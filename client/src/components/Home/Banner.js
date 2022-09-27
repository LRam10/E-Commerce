import React from "react";

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
          <button className="btn btn-blue btn-lg my-3">Shop Now</button>
        </div>
        <div className="col-xs-12 col-sm-6 img-cont"></div>
      </div>
    </div>
  );
};

export default Banner;
