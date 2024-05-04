import React, {useState, useEffect, lazy, Suspense} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectInventory, selectProducts} from "../../features/products/productsSlice";
import ImageSlide from "../../Component/ImageSlide/ImageSlide";
import './ProductDetails.css'
import Cart from "../../Component/Cart/Cart";
import namedColors from 'color-name-list';
import {addToCart, createCartUser, selectCart, updateCartUser} from "../../features/cart/cartSlice";
import cart from "../../Component/Cart/Cart";
import store from "../../store";
// import Review from "../Review/Review";
// import Comment from "../Comment/Comment";
import {loadReview} from "../../features/review/reviewSlice";
import AttrProduct from "../../Component/AttrProduct/AttrProduct";
// import SameBrand from "../SameBrand/SameBrand";
import { toast } from 'react-toastify';
import {getCookie} from "../../utils/cookie";
import button from "bootstrap/js/src/button";
import {selectUser} from "../../features/auth/authSlice";
import {selectVoucher} from "../../features/voucher/voucherSlice";


const Review = lazy(()=>import("../../Component/Review/Review"))
const Comment = lazy(()=>import("../../Component/Comment/Comment"))
const SameBrand = lazy(()=>import("../../Component/SameBrand/SameBrand"))

const listType = {
    'phone': 'Điện Thoại',
    'watch': 'Đồng Hồ',
    'tablet': 'Máy Tính Bảng'
}

