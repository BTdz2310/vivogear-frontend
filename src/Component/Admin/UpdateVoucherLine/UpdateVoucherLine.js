import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useDispatch, useSelector} from "react-redux";
import {selectProducts} from "../../../features/products/productsSlice";
import {deleteVoucher, selectVoucher, updateVoucher} from "../../../features/voucher/voucherSlice";
import moment from "moment";
import {toast} from "react-toastify";

const formatExpired = (ts) => {

    const date = new Date(ts);
    const mm = date.getMonth()<10?`0${date.getMonth()}`:date.getMonth();
    // console.log(mm)
    const dd = date.getDate()<10?`0${date.getDate()}`:date.getDate();
    // console.log('date', `${date.getFullYear()}-${mm}-${dd}`)
    return moment.unix(ts/1000).format("YYYY-MM-DD")
    // return `${date.getFullYear()}-${mm}-${dd}`
}

const UpdateVoucherLine = ({data}) => {
    const [show, setShow] = useState(false);
    const [checkedProducts, setCheckedProduct] = useState(data.products)

    const [typeCP, setTypeCP] = useState(data.type)
    const [code, setCode] = useState(data.code);
    const [discount, setDiscount] = useState(data.discount);
    const [minO, setMinO] = useState(data.minO);
    const [maxD, setMaxD] = useState(data.maxD);
    const [expired, setExpired] = useState(formatExpired(data.expired));
    // console.log('first',expired)
    const [canSave, setCanSave] = useState(data.canSave);
    const [searchText, setSearchText] = useState('');
    const [inform, setInform] = useState(false);

    const selectedProducts = useSelector(selectProducts);
    const selectedVoucher = useSelector(selectVoucher)
    const dispatch = useDispatch();

    const resetType = () => {
        setCode();
        setDiscount();
        setMinO();
        setMaxD();
        setExpired();
        setCanSave(false);
        setInform(false)
        setCheckedProduct([])
    }

    const handleCheck = () => {
        setCheckedProduct([])
        document.getElementsByName('CVI').forEach(element=>{
            if(element.checked) setCheckedProduct(prev=>[...prev, element.id])
        })


    }

    const handleResetCVP = () => {
        setCheckedProduct([]);
    }

    const handleCheckAllCVP = () => {
        Object.keys(selectedProducts).filter(key=>selectedProducts[key].name.toLowerCase().includes(searchText.toLowerCase())).forEach(key=>{
            if(!checkedProducts.includes(key)) setCheckedProduct(prev=>[...prev, key])
        })
    }

    const handleUpdate = async () => {
        const date = new Date(expired);
        if(checkedProducts.length===0&&typeCP==='products'){
            alert('Vui Lòng Chọn Sản Phẩm');
            return;
        }
        console.log(data)
        const updatedVoucher = {
            _id: data._id,
            code,
            type: typeCP,
            discount: Number(discount),
            maxD: Number(maxD)|0,
            expired: date.getTime(),
            canSave,
            products: checkedProducts,
            minO: Number(minO),
            inform
        }
        const response = await dispatch(updateVoucher(updatedVoucher))
        toast.success('Cập Nhật Voucher Thành Công!!')
        handleClose()
    }
console.log('>>>DATA', data)
    const handleDelete = async () => {
        const response = await dispatch(deleteVoucher(data));
        if(response.payload.msg==='Error'){
            toast.error('Lỗi Server!!')
            return;
        }
        toast.success('Xoá Voucher Thành Công!!')
        handleClose()
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div id='updateLineVoucher'>
            <i className="fa-solid fa-gear updateVoucherHide" onClick={handleShow}></i>

            <Modal show={show} onHide={handleClose} className='md-modal'>
                <Modal.Header>
                    <Modal.Title>Update Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="CPContainer">
                        <div className="typeCP">
                            <label htmlFor="typeCP">Loại Voucher</label>
                            <select name="typeCP" disabled value={typeCP} onChange={(e)=> {
                                setTypeCP(e.target.value)
                                resetType()
                            }}>
                                <option value=""></option>
                                <option value="products">Sản Phẩm</option>
                                <option value="orders">Đơn Hàng</option>
                            </select>
                        </div>
                    </div>
                    {typeCP==='products'?(
                        <div className='CVPContainer'>
                            <div className="CVPLeft">
                                <div className="CVPCode">
                                    <label htmlFor="CVPCode" className='CVPLabel'>Mã Code: </label>
                                    <input type="text" name='CVPCode' disabled required value={code} onChange={(e)=>setCode(e.target.value)}/>
                                </div>
                                <div className="CVPDiscount">
                                    <label htmlFor="CVPDiscount" className='CVPLabel'>Giảm Giá (Giá Trị Dưới 1 Sẽ Được Hiểu Là % Giá Trị Đơn Hàng): </label>
                                    <input type="number" name='CVPDiscount' required step='0.01' value={discount} onChange={(e)=>setDiscount(e.target.value)} className={discount?(discount<1?'CVPercent':'CVDollar'):undefined}/>
                                    {Number(discount)>=0&&Number(discount)!==0?(discount<1?(<span style={{marginLeft: '8px'}}>%</span>):(<span style={{marginLeft: '8px'}}>$</span>)):undefined}
                                </div>
                                {Number(discount)>=0&&Number(discount)<1&&Number(discount)!==0?(<div className="CVPMaxD">
                                    <label htmlFor="CVPMaxD" className='CVPLabel'>Giảm Giá Tối Đa: </label>
                                    <input type="number" name='CVPMaxD' required value={maxD} onChange={(e)=>setMaxD(e.target.value)}/>
                                    <span style={{marginLeft: '8px'}}>$</span>
                                </div>):undefined}
                                <div className="CVPExpired">
                                    <label htmlFor="CVPExpired" className='CVPLabel'>Ngày Hết Hạn: </label>
                                    <input type="date" name='CVPExpired' required value={expired} onChange={(e)=>setExpired(e.target.value)}/>
                                </div>
                                <div className="CVPCanSave">
                                    <label htmlFor="CVPCanSave" className='CVPLabel'>Cho Phép Người Dùng Nhập Mã: </label>
                                    <input type='checkbox' name='CVPCanSave' checked={canSave} onChange={(e)=>setCanSave(e.target.checked)}/>
                                </div>
                                <div className="CVOCanSave">
                                    <label htmlFor="CVOInform" className='CVOLabel'>Thông Báo Cho Tất Cả Người Dùng: </label>
                                    <input type='checkbox' name='CVOInform' checked={inform} onChange={(e)=>setInform(e.target.checked)}/>
                                </div>
                            </div>
                            <div className="CVPRight">
                                <div className="CVPCheck">
                                    <input type="text" placeholder='Tìm Kiếm' value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                                    <button className='checkAllCVP' onClick={()=>handleCheckAllCVP()}>Chọn Tất Cả</button>
                                    <button className='checkAllCVP' onClick={()=>handleResetCVP()}>Đặt Lại</button>
                                </div>
                                {selectedProducts?(
                                    <div className='CVPShow'>
                                        {Object.keys(selectedProducts).filter(key=>selectedProducts[key].name.toLowerCase().includes(searchText.toLowerCase())).map(key=>(
                                            <div className='CVPItem' key={key}>
                                                <input type="checkbox" id={key} name='CVI' className='CVI' onChange={()=>handleCheck()} checked={checkedProducts.includes(key)}/>
                                                <label htmlFor={key} className='CVPRightLabel'>
                                                    <img src={selectedProducts[key].img} alt={selectedProducts[key].name}/>
                                                    <p>{selectedProducts[key].name}</p>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ):undefined}
                            </div>
                        </div>
                    ):typeCP==='orders'?(
                        <div className='CVOContainer'>
                            <div className="CVOCode">
                                <label htmlFor="CVOCode" className='CVOLabel'>Mã Code: </label>
                                <input type="text" name='CVOCode' disabled required value={code} onChange={(e)=>setCode(e.target.value)}/>
                            </div>
                            <div className="CVOMinO">
                                <label htmlFor="CVOMinO" className='CVOLabel'>Đơn Hàng Tối Thiểu: </label>
                                <input type="number" name='CVOMinO' required value={minO} onChange={(e)=>setMinO(e.target.value)}/>
                                <span style={{marginLeft: '8px'}}>$</span>
                            </div>
                            <div className="CVODiscount">
                                <label htmlFor="CVODiscount" className='CVOLabel'>Giảm Giá (Giá Trị Dưới 1 Sẽ Được Hiểu Là % Giá Trị Đơn Hàng): </label>
                                <input type="number" name='CVODiscount' step='0.01' required value={discount} onChange={(e)=>setDiscount(e.target.value)} className={discount?(discount<1?'CVPercent':'CVDollar'):undefined}/>
                                {Number(discount)>=0&&Number(discount)!==0?(discount<1?(<span style={{marginLeft: '8px'}}>%</span>):(<span style={{marginLeft: '8px'}}>$</span>)):undefined}
                            </div>
                            {Number(discount)>=0&&Number(discount)<1&&Number(discount)!==0?(<div className="CVOMaxD">
                                <label htmlFor="CVOMaxD" className='CVOLabel'>Giảm Giá Tối Đa: </label>
                                <input type="number" name='CVOMaxD' required value={maxD} onChange={(e)=>setMaxD(e.target.value)}/>
                                <span style={{marginLeft: '8px'}}>$</span>
                            </div>):undefined}
                            <div className="CVOExpired">
                                <label htmlFor="CVOExpired" className='CVOLabel'>Ngày Hết Hạn: </label>
                                <input type="date" name='CVOExpired' required value={expired} onChange={(e)=>console.log(e.target.value)}/>
                            </div>
                            <div className="CVOCanSave">
                                <label htmlFor="CVOCanSave" className='CVOLabel'>Cho Phép Người Dùng Nhập Mã: </label>
                                <input type='checkbox' name='CVOCanSave' checked={canSave} onChange={(e)=>setCanSave(e.target.checked)}/>
                            </div>
                            <div className="CVOCanSave">
                                <label htmlFor="CVOInform" className='CVOLabel'>Thông Báo Cho Tất Cả Người Dùng: </label>
                                <input type='checkbox' name='CVOInform' checked={inform} onChange={(e)=>setInform(e.target.checked)}/>
                            </div>
                        </div>
                    ):undefined}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={()=>handleDelete()}>
                        Delete
                    </Button>
                    <Button variant="primary" onClick={()=>handleUpdate()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateVoucherLine;