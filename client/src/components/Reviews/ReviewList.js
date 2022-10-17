import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({reviews,handleModal}) => {

const content = reviews.map(review =>(
        <ReviewCard key={review._id} review={review}/>
    
))
  return (
    <>
      <div className="col-lg-12">
        <p className="d-inline-block">Total Reviews ({reviews.length})</p>
        <button
          className="btn btn-light btn-sm float-right"
          onClick={handleModal}
        >
          Write A Review
        </button>
      </div>
    {content}
    </>
  );
};

export default ReviewList;
