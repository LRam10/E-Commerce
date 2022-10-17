import React, { useState,useContext } from "react";
import {useDispatch} from 'react-redux';

import {postReview} from '../../app/features/reviews/reviewsSlice';

import AlertContext from "../../context/alerts/alertContext";
import StarRating from "../../utils/Rating/StarRating";

const ModalReview = ({ handleModal, img_url, name, _id }) => {
  const dispatch = useDispatch()
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [starsSelected, setStarsSelected] = useState(0);
  const [review, setReview] = useState({
    headline: "",
    comments: "",
    recommend_option: "",
    item_id:_id
  });
  const onReviewChange = (e) => {
    e.preventDefault();
    setReview({ ...review, [e.target.name]: e.target.value });
  };
  const changeStars = (stars) => {setStarsSelected(stars);};

  const onSubmit = async (e) => {
    e.preventDefault();
    if (starsSelected === 0) {
      setAlert('Please Select a Rating','danger');
    } else {
      try {
      dispatch(postReview({ ...review, rating: starsSelected })).unwrap();
      setReview({
        headline:"",
        comments:"",
        recommend_option:"",
        item_id:''
      });
      setStarsSelected(0);
      handleModal();
        
      } catch (error) {
        console.log(error);
      }
      
    }
  };
  return (
    <div
      className="modal "
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Review Product</h3>
            <button type="button" onClick={handleModal}>
              <i className="fa fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-4 pb-4 border-bottom">
            <img
                className=" border"
                src={img_url}
                alt={`${name}-bracelet`}
                height="60"
                width="60"
              />
              <p className="pl-2">{name}</p>
            </div>
            <form>
              <label>Your Rating:</label>
              <StarRating
                handleStars={changeStars}
                startsSelected={starsSelected}
              />
              <label htmlFor="headline">Review Headline:</label>
              <input
                type="text"
                name="headline"
                className="form-control mb-4"
                defaultValue={review.headline}
                onChange={onReviewChange}
              required ></input>
              <label htmlFor="comments">Comments:</label>
              <textarea
                type="text"
                name="comments"
                className="form-control mb-4"
                defaultChecked={review.comments}
                rows={5}
                cols={5}
                onChange={onReviewChange}
              required></textarea>
              <label htmlFor="recommend">
                Would You Recommend This Product?
              </label>
              <div className="form-check">
                <input
                  type="radio"
                  name="recommend_option"
                  value="Yes"
                  className="form-check-input"
                  onChange={(e) =>
                    setReview({ ...review, recommend_option: e.target.value })
                  }
                  defaultChecked={review.recommend_option === "Yes"}
                ></input>
                <label htmlFor="Yes" className="form-check-label">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="recommend_option"
                  value="No"
                  className="form-check-input"
                  onChange={(e) =>
                    setReview({ ...review, recommend_option: e.target.value })
                  }
                  defaultChecked={review.recommend_option === "No"}
                ></input>
                <label htmlFor="No" className="fomr-check-label">
                  No
                </label>
              </div>
              <div className="col-6 mx-auto mt-4" style={{display:'grid'}}>
              <input
                type="submit"
                className="btn btn-blue btn-large"
                onClick={onSubmit}
                value="Submit"
              ></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalReview;
