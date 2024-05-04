import React, {useState, useEffect} from "react";
import './AttrProduct.css'

const AttrProduct = ({data}) => {
    return (
        <div className='attribute-product'>
            <h2>THÔNG TIN SẢN PHẨM</h2>

            <details>
                <summary>
                    <p className='attribute-product__title'>Kết Nối Mạng</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Công Nghệ</p>
                    <p>{data.details.Network.Technology}</p>
                </div>
            </details>

            <details>
                <summary>
                    <p className='attribute-product__title'>Ngày Ra Mắt</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Ngày Công Bố</p>
                    <p>{data.details.Launch.Announced}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Ngày Mở Bán</p>
                    <p>{data.details.Launch.Status}</p>
                </div>
            </details>

            <details>
                <summary>
                    <p className='attribute-product__title'>Tổng Quan</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Hệ Điều Hành</p>
                    <p>{data.details.Platform.OS}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Chipset</p>
                    <p>{data.details.Platform.Chipset}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>CPU</p>
                    <p>{data.details.Platform.CPU}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>GPU</p>
                    <p>{data.details.Platform.GPU}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Chất Liệu</p>
                    <p>{data.details.Body.Build}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Sim</p>
                    <p>{data.details.Body.SIM}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Bluetooth</p>
                    <p>{data.details.Comms.Bluetooth}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>USB</p>
                    <p>{data.details.Comms.USB}</p>
                </div>
            </details>

            <details>
                <summary>
                    <p className='attribute-product__title'>Màn Hình</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Loại</p>
                    <p>{data.details.Display.Type}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Kích Cỡ</p>
                    <p>{data.details.Display.Size}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Độ Phân Giải</p>
                    <p>{data.details.Display.Resolution}</p>
                </div>
            </details>

            {(data.details['Main Camera'])?<details>
                <summary>
                    <p className='attribute-product__title'>Camera Sau</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Tính Năng</p>
                    <p>{data.details['Main Camera'].Features}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>{Object.keys(data.details['Main Camera']).filter(key=>key!=='Features'&&key!=='Video')[0]}</p>
                    <p>{data.details['Main Camera'][Object.keys(data.details['Main Camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Video</p>
                    <p>{data.details['Main Camera'].Video}</p>
                </div>
            </details>:undefined}

            {(data.details['Selfie camera'])?<details>
                <summary>
                    <p className='attribute-product__title'>Camera Trước</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Tính Năng</p>
                    <p>{data.details['Selfie camera'].Features}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>{Object.keys(data.details['Selfie camera']).filter(key=>key!=='Features'&&key!=='Video')[0]}</p>
                    <p>{data.details['Selfie camera'][Object.keys(data.details['Selfie camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Video</p>
                    <p>{data.details['Selfie camera'].Video}</p>
                </div>
            </details>:undefined}

            <details>
                <summary>
                    <p className='attribute-product__title'>Pin</p>
                    <i className="fa-solid fa-angle-up minimize-attr"></i>
                    <i className="fa-solid fa-angle-down expand-attr"></i>
                </summary>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Loại</p>
                    <p>{data.details.Battery.Type}</p>
                </div>
                <div className="attribute-product__display">
                    <p className='attribute-product__name'>Sạc</p>
                    <p>{data.details.Battery.Charging}</p>
                </div>
            </details>

        </div>
    )
}

export default AttrProduct;


// <tr>
//     <td></td>
// </tr>
// <tr>
//     <td></td>
//     <td>{data.details.}</td>
// </tr>