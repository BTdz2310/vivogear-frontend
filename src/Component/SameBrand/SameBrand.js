import React, {useState, useEffect} from "react";
import './SameBrand.css'
import {useDispatch, useSelector} from "react-redux";
import {selectProducts} from "../../features/products/productsSlice";
import {Link, useLocation} from "react-router-dom";
import {selectTypes} from "../../features/types/typesSlice";
import ListProducts from "../Product/ListProducts";
import {choseBrand, resetChose} from "../../features/filters/filtersSlice";

const SameBrand = () => {
    // const type =
    const selectedProduct = useSelector(selectProducts);
    const location = useLocation();
    const idP = location.pathname.split('/')[2];
    const [hien, setHien] = useState(false);
    
    const dispatch = useDispatch();

    console.log('KEKEKEKEKEKEKKE')
    
    const handleScroll = (e) => {
        console.log(e.scrollLeft)
        if(e.scrollLeft===380){
            setHien(true)
        }else{
            setHien(false)
        }
    }
    
    const handleSameType = () => {
        dispatch(resetChose());
        dispatch(choseBrand(selectedProduct[idP].brand))
    }
    
    return (
        <>
            {document.querySelector('.list')&&console.log(document.querySelector('.list').firstChild.offsetWidth)}
            <div className="listContainer">
                {/*<div className="listContent">*/}
                    <div className="list" onScroll={(e)=>handleScroll(e.target)}>
                        {/*{console.log(selectedProduct[idP].type)}*/}
                        {/*{console.log(selectedType[selectedProduct[idP].type].filter(sp=>sp.brand===selectedProduct[idP].brand))}*/}

                        {<ListProducts data={Object.keys(selectedProduct).filter(key=>selectedProduct[key].brand===selectedProduct[idP].brand&&idP!==selectedProduct[key]._id).map(key=>selectedProduct[key])} type={'show'} same={true}/>}
                        
                    </div>
                    {/*<div className="others">*/}
                            <Link to='../search'>
                                <i className="fa-solid fa-circle-chevron-right" id={hien?'hien':undefined} onClick={()=>handleSameType()}>
                                </i>
                            </Link>
                    {/*</div>*/}

                        
                {/*</div>*/}
            </div>
        </>
    )
}

export default SameBrand;