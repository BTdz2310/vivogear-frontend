import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCookie} from "../../utils/cookie";
import {loadNotity} from "../notify/notifySlice";
import socket from "../../socketClient";

export const getAllOrder = createAsyncThunk(
    'order/getAllOrder',
    async (data, thunkAPI) => {
        const response = await fetch('https://vivogear-backend.onrender.com/api/order', {
            method: 'GET',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },

        })
        const json = await response.json();
        console.log('LOAD>>>O', json)
        return json;
    }
)
export const getAllAdminOrder = createAsyncThunk(
    'order/getAllAdminOrder',
    async (data, thunkAPI) => {
        const response = await fetch('https://vivogear-backend.onrender.com/api/orders', {
            method: 'GET',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
            },

        })
        // console.log('.>>>res', response)
        const json = await response.json();
        return json;
    }
)

// export const createOrder = createAsyncThunk(
//     'order/createOrder',
//     async (data, thunkAPI) => {
//         const response = await fetch('http://localhost:5001/api/order', {
//             method: 'POST',
//             headers: {
//                 // "Content-Type": "application/json",
//                 'Content-Type': 'application/json; charset=utf-8',
//                 'Authorization': `Bearer ${getCookie('token')}`,
//             },
//             body: JSON.stringify(data)
//         })
//         const json = await response.json();
//         console.log('>>>>>HERE', json)
//         return json;
//     }
// )

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: {

        }
    },
    reducers: {
        //socket
        placedOrder: (state, action) => {
            socket.emit('CEOPlaced', action.payload)
        },
        handleOrder: (state, action) => {
            socket.emit('CEOHandle', action.payload)
        },
        updateOrder: (state, action) => {
            state.order[action.payload._id] = action.payload;
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(createOrder.fulfilled, (state, action) => {
        //     console.log('>>>LOAD ORDER', action.payload)
        //     if(action.payload.data) state.order = [action.payload.data, ...state.order]
        // });
        builder.addCase(getAllOrder.fulfilled, (state, action) => {
            console.log('>>>GET ORDER', action.payload)
            // action.payload.data.forEach(order=>{
            //     state.order[order._id] = order;
            // })
            if(action.payload.data){
                action.payload.data.forEach(order=>{
                    state.order[order._id] = order;
                })
            }
            // if(action.payload.data) state.order[action.payload.data._id] = action.payload.data
        });
        builder.addCase(getAllAdminOrder.fulfilled, (state, action) => {
            // console.log('>>>GET ORDER', action.payload)
            // if(action.payload.data) state.order = action.payload.data
            if(action.payload.data){
                action.payload.data.forEach(order=>{
                    state.order[order._id] = order;
                })
            }
        });
    }
})

export default orderSlice.reducer;
export const {placedOrder, handleOrder, updateOrder} = orderSlice.actions;
// export const selectOrder = state => state.order.order;
export const selectOrder = state => Object.keys(state.order.order).length>0 ? Object.keys(state.order.order).map(key=>state.order.order[key]):[];
export const selectRawOrder = state => state.order.order;