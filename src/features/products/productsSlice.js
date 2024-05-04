import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {addType} from "../types/typesSlice";

const api_url = "http://localhost:3600/products";

export const createProducts = createAsyncThunk('products/createProducts',async (data, thunkAPI)=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/product', {
        method: 'POST',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
        // mode: 'no-cors',
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
})

export const getAllProducts = createAsyncThunk('products/getAllProducts',async (data, thunkAPI)=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/product', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    const json = await response.json();
    return json;
})

export const createInventory = createAsyncThunk('products/createInventory',async (data, thunkAPI)=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/inventory', {
        method: 'POST',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
        // mode: 'no-cors',
        body: JSON.stringify(data)
    })
    console.log('A>>>DADA', data)
    const json = await response.json();
    return json;
})

export const getAllInventory = createAsyncThunk('products/getAllInventory',async (data, thunkAPI)=>{
    const response = await fetch('https://vivogear-backend.onrender.com/api/inventory', {
        method: 'GET',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    const json = await response.json();
    return json;
})

export const changeProduct = createAsyncThunk('products/changeProduct',async (data, thunkAPI)=>{
    const response = await fetch(`https://vivogear-backend.onrender.com/api/product/${data.id}`, {
        method: 'PUT',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    return json;
})

export const deleteProduct = createAsyncThunk('products/deleteProduct',async (data, thunkAPI)=>{
    console.log(typeof data)
    const response = await fetch(`https://vivogear-backend.onrender.com/api/product/${data}`, {
        method: 'DELETE',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    const json = await response.json();
    return json;
})

export const changeInventory = createAsyncThunk('products/changeInventory',async (data, thunkAPI)=>{
    console.log(data)
    const response = await fetch(`https://vivogear-backend.onrender.com/api/inventory/${data.id}`, {
        method: 'PUT',
        headers: {
            // "Content-Type": "application/json",
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    const json = await response.json();
    console.log('1>>>>!!!11111', json)
    return json;
})

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: {

        },
        inventory: {

        }
    },
    reducers: {
        addProduct: (state, action) => {
            state.products[action.payload.id] = action.payload
        },
        updateQuantity: (state, action) => {
            action.payload.forEach(inv=>{
                state.inventory[inv.productId][inv.inventoryId].quantity = inv.quantity;
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createProducts.fulfilled, (state, action) => {
            console.log('>>>CREATE PRO',action.payload)
            state.products[action.payload.data._id] = action.payload.data;
        });
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            // console.log('>>>>>>DATA',action.payload)
            // console.log('>>>ID', action.payload.data[0].id)
            for(let i=0; i<action.payload.data.length; i++){
                state.products[action.payload.data[i]['_id']] = action.payload.data[i]
            }
        })
        builder.addCase(createInventory.fulfilled, (state, action) => {
            console.log('>>>CREATE INVENT',action.payload)
            if(action.payload.msg==='ok'){
                action.payload.data.forEach(inv=>{
                    state.inventory[inv.idSP] = state.inventory[inv.idSP]?state.inventory[inv.idSP]:{};
                    state.inventory[inv.idSP][inv['_id']] = inv
                })
            }
        });
        builder.addCase(getAllInventory.fulfilled, (state, action) => {
            console.log('>>>>>>DATA',action.payload.data)
            for(let i=0; i<action.payload.data.length; i++){
                state.inventory[action.payload.data[i].idSP] = state.inventory[action.payload.data[i].idSP]?state.inventory[action.payload.data[i].idSP]:{};
                state.inventory[action.payload.data[i].idSP][action.payload.data[i]['_id']] = action.payload.data[i]
                 // = state.inventory[action.payload.data[i].id]?[action.payload.data[i]]:[...state.inventory[action.payload.data[i].id], action.payload.data[i]]
            }
        });
        builder.addCase(changeProduct.fulfilled, (state, action) => {
            console.log('>>>>>>DATACHAN>>>>GE',action.payload.data)
            if(action.payload.data){
                state.products[action.payload.data.id].type = action.payload.data.type
            }
        });
        builder.addCase(changeInventory.fulfilled, (state, action) => {
            console.log('>>>>>>DATACHAN>>>>GE>>INVNE',action.payload.data)
            if(action.payload.data){
                state.inventory[action.payload.data.idSP][action.payload.data.id].quantity = action.payload.data.inv.quantity;
                state.inventory[action.payload.data.idSP][action.payload.data.id].price = action.payload.data.inv.price;
            }
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            console.log('>>>>>>DATACHAN>>>>GE>>INVNE',action.payload.data)
            if(action.payload.data){
                state.products[action.payload.data].available = false;
            }
        });
    }
})


export const selectProducts = (state) => state.products.products;
export const selectInventory = (state) => state.products.inventory;

export const selectArrayProducts = state => {
    return Object.keys(state.products.products).map(key=>state.products.products[key]);
}

// export const rtnTypeProducts = 

export default productsSlice.reducer;
export const {addProduct, updateQuantity} = productsSlice.actions;