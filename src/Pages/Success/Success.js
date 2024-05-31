// import React, {useEffect} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import {selectCart} from "../../features/cart/cartSlice";
// import {selectUser} from "../../features/auth/authSlice";
// import {placedOrder} from "../../features/order/orderSlice";
// import {toast} from "react-toastify";
//
// const Success = () => {
//
//     const selectedCart = useSelector(selectCart);
//     const selectedUser = useSelector(selectUser);
//     const dispatch = useDispatch();
//
//     useEffect(() => {
//
//         const load = async () => {
//             await dispatch(placedOrder({
//                 user: selectedUser._id,
//                 products: selectedCart.map(item=>{
//                     return {
//                         inventoryId: item.idInv,
//                         productId: item.idSP,
//                         quantity: item.quantity,
//                         img: item.img,
//                         name: item.name,
//                     }
//                 }),
//                 status: 0,
//                 placed: Date.now(),
//                 total: totalAV,
//                 voucher: voucher1,
//                 phone,
//                 address
//             }))
//
//             toast.success('Đặt Đơn Hàng Thành Công')
//             navigate('/user/purchase')
//         }
//
//     }, []);
//
//     return (
//         <div>
//
//         </div>
//     );
// };
//
// export default Success;