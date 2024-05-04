import React, {Fragment, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectInventory} from "../../../features/products/productsSlice";
import {handleOrder, selectRawOrder} from "../../../features/order/orderSlice";

const formatTimestamp = (timestamp) => {

    const date = new Date(timestamp);

    return date.toLocaleString({
        locale: 'en-US',
    });
}

function limit (string = '') {
    const length = 40;
    if(string.length<=40) return string;
    return string.substring(0, 40).concat(' ...')
}

export const checkStatus = (num) => {
    switch (num){
        case 0:
            return 'Chờ Xác Nhận';
        case 1:
            return 'Chờ Giao Cho ĐVVC';
        case 2:
            return 'Đang Vận Chuyển';
        case 3:
            return 'Giao Hàng Thành Công';
        case 4:
            return 'Đơn Hàng Hoàn Thành';
        case 5:
            return 'Đơn Hàng Bị Huỷ';
        case 6:
            return 'Đơn Hàng Bị Trả Lại';
    }
}

export const checkColorStatus = (num) => {
    switch (num){
        case 0:
            return '#c0c0c0';
        case 1:
            return '#ffd700';
        case 2:
            return '#ffa500';
        case 3:
            return '#1e90ff';
        case 4:
            return '#32cd32';
        case 5:
            return '#ff6347';
        case 6:
            return '#8a2be2';
    }
}

const OrderAdminLine = ({orderId}) => {

    const [hide, setHide] = useState(true);
    const selectedInventory = useSelector(selectInventory);
    const dispatch = useDispatch();
    const selectedRawOrder = useSelector(selectRawOrder);

    const [data, setData] = useState(null);

    useEffect(() => {
        if(selectedRawOrder){
            setData(selectedRawOrder[orderId])
        }
    }, [orderId, selectedRawOrder]);

    const handleConfirmed = () => {
        dispatch(handleOrder({
            _id: data._id,
            status: 1,
            confirmed: Date.now()
        }))
    }

    const handleDelivered = () => {
        dispatch(handleOrder({
            _id: data._id,
            status: 2,
            pickup: Date.now()
        }))
    }

    const handleReceived = () => {
        dispatch(handleOrder({
            _id: data._id,
            status: 3,
            received: Date.now()
        }))
    }

    const handleCanceled = () => {
        dispatch(handleOrder({
            _id: data._id,
            status: 5,
            canceled: Date.now()
        }))
    }

    console.log('>>>>DATA', orderId)

    return (
        <>
            {data?(
                <>
                    <tr onClick={()=>setHide(prev=>!prev)}>
                        <td>{data._id}</td>
                        <td style={{padding: '10px'}}><p style={{padding: '4px 8px', backgroundColor: checkColorStatus(data.status), borderRadius: '12px'}}>{checkStatus(data.status)}</p></td>
                        <td>{formatTimestamp(data.placed)}</td>
                        <td className='price' style={{fontWeight: 'unset'}}>{data.total}</td>
                        <td>{limit(data.address)}</td>
                    </tr>
                    <tr style={{display: hide?'none':'table-row'}} className='expandTR'>
                        <td colSpan="5">
                            {data.message&&(
                                <div className="contactOrder">
                                    <p>Lý Do</p>
                                    <p>{data.message}</p>
                                </div>
                            )}
                            <div className="contactOrder">
                                <p>Số Điện Thoại</p>
                                <p>{data.phone}</p>
                            </div>
                            <div className="contactOrder">
                                <p>Địa Chỉ Giao Hàng</p>
                                <p>{data.address}</p>
                            </div>
                            <p style={{textAlign: 'left', padding: '10px 40px', fontWeight: 'bold'}}>Danh Sách Mua</p>
                            <table>
                                <tbody>
                                {data.products.map(product=>(
                                    <Fragment key={product._id}>
                                        <tr className="order-line__product">
                                            <>
                                                <td><img src={product.img} alt={product.name}/></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.5)'}}><p style={{color: 'white'}}>{product.name}</p></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.3)'}}><p>{selectedInventory[product.productId]?selectedInventory[product.productId][product.inventoryId].size:''}</p></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.2)'}}><p>{selectedInventory[product.productId]?selectedInventory[product.productId][product.inventoryId].color:''}</p></td>
                                                <td style={{width: '40px'}}><p>{product.quantity}</p></td>
                                            </>
                                        </tr>
                                    </Fragment>
                                ))}
                                <tr>
                                    <td colSpan='5' style={{textAlign: 'right', paddingRight: '40px', fontWeight: 'bold', fontSize: '20px'}}>{`Tổng Tiền: ${data.total}$`}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="btnExpandOrder">
                                <button disabled={data.status!==0} id={data.status!==0?'disabledBtn':undefined} onClick={()=>handleConfirmed()}>Xác Nhận Đơn Hàng</button>
                                <button disabled={data.status!==1} id={data.status!==1?'disabledBtn':undefined} onClick={()=>handleDelivered()}>Xác Nhận Đã Giao Cho ĐVVC</button>
                                <button disabled={data.status!==2} id={data.status!==2?'disabledBtn':undefined} onClick={()=>handleReceived()}>Xác Nhận Đã Giao Hàng Thành Công</button>
                                <button disabled={data.status!==0} id={data.status!==0?'disabledBtn':undefined} onClick={()=>handleCanceled()} className='orderAdm-canceled-btn'>Huỷ Đơn Hàng</button>
                            </div>
                        </td>
                    </tr>
                </>
            ):undefined}
        </>
    );
};

export default OrderAdminLine;