import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
    reviews:[],
    error:'',
    loading:'idle', //| 'loading' | 'succeeded' | 'failed'
    successMsg:'',
}

export const postReview = createAsyncThunk('review/postReview',async (review)=>{
review.date_created = new Date().toISOString();
const response = await axios.post('/reviews',review);
return response.data;
});

export const loadReviews  = createAsyncThunk('review/loadReviews', async(id)=>{
    const response = await axios.get(`/reviews/${id}`);
    return response.data;
})

const reviewsSlice = createSlice({
name:'reviews',
initialState,
reducers:{},
extraReducers:(builder) =>{
    builder
    .addCase(postReview.fulfilled,(state,action)=>{
        console.log(action.payload);
        state.successMsg = action.payload
    })
    .addCase(loadReviews.pending,(state,action)=>{
        state.loading = 'loading';
    })
    .addCase(loadReviews.fulfilled,(state,action)=>{
        state.loading = 'success';
        state.reviews = action.payload;
    })
    .addCase(loadReviews.rejected,(state,action)=>{
        state.loading = 'failed';
    })
}
});

export const getAllReviews = (state)=> state.reviews.reviews;
export const getReviewStatus = (state)=>state.reviews.loading;
export const getReviewError = (state)=>state.reviews.error;
export const getReviewMsg = (state)=>state.reviews.successMsg;
export default reviewsSlice.reducer;