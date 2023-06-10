const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jsonToken = require("jsonwebtoken");
const userModel = require("../models/User");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");

const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

dotenv.config();

router.post("/google", async (req, res) => {
  try {
    const { access_token } = req.body;
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const { name, email, picture } = response.data;
    const fullName = name.split(" ");
    const user = await userModel.findOneAndUpdate(
        { email },
        { firstName: fullName[0],
          lastName:fullName[1],
          accessType:0,
          picture },
        { new: true, upsert: true }
      )
      .lean();
    const payload = {
      user: { id: user._id, accessType: user.accessType },
    };
    jsonToken.sign(
      payload,
      process.env.jwtSecret,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//@Type   POST
//@Desc   Create Authentication
//@Access  Private
router.get("/", auth, async (req, res) => {
  try {
    console.log('Get user',req.body, req.user);
    const user = await userModel
      .findById(req.user.id)
      .select("-passwordObject");
      res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});
//@Type   GEt
//@Desc   get authentication token
//@Access  Public
router.post(
  "/",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please input a password").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      console.log('User Register', req.body)
      //destructuring from the request body
      const { password, email } = req.body;
      let user = await userModel.findOne({ email });
      //if user is not available
      if (!user) return res.json({ msg: "Email doesn't exists" });
      const isMatch = await bcrypt.compare(
        password,
        user.passwordObject.password
      );
      if (!isMatch) {
        user.passwordObject.numberOfTries--;
        await user.save();
        return res.status(400).json({ msg: "Invalid password" });
      }
      const payload = {
        user: { id: user.id, access: user.accessType },
      };
      jsonToken.sign(
        payload,
        process.env.jwtSecret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);
router.post("/admin", async (req, res) => {
  try {
    //destructuring from the request body
    const { password, email } = req.body;
    let user = await userModel.findOne({ email });
    //if user is not available
    if (!user) return res.json({ msg: "Email doesn't exists" });
    if (user.accessType !== 1)
      return res.status(400).json({ msg: "Unauthorized User" });
    const isMatch = await bcrypt.compare(
      password,
      user.passwordObject.password
    );
    if (!isMatch) {
      user.passwordObject.numberOfTries--;
      await user.save();
      return res.status(400).json({ msg: "Invalid password" });
    }
    const payload = {
      user: { id: user.id, access: user.accessType },
    };
    jsonToken.sign(
      payload,
      process.env.jwtSecret,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
