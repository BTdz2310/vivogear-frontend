import React, {useState, useEffect, Fragment} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    clickFilterBtn, selectFilter,
} from "../../features/filters/filtersSlice";
import ListProducts from "../Product/ListProducts";

import {dataP} from "../../dataP";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import product from "../Product/Product";
import {addScale, selectScale} from "../../features/scale/scaleSlice";
import {selectProducts} from "../../features/products/productsSlice";
import {toast} from "react-toastify";

const propertyMap = {
    '<4': 'Dưới 4GB',
    '4-6': '4GB - 6GB',
    '6-8': '6GB - 8GB',
    '>8': 'Trên 8GB',
    '<64': 'Dưới 64GB',
    '64-128': '64GB - 128GB',
    '128-256': '128GB - 256GB',
    '256-516': '256GB - 512GB',
    '>512': 'Trên 512GB',
    '<6': 'Dưới 6 inch',
    '6-6.5': '6 inch - 6.5 inch',
    '6.5-7': '6.5 inch - 7 inch',
    '>7': 'Trên 7 inch',
    '<900': 'HD',
    '900-1400': 'Full HD',
    '1400-1800': 'Quad HD',
    '>1800': 'Ultra HD',
    '<48': 'Dưới 48MP',
    '48-64': '48MP - 64MP',
    '64-108': '64MP - 108MP',
    '>108': 'Trên 108MP',
    '<16': 'Dưới 16MP',
    '16-32': '16MP - 32MP',
    '32-64': '32MP - 64MP',
    '>64': 'Trên 64MP',
    '<4000': 'Dưới 4000mAH',
    '4000-5000': 'Từ 4000 - 5000mAH',
    '>5000': 'Trên 5000mAH',
    'retina': 'Retina',
    'lcd': 'LCD',
    'amoled': 'AMOLED',
    'oled': 'OLED',
    'ios': 'iOS',
    'android': 'Android',
    'snapdragon': 'Qualcomm Snapdragon series',
    'mediatek': 'MediaTek series',
    'xynos': 'Samsung Exynos series',
    'apple': 'Apple A series',
    'kirin': 'Kirin (Huawei) series',
    'Single': 'Single Cameras',
    'Dual': 'Dual Cameras',
    'Triple': 'Triple Cameras',
    'Quad': 'Quad Cameras',
    'type-c': 'Type-C',
    'lightning': 'Lightning',
    'microusb': 'Micro USB',
    'yes': 'Có',
    'no': 'Không',
    '<30': 'Dưới 30g',
    '30-70': '30 - 70g',
    '70-100': '70 - 100g',
    '>100': 'Trên 100g',
    '<1.2': 'Dưới 1.2 inch',
    '1.2-1.5': '1.2 - 1.5 inch',
    '>1.5': 'Trên 1.5 inch',
    '<300': 'Dưới 300 x 300 pixels',
    '300-400': '300 x 300 - 400 x 400 pixels',
    '>400': 'Trên 400 x 400 pixels',
    'heart': 'Đo Nhịp Tim',
    'barometer': 'Đo Áp Suất Khí Quyển',
    'temperature': 'Đo Nhiệt Độ Cơ Thể',
    'compass': 'La Bàn',
    '300-500': '300 - 500mAH',
    '>500': 'Trên 500mAH',
    'spo2': 'Đo Độ Bão Hoà Oxy Trong Động Mạch',
    'gyro': 'Cảm Biến Con Quay Hồi Chuyển',
    'accelerometer': 'Theo Dõi Cơ Thể',
    '4-8': '4GB - 8GB',
    '8-16': '8GB - 16GB',
    '>16': 'Trên 16GB',
    '256-512': '256GB - 512GB',
    'ips': 'IPS',
    '<8': 'Dưới 8 inch',
    '8-10': '8 - 10 inch',
    '>10': 'Trên 10 inch',
    '8-12': '8 - 12MP',
    '>12': 'Trên 12MP',
    '6-9': '6 - 9MP',
    '>9': 'Trên 9MP',
    '<5000': 'Dưới 5000mAH',
    '5000-8000': '5000 - 8000 mAH',
    '>8000': 'Trên 8000 mAH',
}

