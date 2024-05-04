import React from 'react';
import {useSelector} from "react-redux";
import {selectProducts} from "../../../features/products/productsSlice";
import './UpdateProduct.css'
import ListProducts from "../../Product/ListProducts";

const UpdateProduct = () => {

    const selectedProducts = useSelector(selectProducts);

    return (
        <>
            <div className="admin-task__head">Sửa Sản Phẩm</div>
            <div className="admin-task__action">
                <div className="updateP">
                    <section id="items-list">
                        {selectedProducts&&(
                            <ListProducts data={Object.keys(selectedProducts||{}).map(product=>selectedProducts[product])} type='InChange' />
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default UpdateProduct;