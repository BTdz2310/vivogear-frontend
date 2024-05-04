import React, {Fragment, useEffect, useState} from 'react';
import Header from "../../Component/Header/Header";
import './Checkout.css'
import {useDispatch, useSelector} from "react-redux";
import {clearCartUser, selectCart} from "../../features/cart/cartSlice";
import {selectInventory} from "../../features/products/productsSlice";
import ProductCart from "../../Component/ProductCart/ProductCart";
import {
    addVoucherUser,
    selectUser,
    updateUser,updateVoucherUser
} from "../../features/auth/authSlice";
import {selectVoucher} from "../../features/voucher/voucherSlice";
import {formatExpired} from "../../utils/math";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import VoucherTag from "../../Component/VoucherTag/VoucherTag";
import { toast } from 'react-toastify';
import {placedOrder} from "../../features/order/orderSlice";
import {useNavigate} from "react-router-dom";
import AddressInput from "../../Component/AddressInput/AddressInput";
import store from "../../store";
import {getCookie} from "../../utils/cookie";

const checkAddress = (address) => {
    console.log('->>ADD',arr, address.length)

    const arr = address.split(' - ');
    if(arr.length!==4) return true;
    let count = 0;
    for(let i=0; i<4; i++){
        if(arr[i].length===0) count++;
    }
    return !(count === 0);
}

const compare = (a, b) => {
    const aValue = a.value;
    const bValue = b.value;

    if (aValue && !bValue) {
        return -1;
    }
    if (!aValue && bValue) {
        return 1;
    }
    return a.value < b.value ? -1 : 1;
}


