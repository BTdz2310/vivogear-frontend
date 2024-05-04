import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postDataAPI} from "../../utils/fetchData";
import {getCookie, setCookie} from "../../utils/cookie";
import store from "../../store";
import socket from "../../socketClient";

export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        const response = await fetch('https://vivogear-backend.onrender.com/api/login', {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
            },
            // mode: 'no-cors',
            body: JSON.stringify(data)
        })
        const json = await response.json();
        if(json['access_token']){
            setCookie('token', json['access_token'], 1)
        }
        console.log('thunk',json)
        return {
            json,
            loggedIn: !!json['access_token'],
            adminIn: json.isAdmin
        };
    }
)

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (data, thunkAPI) => {
        const response = await fetch(`https://vivogear-backend.onrender.com/api/profile`, {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            // mode: 'no-cors',
            body: JSON.stringify(data.data)
        })
        const json = await response.json();
        return json;
    }
)

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data, thunkAPI) => {
        const response = await fetch(`https://vivogear-backend.onrender.com/api/changePassword`, {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            // mode: 'no-cors',
            body: JSON.stringify(data)
        })
        const json = await response.json();
        return json;
    }
)

export const addVoucherUser = createAsyncThunk(
    'auth/addVoucherUser',
    async (data, thunkAPI) => {
        const response = await fetch(`https://vivogear-backend.onrender.com/api/addVoucherUser`, {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            // mode: 'no-cors',
            body: JSON.stringify({
                code: data
            })
        })
        const json = await response.json();
        return json;
    }
)

export const checkedVoucher = createAsyncThunk('auth/useVoucher',async (data, thunkAPI)=>{
    console.log(data)
    const response = await fetch(`https://vivogear-backend.onrender.com/api/useVoucher`, {
        method: 'POST',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    console.log('>>>>>>>VOUCHER', json)
    return json;
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        auth: {
            id: null,
            isLoggedIn: false,
            isAdmin: false,
            user: null
        },
    },
    reducers: {
        logout: (state, action) => {
            state.auth.id = null;
            state.auth.isLoggedIn = false;
            state.auth.isAdmin = false;
            state.auth.user = null;
            setCookie('token', null, -1)
            store.dispatch({
                type: 'cartSlice/logoutCart'
            })
        },
        credential: (state, action) => {
            console.log('P>>>AYLOAD', action.payload)
            state.auth.id = action.payload.id;
            state.auth.user = action.payload.user;
            state.auth.isAdmin = action.payload.isAdmin;
            state.auth.isLoggedIn = true;
        },
        updateVoucherUser: (state, action) => {
            action.payload.forEach(voucher=>{
                state.auth.user.voucher.forEach(vch=>{
                    if(vch.code===voucher) vch.used = true;
                })
            })
        },
        rtnVoucher: (state, action) => {
            action.payload.forEach(voucher=>{
                state.auth.user.voucher.forEach(vch=>{
                    if(vch.code===voucher) vch.used = false;
                })
            })
        },
        socialLogin: (state, action) => {
            state.auth.id = action.payload._id;
            state.auth.isLoggedIn = true;
            state.auth.isAdmin = false;
            state.auth.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(login.fulfilled, (state, action) => {
            console.log('build',action)
            if(action.payload.loggedIn) {
                state.auth.isLoggedIn = true;
                state.auth.id = action.payload.json.id;
                state.auth.user = action.payload.json.user;
                state.auth.isAdmin = action.payload.json.isAdmin;
                // console.log('token', state.auth.idUser)
                console.log(state.auth.isLoggedIn)
            }
            // socket.emit('test', action.payload.json['access_token'])
            // socket.emit('CENLogin', action.payload.json['access_token'])
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            if(action.payload.data){
                console.log(action.payload.data)
                state.auth.user = action.payload.data;
            }
        });
        builder.addCase(addVoucherUser.fulfilled, (state, action) => {
            if(action.payload.data){
                console.log('>>>>>',action.payload.data)
                state.auth.user.voucher = action.payload.data
                // state.auth.user = action.payload.data;
            }
        })
        builder.addCase(changePassword.fulfilled, (state, action) => {
            if(action.payload.data){
                console.log('>>>>>',action.payload.data)
                state.auth.user = action.payload.data
                // state.auth.user = action.payload.data;
            }
        })
        builder.addCase(checkedVoucher.fulfilled, (state, action) => {
            if(action.payload.data){
                console.log('>>>>>',action.payload.data)
                state.auth.user = action.payload.data
                // state.auth.user = action.payload.data;
            }
        })
    }
})

export default authSlice.reducer;

export const {logout, credential, rtnVoucher, updateVoucherUser, socialLogin} = authSlice.actions;

export const checkLogin = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.auth.user;