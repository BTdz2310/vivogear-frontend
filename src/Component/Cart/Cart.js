import React, {useEffect} from 'react';
import {Link} from 'react-router-dom'; 
import {useState} from 'react'
import './Cart.css'
import {loadCart, selectCart} from "../../features/cart/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import store from "../../store";
import {selectInventory, selectProducts} from "../../features/products/productsSlice";
import ProductCart from "../ProductCart/ProductCart";
import {keyHandler} from "react-slick/lib/utils/innerSliderUtils";
import {socket} from "../../App";
import {getCookie} from "../../utils/cookie";
import {selectReview} from "../../features/review/reviewSlice";
function Cart () {
    const [display, setDisplay] = useState({
        cursor: 'pointer'
    });
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const [sum, setSum] = useState(0)
    const [count, setCount] =useState(0)
    const selectedCart = useSelector(selectCart);
    const selectedInventory = useSelector(selectInventory);
    const selectedReview = useSelector(selectReview);
    const allProduct = useSelector(selectProducts);

    console.log('RE>>>VIEW', selectedReview)

    const handleDisplay = () => {
        setShow(prev=>!prev);
    }
    useEffect(()=>{
        console.log('ffff')
        setCount(Object.keys(store.getState().cart.cart).map(key=>store.getState().cart.cart[key].soLuong).reduce((accumulator, currentValue) => accumulator + currentValue, 0))
        setSum(Object.keys(store.getState().cart.cart).map(key=>store.getState().cart.cart[key].soLuong*store.getState().cart.cart[key].price).reduce((accumulator, currentValue) => accumulator + currentValue, 0))
        if(sum===0){
            // setDisplay('not-allowed');
            setDisplay({
                cursor: 'not-allowed',
                color: 'grey'
            })
        }else{
            // setDisplay('pointer');
            setDisplay({
                cursor: 'pointer'
            })
        }
    },[store.getState().cart.cart])

    const soLuongCart = () => {
        let count = 0;
        selectedCart.forEach(inv=>{
            count+=inv.quantity;
        })
        return count;
    }

    const giaTienCart = () => {
        let sum = 0;
        selectedCart.forEach(inv=>{
            // console.log('>>>SELE',selectedInventory)
            if(Object.keys(selectedInventory).length!==0) sum+=inv.quantity*selectedInventory[inv.idSP][inv.idInv].price;
        })
        return sum;
    }

    return (
        <>
            <div id='header-cart__icon' onClick={()=>handleDisplay()}>
                <div>
                    <svg
                        className='header__svg--fill'
                        viewBox="0 0 1024 1024"
                        fill="black"
                        height="32px"
                        width="32px"
                    >
                        <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 00-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 100 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 00-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 00-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 00-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 01-31.6 31.6z" />
                    </svg>
                {selectedCart.length!==0?(<i id="header-cart__count">{soLuongCart()}</i>):(<i id="header-cart__count">0</i>)}
                </div>
                <div className='header-cart__table' id={show?'--visible':'--invisible'}>
                    <div id="header-cart__display">
                        {count===0?(<p><b>Không Có Mặt Hàng Nào Cả!</b></p>)
                        :(
                            <table>
                                <tbody>
                                    {selectedCart.map((element, index)=>(
                                        // <li key={index}>
                                        //     <img src={allProduct[selectedCart[element].idSP].img}/>
                                        //     <div className="center">
                                        //         <p className="nameCartItems">{allProduct[selectedCart[element].idSP].name}</p>
                                        //         <div className="quantityItems">
                                        //             <button>-</button>
                                        //             <input type='number' value={selectedCart[element].soLuong}/>
                                        //             <button>+</button>
                                        //         </div>
                                        //     </div>
                                        //     <Link to='' className='delete'>
                                        //         <i className="fa-solid fa-xmark"></i>
                                        //     </Link>
                                        // </li>
                                        <ProductCart key={element.idInv} element={element} type='cart'/>
                                        // <p>{element}</p>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/*{console.log('>>>>>>>>CART', selectedCart)}*/}
                    {selectedCart.length!==0?(<div><p>Tổng tiền tạm tính: <strong>{giaTienCart()}</strong></p></div>):undefined}
                    <Link to="/checkout" className="checkout" id={selectedCart.length===0?'__link--disabled':undefined}>Tiến hành thanh toán</Link>
                </div>
            </div>
        </>
    )
}

export default Cart;