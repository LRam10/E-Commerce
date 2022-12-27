import React from "react";
import {Link} from 'react-router-dom';
const Banner = () => {
  return (
    <div className="container-fluid py-2">
      <div className="row d-flex align-items-center">
        <div className="col-xs-12 col-sm-6">
          <h1>Good Vibes Only</h1>
          <p>
            Explore hundredths of handmade bracelets, great for gift to friends
            or that special someone.{" "}
          </p>
          <Link className="btn btn-blue btn-lg my-3"
          to={{
            pathname: `/category/all`,
            state: {
              img_url: 'https://res.cloudinary.com/doei459zd/image/upload/v1608339868/Category/pexels-ekrulila-3084342_lqiatx.jpg',
            }
          }}>Shop Now</Link>
        </div>
        <div className="col-xs-12 col-sm-6 img-cont"></div>
      </div>
    </div>
  );
};

export default Banner;
