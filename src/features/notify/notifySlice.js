import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCookie} from "../../utils/cookie";
import {getCartUser} from "../cart/cartSlice";

export const loadNotity = createAsyncThunk(
    'notify/loadNotify',
    async (data, thunkAPI) => {
        const response = await fetch('https://vivogear-backend.onrender.com/api/notify', {
            method: 'GET',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },

        })
        const json = await response.json();
        return json.data;
    }
)

export const notifySlice = createSlice({
    name: 'notify',
    initialState: {
        notify: []
    },
    reducers: {
        readAll: (state, action) => {
            state.notify.forEach(notify=>notify.isRead=true)
        },
        newNotify: (state, action) => {
            state.notify[action.payload._id] = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadNotity.fulfilled, (state, action) => {
            action.payload.forEach(notify=>{
                state.notify[notify._id] = notify;
            })
        });
    }
})

export const selectNotify = (state) => {
    const rtn = [];
    Object.keys(state.notify.notify).forEach(ntf=>{
        rtn.push(state.notify.notify[ntf])
    })
    return rtn;
};

export const {readAll, newNotify} = notifySlice.actions;

export default notifySlice.reducer