export function ProductDetails(){
    console.log('stOOOAROWOROAW')
    console.log(store.getState())
    console.log('DETAILLLLLŁRRŁ');
    const location = useLocation();
    const idP = location.pathname.split('/')[2];
    console.log(idP)
    const allProducts = useSelector(selectProducts);
    const [imgs, setImgs] = useState([]);
    const [size, setSize] = useState('');
    const [mausac, setMauSac] = useState('');
    const dispatch = useDispatch();
    const [reviewSec, setReviewSec] = useState(1)
    const selectedCart = useSelector(selectCart);
    const selectedInventory = useSelector(selectInventory)
    const selectedUser = useSelector(selectUser);
    const selectedVoucher = useSelector(selectVoucher);
    // console.log(`size: ${size}`)
    // const imgs = [];
    // {setImgs(allProducts[idP].imgsDetail)}

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    
    useEffect(()=>{
        setSize(null);
        setMauSac(null);
    }, [idP])
    
    useEffect(()=>{
        dispatch(loadReview())
    }, [])


    const checkQuantity = () => {
        return selectedInventory[idP]?(Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]?selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]].quantity:0):0
        // return mausac===''||size===''?selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]].quantity:0;
    }

    const checkPrice = () => {
        return selectedInventory[idP]?(Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]?selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]].price:0):0
        // return mausac===''||size===''?selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]].quantity:0;
    }


    const setColor = (element) => {
        const color = namedColors.find(color => color.name === element);
        const colorHex = color.hex;
        return {backgroundColor: colorHex}
    }
 
    
    const handleAddToCart = () => {

        if(!Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]||selectedInventory[idP][selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id].quantity<=0){
            toast.error('Sản Phẩm Hết Hàng Hoặc Không Khả Dụng');
            return;
        }

        const data = {
            idInv: selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id,
            idSP: idP,
            name: allProducts[idP].name,
            img: allProducts[idP].img,
            quantity: 1
        };
        
        console.log(`CHECK INCLUDE: ${selectedCart.map(ct=>ct.idInv)}`)
        console.log('CHECKKCKK', (selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id))

        if(getCookie('token')){
            if(selectedCart.map(ct=>ct.idInv).includes(selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id)){
                dispatch(updateCartUser({
                    idInv: selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id,
                    quantity: selectedCart.filter(ct=>ct.idInv===selectedInventory[idP][Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]]._id)[0].quantity + 1
                }))
            }else{
                dispatch(createCartUser(data))
            }
        }else{
            dispatch(addToCart(data))
        }


        toast.success('Thêm Vào Giỏ Hàng Thành Công!!!')
        
        console.log(selectedCart)
        // localStorage.setItem('cart', JSON.stringify(store.getState().cart.cart))
        setSize(null);
        setMauSac(null);
    }

    const checkVoucher = (arr) => {
        console.log('heheh>>>', arr)
        let max = 0;
        for(let i=0; i<arr.length; i++){
            if(arr[i].discount>=1) max = Math.max(max, arr[i].discount);
            else max = Math.max(max, Math.min(arr[i].discount*checkPrice(), arr[i].maxD))
        }
        return Math.ceil(max);
        // return Math.max(...arr);
    }
    
    return (
        <>
            {console.log('HAAHHA', allProducts[idP])}
            {allProducts[idP]?
                <>
                    <div className='product-details'>
                        <div className='product-details__left'>
                            {/*{console.log(allProducts[idP])}*/}
                            <ImageSlide images={allProducts[idP].imgsDetail}/>
                            <AttrProduct data={allProducts[idP]}/>
                        </div>
                        <div className='product-details__right'>
                            <div className="product-details__user-task">
                                <div className="back">
                                    <Link to={`/search/${allProducts[idP].type}`} className='backback'>
                                        {console.log(allProducts[idP])}
                                        <i className="fa-solid fa-arrow-left"></i>
                                        <span>{`Về ${listType[allProducts[idP].type]}`}</span>
                                    </Link>
                                </div>
                                <div className="userTask">
                                    <Link to='/' className="homeTask">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            height="1em"
                                            width="1em"
                                        >
                                            <path d="M12.71 2.29a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42A1 1 0 003 13h1v7a2 2 0 002 2h12a2 2 0 002-2v-7h1a1 1 0 001-1 1 1 0 00-.29-.71zM6 20v-9.59l6-6 6 6V20z" />
                                        </svg>
                                    </Link>
                                    {/*<i className="fa-solid fa-cart-shopping fa-xl"></i>*/}
                                    <Cart/>
                                </div>
                            </div>
                            <div className="detailOrder">
                                <div className="nameAndBrand">
                                    <h3 className='nameProduct'>{allProducts[idP].name}</h3>
                                    {/*<div className="brandProduct">{allProducts[idP].brand}</div>*/}
                                </div>
                                <div className="internal">
                                    <h5>Kích thước</h5>
                                    <div className="element elementInternal">
                                        <div className="sizeSP">
                                            {allProducts[idP].size.map((size1, ind) => {
                                                return (<div key={ind}
                                                            onClick={(e) => setSize(size1)}><p id={size===size1?'ffocus':undefined}>{size1}</p></div>)
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="color">
                                    <div className='colorTitle'>
                                        <h5>Màu sắc</h5>
                                        {mausac?<p>{mausac}</p>:undefined}
                                    </div>
                                    <div className="element elementColor">
                                        <ul className="colorSP">
                                            {allProducts[idP].color.map((cl, ind) => {
                                                return (
                                                    <li onClick={() => setMauSac(cl)} key={ind} id={mausac===cl?'ffocus':undefined}>
                                                        <div className='circleColor' style={{backgroundColor: namedColors.find(color => color.name === cl).hex}}></div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="priceD">
                                    <div className="priceT">
                                        <p>Hiện Có:</p>
                                        <p className=''><b>{checkQuantity()}</b></p>
                                    </div>
                                    <div className="priceT">
                                        <p>Giá:</p>
                                        <p className='price'>{checkPrice()}</p>
                                    </div>
                                </div>
                                <div className="addToCart">
                                    <h2>{checkPrice()}</h2>
                                    {allProducts[idP].available?selectedInventory[idP]&&(<button disabled={!size||!mausac} onClick={() => handleAddToCart()}>Thêm Vào Giỏ Hàng</button>):(<button disabled>Sản Phẩm Ngừng Bán</button>)}
                                    {/*: (*/}
                                        {/*<button disabled>Thêm Vào Giỏ Hàng</button>)*/}
                                    {/*<button {(!size||!mausac)&&disabled} onClick={()=>handleAddToCart()}>Thêm Vào Giỏ Hàng</button>*/}
                                    {selectedUser&&selectedVoucher&&!!Object.keys(selectedInventory[idP]).filter(key=>selectedInventory[idP][key].color===mausac&&selectedInventory[idP][key].size===size)[0]&&checkVoucher(selectedUser.voucher.filter(vou=>!vou.used).map(vou=>selectedVoucher[vou.code]).filter(vou=>vou.products.includes(idP)))>0?<p>{`Bạn sẽ tiết kiệm được $${checkVoucher(selectedUser.voucher.filter(vou=>!vou.used).map(vou=>selectedVoucher[vou.code]).filter(vou=>vou.products.includes(idP)))} từ Voucher Sản Phẩm.`}</p>:undefined}
                                </div>
                            </div>
                            <div className="reviewSec">
                                <div className="titleSec">
                                    <div className={reviewSec===1 ? 'titleFocus':undefined} onClick={() => setReviewSec(1)}>
                                        <p>Đánh Giá</p>
                                    </div>
                                    <div className={reviewSec===2 ? 'titleFocus':undefined} onClick={() => setReviewSec(2)}>
                                        <p>Bình Luận</p>
                                    </div>
                                    {/*<div className={reviewSec===3 ? 'titleFocus':undefined} onClick={() => setReviewSec(3)}>*/}
                                    {/*    <p>SP Cùng Hãng</p>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="revCom">
                                    
                                    <Suspense fallback={<h1>Loading...</h1>}>
                                        {reviewSec===1?<Review />:reviewSec===2?<Comment />:<SameBrand />}
                                    </Suspense>
                                    
                                </div>
                            </div>
                        </div>
                        {console.log(allProducts[idP])}
                    </div>
                </>:undefined}
        </>
    )
}