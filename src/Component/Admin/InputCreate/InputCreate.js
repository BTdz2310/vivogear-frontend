import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectInventory, selectProducts} from "../../../features/products/productsSlice";

function InputCreate({size, color, id, handleColorChild, setData, setColorCheck, colorCheck, type, setCheckInv, idInv, price}) {
    const [soLuong, setSoLuong] = useState('');
    const [gia, setGia] = useState('');
    const [check, setCheck] = useState(false);
    const [changePrice, setChangePrice] = useState(type==='change'?price:'');
    // const [data, setData]
    const selectedInventory = useSelector(selectInventory);
    const selectedProducts = useSelector(selectProducts);

    // useEffect(() => {
    //     setData({
    //         id,
    //         size,
    //         color,
    //         price: gia,
    //         quantity: soLuong
    //     })
    // }, [soLuong, gia]);

    const checkSL = () => {
        const idSP = Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===id)[0];
        if(!selectedInventory[idSP]) return 0;
        for(let i=0; i<Object.keys(selectedInventory[idSP]).length; i++){
            if(selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].color===color&&selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].size===size){
                return selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].quantity;
            }
        }
        return 0;
    }

    const checkGia = () => {
        const idSP = Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===id)[0];
        if(!selectedInventory[idSP]) return 0;
        for(let i=0; i<Object.keys(selectedInventory[idSP]).length; i++){
            if(selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].color===color&&selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].size===size){
                return selectedInventory[idSP][Object.keys(selectedInventory[idSP])[i]].price;
            }
        }
        return 0;
    }

    const handleClick = () => {
        if(type==='add'){
            if(!soLuong||!Number(soLuong)){
                document.getElementById(`soLuong:${size}-${color}`).focus();
                return
            }
            if((!gia&&checkGia()===0)||(!Number(gia)&&checkGia()===0)){
                document.getElementById(`gia:${size}-${color}`).focus();
                return
            }
            // handleColorChild(size, color)
            setCheck(true);
            setColorCheck(prev=>{
                return {
                    ...prev,
                    [size]: colorCheck[size]?[...colorCheck[size], color]:[color]
                }
            })
            setData(prev=>[{
                id,
                size,
                color,
                price: gia||checkGia(),
                quantity: soLuong
            },...prev])
        }else if(type==='change'){
            // console.log('num>>>',!Number(changePrice))
            if(!soLuong||!Number(soLuong)){
                document.getElementById(`soLuong:${size}-${color}`).focus();
                return
            }
            if((!changePrice)||(!(Number(changePrice)>0))){
                document.getElementById(`gia:${size}-${color}`).focus();
                return
            }
            // handleColorChild(size, color)
            setCheck(true);
            setCheckInv(prev=>[...prev, {
                idInv: idInv,
                price: Number(changePrice),
                quantity: Number(soLuong)
            }])
        }
    }

    // console.log('INPUT', size, color)
    if(type==='add') return (
        <div className='inputCreate' id={check?'checkInputCreate':undefined}>
            <div className="nameInp">
                {check?(<i className="fa-solid fa-circle-check" style={{ height: '20px', marginTop: '4px'}}></i>):(<i className="fa-solid fa-circle-xmark"
                                                                                                                      style={{color: 'red', height: '20px', cursor: 'pointer', marginTop: '4px'}}
                                                                                                                      onClick={() => handleColorChild(size, color)}></i>)}
                <p>{`${size}: ${color}`}</p>
            </div>
            <div className="formInputCreate">
                {/*{console.log(`>>>QUAN${size}-${color}`,soLuong)}*/}
                {/*{console.log(`>>>GIAA${size}-${color}`,gia)}*/}
                <input id={`soLuong:${size}-${color}`} type="text" placeholder='SL' readOnly={check} value={soLuong} onChange={(e)=>setSoLuong(e.target.value)}/>&nbsp;&nbsp;
                <span>Hiện có: {checkSL()}</span>
                <input id={`gia:${size}-${color}`} style={{marginLeft: '20px!important'}} type="text" readOnly={checkGia()!==-0||check} value={checkGia()===0?gia:checkGia()} className='priceInputCreate' onChange={(e)=>setGia(e.target.value)}/>&nbsp;&nbsp;
                <span>$</span>
                <button className="addInputCreate" onClick={()=>handleClick()} disabled={check}>
                    Thêm
                </button>
            </div>
        </div>
    );

    if(type==='change') return (
        <div className='inputCreate' id={check?'checkInputCreate':undefined}>
            <div className="nameInp">
                {check?(<i className="fa-solid fa-circle-check" style={{ height: '20px', marginTop: '4px'}}></i>):(<i className="fa-solid fa-circle-xmark"
                                                                                                                      style={{color: 'red', height: '20px', cursor: 'pointer', marginTop: '4px'}}
                                                                                                                      onClick={() => handleColorChild(size, color)}></i>)}
                <p>{`${size}: ${color}`}</p>
            </div>
            <div className="formInputCreate">
                {/*{console.log(`>>>QUAN${size}-${color}`,soLuong)}*/}
                {/*{console.log(`>>>GIAA${size}-${color}`,gia)}*/}
                <input id={`soLuong:${size}-${color}`} type="text" placeholder='SL' readOnly={check} value={soLuong} onChange={(e)=>setSoLuong(e.target.value)}/>&nbsp;&nbsp;
                <span>Hiện có: {selectedInventory[id][idInv].quantity}</span>
                <input id={`gia:${size}-${color}`} style={{marginLeft: '20px!important'}} type="text" value={changePrice} readOnly={check} className='priceInputCreate' onChange={(e)=>setChangePrice(e.target.value)}/>&nbsp;&nbsp;
                <span>$</span>
                <button className="addInputCreate" onClick={()=>handleClick()} disabled={check}>
                    Sửa
                </button>
            </div>
        </div>
    )
}

export default InputCreate;