import React, {Fragment, useEffect, useMemo, useState} from 'react';
import './PurchaseUser.css'
import {useSelector} from "react-redux";
import {selectOrder} from "../../features/order/orderSlice";
import OrderLine from "../OrderLine/OrderLine";

const PurchaseUser = () => {


    const selectedOrder = useSelector(selectOrder);

    console.log('>>>ORDER', selectedOrder)
    return (
        <>
            {selectedOrder.length?selectedOrder.sort(function(a, b) {
                return b.placed - a.placed;
            }).map(order=>(
                <Fragment key={order._id}>
                    <OrderLine orderId={order._id}/>
                </Fragment>
            )):undefined}
        </>
    );
};

export default PurchaseUser;