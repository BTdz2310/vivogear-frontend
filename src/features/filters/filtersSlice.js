import {createSlice} from "@reduxjs/toolkit";
import {selectArrayProducts, selectProducts} from "../products/productsSlice";

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        name: '',
        brand: '',
        price: 1000,
        phone: {
            ram: [],
            memory: [],
            d_type: [],
            d_size: [],
            d_res: [],
            p_os: [],
            p_chipset: [],
            mc_type: [],
            mc_res: [],
            sc_type: [],
            sc_res: [],
            cnt_usb: [],
            cnt_jack: [],
            btr_type: [],
            btr_chg: []
        },
        watch: {
            memory: [],
            weight: [],
            d_type: [],
            d_size: [],
            d_res: [],
            features: [],
            btr_type: []
        },
        tablet: {
            ram: [],
            memory: [],
            d_type: [],
            d_size: [],
            d_res: [],
            cnt_usb: [],
            cnt_jack: [],
            mc_res: [],
            sc_res: [],
            btr_type: [],
        },
        all: {

        }
    },
    reducers: {
        choseName: (state, action) => {
            state['name'] = action.payload;
        },
        choseBrand: (state, action) => {
            state['brand'] = action.payload;
        },
        chosePrice: (state, action) => {
            state['price'] = action.payload;
        },
        resetChose: (state, action) => {
            state['name'] = ''
            state['brand'] = ''
            state['price'] = 1000
        },
        clickFilterBtn: (state, action) => {
            if(!state[action.payload.type][action.payload.detail].includes(action.payload.value)){
                state[action.payload.type][action.payload.detail].push(action.payload.value);
            }else{
                state[action.payload.type][action.payload.detail] = state[action.payload.type][action.payload.detail].filter(value=>value!==action.payload.value);
            }
        }
    }
})

export const selectName = state => state.filters.name.toLowerCase();
export const selectBrand = state => state.filters.brand;
export const selectPrice = state => state.filters.price;

// export const selectTypeProducts = state => {
//     return state.products.products.filter(sp=>sp.type.includes(selectType()));
// }

// export const selectFitProducts = state => {
    // return state.products.products.filter(sp=>sp.type.includes(selectType())&&sp.brand.includes(selectBrand())&&sp.price<=selectPrice());
// }

export const selectFitProducts = state => {
    return Object.keys(state.products.products).filter(key=>state.products.products[key].name.toLowerCase().includes(selectName(state))&&state.products.products[key].brand.includes(selectBrand(state))&&Number(state.products.products[key].price)<=Number(selectPrice(state))).map(key=>state.products.products[key]);
}

export const selectFilter = state => state.filters;

export default filtersSlice.reducer;
export const {clickFilterBtn , choseBrand, chosePrice, choseName, resetChose} = filtersSlice.actions;