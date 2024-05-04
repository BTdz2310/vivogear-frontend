import React from 'react';
import './VoucherTag.css'
import {Link} from "react-router-dom";
import moment from "moment/moment";
import {formatExpired} from "../../utils/math";
import {useSelector} from "react-redux";
import {selectProducts} from "../../features/products/productsSlice";

export const formatTime = (ts) => {

    const date = new Date(ts);
    const mm = date.getMonth()<10?`0${date.getMonth()}`:date.getMonth();
    // console.log(mm)
    const dd = date.getDate()<10?`0${date.getDate()}`:date.getDate();
    // console.log('date', `${date.getFullYear()}-${mm}-${dd}`)
    return moment.unix(ts/1000).format("DD-MM-YYYY")
    // return `${date.getFullYear()}-${mm}-${dd}`
}

const VoucherTag = ({data, user, products, total, used}) => {
    const selectedProducts = useSelector(selectProducts);
    // console.log('>>>>PRO', products)
    return (
        <>
            {data?(
                <div className="coupon-item-wrapper" id={formatExpired(data.expired)===-1?'expiredVoucher':((!user&&data.type==='orders'&&total<data.minO)||(!user&&data.type==='products'&&products.length===0)||used?'expiredVoucher':undefined)} >
                    {console.log('?>>>KKEE',data)}
                    <div className="coupon-head">
                        {/*<div className="header-wrapper" style={{backgroundImage: 'none'}}>*/}
                        <div className="head-left">
                            <h5>{`Giảm ${data.discount<1?`${(data.discount*100).toFixed(1)}%`:`${data.discount}$`}`}</h5>
                            {data.type==='orders'?(<p>{`Đơn Tối Thiểu: ${data.minO}$`}</p>):undefined}
                            {data.discount<1?(<p>{`Giảm Tối Đa: ${data.maxD}$`}</p>):undefined}
                        </div>
                        <div className="head-right">
                            <div className='coupon-code'>
                                <p>{data.code}</p>
                            </div>
                            <p id='coupon-date'>{formatExpired(data.expired)===-1?'Hết Hạn Sử Dụng':`Còn Lại ${formatExpired(data.expired)}`}</p>
                        </div>

                        {/*</div>*/}
                    </div>
                    <div className="coupon-mid-line">
                        <div></div>
                    </div>
                    <div className="coupon-body">
                        <ul className="coupon-tips__list">
                            <li className="data-range">
                                <span>{`Hết Hạn 00:00:00 ${formatTime(data.expired)}`}</span></li>
                            <li className="use-range">
                                {data.type==='orders'?(<p>Cho tất cả sản phẩm đã chọn</p>):(user?<Link to={`/search?voucher=${data.code}`}><i><b>{`Cho ${data.products.length} sản phẩm`}</b></i></Link>:(
                                    <>
                                        <span>{`Cho ${products.length} sản phẩm đã chọn`}</span>
                                        <div className="tooltipVoucher">
                                            {products.map(product=>(
                                                <React.Fragment key={product.idInv}>
                                                    {selectedProducts?<p>{`${selectedProducts[product.idSP].name} - ${product.size} - ${product.color}: ${data.discount>=1?`${data.discount}$`:`${Math.min(data.maxD, Math.ceil(product.price*data.discount))}$`}`}</p>:undefined}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </>
                                ))}
                            </li>
                            {data.type==='orders'&&total<data.minO?(
                                <li>Đơn Hàng Không Đạt Giá Trị Tối Thiểu</li>
                            ):undefined}
                            {used?(
                                <li>Đã Sử Dụng</li>
                            ):undefined}
                        </ul>
                    </div>
                    <div className="coupon-border-left coupon-cycle-border"></div>
                    <div className="coupon-border-right coupon-cycle-border"></div>

                </div>
            ):undefined}
        </>
    );
};

export default VoucherTag;