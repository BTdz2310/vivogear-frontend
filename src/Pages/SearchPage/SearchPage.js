import React, {useState, useEffect, useMemo} from 'react';
import SearchForm from '../../Component/SearchForm/SearchForm'
import SearchDisplay from '../../Component/SearchDisplay/SearchDisplay'
import Header from "../../Component/Header/Header";
import './SearchPage.css'
import {useDispatch, useSelector} from "react-redux";
import {
    selectBrand,
    selectName, selectPrice,
} from "../../features/filters/filtersSlice";
import {selectProducts} from "../../features/products/productsSlice";
import {Link, useLocation} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {selectVoucher} from "../../features/voucher/voucherSlice";
import {addScale, selectScale} from "../../features/scale/scaleSlice";
import socket from "../../socketClient";

const selectFitProduct = (state, name, brand, price) => {
    return Object.keys(state).filter(key=>state[key].name.toLowerCase().includes(name)&&state[key].brand.includes(brand)&&Number(state[key].price)<=Number(price)).map(key=>state[key]);
}


function SearchPage (){

    const [scale1, setScale1] = useState(null);
    const [scale2, setScale2] = useState(null);

    const dispatch = useDispatch();

    const selectedScale = useSelector(selectScale);

    useEffect(()=>{
        setScale1(selectedScale.scale1);
        setScale2(selectedScale.scale2);
    }, [selectedScale])

    const location = useLocation();
    const type = location.pathname.split('/')[2];
    console.log(`type ${type}`)

    const selectedName = useSelector(selectName)
    const selectedBrand = useSelector(selectBrand)
    const selectedPrice = useSelector(selectPrice)
    const selectedVoucher = useSelector(selectVoucher)


    const search = window.location.search;
    const params = new URLSearchParams(search);
    const voucherParam = params.get('voucher');
    // console.log('>>>VO', foo)

    const paramFilter = (param) => {
        if(!param) return allProducts;
        if(selectedVoucher[voucherParam]) return selectedVoucher[voucherParam].products.map(key => allProducts[key]);
        return [];
    }

    const allProducts = useSelector(selectProducts);
    const fitProducts = useMemo(()=>selectFitProduct(paramFilter(voucherParam), selectedName, selectedBrand, selectedPrice).filter(product=>product.type.includes(type||'')), [paramFilter(voucherParam), selectedName, selectedBrand, selectedPrice, type]);



    const [showScale, setShowScale] = useState(false);


    const handleClose = () => setShowScale(false);
    const handleShowScale = () => {
        if(checkCount()==='2') setShowScale(true)
        else toast.warning('Bạn cần chọn 2 sản phẩm để so sánh !!!')
    };

    const scaleAdd = (id, e) => {
        e.preventDefault();
        dispatch(addScale(id));
    }

    const checkCount = () => {
        if(!scale1&&!scale2) return '0';
        else if(scale1&&scale2) return '2';
        return '1';
    }
    
    return (
        <div className='search-page'>
            <Header />
            {selectedVoucher[voucherParam]&&console.log('typeNaaaaammmee', selectedVoucher[voucherParam].products.map(key => allProducts[key]))}
            {console.log(allProducts)}
            <div className="pt-3 pb-3 container">
                <section className="search-page__left">
                    <SearchForm />
                </section>
                <section className="search-page__right">
                    {/*<SearchDisplay data={arrayChoseProduct[type]}/>*/}
                    <SearchDisplay showScale={showScale} setShowScale={setShowScale} data={Object.keys(fitProducts).length>0?Object.keys(fitProducts).map(key=>fitProducts[key]):[]} type={type}/>
                    {/*{selectedVoucher[voucherParam]?(<SearchDisplay data={voucherParam?selectedVoucher[voucherParam].products.map(key => allProducts[key]):fitProducts} scaleAdd={scaleAdd}/>):undefined}*/}
                </section>
            </div>
            {/*<div className="search-page__compare">*/}
            {/*    <div className="search-page__compare--button" onClick={handleShowScale}>*/}
            {/*        <i className="fa-solid fa-scale-balanced">*/}
            {/*            <span className='countScale' style={{color: 'white'}}>{checkCount()}</span>*/}
            {/*        </i>*/}
            {/*    </div>*/}

            {/*    <div className="search-page__compare--menu">*/}
            {/*        <Link to={`/product/${scale1}`} className="search-page__compare--item" style={{*/}
            {/*            backgroundImage: scale1?`url(${allProducts[scale1].img})`:'unset',*/}
            {/*            backgroundSize: "contain",*/}
            {/*            backgroundRepeat: 'no-repeat',*/}
            {/*            height: '42px',*/}
            {/*            width: '42px',*/}
            {/*            cursor: scale1?'pointer':'default',*/}
            {/*            pointerEvents: scale1?'unset':'none'*/}
            {/*        }}>*/}
            {/*            {scale1&&(*/}
            {/*                <div className="search-page__compare--delete" onClick={(e)=>{*/}
            {/*                    e.preventDefault();*/}
            {/*                    setScale1(null)*/}
            {/*                }}>*/}
            {/*                    <i className="fa-solid fa-x"></i>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </Link>*/}
            {/*        /!*<Link to={`/product/${scale2}`}>*!/*/}
            {/*            <Link to={`/product/${scale2}`} className="search-page__compare--item" style={{*/}
            {/*                backgroundImage: scale2?`url(${allProducts[scale2].img})`:'unset',*/}
            {/*                // backgroundColor: scale2?'unset':'darkslategrey',*/}
            {/*                backgroundSize: "contain",*/}
            {/*                backgroundRepeat: 'no-repeat',*/}
            {/*                height: '42px',*/}
            {/*                width: '42px',*/}
            {/*                cursor: scale2?'pointer':'default',*/}
            {/*                pointerEvents: scale2?'unset':'none'*/}
            {/*            }}>*/}
            {/*                {scale2&&(*/}
            {/*                    <div className="search-page__compare--delete" onClick={(e)=> {*/}
            {/*                        e.preventDefault();*/}
            {/*                        setScale2(null)*/}
            {/*                    }}>*/}
            {/*                        <i className="fa-solid fa-x"></i>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            </Link>*/}
            {/*        /!*</Link>*!/*/}
            {/*    </div>*/}
            {/*    <div className="search-page__compare--hide">*/}

            {/*    </div>*/}
            {/*</div>*/}
            <Modal show={showScale} onHide={handleClose} className='md-modal'>
                <Modal.Header>
                    <Modal.Title>So Sánh Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className='search-page__compare--table'>
                        <tbody>
                            <tr>
                                <td>
                                    {scale1?(<Link style={{display: 'block', textDecoration: 'none', color: 'black'}}
                                                   to={`/product/${allProducts[scale1]._id}`}>
                                    <img src={allProducts[scale1].img} alt={scale1&&allProducts[scale1].name}/>
                                    <p>{allProducts[scale1].name}</p>
                                    </Link>):undefined}
                                </td>
                                <td></td>
                                <td>
                                    {scale2?(<Link style={{display: 'block', textDecoration: 'none', color: 'black'}}
                                        to={`/product/${allProducts[scale2]._id}`}>
                                    <img src={allProducts[scale2].img} alt={scale2&&allProducts[scale2].name}/>
                                    <p>{allProducts[scale2].name}</p>
                                    </Link>):undefined}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Ngày Ra Mắt</td>
                            </tr>
                            <tr>
                                <td >{scale1&&allProducts[scale1].details.Launch.Announced}</td>
                                <td >Ngày Mở Bán</td>
                                <td >{scale2&&allProducts[scale2].details.Launch.Announced}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Kết Nối Mạng</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Network.Technology}</td>
                                <td>Công Nghệ</td>
                                <td>{scale2&&allProducts[scale2].details.Network.Technology}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Tổng Quan</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Platform.OS}</td>
                                <td>Hệ Điều Hành</td>
                                <td>{scale2&&allProducts[scale2].details.Platform.OS}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Platform.Chipset}</td>
                                <td>Chipset</td>
                                <td>{scale2&&allProducts[scale2].details.Platform.Chipset}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Platform.CPU}</td>
                                <td>CPU</td>
                                <td>{scale2&&allProducts[scale2].details.Platform.CPU}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Platform.GPU}</td>
                                <td>GPU</td>
                                <td>{scale2&&allProducts[scale2].details.Platform.GPU}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Body.SIM}</td>
                                <td>Sim</td>
                                <td>{scale2&&allProducts[scale2].details.Body.SIM}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Comms.Bluetooth}</td>
                                <td>Bluetooth</td>
                                <td>{scale2&&allProducts[scale2].details.Comms.Bluetooth}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Comms.USB}</td>
                                <td>Cổng Sạc</td>
                                <td>{scale2&&allProducts[scale2].details.Comms.USB}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Màn Hình</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Display.Type}</td>
                                <td>Loại</td>
                                <td>{scale2&&allProducts[scale2].details.Display.Type}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Display.Size}</td>
                                <td>Kích Thước</td>
                                <td>{scale2&&allProducts[scale2].details.Display.Size}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Display.Resolution}</td>
                                <td>Độ Phân Giải</td>
                                <td>{scale2&&allProducts[scale2].details.Display.Resolution}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Camera Sau</td>
                            </tr>
                            {/*{console.log('HEHHE',scale1&&Object.keys(allProducts[scale1].details['Main Camera']).filter(key=>key!=='Features'&&key!=='Video')[0])}*/}
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details['Main Camera'])?allProducts[scale1].details['Main Camera'].Features:undefined}</td>
                                <td>Tính Năng</td>
                                <td>{(scale2&&allProducts[scale2].details['Main Camera'])?allProducts[scale2].details['Main Camera'].Features:undefined}</td>
                            </tr>
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details&&allProducts[scale1].details['Main Camera'])?allProducts[scale1].details['Main Camera'][Object.keys(allProducts[scale1].details['Main Camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]:undefined}</td>
                                <td>Thông Số</td>
                                <td>{(scale2&&allProducts[scale2].details&&allProducts[scale2].details['Main Camera'])?allProducts[scale2].details['Main Camera'][Object.keys(allProducts[scale2].details['Main Camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]:undefined}</td>
                            </tr>
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details['Main Camera'])?allProducts[scale1].details['Main Camera'].Video:undefined}</td>
                                <td>Video</td>
                                <td>{(scale2&&allProducts[scale2].details['Main Camera'])?allProducts[scale2].details['Main Camera'].Video:undefined}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Camera Trước</td>
                            </tr>
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details['Selfie camera'])?allProducts[scale1].details['Selfie camera'].Features:undefined}</td>
                                <td>Tính Năng</td>
                                <td>{(scale2&&allProducts[scale2].details['Selfie camera'])?allProducts[scale2].details['Selfie camera'].Features:undefined}</td>
                            </tr>
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details&&allProducts[scale1].details['Selfie camera'])?allProducts[scale1].details['Selfie camera'][Object.keys(allProducts[scale1].details['Selfie camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]:undefined}</td>
                                <td>Thông Số</td>
                                <td>{(scale2&&allProducts[scale2].details&&allProducts[scale2].details['Selfie camera'])?allProducts[scale2].details['Selfie camera'][Object.keys(allProducts[scale2].details['Selfie camera']).filter(key=>key!=='Features'&&key!=='Video')[0]]:undefined}</td>
                            </tr>
                            <tr>
                                <td>{(scale1&&allProducts[scale1].details['Selfie camera'])?allProducts[scale1].details['Selfie camera'].Video:undefined}</td>
                                <td>Video</td>
                                <td>{(scale2&&allProducts[scale2].details['Selfie camera'])?allProducts[scale2].details['Selfie camera'].Video:undefined}</td>
                            </tr>
                            <tr>
                                <td colSpan='3' className='search-page__compare--title'>Pin</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Battery.Type}</td>
                                <td>Loại</td>
                                <td>{scale2&&allProducts[scale2].details.Battery.Type}</td>
                            </tr>
                            <tr>
                                <td>{scale1&&allProducts[scale1].details.Battery.Charging}</td>
                                <td>Sạc</td>
                                <td>{scale2&&allProducts[scale2].details.Battery.Charging}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SearchPage;