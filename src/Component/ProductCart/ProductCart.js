import React from 'react';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {selectInventory, selectProducts} from "../../features/products/productsSlice";
import {changeQuantity, deleteCart, deleteCartUser, selectCart, updateCartUser} from "../../features/cart/cartSlice";
import './ProductCart.css'
import store from "../../store";
import {getCookie} from "../../utils/cookie";

function ProductCart({element, type}){
    const {idInv, idSP, name, img, quantity} = element;
    const allProduct = useSelector(selectProducts);
    const selectedCart = useSelector(selectCart)
    const [soLuong, setSoLuong] = useState(quantity);
    const [check, setCheck] = useState(false);
    const dispatch = useDispatch();

    const selectedInventory = useSelector(selectInventory)

    useEffect(()=>{
        setSoLuong(quantity);
    },[selectedCart])
    //
    const handleDec = () => {
        setCheck(true)
        setSoLuong(prevState => prevState-1)
    }
    
    const handleInc = () => {
        setCheck(true)
        setSoLuong(prevState => prevState+1)
    }
    
    useEffect(()=>{
        console.log('CHECK', check)
        if(check){
            if(soLuong===0){
                if(getCookie('token')){
                    dispatch(deleteCartUser({idInv: idInv}))
                }else{
                    dispatch(deleteCart({_id: idInv}))
                    localStorage.setItem('cart', JSON.stringify(store.getState().cart.cart))
                }
            }else{
                if(getCookie('token')){
                    dispatch(updateCartUser({
                        idInv,
                        quantity: soLuong
                    }))
                }else{
                    const payload = {
                        _id: idInv,
                        quantity: soLuong
                    }
                    dispatch(changeQuantity(payload));
                    localStorage.setItem('cart', JSON.stringify(store.getState().cart.cart))
                }
            }
            setCheck(false)
        }
        // console.log(store.getState().cart.cart)
    }, [soLuong])

    // useEffect(()=>{
    //     console.log('CHANDNAWDLANW?>>>>>>')
    // },[soLuong])
    
    
    const handleDelete = () => {
        setCheck(true)
        // console.log('IVNETK', idInv)
        if(getCookie('token')){
            dispatch(deleteCartUser({idInv: idInv}))
        }else{
            dispatch(deleteCart({_id: idInv}));
            localStorage.setItem('cart', JSON.stringify(store.getState().cart.cart))
        }
    }
    
    return (
        <>
            {/*{console.log('CHECK-MAIn', {element, type})}*/}
            {/*{console.log('TETETTSTS', idInv, idSP, name, img, quantity)}*/}
            {/*{console.log('SLSLLSLSLS', element)}*/}
            {type==='cart'?(<tr className='cart-line__tooltip'>
                {/*{console.log('dwad')}*/}
                {/*{console.log(allProduct[selectedCart[element].idSP])}*/}
                <td>
                    <img src={img} alt={name}/>
                </td>
                <td className="cart-line__center">
                    <p className="cart-line__name">{name}</p>
                    {selectedInventory[idSP] ? (
                        <p className="cart-line__tooltiptext">{`${selectedInventory[idSP][idInv].color} - ${selectedInventory[idSP][idInv].size}`}</p>) : undefined}
                    <div className="cart-line__quantity">
                        <button onClick={() => handleDec()}>-</button>
                        <input type='number' readOnly value={Number(soLuong)} onChange={(e) => {
                            setCheck(true)
                            setSoLuong(Number(e.target.value))
                        }}/>
                        <button onClick={() => handleInc()}
                                 disabled={selectedInventory[element.idSP]&&soLuong >= selectedInventory[element.idSP][element.idInv].quantity}>+</button>
                    </div>
                </td>
                <td className='cart-line__delete' onClick={() => handleDelete()}>
                    <i className="fa-solid fa-xmark"></i>
                </td>
            </tr>):(
                <tr className='COMP'>
                    <td className='COTP'>
                        <img src={img} alt={name} height='100px'/>
                        <div className="COTextP">
                            <p className='COPName'>{name}</p>
                            {selectedInventory[idSP] ? (
                                <p className="COPSize">{`${selectedInventory[idSP][idInv].color} - ${selectedInventory[idSP][idInv].size}`}</p>) : undefined}
                            {/*<p className='COPBrand'>Apple</p>*/}
                        </div>
                    </td>
                    <td className='COTQ'>
                        <div className="cart-line__quantity">
                            <button onClick={() => handleDec()}>-</button>
                            <input type="number"  readOnly value={Number(soLuong)} onChange={(e) => {
                                setCheck(true)
                                setSoLuong(Number(e.target.value))
                            }}/>
                            <button onClick={() => handleInc()} disabled={selectedInventory[element.idSP]&&soLuong>=selectedInventory[element.idSP][element.idInv].quantity}>+</button>
                        </div>
                    </td>
                    <td className="COTPrice">
                        <div className="priceCO">{selectedInventory[idSP]&&(selectedInventory[idSP][idInv]&&selectedInventory[idSP][idInv].price*soLuong)}</div>
                    </td>
                    <td className="COTRemove" onClick={() => handleDelete()}>
                        <i className="fa-solid fa-delete-left"></i>
                    </td>
                </tr>
            )}
        </>
    )
}

export  default ProductCart;