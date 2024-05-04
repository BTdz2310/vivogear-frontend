import React, {useState} from 'react';
import './CreateVoucher.css'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useDispatch, useSelector} from "react-redux";
import {selectProducts} from "../../../features/products/productsSlice";
import {forEach} from "react-bootstrap/ElementChildren";
import {createVoucher, selectVoucher} from "../../../features/voucher/voucherSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateVoucherLine from "../UpdateVoucherLine/UpdateVoucherLine";

const formatTime = (ts) => {
    const date = new Date(ts);
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
}

const CreateVoucher = () => {
    const [show, setShow] = useState(false);
    const [typeCP, setTypeCP] = useState('');

    const [checkedProducts, setCheckedProduct] = useState([])

    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState();
    const [minO, setMinO] = useState();
    const [maxD, setMaxD] = useState();
    const [expired, setExpired] = useState();
    const [canSave, setCanSave] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [inform, setInform] = useState(false);

    const selectedVoucher = useSelector(selectVoucher)
    const selectedProducts = useSelector(selectProducts);
    const dispatch = useDispatch();

    const resetType = () => {
        setCode();
        setDiscount();
        setMinO();
        setMaxD();
        setExpired();
        setCanSave(false);
        setCheckedProduct([])
        setInform(false)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const handleSubmitCV = async (e) => {
        e.preventDefault();
        if(checkedProducts.length===0&&typeCP==='products'){
            alert('Vui Lòng Chọn Sản Phẩm');
            return;
        }
        if(Object.keys(selectedVoucher).includes(code)){
            toast.error('Mã Code Đã Tồn Tại!!')
            return;
        }
        const date = new Date(expired);
        const response = await dispatch(createVoucher({
            type: typeCP,
            code,
            discount: Number(discount),
            maxD: Number(maxD)|0,
            minO: Number(minO),
            expired: date.getTime(),
            canSave,
            inform,
            products: checkedProducts,
        }))
        toast.success('Tạo Voucher Thành Công')
        resetType()
        handleClose()
    }

    return (

        <div className='voucherAdmin'>
            {console.log(checkedProducts)}
            {/*{console.log('sHOW', show)}*/}
            <div className="admin-task__head">Voucher</div>
            <div className="admin-task__action">
                <button className="addVoucher" onClick={()=>handleShow()}>Thêm Voucher</button>
            </div>
            <div className="updateVoucher">
                <h1 style={{marginBottom: '20px', fontFamily: 'fangsong'}}>Sửa Voucher</h1>
                <table className="tblVoucher">
                    <thead>
                        <tr>
                            <td>Code</td>
                            <td>Loại</td>
                            <td>Giảm Giá</td>
                            <td>Giảm Tối Đa</td>
                            <td>Đơn Tối Thiểu</td>
                            <td>Ngày Hết Hạn</td>
                            <td>Sản Phẩm</td>
                            <td style={{width: '50px'}}></td>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedVoucher?Object.keys(selectedVoucher).map(key=>(
                            <tr key={key}>
                                <td>{selectedVoucher[key].code}</td>
                                <td>{selectedVoucher[key].type==='orders'?'Đơn Hàng':'Sản Phẩm'}</td>
                                <td>{Number(selectedVoucher[key].discount)<1?`${selectedVoucher[key].discount*100}%`:`${selectedVoucher[key].discount}$`}</td>
                                <td>{Number(selectedVoucher[key].discount)<1?`${selectedVoucher[key].maxD}$`:''}</td>
                                <td>{selectedVoucher[key].type==='orders'?`${selectedVoucher[key].minO}$`:''}</td>
                                <td>{formatTime(selectedVoucher[key].expired)}</td>
                                {console.log('VOU>>>', selectedVoucher[key])}
                                <td>{selectedVoucher[key].type==='orders'?'':`${selectedVoucher[key].products.length} sản phẩm`}</td>
                                <td><UpdateVoucherLine data={selectedVoucher[key]}/></td>

                            </tr>
                        )):undefined}
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleClose} className='md-modal'>
                    {/*<form onSubmit={(e)=>handleSubmitCV(e)}>*/}
                <Modal.Header >
                    <Modal.Title>Thêm Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="CPContainer">
                            <div className="typeCP">
                                <label htmlFor="typeCP">Loại Voucher</label>
                                <select name="typeCP" value={typeCP} onChange={(e)=> {
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
                                        <input type="text" name='CVPCode' required value={code} onChange={(e)=>setCode(e.target.value)}/>
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
                                    <input type="text" name='CVOCode' required value={code} onChange={(e)=>setCode(e.target.value)}/>
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
                                    <input type="date" name='CVOExpired' required value={expired} onChange={(e)=>setExpired(e.target.value)}/>
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
                    <Button variant="primary"  onClick={(e)=>handleSubmitCV(e)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
                    {/*</form>*/}
            </Modal>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default CreateVoucher;