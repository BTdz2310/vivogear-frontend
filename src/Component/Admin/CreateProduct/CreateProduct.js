import React, {useEffect, useState} from 'react';
import './CreateProduct.css'
import gsmarena from "../../../utils/gsmarena-api";
import ListProducts from "../../Product/ListProducts";

const CreateProduct = () => {
    const [text, setText] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        alert('Bạn cần cài extension tắt CORS bên trình duyệt để sử dụng !!!')
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(await gsmarena.search.search(text))
        setData(await gsmarena.search.search(text))
    }

    return (
        <>
            <div className="admin-task__head">Thêm Sản Phẩm</div>
            <div className="admin-task__action">
                <div className="createP">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                        <input type="text" value={text} onChange={(e)=>setText(e.target.value)}/>
                        <input type="submit" value='Kiểm Tra'/>
                    </form>
                    <div className="dataP">
                        <section className="contRight">
                            <section id="items-list">
                                <ListProducts data={data} type="InAdd"/>
                            </section>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;