import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import './item.css'
import './Edit.css'
import namedColors from 'color-name-list';
import api from '../../api/sanPham';
import { v4 as uuidv4 } from "uuid";
import {
    createInventory,
    createProducts, getAllInventory,
    getAllProducts,
    loadAddProduct,
    selectProducts
} from "../../features/products/productsSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectTypes} from "../../features/types/typesSlice";
import store from "../../store";
import gsmarena from '../../utils/gsmarena-api'
import InputCreate from "../Admin/InputCreate/InputCreate";

const url = "http://localhost:3600/products";



let someColor = namedColors.find(color => color.hex === '#BFDAF7');
// console.log(someColor===undefined); // => white

let someNamedColor = namedColors.find(color => color.name === 'Sierra Blue')
// console.log(someNamedColor); // => #16161d

const sanPham1 = {"spotlight":{"releaseDate":"Released 2017, November 03","body":"174g, 7.7mm thickness","os":"iOS 11.1.1, up to iOS 16.5","storage":"64GB/256GB storage, no card slot","display_size":"5.8\"","display_resolution":"1125x2436 pixels","camera_pixels":"12 MP","video_pixels":"2160p","ram_size":"3 GB RAM","chipset":"Apple A11 Bionic","battery_size":"2716 mAh","battery_type":"Li-Ion","popularity":" 54%"},"all_specs":{"Network":[{"title":"Technology","info":"GSM / HSPA / LTE"},{"title":"2G bands","info":"GSM 850 / 900 / 1800 / 1900 "},{"title":"3G bands","info":"HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100 "},{"title":"4G bands","info":"1, 2, 3, 4, 5, 7, 8, 12, 13, 17, 18, 19, 20, 25, 26, 28, 29, 30, 34, 38, 39, 40, 41, 66"},{"title":"Speed","info":"HSPA 42.2/5.76 Mbps, LTE-A (3CA) Cat12 600/150 Mbps, EV-DO Rev.A 3.1 Mbps"}],"Launch":[{"title":"Announced","info":"2017, September 12"},{"title":"Status","info":"Available. Released 2017, November 03"}],"Body":[{"title":"Dimensions","info":"143.6 x 70.9 x 7.7 mm (5.65 x 2.79 x 0.30 in)"},{"title":"Weight","info":"174 g (6.14 oz)"},{"title":"Build","info":"Glass front (Corning-made glass), glass back (Corning-made glass), stainless steel frame"},{"title":"SIM","info":"Nano-SIM"},{"title":" ","info":"IP67 dust/water resistant (up to 1m for 30 min)\nApple Pay (Visa, MasterCard, AMEX certified)"}],"Display":[{"title":"Type","info":"Super Retina OLED, HDR10, Dolby Vision, 625 nits (HBM)"},{"title":"Size","info":"5.8 inches, 84.4 cm2 (~82.9% screen-to-body ratio)"},{"title":"Resolution","info":"1125 x 2436 pixels, 19.5:9 ratio (~458 ppi density)"},{"title":"Protection","info":"Scratch-resistant glass"},{"title":" ","info":"3D Touch"}],"Platform":[{"title":"OS","info":"iOS 11.1.1, up to iOS 16.5"},{"title":"Chipset","info":"Apple A11 Bionic (10 nm)"},{"title":"CPU","info":"Hexa-core 2.39 GHz (2x Monsoon + 4x Mistral)"},{"title":"GPU","info":"Apple GPU (three-core graphics)"}],"Memory":[{"title":"Card slot","info":"No"},{"title":"Internal","info":"64GB 3GB RAM, 256GB 3GB RAM"},{"title":" ","info":"NVMe"}],"Main Camera":[{"title":"Dual","info":"12 MP, f/1.8, 28mm (wide), 1/3\", 1.22µm, dual pixel PDAF, OIS\n12 MP, f/2.4, 52mm (telephoto), 1/3.4\", 1.0µm, PDAF, OIS, 2x optical zoom"},{"title":"Features","info":"Quad-LED dual-tone flash, HDR (photo/panorama), panorama, HDR"},{"title":"Video","info":"[email protected]/30/60fps, [email protected]/60/120/240fps"}],"Selfie camera":[{"title":"Single","info":"7 MP, f/2.2, 32mm (standard)\nSL 3D, (depth/biometrics sensor)"},{"title":"Features","info":"HDR"},{"title":"Video","info":"[email protected]"}],"Sound":[{"title":"Loudspeaker ","info":"Yes, with stereo speakers"},{"title":"3.5mm jack ","info":"No"}],"Comms":[{"title":"WLAN","info":"Wi-Fi 802.11 a/b/g/n/ac, dual-band, hotspot"},{"title":"Bluetooth","info":"5.0, A2DP, LE"},{"title":"Positioning","info":"GPS, GLONASS, GALILEO, QZSS"},{"title":"NFC","info":"Yes"},{"title":"Radio","info":"No"},{"title":"USB","info":"Lightning, USB 2.0"}],"Features":[{"title":"Sensors","info":"Face ID, accelerometer, gyro, proximity, compass, barometer"}],"Battery":[{"title":"Type","info":"Li-Ion 2716 mAh, non-removable (10.35 Wh)"},{"title":"Charging","info":"15W wired, PD2.0, 50% in 30 min (advertised)\nWireless (Qi)"},{"title":"Talk time","info":"Up to 21 h (3G)"}],"Misc":[{"title":"Colors","info":"Space Gray, Silver, Red, Yellow"},{"title":"Models","info":"A1865, A1901, A1902, A1903, iPhone10,3, iPhone10,6"},{"title":"SAR","info":"1.09 W/kg (head)     1.17 W/kg (body)     "},{"title":"Price","info":"About 280 EUR"}],"Tests":[{"title":"Performance","info":"\nAnTuTu: 233100 (v7)\nGeekBench: 10215 (v4.4)\nGFXBench: 28fps (ES 3.1 onscreen)"},{"title":"Display","info":"\nContrast ratio: Infinity (nominal), 5.013 (sunlight)"},{"title":"Camera","info":"\nPhoto / Video"},{"title":"Loudspeaker","info":"\nVoice 68dB / Noise 74dB / Ring 76dB\n\n"},{"title":"Audio quality","info":"\nNoise -93.7dB / Crosstalk -82.8dB"},{"title":"Battery life","info":"\n\nEndurance rating 74h\n\n"},{"title":"","info":""}]}}
// console.log(sanPham.product);
function Edit({idSP, nameSP, imgSP}) {
    let firstS = '';
    // console.log('>>>>EDIT',idSP, nameSP);
    const [show, setShow] = useState(false);
    const [sanPham, setSanPham] = useState({});
    const [color, setColor] = useState([]);
    const [priceNow, setPriceNow] = useState('');
    const [type, setType] = useState('phone');
    const [data, setData] = useState([]);
    const [colorCheck, setColorCheck] = useState({});

    const [selectedP, setSelectedP] = useState({});

    const selectedProducts = useSelector(selectProducts)

    const reset = () => {
        setColor([])
        setPriceNow('')
        setData([])
        setColorCheck({})
        setSelectedP({})
    }

    // useEffect(() => {
    //     // checkProduct = selectedProducts
    //     setCheckProduct(selectedProducts&&Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0])
    //     console.log('>>>>CEHCK', checkProduct)
    // }, [selectedProducts]);

    const checkProduct = () => {
        console.log((selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]]))
        return selectedProducts?selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]]:''
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    // console.log('types')
    //
    // useEffect(()=>{
    //     if(selectedProducts[idSP]) setType(selectedProducts[idSP].type)
    // },[selectedProducts])
    


    const addProduct = async () => {
        const images = await gsmarena.catalog.getImages(idSP);
        //
        // const sp = {details: sanPham.detailSpec, price: price, color: color, name: nameSP, img: imgSP, id: idSP, type: type, imgsDetail: images, brand: images[0].split('/')[images[0].split('/').length-2]};

        const colorPut = [];
        const sizePut = [];
        let pricePut;

        for(let i=0; i<data.length; i++){
            // console.log('>>MAUSA>>',data[i].color)
            if(!colorPut.includes(data[i].color)) colorPut.push(data[i].color)
        }

        for(let i=0; i<data.length; i++){
            // console.log('>>SIZEE>>',data[i].size)
            if(!sizePut.includes(data[i].size)) sizePut.push(data[i].size)
        }

        for(let i=0; i<data.length; i++){
            // console.log(data[i].price)
            if(!pricePut) pricePut = Number(data[i].price);
            pricePut = Math.min(pricePut, Number(data[i].price))
        }

        // console.log('>>MAUSACC>>',colorPut)
        // console.log('>>MAUSIZEEE>>',sizePut)
        // console.log('>>>>GIAAAA', pricePut)

        const prC = await dispatch(createProducts({
            id: idSP,
            type,
            details: sanPham.detailSpec,
            name: nameSP,
            brand: images[0].split('/')[images[0].split('/').length-2],
            img: imgSP,
            imgsDetail: images,
            color: colorPut,
            size: sizePut,
            price: pricePut
        }))

        // console.log('KEKKE>>>',{
        //     id: idSP,
        //     type: !!(selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]])?(selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]].type):type,
        //     details: sanPham.detailSpec,
        //     name: nameSP,
        //     brand: images[0].split('/')[images[0].split('/').length-2],
        //     img: imgSP,
        //     imgsDetail: images,
        //     color: colorPut,
        //     size: sizePut,
        //     price: pricePut
        // })



        const id_SP = prC.payload.data._id;

        console.log('>>>>PRC: ', id_SP)

        console.log('>>>CREATE DARA', data)

        const res = await dispatch(createInventory({
            id: id_SP,
            data
        }));
        console.log(res)

        reset()





        // const p1 =  dispatch(getAllProducts())
        // const p2 =  dispatch(getAllInventory())
        //
        // await  p1;
        // await p2;

        setShow(false);
    }
    const typesState = useSelector(selectTypes);
    // console.log(typesState)
    
    let typeNew = store.getState().types.types[type];
    // console.log('newwwww')
    // console.log(typeNew)
    const callEdit = async ()=>{
        const details = await gsmarena.catalog.getDevice(idSP);
        setSanPham(details);
    }
    
    useEffect(()=>{
        if(show){
            callEdit();
            // console.log(uuidv4())
            // console.log(uuidv4())
        }
    },[show])
    
    const handleColor = (e) => {
        // console.log(e.target.checked)
        const cl = e.target.value

        const sizeP = priceNow?priceNow:firstS;
        // console.log('SIZZZ????', sizeP)

        // console.log({
        //     [priceNow?priceNow:firstS]: cl
        // });


        if(e.target.checked){
            setSelectedP(prev=>{
                return {
                    ...prev,
                    [sizeP]: selectedP[sizeP]?[...selectedP[sizeP], cl]:[cl]
                }
            })
        }else{
            setSelectedP(prev=>{
                return {
                    ...prev,
                    [sizeP]: selectedP[sizeP].filter(ele=>ele!==cl)
                }
            })
        }
            // console.log('>>>>SELECPPPP',selectedP)

        // console.log('keke');
        // console.log(cl);
        if(cl in color){
            setColor(color.filter(ele=>ele!=cl));
        }else{
            setColor(prev=>[...prev, cl])
        }
        // console.log(color);
    }

    const handleColorChild = (kth, ms) => {
        setSelectedP(prev=>{
            return {
                ...prev,
                [kth]: selectedP[kth].filter(ele=>ele!==ms)
            }
        })
    }

    // console.log(price)
    return (
        <>
            {/*{console.log('>>>>DATA',data)}*/}
            {/*{console.log('>>>>TYPPPEPEPE', type)}*/}
            {/*{console.log('>>>>DATACLLLL',colorCheck)}*/}
            <Button variant="primary" onClick={handleShow} id="addLink">
                <i className='fa-sharp fa-solid fa-plus'></i>
            </Button>

            <Modal show={show} onHide={handleClose} className='md-modal'>
                <Modal.Header>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*{sanPham==={}?<p>Loading...</p>:*/}
                        <div className="editContainer">
                        <div className="leftEdit">
                            <div>
                                <label>ID Sản Phẩm</label>
                                <input type="text" readOnly value={idSP} name="idSP"/>
                            </div>
                            <div>
                                <label>Tên Sản Phẩm</label>
                                <input type="text" readOnly value={nameSP} name="nameSP"/>
                            </div>
                            {sanPham!=={}&&(
                                <>
                                    <div>
                                        <label>Chọn Dung Lượng</label>
                                        <select id='sizeSelect' value={priceNow} onChange={(e)=>{setPriceNow(e.target.value); }}>
                                            {/*{sanPham.inside.}*/}
                                            {/*{console.log('NOWNWOWOOWOWOWO', priceNow)}*/}
                                            {sanPham.detailSpec&&sanPham.detailSpec.Memory.Internal.split(', ').map((element, ind)=>{
                                                if(ind===0) firstS = element;
                                                return <option value={element} key={element}>{element}</option>;
                                            })}

                                        </select>
                                        {/*<p>{sanPham.all_specs&&sanPham.all_specs.Memory[1].info}</p>*/}
                                    </div>
                                    <div>
                                        <label>Chọn màu</label>
                                        <div style={{display: 'inline-flex', position: 'relative', flexWrap: 'wrap', rowGap: '5px'}}>
                                            {sanPham.detailSpec&&sanPham.detailSpec.Misc.Colors.split(', ').map((element,key)=>{
                                                if(namedColors.find(color => color.name === element)===undefined) return;
                                                const color = namedColors.find(color => color.name === element);
                                                const colorHex = color.hex;
                                                return(
                                                    <label key={key}>
                                                        {console.log('>>>CHECKBOX',colorCheck[priceNow?priceNow:firstS])}
                                                        <input type={"checkbox"} disabled={colorCheck[priceNow?priceNow:firstS]&&colorCheck[priceNow?priceNow:firstS].includes(element)} name="checkBox" checked={selectedP[priceNow?priceNow:firstS]&&selectedP[priceNow?priceNow:firstS].includes(element)} id="checkBox" className={"colorClass"} value={element} onChange={(e)=>handleColor(e)}/>
                                                        <span style={{height: '25px', width: '25px', backgroundColor: colorHex, borderRadius: '50%', display: 'inline-block', float: 'right', border: '1px solid black'}}></span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{marginBottom: '10px'}}>Chọn số lượng, giá:</label>
                                        <div className="selectedPDiv">
                                            {
                                                (Object.keys(selectedP)||[]).map(key=>{
                                                    // console.log(key)
                                                    return selectedP[key].map((cl)=>{
                                                        // console.log(cl)
                                                        return <InputCreate size={key} color={cl} id={idSP} key={`${key}-${cl}`} handleColorChild={handleColorChild} setData={setData} setColorCheck={setColorCheck} colorCheck={colorCheck} type='add'/>
                                                    })
                                                })
                                                // console.log('>>>>>OBJJJJ', selectedP)
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <label>Phân loại</label>
                                        <select value={!!(selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]])?(selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]].type):type} disabled={(selectedProducts[Object.keys(selectedProducts).filter(key=>selectedProducts[key].id===idSP)[0]])} onChange={e => {setType(e.target.value)}}>
                                            <option value="phone">Phone</option>
                                            <option value="watch">Watch</option>
                                            <option value="tablet">Tablet</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="rightEdit">
                            <img src={imgSP}/>
                            {/*{console.log(sanPham)}*/}
                        </div>
                    </div>
                {/*}*/}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addProduct}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Edit;






