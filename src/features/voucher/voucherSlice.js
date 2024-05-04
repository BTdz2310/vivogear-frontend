import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import socket from "../../socketClient";

export const getAllVoucher = createAsyncThunk('voucher/getAllVoucher',async (data, thunkAPI)=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/voucher', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    const json = await response.json();
    return json;
})

// export const createVoucher = createAsyncThunk('voucher/createVoucher',async (data, thunkAPI)=>{
//     console.log(data)
//     const response = await fetch('http://localhost:5001/api/voucher', {
//         method: 'POST',
//         headers: {
//             // "Content-Type": "application/json",
//             'Content-Type': 'application/json; charset=utf-8',
//         },
//         body: JSON.stringify(data)
//     })
//     console.log('JSOOSOSNVOUCHER', response)
//     const json = await response.json();
//     return json;
// })
//
// export const updateVoucher = createAsyncThunk('voucher/updateVoucher',async (data, thunkAPI)=>{
//     console.log(data)
//     const response = await fetch(`http://localhost:5001/api/voucher/${data.id}`, {
//         method: 'PUT',
//         headers: {
//             // "Content-Type": "application/json",
//             'Content-Type': 'application/json; charset=utf-8',
//         },
//         body: JSON.stringify(data.uVoucher)
//     })
//     const json = await response.json();
//     console.log('UPDATEEEEE', json)
//     return json;
// })
//
// export const deleteVoucher = createAsyncThunk('voucher/deleteVoucher',async (data, thunkAPI)=>{
//     console.log(data)
//     const response = await fetch(`http://localhost:5001/api/voucher/${data}`, {
//         method: 'DELETE',
//         headers: {
//             // "Content-Type": "application/json",
//             'Content-Type': 'application/json; charset=utf-8',
//         },
//     })
//     const json = await response.json();
//     console.log('DELETE', json)
//     return json;
// })



export const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {
        voucher: {

        }
    },
    reducers: {
        createVoucher: (state, action) => {
            socket.emit('CEVCreate', action.payload);
            state.voucher[action.payload.code] = action.payload;
        },
        deleteVoucher: (state, action) => {
            socket.emit('CEVDelete', action.payload);
            delete state.voucher[action.payload.code];
        },
        updateVoucher: (state, action) => {
            socket.emit('CEVUpdate', action.payload);
            state.voucher[action.payload.code] = action.payload;
        }
    },
    extraReducers: (builder) => {
        // builder.addCase(createVoucher.fulfilled, (state, action) => {
        //     console.log('>>>VOUCHER:::',action.payload)
        //     if(action.payload.data){
        //         state.voucher[action.payload.data.code] = action.payload.data;
        //     }
        // });
        builder.addCase(getAllVoucher.fulfilled, (state, action)=>{
            console.log('>GET>>VOUCHER:::',action.payload)
            action.payload.data.forEach(voucher=>{
                state.voucher[voucher.code] = voucher;
            })
        });
        // builder.addCase(updateVoucher.fulfilled, (state, action)=>{
        //     console.log('>GET>>VOUCHER:::',action.payload)
        //     // action.payload.data.forEach(voucher=>{
        //     //     state.voucher[voucher.code] = voucher;
        //     // })
        //     if(action.payload.data){
        //         state.voucher[action.payload.data.code] = action.payload.data;
        //     }
        // });
        // builder.addCase(deleteVoucher.fulfilled, (state, action)=>{
        //     console.log('>GET>>VOUCHER:::',action.payload)
        //     // action.payload.data.forEach(voucher=>{
        //     //     state.voucher[voucher.code] = voucher;
        //     // })
        //     if(action.payload.data){
        //         delete state.voucher[action.payload.data]
        //     }
        // });
    }
})

export default voucherSlice.reducer;

export const {createVoucher, updateVoucher, deleteVoucher} = voucherSlice.actions

export const selectVoucher = (state) => state.voucher.voucher;