import React, {useState} from 'react';
import './OrderAdmin.css'
import {useSelector} from "react-redux";
import {selectOrder} from "../../../features/order/orderSlice";
import OrderAdminLine from "../OrderAdminLine/OrderAdminLine";

const sortOrder = (arr, typeSort) => {
    switch (typeSort){
        case 'id09':
            return arr.slice().sort((a, b)=>a._id.localeCompare(b._id));
        case 'id90':
            return arr.slice().sort((a, b)=>a._id.localeCompare(b._id)).reverse();
        case 'status09':
            return arr.slice().sort((a, b)=>a.status-b.status);
        case 'status90':
            return arr.slice().sort((a, b)=>b.status-a.status);
        case 'time09':
            return arr.slice().sort((a, b)=>a.placed-b.placed);
        case 'time90':
            return arr.slice().sort((a, b)=>b.placed-a.placed);
        case 'price09':
            return arr.slice().sort((a, b)=>a.total-b.total);
        case 'price90':
            return arr.slice().sort((a, b)=>b.total-a.total);
    }
}

const OrderAdmin = () => {

    const [typeSort, setTypeSort] = useState('status09');
    const selectedOrder = useSelector(selectOrder)

    return (
        <>
            <div className="admin-task__head">Xử Lý Đơn Hàng</div>
            <div className="admin-task__action">
                <table className='admin-action__table'>
                    <thead>
                        <tr>
                            <th onClick={()=>{
                                if(typeSort==='id09') setTypeSort('id90');
                                else setTypeSort('id09');
                            }}>
                                ID Đơn Hàng <i className="fa-solid fa-angles-up" id={typeSort==='id90'?'iconDown':undefined} style={{opacity: typeSort.includes('id')?1:0}}></i>
                            </th>
                            <th onClick={()=>{
                                if(typeSort==='status09') setTypeSort('status90');
                                else setTypeSort('status09');
                            }}>
                                Tình Trạng <i className="fa-solid fa-angles-up" id={typeSort==='status90'?'iconDown':undefined} style={{opacity: typeSort.includes('status')?1:0}}></i>
                            </th>
                            <th onClick={()=>{
                                if(typeSort==='time09') setTypeSort('time90');
                                else setTypeSort('time09');
                            }}>
                                Thời Gian Đặt <i className="fa-solid fa-angles-up" id={typeSort==='time90'?'iconDown':undefined} style={{opacity: typeSort.includes('time')?1:0}}></i>
                            </th>
                            <th onClick={()=>{
                                if(typeSort==='price09') setTypeSort('price90');
                                else setTypeSort('price09');
                            }}>
                                Tổng Tiền <i className="fa-solid fa-angles-up" id={typeSort==='price90'?'iconDown':undefined} style={{opacity: typeSort.includes('price')?1:0}}></i>
                            </th>
                            <th>
                                Địa Chỉ Giao Hàng
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrder?sortOrder(selectedOrder, typeSort).map(order=>(
                            <OrderAdminLine orderId={order._id} key={order._id}/>
                        )):undefined}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default OrderAdmin;