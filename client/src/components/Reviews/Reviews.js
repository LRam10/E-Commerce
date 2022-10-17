import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReviewList from './ReviewList';

import {
  loadReviews,
  getAllReviews,
  getReviewStatus,
} from "../../app/features/reviews/reviewsSlice";
import Spinner from "../../utils/Spinner";

import ModalReview from "./ModalReview";

const Reviews = ({ item }) => {
  const { img_url, name, _id } = item;
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal(!modal);
  const reviews = useSelector(getAllReviews);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadReviews(_id));
  }, [reviews, _id, dispatch]);

  if (getReviewStatus === "loading") return <Spinner />;

  return (
    <div className="row">
      {reviews.length === 0 ? (
          <div className="col-lg-12">
            <div className="text-center mx-auto mb-4 mt-4">
              <p>No Reviews</p>
              <button className="btn btn-light btn-sm" onClick={handleModal}>
                Write A Review
              </button>
            </div>
          </div>
      ) : <ReviewList reviews={reviews} handleModal={handleModal}/>}

      {modal && (
        <ModalReview
          handleModal={handleModal}
          img_url={img_url}
          name={name}
          _id={_id}
        />
      )}
    </div>
  );
};

export default Reviews;
