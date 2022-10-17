import {configureStore} from "@reduxjs/toolkit";
import reviewsSlice  from "./features/reviews/reviewsSlice";

export const store = configureStore({
reducer:{
    reviews:reviewsSlice,
}
});