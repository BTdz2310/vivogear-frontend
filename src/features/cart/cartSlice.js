import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createProducts} from "../products/productsSlice";
import {getCookie} from "../../utils/cookie";

export const getCartUser = createAsyncThunk('cartSlice/getCartUser',async (data, thunkAPI)=>{
    const response = await fetch('http://localhost:5001/api/userCart', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
    })
    console.log('LOAD CART>>>')
    const json = await response.json();
    return json;
})

export const createCartUser = createAsyncThunk('cartSlice/createCartUser',async (data, thunkAPI)=>{
    const response = await fetch('http://localhost:5001/api/userCart', {
        method: 'POST',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
})

export const updateCartUser = createAsyncThunk('cartSlice/updateCartUser',async (data, thunkAPI)=>{
    const response = await fetch('http://localhost:5001/api/userCart', {
        method: 'PUT',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
})

export const deleteCartUser = createAsyncThunk('cartSlice/deleteCartUser',async (data, thunkAPI)=>{
    const response = await fetch('http://localhost:5001/api/userCart', {
        method: 'DELETE',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
})

export const clearCartUser = createAsyncThunk('cartSlice/clearCartUser',async (data, thunkAPI)=>{
    const response = await fetch('http://localhost:5001/api/clearCart', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
    })
    const json = await response.json();
    return json;
})

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: {
        cart: [

        ]
    },
    reducers: {
        loadCart: (state, action) => {
            if(JSON.parse(localStorage.getItem('cart'))===null) localStorage.setItem('cart',JSON.stringify([]));
            else{
                state.cart = JSON.parse(localStorage.getItem("cart"));
            }
        },
        addToCart: (state, action) => {
            let k = 0;
            for(let i=0; i<state.cart.length; i++){
                if(state.cart[i].idInv===action.payload.idInv){
                    state.cart[i].quantity++;
                    k = 1;
                }
            }
            if(k===0) state.cart = [action.payload, ...state.cart];
            localStorage.setItem('cart',JSON.stringify(state.cart));
        },
        deleteCart: (state, action) => {
            // delete state.cart[action.payload]
            for(let i=0; i<state.cart.length; i++){
                if(state.cart[i].idInv===action.payload._id) state.cart.splice(i, 1);
            }
        },
        changeQuantity: (state, action) => {
            console.log('DISPATCH CHANGE')
            for(let i=0; i<state.cart.length; i++){
                if(state.cart[i].idInv===action.payload._id) state.cart[i].quantity = action.payload.quantity;
            }
        },
        logoutCart: (state, action) => {
            state.cart = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCartUser.fulfilled, (state, action) => {
            console.log('>>>CREATE PRO', action.payload)
            state.cart = action.payload.data;
        });
        builder.addCase(createCartUser.fulfilled, (state, action) => {
            console.log('>>>CARTTT CRETAE', action.payload)
            state.cart = [action.payload.data, ...state.cart];
        });
        builder.addCase(updateCartUser.fulfilled, (state, action) => {
            console.log('>>>CARTTT UPDATAEW', action.payload)
            for(let i=0; i<state.cart.length; i++){
                if(state.cart[i].idInv===action.payload.data.idInv){
                    state.cart[i].quantity = action.payload.data.quantity
                }
            }
        });
        builder.addCase(deleteCartUser.fulfilled, (state, action) => {
            console.log('>>>CARTTT DLWLELE', action.payload)
            for(let i=0; i<state.cart.length; i++){
                console.log('CHECK>>>>', state.cart[i].idInv, action.payload.data.idInv ,state.cart[i].idInv===action.payload.data.idInv)
                if(state.cart[i].idInv===action.payload.data.idInv) state.cart.splice(i, 1);
            }
        });
        builder.addCase(clearCartUser.fulfilled, (state, action) => {
            state.cart = []
        });
    }
})

export const selectCart = (state) => state.cart.cart;

export default cartSlice.reducer;

export const {loadCart, addToCart, changeQuantity, deleteCart, logoutCart} = cartSlice.actions;