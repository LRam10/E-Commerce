const JWT = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;
const guestJwtSecret = process.env.GUEST_JWT_SECRET
const crypto = require('crypto');
//Const for guest users
const GUEST_COOKIE = 'guestAuth';
const GUEST_TYPE = 'guest';
const GUEST_TTL_SECONDS = 24 * 60 * 60;
module.exports = (req, res, next) => {
  try {
    const sessionToken = req.cookies?.auth
    if (sessionToken) {
      //Verify token
      try {
        const decodeToken = JWT.verify(sessionToken, jwtSecret);
        if (decodeToken?.user) {
          req.user = decodeToken.user;
          return next();
        }
        res.clearCookie('auth', { path: '/' });
      } catch (err) {
        return res.status(401).json({
          success: false,
          code: 'INVALID SESSION',
          msg: 'Wrong  or session expired, please sign in again',
        });

      }
     
    }
    //Get Guest tokens
    const guestToken = req.cookies.guestAuth;
    if (guestToken) {
      try {
        const decode = JWT.verify(guestToken, guestJwtSecret);
        if (decode?.type === GUEST_TYPE && decode?.sub) {
          req.guestId = decode.sub
        }
        return next()

      } catch (err) {
        console.log(err);
      }
    }
    const guestId = crypto.randomUUID();
    //Create a temporary token for guest user
    try {
      const guestToken = JWT.sign({
        sub: guestId,
        type: GUEST_TYPE
      },
        guestJwtSecret,
        {
          expiresIn: GUEST_TTL_SECONDS,
        });
      res.cookie(GUEST_COOKIE, guestToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: '/'
      })
      req.guestId = guestId;
      next();
    } catch (error) {
      res.status(400).json({
        msg: 'Auth Required',
        success: false
      })
    }

  } catch (error) {
    res.status(400).json({
      msg: 'Auth Required',
      success: false
    })
  }
}