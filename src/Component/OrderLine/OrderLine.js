import React, {Fragment, useEffect, useState} from 'react';
import './OrderLine.css';
import {formatTime} from "../VoucherTag/VoucherTag";
import {useDispatch, useSelector} from "react-redux";
import {selectInventory} from "../../features/products/productsSlice";
import {Link} from "react-router-dom";
import {handleOrder, selectRawOrder} from "../../features/order/orderSlice";
import {checkColorStatus, checkStatus} from "../Admin/OrderAdminLine/OrderAdminLine";
import ReasonModal from "../ReasonModal/ReasonModal";
import button from "bootstrap/js/src/button";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReviewLine from "../ReviewLine/ReviewLine";

const expectedTime = (time) => {
    if(time[1]) return formatTime(time[1] + 604800000);
    return formatTime(time[0] + 1209600000)
}

export const convertTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

const OrderLine = ({orderId}) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const selectedInventory = useSelector(selectInventory);
    const selectedRawOrder = useSelector(selectRawOrder);

    const dispatch = useDispatch();

    const [data, setData] = useState(null);

    useEffect(() => {
        if(selectedRawOrder){
            setData(selectedRawOrder[orderId])
        }
    }, [orderId, selectedRawOrder]);

    const handleSuccess = () => {
        dispatch(handleOrder({
            _id: data._id,
            status: 4,
            success: Date.now()
        }))
    }

    return (
        <>
            {data?(
                <div className='order-line'>
                    <details>
                        <summary className='order-line__head'>
                            <div className="order-line__title">
                                <div className="order-line__title--left">
                                    <h4>{`Mã Số: ${data._id}`}</h4>
                                    <p>{`Số Điện Thoại: ${data.phone}`}</p>
                                    <p>{`Địa Chỉ Nhận Hàng: ${data.address} `}</p>
                                </div>
                                <div className="order-line__title--right">
                                    <h4 style={{padding: '4px 8px', backgroundColor: checkColorStatus(data.status), borderRadius: '12px', textAlign: 'center'}}>{checkStatus(data.status)}</h4>
                                    {/*{!data.completed&&!data.canceled?(<>*/}
                                    {/*    <p>Thời Gian Nhận Hàng Dự Kiến</p>*/}
                                    {/*    <p>{expectedTime([data.placed, data.comfirmed])}</p>*/}
                                    {/*</>):undefined}*/}
                                </div>
                            </div>
                            <div className="order-line__type">
                                <div className="order-line__type--minimize">
                                    <i className="fa-solid fa-caret-up"></i>
                                    <p>Thu Gọn</p>
                                </div>
                                <div className="order-line__type--expand">
                                    <i className="fa-solid fa-caret-down"></i>
                                    <p>Mở Rộng</p>
                                </div>
                            </div>
                        </summary>
                        <div className="order-line__status">
                            <div className="order-line__state">
                                <div>
                                    <div className="order-line__circle"></div>
                                    <div className='order-line__state--first'>
                                        <p>Đơn Hàng</p>
                                        <p>Được Đặt</p>
                                    </div>
                                </div>
                                {/*<p>*/}
                                {/*    <span></span>*/}
                                {/*    <span></span>*/}
                                {/*</p>*/}
                            </div>
                            <div className={data.confirmed?"order-line__state":"order-line__state order-line__state--unfinished"}>
                                <div>
                                    <div className="order-line__stick"></div>
                                    <div className="order-line__circle"></div>
                                    <div>
                                        <p>Xác Nhận</p>
                                        <p>Đơn Hàng</p>
                                    </div>
                                </div>
                            </div>
                            <div className={data.pickup?"order-line__state":"order-line__state order-line__state--unfinished"}>
                                <div>
                                    <div className="order-line__stick"></div>
                                    <div className="order-line__circle"></div>
                                    <div>
                                        <p>Đã Giao</p>
                                        <p>Cho ĐVVC</p>
                                    </div>
                                </div>
                            </div>
                            <div className={data.received?"order-line__state":"order-line__state order-line__state--unfinished"}>
                                <div>
                                    <div className="order-line__stick"></div>
                                    <div className="order-line__circle"></div>
                                    <div>
                                        <p>Giao Hàng</p>
                                        <p>Thành Công</p>
                                    </div>
                                </div>
                            </div>
                            <div className={data.success?"order-line__state":"order-line__state order-line__state--unfinished"}>
                                <div>
                                    <div className="order-line__stick"></div>
                                    <div className="order-line__circle"></div>
                                    <div>
                                        <p>Hoàn Thành</p>
                                        <p>Đơn Hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop: '80px'}}>
                            <table>
                                <tbody>
                                {Object.keys(data)?data.products.map(product=>(
                                    <Fragment key={product._id}>
                                        <tr className="order-line__product">
                                            <>
                                                <td><img src={product.img} alt={product.name}/></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.5)'}}><Link style={{color: 'white'}} to={`/product/${product.productId}`}><p>{product.name}</p></Link></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.3)'}}><p>{selectedInventory[product.productId]?selectedInventory[product.productId][product.inventoryId].size:''}</p></td>
                                                <td style={{width: 'calc((100% - 120px) * 0.2)'}}><p>{selectedInventory[product.productId]?selectedInventory[product.productId][product.inventoryId].color:''}</p></td>
                                                <td style={{width: '40px'}}><p>{product.quantity}</p></td>
                                            </>
                                        </tr>
                                    </Fragment>
                                )):undefined}
                                <tr>
                                    <td colSpan='5' style={{textAlign: 'right', paddingRight: '40px', fontWeight: 'bold', fontSize: '20px'}}>{`Tổng Tiền: ${data.total}$`}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="order-line__time">
                            <h4>Tình Trạng Đơn Hàng</h4>
                            <ul>
                                {data.canceled&&<li><p>{`${convertTime(data.canceled)} ${formatTime(data.canceled)}: Đơn Hàng Bị Huỷ Vì: "${data.message}".`}</p></li>}
                                {data.returned&&<li><p>{`${convertTime(data.returned)} ${formatTime(data.returned)}: Đơn Hàng Bị Trả Lại Vì: "${data.message}".`}</p></li>}
                                {data.success&&<li><p>{`Đơn Hàng Hoàn Thành.`}</p></li>}
                                {data.received&&<li><p>{`${convertTime(data.received)} ${formatTime(data.received)}: Khách Hàng Nhận Hàng Thành Công.`}</p></li>}
                                {data.pickup&&<li><p>Đơn Hàng Đang Được Vận Chuyển.</p></li>}
                                {data.pickup&&<li><p>{`${convertTime(data.confirmed)} ${formatTime(data.pickup)}: Nhân Viên Đã Giao Cho Đơn Vị Vận Chuyển.`}</p></li>}
                                {data.confirmed&&<li><p>{`${convertTime(data.confirmed)} ${formatTime(data.confirmed)}: Admin Đã Xác Nhận Đơn Hàng.`}</p></li>}
                                <li><p>{`${convertTime(data.placed)} ${formatTime(data.placed)}: Đơn Hàng Được Khách Hàng Đặt.`}</p></li>
                            </ul>
                        </div>
                        <div className="order-line__button">
                            <button disabled={data.status!==3} onClick={()=>handleSuccess()}>Đã Nhận Được Hàng</button>
                            {data.status===3||data.status===6&&<ReasonModal type='returned' data={data}/>}
                            <button disabled={data.status!==4} onClick={handleShow}>Đánh Giá Sản Phẩm</button>
                            <ReasonModal type='cancel' data={data}/>
                        </div>
                    </details>
                    <Modal show={show} onHide={handleClose} className='md-modal'>
                        <Modal.Header >
                            <Modal.Title>Đánh Giá Sản Phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {data.status===4&&(
                                <>
                                    {console.log('data>>', data)}
                                    {data.products.map(inv=>(
                                       <ReviewLine inv={inv} orderId={data._id} key={inv.inventoryId}/>
                                    ))}
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Xong
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ):undefined}
        </>
    );
};
export default OrderLine;