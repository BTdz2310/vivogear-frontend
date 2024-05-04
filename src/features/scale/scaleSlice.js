import {createSlice} from "@reduxjs/toolkit";
import {productsSlice} from "../products/productsSlice";


export const scaleSlice = createSlice({
    name: 'scale',
    initialState: {
        scale1: null,
        scale2: null
    },
    reducers: {
        addScale: (state, action) => {
            if(!state.scale1){
                state.scale1 = action.payload;
                if(state.scale2===action.payload) state.scale2 = null;
            }else if(!state.scale2){
                if(state.scale1!==action.payload) state.scale2 = action.payload;
            }else{
                if((state.scale1!==action.payload)){
                    state.scale2 = state.scale1;
                    state.scale1 = action.payload;
                }
            }
        },
        removeScale: (state, action) => {
            state[action.payload] = null;
        }
    }
})

// export const checkScale = (state) => state.scale.scale1 && state.scale.scale2;

export const selectScale = (state) => state.scale;

export default scaleSlice.reducer;

export const { addScale, removeScale } = scaleSlice.actions;