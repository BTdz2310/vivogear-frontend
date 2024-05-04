import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import socket from "../../socketClient";


export const loadReview = createAsyncThunk('review/loadReview',async ()=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/review', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
    })

    return await response.json();
})


export const reviewSlice = createSlice({
    name: 'reviewSlice',
    initialState: {
        review: {

        }
    },
    reducers: {
        createReview: (state, action) => {
            socket.emit('CERCreate', action.payload);
            if(!state.review[action.payload.productId]){
                state.review[action.payload.productId] = {};
            }
            state.review[action.payload.productId][action.payload.orderId] = action.payload;
        },
        newReview: (state, action) => {
            console.log('pay',action.payload)
            if(!state.review[action.payload.productId]){
                state.review[action.payload.productId] = {};
            }
            state.review[action.payload.productId][action.payload.orderId] = action.payload;
            // state.review = {};
            // action.payload.forEach(review=>{
            //     if(!state.review[review.productId]){
            //         state.review[review.productId] = [review];
            //     }else{
            //         state.review[review.productId] = [...state.review[review.productId], review];
            //     }
            // });
            // if(!state.review[action.payload.productId]){
            //     state.review[action.payload.productId] = [action.payload];
            // }else{
            //     state.review[action.payload.productId].unshift(action.payload);
            // }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadReview.fulfilled, (state, action) => {
            if(action.payload.data) {
                state.review = {};
                console.log('>>>GET', action.payload.data);
                action.payload.data.forEach(review => {
                    if(!state.review[review.productId]){
                        state.review[review.productId] = {};
                    }
                    state.review[review.productId][review.orderId] = review;
                })
            }
        });
    }
}) 

export const {createReview, newReview} = reviewSlice.actions;
export default reviewSlice.reducer;

export const selectReview = (state) => {
    const reviews = {};
    Object.keys(state.review.review).forEach(pID=>{
        const arr = [];
        Object.keys(state.review.review[pID]).forEach(rv=>{
            arr.push(state.review.review[pID][rv]);
        })
        reviews[pID] = arr;
    })
    return reviews
};