import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
// import {selectTypes} from '../filters/filtersSlice'

const api_url = "http://localhost:3600/types";
// const selectedType = useSelector(selectTypes)

export const loadTypes = createAsyncThunk('types/loadTypes',async ()=>{
    const response = await fetch(api_url);
    const json = await response.json();
    console.log('load')
    console.log(json)
    return json;
})
export const typesSlice = createSlice({
    name: 'types',
    initialState: {
        types: {
            phone: [],
            watch: [],
            tablet: []
        },
        isLoadingTypes: false,
        failedToLoadTypes: false
    },
    reducers: {
        addType: (state, action) => {
            state.types[action.payload.type].push(action.payload.val);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadTypes.pending, (state, action) => {
            state.isLoadingTypes = true;
            state.failedToLoadTypes = false;
        })
        builder.addCase(loadTypes.fulfilled, (state, action) => {
            console.log('fulfilled')
            console.log(action.payload);
            action.payload.forEach(type1=>{
                // console.log(product.id)
                state.types[type1.id] = type1.value;
            })
            // state.types = action.payload;
            state.isLoadingTypes = false;
            state.failedToLoadTypes = false;
        })
        builder.addCase(loadTypes.rejected, (state, action) => {
            state.isLoadingTypes = false;
            state.failedToLoadTypes = true;
        })
    }
})

export const selectTypes = state => state.types.types;
// export const searchTypes = state => state.types[selectedType];

export default typesSlice.reducer;
export const {addType} = typesSlice.actions;

