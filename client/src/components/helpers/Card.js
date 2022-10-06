import React from "react";
import { Link } from "react-router-dom";
const Card = ({ img, category, cover }) => {
  return (
    <div className="card text-center border-0">
      <Link
        to={{
          pathname: `/category/${category}`,
          state: {
            img_url: img,
          },
        }}
      >
        <img src={cover} alt={`${category}-img`} className="card-img-menu" />
      </Link>

      <div className="card-body bg-white">
        <div className="card-text">
          <h5 className="text-center">{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
        </div>
      </div>
    </div>
  );
};
export default Card;
