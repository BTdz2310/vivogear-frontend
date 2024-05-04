import React, {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {handleOrder} from "../../features/order/orderSlice";
import {useDispatch} from "react-redux";
import './ReasonModal.css'
import {toast} from "react-toastify";

const ReasonModal = ( {type, data} ) => {

    const [show, setShow] = useState(false);
    const [reason, setReason] = useState('');
    const [otherR, setOtherR] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        setReason('');
        setOtherR('');
    }, [show]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleSubmit = async () => {
        if(!reason){
            toast.error('Vui lòng chọn lý do');
            return;
        }
        const cancel = {
            _id: data._id,
            status: 5,
            canceled: Date.now(),
            message: reason !== 'Khác' ? reason : otherR
        }
        await dispatch(handleOrder(cancel));
        toast.success('Huỷ Đơn Hàng Thành Công')
        handleClose();
    }

    const handleReturned = () => {
        if(!reason){
            toast.error('Vui lòng chọn lý do');
            return;
        }
        const returned = {
            _id: data._id,
            status: 6,
            returned: Date.now(),
            message: reason
        }
        dispatch(handleOrder(returned));
        toast.success('Trả Đơn Hàng Thành Công')
        handleClose();
    }

    const switchModal = () => {
        switch (type) {
            case 'cancel':
                return (
                    <>
                        <button disabled={data.status!==0} id={data.status!==0?'disabledBtn':undefined} onClick={handleShow}>Huỷ Đơn Hàng</button>
                        <Modal show={show} onHide={handleClose} className='reason-modal'>
                            <Modal.Header>
                                <Modal.Title>Chọn Lý Do Huỷ</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="reason-modal-list">
                                    <label className="reason-modal-option">Muốn thay đổi địa chỉ giao hàng
                                        <input type="radio" name="reason" value="Muốn thay đổi địa chỉ giao hàng" onChange={(e)=>setReason(e.target.value)}/>
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Muốn nhập/thay đổi mã Voucher
                                        <input type="radio" name="reason" value="Muốn nhập/thay đổi mã Voucher" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Muốn thay đổi sản phẩm trong đơn hàng
                                        <input type="radio" name="reason" value="Muốn thay đổi sản phẩm trong đơn hàng" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Tìm thấy giá rẻ hơn ở chỗ khác
                                        <input type="radio" name="reason" value="Tìm thấy giá rẻ hơn ở chỗ khác" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Đổi ý, không muốn mua nữa
                                        <input type="radio" name="reason" value="Đổi ý, không muốn mua nữa" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Khác
                                        <input type="radio" name="reason" value="Khác" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    {reason==='Khác'&&(
                                        <textarea className='reason-option-other' rows={3} value={otherR} onChange={(e)=>setOtherR(e.target.value)}></textarea>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={()=>handleSubmit()}>
                                    Xác Nhận Huỷ
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )
            case 'returned':
                return (
                    <>
                        <button disabled={data.status!==3} onClick={handleShow}>Yêu Cầu Trả Hàng</button>
                        <Modal show={show} onHide={handleClose} className='md-modal'>
                            <Modal.Header>
                                <Modal.Title>Chọn Lý Do Trả Hàng</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="reason-modal-list">
                                    <label className="reason-modal-option">Chưa nhận được hàng
                                        <input type="radio" name="reason" value="Chưa nhận được hàng" onChange={(e)=>setReason(e.target.value)}/>
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Thiếu hàng
                                        <input type="radio" name="reason" value="Thiếu hàng" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Người bán gửi sai hàng
                                        <input type="radio" name="reason" value="Người bán gửi sai hàng" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Hàng bể vỡ (vỡ vụn, trầy xước, không nguyên vẹn, rò rỉ chất lỏng...)
                                        <input type="radio" name="reason" value="Hàng bể vỡ (vỡ vụn, trầy xước, không nguyên vẹn, rò rỉ chất lỏng...)" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Hàng lỗi, không hoạt động
                                        <input type="radio" name="reason" value="Hàng lỗi, không hoạt động" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Hàng đã qua sử dụng
                                        <input type="radio" name="reason" value="Hàng đã qua sử dụng" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                    <label className="reason-modal-option">Hàng giả/nhái
                                        <input type="radio" name="reason" value="Hàng giả/nhái" onChange={(e)=>setReason(e.target.value)} />
                                        <span className='reason-option-checkmark'></span>
                                    </label>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                                <Button variant="primary" onClick={()=>handleReturned()}>
                                    Xác Nhận Trả Hàng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )
        }
    }

    return (
        <>
            {switchModal()}
        </>
    );
};

export default ReasonModal;