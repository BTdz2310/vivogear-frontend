import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "./features/products/productsSlice";
import typesSlice from "./features/types/typesSlice";
import filtersSlice from "./features/filters/filtersSlice";
import cartSlice from "./features/cart/cartSlice";
import reviewSlice from "./features/review/reviewSlice";
import authSlice from "./features/auth/authSlice";
import notifySlice from "./features/notify/notifySlice";
import voucherSlice from "./features/voucher/voucherSlice";
import orderSlice from "./features/order/orderSlice";
import scaleSlice from "./features/scale/scaleSlice";
export default configureStore({
    reducer: {
        types: typesSlice,
        products: productsSlice,
        filters: filtersSlice,
        cart: cartSlice,
        review: reviewSlice,
        auth: authSlice,
        notify: notifySlice,
        voucher: voucherSlice,
        order: orderSlice,
        scale: scaleSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});