const typeMap = {
    ram: 'Ram',
    memory: 'Bộ Nhớ',
    d_type: 'Loại Màn Hình',
    d_size: 'Kích Thước Màn Hình',
    d_res: 'Độ Phân Giải Màn Hình',
    p_os: 'Hệ Điều Hành',
    p_chipset: 'Chipset',
    mc_type: 'Loại Cam Sau',
    mc_res: 'Độ Phân Giải Cam Sau',
    sc_type: 'Loại Cam Trước',
    sc_res: 'Độ Phân Giải Cam Trước',
    cnt_usb: 'Cổng Kết Nối',
    cnt_jack: 'Jack Tai Nghe',
    btr_type: 'Dung Lượng Pin',
    btr_chg: 'Tính Năng Sạc',
    weight: 'Trọng Lượng',
    features: 'Tính Năng',

}

const checkRam = product => {
    const resultArray = [];
    const regex = /(\d+)GB RAM/;
    for (const str of product.size) {
        const match = str.match(regex);
        if (match && match[1]) {
            resultArray.push(parseInt(match[1], 10));
        }
    }
    return resultArray;
}
const checkMemory = product => {
    const resultArray = [];
    const regex = /(\d+)GB/;
    for (const str of product.size) {
        const match = str.match(regex);
        if (match && match[1]) {
            resultArray.push(parseInt(match[1], 10));
        }
    }
    return resultArray;
}
const checkMP = str => {
    const regex = /\b(\d+)\s*MP\b/g;
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(parseInt(match[1], 10));
    }
    return matches;
}

const checkBattery = str => {
    const regex = /\b(\d+)\s*mAh\b/g;
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(parseInt(match[1], 10));
    }
    return matches;
}

const checkWeight = str => {
    const regex = /\b(\d+(\.\d+)?)\s*g\b/g;
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(parseFloat(match[1]));
    }
    return matches[0];
}

const checkPropertyNumber = (productValue, filterArr) => {
    // console.log('>>VAL',productValue)
    if (filterArr.length === 0) return true;
    let minn;
    let maxx;
    if(!Array.isArray(productValue)){
        // console.log('VAL-NUM', filterArr, productValue)
        return filterArr.some(elementB => {
            if (elementB.includes('<')) {
                minn = 0;
                maxx = elementB.split('<')[1];
            } else if (elementB.includes('-')) {
                minn = elementB.split('-')[0];
                maxx = elementB.split('-')[1];
            } else {
                minn = elementB.split('>')[1];
                maxx = Infinity;
            }
            // console.log('VAL1',Number(productValue), minn, maxx)
            return Number(productValue) >= minn && Number(productValue) < maxx;
        });
    }else{
        return productValue.some(elementA => {
            return filterArr.some(elementB => {
                if (elementB.includes('<')) {
                    minn = 0;
                    maxx = elementB.split('<')[1];
                } else if (elementB.includes('-')) {
                    minn = elementB.split('-')[0];
                    maxx = elementB.split('-')[1];
                } else {
                    minn = elementB.split('>')[1];
                    maxx = Infinity;
                }
                return elementA >= minn && elementA < maxx;
            });
        });
    }
}

const checkPropertyString = (propertyValue, filterArr) => {
    if (filterArr.length === 0) return true;
    if(!Array.isArray(propertyValue)){
        return filterArr.some(element => {
            if(element==='oled') return propertyValue.includes(element) && !propertyValue.includes('amoled');
            return propertyValue.includes(element);
        })
    }else{
        return propertyValue.some(elementA => {
            return filterArr.some(elementB => {
                return elementA.includes(elementB);
            });
        });
    }
}

