import React, {lazy} from "react";
import Edit from "../Edit/Edit";
import {Link} from "react-router-dom";
import ChangeProduct from "../Admin/ChangeProduct/ChangeProduct";
import namedColors from 'color-name-list';
import {useDispatch, useSelector} from "react-redux";
import {addScale, selectScale} from "../../features/scale/scaleSlice";


function Product({product1, type, same}){

    const selectedScale = useSelector(selectScale);
    const dispatch = useDispatch();

    const scaleAdd = (id, e) => {
        e.preventDefault();
        dispatch(addScale(id));
    }

    const ProductSwitch = () => {
        switch (type){
            case 'InSearch':
                return (
                    <article className="product__card">
                        <Link to={`/product/${product1['_id']}`}>
                            <div>
                                <img src={product1.img} alt={product1.name}/>
                                <p className="product__name">{product1.name}</p>
                                <div className="product__color">
                                    {product1.color.map(color=>(
                                        <div key={color} className='product__circle' style={{backgroundColor: namedColors.find(cl => cl.name === color).hex}}></div>
                                    ))}
                                </div>
                                <p className='product__price'>{product1.price}</p>
                            </div>
                            <div className="product__compare" onClick={(e) => scaleAdd(product1._id, e)}>
                                <i className="fa-solid fa-scale-balanced"></i>
                            </div>
                        </Link>
                    </article>
                )
            case 'InAdd':
                return (
                    <article className="product__card">
                        <div>
                            <img src={product1.img} alt={product1.name}/>
                            <p className="product__name">{product1.name}</p>
                        </div>
                        {/*{console.log(`type keke ${type}`)}*/}
                        <Edit idSP={product1.id} nameSP={product1.name} imgSP={product1.img}/>
                    </article>
                )
            case 'InChange':
                return (
                    <article className="product__card">
                        <div>
                            <img src={product1.img} alt={product1.name}/>
                            <p className="product__name">{product1.name}</p>
                        </div>
                        <ChangeProduct idSP={product1._id}/>
                    </article>
                )
            default:
                return (
                    <>

                    </>
                )
        }
    }
    
    return (
        <>
            {ProductSwitch()}
        </>
    )
}

export default Product;
