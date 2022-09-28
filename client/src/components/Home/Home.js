import React, { Fragment, useEffect, useContext } from "react";

import Banner from "./Banner";
import Card from "../helpers/Card";
import FeaturedItem from "../helpers/FeaturedItem";

import woodenImg from "../../images/wooden.JPG";
import friendImg from "../../images/friendship.jpg";
import Paracord from "../../images/Paracord.png";
import RedStrings from "../../images/Red_Strings.png";
import AuthContext from "../../context/auth/authContext";
import { useExpiration } from "../../utils/useExpiration";

const Home = () => {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    authContext.loadUser();
    //eslint-disable-next-line
  }, []);
  useExpiration();
  return (
    <Fragment>
      <Banner/>
      <div className="container-fluid mt-5 pt-5 mb-5 pb-5">
        <div className="row">
        <h3 className="mb-5 "><u>Styles</u></h3>
        </div>
        <div className="row">
          <div className="col-sm-3 col-xs-12 mt-2">
            <Card
            category={"wooden"}
            cover={woodenImg} 
            img={"http://res.cloudinary.com/doei459zd/image/upload/v1584471523/Category/dnb9hd2tzfk4g3rgnzg2.jpg"}/>
          </div>
          <div className="col-sm-3 col-xs-12 mt-2">
          <Card 
            category={"red-strings"}
            cover={RedStrings}
            img={"https://res.cloudinary.com/doei459zd/image/upload/v1573665197/Bracelet/xhmd2kztgryk8y6gln2p.png"} />
          </div>
          <div className="col-sm-3 col-xs-12 mt-2">
            <Card 
            category={"paracord"}
            cover={Paracord}
            img={"http://res.cloudinary.com/doei459zd/image/upload/v1584471604/Category/hkfzztd6j1buedi9j2po.jpg"} />
          </div>
          <div className="col-sm-3 col-xs-12 mt-2">
            <Card 
            category={"friendship"}
            cover={"https://res.cloudinary.com/doei459zd/image/upload/v1575564841/Bracelet/pbk7p8117drevjgtmjkr.jpg"}
            img={friendImg} />
          </div>
        </div>
      </div>
      <FeaturedItem 
      name={"Lucky Elephant"}
      img_url={'https://res.cloudinary.com/doei459zd/image/upload/v1575554850/Bracelet/i38e3nhs5wj2wzsexuky.jpg'}
      category={"Red Strings"}
      description={"Adjustable unisex bracelets. Handmade with high quality material, with a silver 3cm diamater elephant charm. This beautiful bracelet makes a good gift for him or her. Is believe that a red bracelts bring good luck and postitive energy "}/>
    </Fragment>
  );
};

export default Home;