function SearchDisplay({data, type, showScale, setShowScale}){
    const [sorting, setSorting] = useState('sort09');
    const [showFilter, setShowFilter] = useState(false);
    const selectedFilter = useSelector(selectFilter);

    const [scale1, setScale1] = useState(null);
    const [scale2, setScale2] = useState(null);

    const selectedScale = useSelector(selectScale);
    const allProducts = useSelector(selectProducts);

    useEffect(()=>{
        setScale1(selectedScale.scale1);
        setScale2(selectedScale.scale2);
    }, [selectedScale])


    // const selectedFitFilterPhone = useSelector(selectFilterPhone);
    const dispatch = useDispatch();
    const handleClickBtn = (property, value) => {
        dispatch(clickFilterBtn({
            type: type,
            detail: property,
            value
        }))
    }

    const filterType = (type) => {
        switch (type) {
            case 'phone':
                return (
                    <>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>RAM</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.ram.includes('<4')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','<4')}>Dưới 4GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.ram.includes('4-6')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','4-6')}>4GB - 6GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.ram.includes('6-8')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','6-8')}>6GB - 8GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.ram.includes('>8')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','>8')}>Trên 8GB</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Bộ Nhớ</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.memory.includes('<64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','<64')} >Dưới 64GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.memory.includes('64-128')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','64-128')} >64GB - 128GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.memory.includes('128-256')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','128-256')} >128GB - 256GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.memory.includes('256-516')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','256-516')} >256GB - 512GB</button>
                                    <button className={selectedFilter&&selectedFilter.phone.memory.includes('>512')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','>512')} >Trên 512GB</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Màn Hình</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Kích Thước</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.d_size.includes('<6')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','<6')}>Dưới 6 inch</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_size.includes('6-6.5')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','6-6.5')}>6 inch - 6.5 inch</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_size.includes('6.5-7')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','6.5-7')}>6.5 inch - 7 inch</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_size.includes('>7')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','>7')}>Trên 7 inch</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Loại</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.d_type.includes('lcd')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','lcd')}>LCD</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_type.includes('amoled')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','amoled')}>AMOLED</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_type.includes('oled')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','oled')}>OLED</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.d_res.includes('<900')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','<900')}>HD</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_res.includes('900-1400')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','900-1400')}>Full HD</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_res.includes('1400-1800')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','1400-1800')}>Quad HD</button>
                                    <button className={selectedFilter&&selectedFilter.phone.d_res.includes('>1800')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','>1800')}>Ultra HD</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Nền Tảng</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Hệ Điều Hành</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.p_os.includes('ios')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_os','ios')}>iOS</button>
                                    <button className={selectedFilter&&selectedFilter.phone.p_os.includes('android')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_os','android')}>Android</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Chipset</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.p_chipset.includes('snapdragon')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_chipset','snapdragon')}>Qualcomm Snapdragon series</button>
                                    <button className={selectedFilter&&selectedFilter.phone.p_chipset.includes('mediatek')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_chipset','mediatek')}>MediaTek series</button>
                                    <button className={selectedFilter&&selectedFilter.phone.p_chipset.includes('xynos')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_chipset','xynos')}>Samsung Exynos series</button>
                                    <button className={selectedFilter&&selectedFilter.phone.p_chipset.includes('apple')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_chipset','apple')}>Apple A series</button>
                                    <button className={selectedFilter&&selectedFilter.phone.p_chipset.includes('kirin')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('p_chipset','kirin')}>Kirin (Huawei) series</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Camera Sau</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Loại</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.mc_type.includes('Dual')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_type','Dual')}>Dual Cameras</button>
                                    <button className={selectedFilter&&selectedFilter.phone.mc_type.includes('Triple')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_type','Triple')}>Triple Cameras</button>
                                    <button className={selectedFilter&&selectedFilter.phone.mc_type.includes('Quad')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_type','Quad')}>Quad Cameras</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.mc_res.includes('<48')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','<48')}>Dưới 48MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.mc_res.includes('48-64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','48-64')}>48MP - 64MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.mc_res.includes('64-108')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','64-108')}>64MP - 108MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.mc_res.includes('>108')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','>108')}>Trên 108MP</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Camera Trước</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Loại</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.sc_type.includes('Single')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_type','Single')}>Single Camera</button>
                                    <button className={selectedFilter&&selectedFilter.phone.sc_type.includes('Dual')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_type','Dual')}>Dual Cameras</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.sc_res.includes('<16')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','<16')}>Dưới 16MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.sc_res.includes('16-32')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','16-32')}>16MP - 32MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.sc_res.includes('32-64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','32-64')}>32MP - 64MP</button>
                                    <button className={selectedFilter&&selectedFilter.phone.sc_res.includes('>64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','>64')}>Trên 64MP</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Cổng Kết Nối</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Cổng Sạc</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.cnt_usb.includes('type-c')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','type-c')}>Type-C</button>
                                    <button className={selectedFilter&&selectedFilter.phone.cnt_usb.includes('lightning')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','lightning')}>Lightning</button>
                                    <button className={selectedFilter&&selectedFilter.phone.cnt_usb.includes('microusb')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','microusb')}>Micro USB</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Jack Cắm Tai Nghe 3.5mm</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.cnt_jack.includes('yes')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_jack','yes')}>Có</button>
                                    <button className={selectedFilter&&selectedFilter.phone.cnt_jack.includes('no')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_jack','no')}>Không</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Pin Và Sạc</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Dung Lượng Pin</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.phone.btr_type.includes('<4000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','<4000')}>Dưới 4000mAH</button>
                                    <button className={selectedFilter&&selectedFilter.phone.btr_type.includes('4000-5000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','4000-5000')}>Từ 4000 - 5000mAH</button>
                                    <button className={selectedFilter&&selectedFilter.phone.btr_type.includes('>5000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','>5000')}>Trên 5000mAH</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'watch':
                return (
                    <>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Bộ Nhớ</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.memory.includes('<16')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','<16')}>Dưới 16GB</button>
                                    <button className={selectedFilter&&selectedFilter.watch.memory.includes('16-32')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','16-32')}>16GB - 32GB</button>
                                    <button className={selectedFilter&&selectedFilter.watch.memory.includes('32-64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','32-64')}>32GB - 64GB</button>
                                    <button className={selectedFilter&&selectedFilter.watch.memory.includes('>64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','>64')}>Trên 64GB</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Trọng Lượng</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.weight.includes('<30')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('weight','<30')}>Dưới 30g</button>
                                    <button className={selectedFilter&&selectedFilter.watch.weight.includes('30-70')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('weight','30-70')}>30 - 70g</button>
                                    <button className={selectedFilter&&selectedFilter.watch.weight.includes('70-100')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('weight','70-100')}>70 - 100g</button>
                                    <button className={selectedFilter&&selectedFilter.watch.weight.includes('>100')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('weight','>100')}>Trên 100g</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Màn Hình</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Loại</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.d_type.includes('amoled')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','amoled')}>AMOLED</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_type.includes('oled')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','oled')}>OLED</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_type.includes('lcd')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','lcd')}>LCD</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Kích Thước</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.d_size.includes('<1.2')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','<1.2')}>Dưới 1.2 inch</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_size.includes('1.2-1.5')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','1.2-1.5')}>1.2 - 1.5 inch</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_size.includes('>1.5')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_size','>1.5')}>Trên 1.5 inch</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.d_res.includes('<300')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','<300')}>Dưới 300 x 300 pixels</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_res.includes('300-400')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','300-400')}>300 x 300 - 400 x 400 pixels</button>
                                    <button className={selectedFilter&&selectedFilter.watch.d_res.includes('>400')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','>400')}>Trên 400 x 400 pixels</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Tính Năng</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('heart')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','heart')}>Đo Nhịp Tim</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('barometer')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','barometer')}>Đo Áp Suất Khí Quyển</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('temperature')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','temperature')}>Đo Nhiệt Độ Cơ Thể</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('compass')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','compass')}>La Bàn</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('spo2')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','spo2')}>Đo Độ Bão Hoà Oxy Trong Động Mạch</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('gyro')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','gyro')}>Cảm Biến Con Quay Hồi Chuyển</button>
                                    <button className={selectedFilter&&selectedFilter.watch.features.includes('accelerometer')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('features','accelerometer')}>Theo Dõi Cơ Thể</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Dung Lượng Pin</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.watch.btr_type.includes('300-500')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','300-500')}>300 - 500mAH</button>
                                    <button className={selectedFilter&&selectedFilter.watch.btr_type.includes('>500')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','>500')}>Trên 500mAH</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            case 'tablet':
                return (
                    <>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>RAM</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.ram.includes('<4')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','<4')}>Dưới 4GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.ram.includes('4-8')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','4-8')}>4GB - 8GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.ram.includes('8-16')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','8-16')}>8GB - 16GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.ram.includes('>16')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('ram','>16')}>Trên 16GB</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Bộ Nhớ</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.memory.includes('<64')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','<64')}>Dưới 64GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.memory.includes('64-128')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','64-128')}>64GB - 128GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.memory.includes('128-256')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','128-256')}>128GB - 256GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.memory.includes('256-512')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','256-512')}>256GB - 512GB</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.memory.includes('>512')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('memory','>512')}>Trên 512GB</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Màn Hình</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Loại</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.d_type.includes('amoled')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','amoled')}>AMOLED</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_type.includes('lcd')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','lcd')}>LCD</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_type.includes('ips')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_type','ips')}>IPS</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Kích Thước</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('<8')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','<8')}>Dưới 8 inch</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('8-10')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','8-10')}>8 - 10 inch</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('>10')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','>10')}>Trên 10 inch</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('<900')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','<900')}>HD</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('900-1400')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','900-1400')}>Full HD</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('1400-1800')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','1400-1800')}>Quad HD</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.d_res.includes('>1800')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('d_res','>1800')}>Ultra HD</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Cổng Kết Nối</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Cổng Sạc</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.cnt_usb.includes('type-c')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','type-c')}>USB Type-C</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.cnt_usb.includes('lightning')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','lightning')}>Lightning</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.cnt_usb.includes('microusb')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_usb','microusb')}>Micro USB</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Jack Cắm Tai Nghe 3.5mm</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.cnt_jack.includes('yes')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_jack','yes')}>Có</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.cnt_jack.includes('no')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('cnt_jack','no')}>Không</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Camera</h2>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải Camera Sau</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.mc_res.includes('8-12')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','8-12')}>8 - 12MP</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.mc_res.includes('>12')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('mc_res','>12')}>Trên 12MP</button>
                                </div>
                            </div>
                            <div className="filter-modal__body--list">
                                <h3>Độ Phân Giải Camera Trước</h3>
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.sc_res.includes('6-9')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','6-9')}>6 - 9MP</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.sc_res.includes('>9')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('sc_res','>9')}>Trên 9MP</button>
                                </div>
                            </div>
                        </div>
                        <div className="filter-modal__group">
                            <div className="filter-modal__title">
                                <h2>Dung Lượng Pin</h2>
                            </div>
                            <div className="filter-modal__body--one">
                                <div className="filter-modal__choice">
                                    <button className={selectedFilter&&selectedFilter.tablet.btr_type.includes('<5000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','<5000')}>Dưới 5000mAH</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.btr_type.includes('5000-8000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','5000-8000')}>5000 - 8000 mAH</button>
                                    <button className={selectedFilter&&selectedFilter.tablet.btr_type.includes('>8000')?'filter-modal__button--selected':'filter-modal__button'} onClick={()=>handleClickBtn('btr_type','>8000')}>Trên 8000 mAH</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
        }
    }

    const fitFilterProduct = arr => {
        switch (type){
            case 'phone':
                // arr.forEach(product=>console.log('>>>MEM', product.size,checkMemory(product)))
                // console.log('>>>>MEM', checkMemory(arr[0]))
                return arr.filter(product=>checkPropertyNumber(checkRam(product), selectedFilter.phone.ram) && checkPropertyNumber(checkMemory(product), selectedFilter.phone.memory) && checkPropertyNumber(product.details.Display.Size.match(/(\d+\.\d+)\s*inches/)[1], selectedFilter.phone.d_size) && checkPropertyNumber(product.details.Display.Resolution.match(/(\d+)\s*x\s*(\d+)\s*pixels/)[1], selectedFilter.phone.d_res) && checkPropertyString(product.details.Display.Type.toLowerCase(), selectedFilter.phone.d_type) && checkPropertyString(product.details.Platform.OS.toLowerCase() ,selectedFilter.phone.p_os) && checkPropertyString(product.details.Platform.Chipset.toLowerCase(), selectedFilter.phone.p_chipset) && checkPropertyString(Object.keys(product.details["Main Camera"]), selectedFilter.phone.mc_type) && checkPropertyNumber(checkMP(product.details["Main Camera"][Object.keys(product.details["Main Camera"]).filter(key=>key!==""&&key!=="Video"&&key!=="Features")[0]]).reduce((a, b) => a + b, 0), selectedFilter.phone.mc_res) && checkPropertyNumber(checkMP(product.details["Selfie camera"][Object.keys(product.details["Selfie camera"]).filter(key=>key!==""&&key!=="Video"&&key!=="Features")[0]]).reduce((a, b) => a + b, 0), selectedFilter.phone.sc_res) && checkPropertyString(Object.keys(product.details["Selfie camera"]), selectedFilter.phone.sc_type) && checkPropertyString(product.details.Comms.USB.toLowerCase(), selectedFilter.phone.cnt_usb) && checkPropertyString(product.details.Sound["3.5mm jack "].toLowerCase(), selectedFilter.phone.cnt_jack) && checkPropertyNumber(checkBattery(product.details.Battery.Type), selectedFilter.phone.btr_type));
            case 'watch':
                return arr.filter(product => checkPropertyNumber(checkMemory(product), selectedFilter.watch.memory) && checkPropertyNumber(checkWeight(product.details.Body.Weight), selectedFilter.watch.weight) && checkPropertyNumber(product.details.Display.Size.match(/(\d+\.\d+)\s*inches/)[1], selectedFilter.watch.d_size) && checkPropertyNumber(product.details.Display.Resolution.match(/(\d+)\s*x\s*(\d+)\s*pixels/)[1], selectedFilter.watch.d_res) && checkPropertyString(product.details.Display.Type.toLowerCase(), selectedFilter.watch.d_type) && checkPropertyString(product.details.Features.Sensors.toLowerCase(), selectedFilter.watch.features) && checkPropertyNumber(checkBattery(product.details.Battery.Type), selectedFilter.watch.btr_type))
            case 'tablet':
                return arr.filter(product => checkPropertyNumber(checkRam(product), selectedFilter.tablet.ram) && checkPropertyNumber(checkMemory(product), selectedFilter.tablet.memory) && checkPropertyNumber(product.details.Display.Size.match(/(\d+\.\d+)\s*inches/)[1], selectedFilter.tablet.d_size) && checkPropertyNumber(product.details.Display.Resolution.match(/(\d+)\s*x\s*(\d+)\s*pixels/)[1], selectedFilter.tablet.d_res) && checkPropertyString(product.details.Display.Type.toLowerCase(), selectedFilter.tablet.d_type) && checkPropertyString(product.details.Comms.USB.toLowerCase(), selectedFilter.tablet.cnt_usb) && checkPropertyString(product.details.Sound["3.5mm jack "].toLowerCase(), selectedFilter.tablet.cnt_jack) && checkPropertyNumber(checkMP(product.details["Main Camera"][Object.keys(product.details["Main Camera"]).filter(key=>key!==""&&key!=="Video"&&key!=="Features")[0]]).reduce((a, b) => a + b, 0), selectedFilter.tablet.mc_res) && checkPropertyNumber(checkMP(product.details["Selfie camera"][Object.keys(product.details["Selfie camera"]).filter(key=>key!==""&&key!=="Video"&&key!=="Features")[0]]).reduce((a, b) => a + b, 0), selectedFilter.tablet.sc_res) && checkPropertyNumber(checkBattery(product.details.Battery.Type), selectedFilter.tablet.btr_type));
            default:
                return arr;
        }
    }

    const checkCount = () => {
        if(!scale1&&!scale2) return '0';
        else if(scale1&&scale2) return '2';
        return '1';
    }

    const handleCloseScale = () => setShowScale(false);
    const handleShowScale = () => {
        if(checkCount()==='2') setShowScale(true)
        else toast.warning('Bạn cần chọn 2 sản phẩm để so sánh !!!')
    };

    const scaleAdd = (id, e) => {
        e.preventDefault();
        dispatch(addScale(id));
    }

    const handleClose = () => setShowFilter(false)

    const handleShow = () => setShowFilter(true)

    return(
        <>
            {/*{console.log('>>>>DATADIS: ', data)}*/}
            <div className="search-display__task">
                <div className="search-display__formbar">
                    <div className="search-display__action">
                        <div>
                            <div className="search-display__filter--button" onClick={handleShow}>
                                {/*<i className="fa-solid fa-filter"></i>*/}
                                <p>Bộ Lọc</p>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                        <div className="search-display__sort">
                            <select aria-label='sort' name="sortProduct" value={sorting} onChange={(e)=>setSorting(e.target.value)}>
                                <option name='sortProduct' value="sort09">Giá tăng dần</option>
                                <option name='sortProduct' value="sort90">Giá giảm dần</option>
                                <option name='sortProduct' value="sortAZ">Từ A-Z</option>
                                <option name='sortProduct' value="sortZA">Từ Z-A</option>
                            </select>
                        </div>
                        <div style={{paddingLeft: '10px'}}>
                            <p>{`${fitFilterProduct(data).length} sản phẩm`}</p>
                            {/*{console.log('>>LENGTH', data.length)}*/}
                        </div>
                    </div>
                    <div className='search-display__scale--button' style={{backgroundColor: 'rgb(33, 37, 41)', color: 'white', position: 'relative', borderRadius: '16px'}}>
                        <div className='search-display__filter--button' onClick={handleShowScale}>
                            <p style={{zIndex: '100'}}>So Sánh</p>
                            <i className="fa-solid fa-scale-balanced" style={{fontSize: '16px', position: 'relative'}}>
                                <span className='countScale' style={{color: 'white'}}>{checkCount()}</span>
                            </i>
                        </div>
                        <div className="search-page__compare--menu">
                            <Link to={`/product/${scale1}`} className="search-page__compare--item" style={{
                                backgroundImage: scale1?`url(${allProducts[scale1].img})`:'unset',
                                backgroundSize: "contain",
                                backgroundRepeat: 'no-repeat',
                                height: '42px',
                                width: '42px',
                                cursor: scale1?'pointer':'default',
                                pointerEvents: scale1?'unset':'none'
                            }}>
                                {scale1&&(
                                    <div className="search-page__compare--delete" onClick={(e)=>{
                                        e.preventDefault();
                                        setScale1(null)
                                    }}>
                                        <i className="fa-solid fa-x"></i>
                                    </div>
                                )}
                            </Link>
                            {/*<Link to={`/product/${scale2}`}>*/}
                            <Link to={`/product/${scale2}`} className="search-page__compare--item" style={{
                                backgroundImage: scale2?`url(${allProducts[scale2].img})`:'unset',
                                // backgroundColor: scale2?'unset':'darkslategrey',
                                backgroundSize: "contain",
                                backgroundRepeat: 'no-repeat',
                                height: '42px',
                                width: '42px',
                                cursor: scale2?'pointer':'default',
                                pointerEvents: scale2?'unset':'none'
                            }}>
                                {scale2&&(
                                    <div className="search-page__compare--delete" onClick={(e)=> {
                                        e.preventDefault();
                                        setScale2(null)
                                    }}>
                                        <i className="fa-solid fa-x"></i>
                                    </div>
                                )}
                            </Link>
                            {/*</Link>*/}
                        </div>
                    </div>
                </div>
                <div className="search-display__filter">
                    {/*{console.log('>>>MAP',Object.keys(selectedFilter[type]).filter(key=>selectedFilter[type][key].length>0))}*/}
                    <div className="search-display__filter--list">
                        {Object.keys(selectedFilter[type]).filter(key=>selectedFilter[type][key].length>0).map(key=>(
                            <Fragment key={key}>
                                {/*console.log('KEYMAP',selectedFilter[type][key])*/}

                                {selectedFilter[type][key].map(value => (
                                    <div className='tooltipFilter' key={`${key}-${value}`}>
                                        <button className='search-display__button--selected' onClick={()=>handleClickBtn(key,value)}>{propertyMap[value]}</button>
                                        <div className="tooltipTextFilter">{typeMap[key]}</div>
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <section id="items-list">
                <ListProducts data={fitFilterProduct(data)} type="InSearch" same={false} sort={sorting}/>
            </section>
            <Modal show={showFilter} onHide={handleClose} className='md-modal'>
                <Modal.Header>
                    <Modal.Title>Bộ Lọc Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filterType(type)}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default SearchDisplay;