const Checkout = () => {
    const [quantity, setQuantity] = useState(0)
    const selectedCart = useSelector(selectCart);
    const selectedInventory = useSelector(selectInventory);
    const selectedUser = useSelector(selectUser);
    const selectedVoucher = useSelector(selectVoucher)
    const [total, setTotal] = useState(0);
    const [totalAV, setTotalAV] = useState(0);
    const [voucherO, setVoucherO] = useState('');
    const [voucherP, setVoucherP] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [addCode, setAddCode] = useState('');

    const dispatch = useDispatch();

    const [showAddress, setShowAddress] = useState(false);
    const [showVoucher, setShowVoucher] = useState(false);
    const [typeVoucher, setTypeVoucher] = useState('orders');

    const handleCloseAddress = () => setShowAddress(false);
    const handleShowAddress = () => setShowAddress(true);

    const handleCloseVoucher = () => setShowVoucher(false);
    const handleShowVoucher = () => setShowVoucher(true);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!getCookie('token')){
            localStorage.setItem('navigate', '/checkout');
            navigate('/login');
        }
    }, [])

    useEffect(() => {
        if(selectedUser){
            setAddress(selectedUser.address);
            setPhone(selectedUser.phone)
        }
    }, [selectedUser]);

    useEffect(() => {
        if(address.length){
            const arr = address.split(' - ');
            let count = 0;
            for(let i=0; i<4; i++){
                if(arr[i].length===0) count++;
            }
            if(count===4) setAddress('')
        }
    }, [address]);

    // const [reprice, setReprice] = useState(0);

    useEffect(() => {
        if(selectedInventory&&selectedCart&&getCookie('token')){
            let sum = 0;
            selectedCart.forEach(cart=>{
                // console.log('>>SUMCART',cart)
                sum += selectedInventory[cart.idSP][cart.idInv].price*cart.quantity;
                // console.log('>>SUM',sum)
            })
            setTotal(sum)
            // console.log('total', total)
        }
    }, [selectedCart]);



    useEffect(()=>{
        let checkTotal = total;
        // console.log('>>>TOTAL',total)
        if(voucherO&&selectedVoucher){
            checkTotal = Math.floor(selectedVoucher[voucherO].discount<1 ? (selectedVoucher[voucherO].discount*checkTotal<selectedVoucher[voucherO].maxD?checkTotal * (1 - selectedVoucher[voucherO].discount):checkTotal-selectedVoucher[voucherO].maxD) : checkTotal - selectedVoucher[voucherO].discount);
        }
        if(voucherP&&selectedVoucher){
            const voucher = selectedVoucher[voucherP]
            checkTotal = checkTotal - vouProduct(voucher.discount, voucher.products, voucher.maxD)
        }
        setTotalAV(checkTotal)
    }, [voucherP, voucherO, total])

    const vouProduct = (discount, arr, maxD) => {
        // console.log('>>>>MAXD', maxD)
        if(discount>=1) return discount;
        return Math.ceil(Math.min(discount * (Math.max(Math.max(...selectedCart.filter(cart=>arr.includes(cart.idSP)).map(inv=>selectedInventory[inv.idSP][inv.idInv].price)), 0)), maxD))
    }

    const handleAdd = async () => {
            toast.success('Thêm Voucher Thành Công')

        // console.log(selectedVoucher)
        if(selectedUser.voucher.map(ele=>ele.code).includes(addCode)) {
            toast.error('Code Đã Sử Dụng')
            setAddCode('')
            return;
        }
        if(!selectedVoucher[addCode]||!selectedVoucher[addCode].canSave){
            toast.error('Không Áp Dụng Được Voucher Này')
            setAddCode('')
            return
        }
        if(selectedVoucher[addCode]&&selectedVoucher[addCode].canSave){
            // console.log('kke')
            await dispatch(addVoucherUser(addCode))
            toast.success('Thêm Voucher Thành Công')
            setAddCode('')
        }
    }

    const checkIn = (arr1, arr2) =>{
        // console.log(`>>>1: ${arr1} >>>2: ${arr2}`)
        // if(!arr1||!arr2) return true;
        // arr1.forEach(element=>{
        //     console.log(element , arr2, arr2.includes(element))
        //     if(arr2.includes(element)) return false;
        // })
        for(let i=0; i<arr1.length; i++){
            if(arr2.includes(arr1[i])) return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if(!address){
            toast.error('Vui Lòng Điền Địa Chỉ Nhận Hàng')
            return;
        }
        if(!phone){
            toast.error('Vui Lòng Điền Số Điện Thoại')
            return;
        }

        for(let i=0; i<selectedCart.length; i++){
            if(selectedCart[i].quantity>selectedInventory[selectedCart[i].idSP][selectedCart[i].idInv].quantity){
                toast.error(`Sản Phẩm ${selectedCart[i].name} Không Đủ Số Lượng. Vui Lòng Cập Nhật Lại. Hiện Tại: ${selectedCart[i].quantity} - Khả Dụng ${selectedInventory[selectedCart[i].idSP][selectedCart[i].idInv].quantity}`);
                return;
            }
        }

        const voucher1 = [];
        if(voucherO) voucher1.push(voucherO)
        if(voucherP) voucher1.push(voucherP)
        // console.log('>>>>VOUWEG', voucher1)


        await dispatch(placedOrder({
            user: selectedUser._id,
            products: selectedCart.map(item=>{
                return {
                    inventoryId: item.idInv,
                    productId: item.idSP,
                    quantity: item.quantity,
                    img: item.img,
                    name: item.name,
                }
            }),
            status: 0,
            placed: Date.now(),
            total: totalAV,
            voucher: voucher1,
            phone,
            address
        }))

        toast.success('Đặt Đơn Hàng Thành Công')
        navigate('/user/purchase')
    }

    const handleInfo = async () => {
        console.log('>>>HEHEH>>', address)
        if(checkAddress(address)){
            toast.error("Vui Lòng Chỉnh Sửa Lại Địa Chỉ")
            return;
        }
            console.log('>>>PHOEN', Number(phone))
        if(!Number(phone)||phone.match(/\d/g).length!==10){
            toast.error('Vui Lòng Nhập Đầy Đủ Số Điện Thoại')
            return;
        }
        const res = await dispatch(updateUser({
            id: selectedUser._id,
            data: {
                phone,
                address,
            }
        }))
        if(res.payload.data){
            toast.success(res.payload.msg)
        }else{
            toast.error(res.payload.msg)
            return;
        }
        handleCloseAddress();
    }

    return (
        <>
            {/*{console.log('USERRRR', selectedUser)}*/}
            <Header />
        <main className='checkoutPage'>
            <div className="COLeft">
                {/*<h2 className='COTitle'>Giỏ Hàng</h2>*/}
                <section className="products">
                    <table>
                        <thead className='COTHead'>
                            <tr>
                                <td width='50%' style={{textAlign: 'left'}}>Sản Phẩm</td>
                                <td width='30%' style={{textAlign: 'left'}}>Số Lượng</td>
                                <td width='15%' style={{textAlign: 'left'}}>Tổng Giá</td>
                                <td width='5%' style={{textAlign: 'center'}}></td>
                            </tr>
                        </thead>
                        <tbody id='checkoutTbl'>
                            {selectedCart.map((element, index)=>(
                                <ProductCart key={element.idInv} element={element}/>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <div className="CORight">
                <section className="address-info">
                    {/*<h2 className='COTitle'>Thông Tin Giao Hàng</h2>*/}
                    <div className="addressCODiv">
                        <div className="addressCODivLeft">
                            <h5>{selectedUser&&selectedUser.username}</h5>
                            <p>{phone}</p>
                            <p>{address}</p>
                        </div>
                        <div className="addressCODivRight">
                            <p onClick={handleShowAddress}>Sửa</p>
                        </div>
                    </div>
                </section>

                <section className="payment-info">
                    {/*<h2 className='COTitle'>Tính Tiền</h2>*/}

                    <div className="paymentCODiv">
                        <p className='titleVoucher'>Voucher Đơn Hàng</p>
                        <div className="selectVoucher">
                            {/*<select name="voucherOrder">*/}
                            {/*    <option value="1">1</option>*/}
                            {/*    <option value="2">2</option>*/}
                            {/*    <option value="3">3</option>*/}
                            {/*</select>*/}
                            <select name="voucherOrder" value={voucherO} onChange={(e)=>setVoucherO(e.target.value)}>
                                <option value=''>Không Sử Dụng</option>
                                {(selectedUser&&Object.keys(selectedVoucher).length)?selectedUser.voucher.filter(voucher=>!voucher.used).map(voucher=>voucher.code).map(key=>selectedVoucher[key]).filter(voucher=>voucher.type==='orders').map(voucher=>(
                                    <Fragment key={voucher.code}>
                                        {console.log('HEHEH>>>',voucher)}

                                        {voucher.minO>total||formatExpired(voucher.expired)===-1?undefined:<option key={voucher.code} value={voucher.code}>{`${voucher.code} - (${Math.ceil(voucher.discount<1?Math.min(voucher.discount*total, voucher.maxD):voucher.discount)}$)`}{console.log('>>>VOU', voucher)}</option>}
                                    </Fragment>
                                )):undefined}
                                {/*{selectedUser&&console.log('>>>VOUC',selectedUser.voucher.map(voucher=>voucher.code).map(key=>selectedVoucher[key]).filter(voucher=>voucher.type==='orders'))}*/}
                            </select>
                        </div>
                        <p className='titleVoucher'>Voucher Sản Phẩm</p>
                        <div className="selectVoucher">
                            {/*<select name="voucherOrder">*/}
                            {/*    <option value="1">1</option>*/}
                            {/*    <option value="2">2</option>*/}
                            {/*    <option value="3">3</option>*/}
                            {/*</select>*/}
                            <select name="voucherProduct" value={voucherP} onChange={(e)=>setVoucherP(e.target.value)}>
                                <option value=''>Không Sử Dụng</option>
                                {(selectedUser&&Object.keys(selectedVoucher).length&&selectedCart)?selectedUser.voucher.filter(voucher=>!voucher.used).map(voucher=>voucher.code).map(key=>selectedVoucher[key]).filter(voucher=>voucher.type==='products').map(voucher=>(
                                    <Fragment key={voucher.code}>
                                        {checkIn(selectedCart.map(cart=>cart.idSP), voucher.products)||formatExpired(voucher.expired)===-1?undefined:<option key={voucher.code} value={voucher.code}>{`${voucher.code} - (${vouProduct(voucher.discount, voucher.products, voucher.maxD)}$)`}{console.log('>>>VOU', voucher)}</option>}
                                    </Fragment>
                                )):undefined}
                            </select>
                        </div>
                        <p className="myVoucher" onClick={handleShowVoucher}>Voucher của tôi</p>
                        {/*<div className="totalPayment">*/}
                        {/*    <p className='titleTotal'>Tổng Tiền</p>*/}
                        {/*    <p className='totalPrice'>{`$${totalAV}`}</p>*/}
                        {/*</div>*/}
                    <div className="purchaseDiv">
                        <div className='purchaseBtn' onClick={()=>handleSubmit()}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span>{`$${totalAV}`}</span>
                        </div>
                    </div>
                    </div>
                </section>
            </div>

        </main>


            <Modal show={showAddress} onHide={handleCloseAddress} className='addressModal'>
                <Modal.Header >
                    <Modal.Title>Chỉnh Sửa Thông Tin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className='addressModalTbl'>
                        <tr>
                            <td>Địa Chỉ Nhận Hàng</td>
                            <AddressInput setAddress={setAddress} address={address} addressFirst={selectedUser?selectedUser.address:''}/>
                            {/*<td><textarea value={address} onChange={(e)=>setAddress(e.target.value)}/></td>*/}
                        </tr>
                        <tr>
                            <td>Số Điện Thoại Liên Hệ</td>
                            <td><input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)}/></td>
                        </tr>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddress}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleInfo()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showVoucher} onHide={handleCloseVoucher} className='voucherModal'>
                <Modal.Body>
                    <div className="addVoucherModal">
                        <input type="text" value={addCode} onChange={(e)=>setAddCode(e.target.value)}/>
                        <p onClick={()=>handleAdd()}>Áp Dụng</p>
                    </div>
                    <div className="myVoucherDiv">
                        <div className="myVoucherTitle">
                            <p className={typeVoucher==='orders'?'choseTitle':undefined} onClick={()=>setTypeVoucher('orders')}>Đơn Hàng</p>
                            <p className={typeVoucher==='products'?'choseTitle':undefined} onClick={()=>setTypeVoucher('products')}>Sản Phẩm</p>
                        </div>
                        <div className="myVoucherList">
                            <div className="myVoucherContainer">
                                {selectedUser&&selectedVoucher?selectedUser.voucher.map(voucher=>(
                                    <Fragment key={voucher.code}>
                                        {/*<p>{voucher.type}</p>*/}
                                        {selectedVoucher[voucher.code]?selectedVoucher[voucher.code].type===typeVoucher&&<VoucherTag key={voucher.code} used={voucher.used} data={selectedVoucher[voucher.code]} products={selectedCart.filter(selc=>selectedVoucher[voucher.code].products.filter(vou=>selectedCart.map(ele=>ele.idSP).includes(vou)).includes(selc.idSP)).map(cartS=>selectedInventory[cartS.idSP][cartS.idInv])} total={total}/>:undefined}
                                    </Fragment>
                                )):undefined}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>


</>
    );
};

export default Checkout;