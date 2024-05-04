import React, {useState, useEffect} from 'react';
import './SearchForm.css'
import {useDispatch, useSelector} from "react-redux";
import {
    choseBrand,
    choseName,
    chosePrice,
    selectName,
    selectBrand,
    selectPrice,
    resetChose
} from "../../features/filters/filtersSlice";
import {Link, useLocation} from "react-router-dom";

function  SearchForm (){
    const selectedName = useSelector(selectName)
    const selectedBrand = useSelector(selectBrand)
    const selectedPrice = useSelector(selectPrice)
    
    const [priceS, setPriceS] = useState(selectedPrice);
    const [nameChose, setNameChose] = useState(selectedName);
    const [brandChose, setBrandChose] = useState(selectedBrand);

    const location = useLocation();
    const type = location.pathname.split('/')[2];
    
    const dispatch = useDispatch();
    
    useEffect(()=>{
        setPriceS(selectedPrice)
    }, [selectedPrice])

    useEffect(()=>{
        setNameChose(selectedName)
    }, [selectedName])

    useEffect(()=>{
        setBrandChose(selectedBrand)
    }, [selectedBrand])
    
    const handleNameChose = (e) => {
        setNameChose(e)
        dispatch(choseName(e))
    }
    
    const handleBrandChose = (e) => {
        console.log(e)
        setBrandChose(e);
        dispatch(choseBrand(e))
    }
    
    const handlePriceChose = (e) => {
        setPriceS(e)
        dispatch(chosePrice(e))
    }
    
    // const handleResetChose = () => {
    //     dispatch(resetChose());
    // }
    
    return (
        
        <>
            <div className="search-form">
                {/*<aside className="textN">*/}
                {/*    <h2>Tên SP</h2>*/}
                {/*    <input type="text" name="searchText" id="searchText" placeholder="Tìm kiếm" style={{width: '100%'}}/>*/}
                {/*</aside>*/}

                <div className="search-form__group" id="searchForm-name">
                    <input type="text" placeholder='TÌM ...' className='searchForm-group-input' name='nameS' onInput={(e)=>handleNameChose(e.target.value)} value={nameChose}/>
                </div>
                
                <div className="search-form__group">
                    <p className="search-form__title">Phân Loại</p>
                    <div className="search-form__button">
                        <Link to={'/search/phone'} id={type==='phone'?'typeFocus':undefined} className='typeLinkBtn'>Điện Thoại</Link>
                        <Link to={'/search/watch'} id={type==='watch'?'typeFocus':undefined} className='typeLinkBtn'>Đồng Hồ</Link>
                        <Link to={'/search/tablet'} id={type==='tablet'?'typeFocus':undefined} className='typeLinkBtn'>Máy Tính Bảng</Link>
                    </div>
                </div>
                
                <div className="search-form__group">
                    <p className="search-form__title">Thương Hiệu</p>
                    <div>
                        <select aria-label='brand' name="brandS" className='searchForm-brand-select' onChange={(e)=>handleBrandChose(e.target.value)} value={brandChose}>
                            <option value="" name="brandS">Tất Cả</option>
                            <option value="apple" name="brandS">Apple</option>
                            <option value="samsung" name="brandS">Samsung</option>
                            <option value="xiaomi" name="brandS">Xiaomi</option>
                            <option value="asus" name="brandS">Asus</option>
                            <option value="huawei" name="brandS">Huawei</option>
                        </select>
                    </div>
                </div>
                
                <div className="search-form__group">
                    <p className="search-form__title">Giá</p>
                    <div className="search-form__price">
                        <label htmlFor='priceS' className='__price search-form__price--value'>{priceS}</label>
                        <input type="range" name='priceS' id='priceS' min='0' max='1000' value={priceS} onChange={(e)=>handlePriceChose(e.target.value)}/>
                    </div>
                </div>
                
                {/*<div className="searchClear">*/}
                {/*    <button onClick={()=>handleResetChose()}>Đặt Lại</button>*/}
                {/*</div>*/}
            </div>
        </>
    )
}

export default SearchForm