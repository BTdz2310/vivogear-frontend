import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useDispatch, useSelector} from "react-redux";
import {
    changeInventory,
    changeProduct, deleteProduct,
    selectInventory,
    selectProducts
} from "../../../features/products/productsSlice";
import InputCreate from "../InputCreate/InputCreate";
import './ChangeProduct.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeProduct = ({idSP}) => {
    const [show, setShow] = useState(false);

    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [checkInv, setCheckInv] = useState([]);

    const selectedProducts = useSelector(selectProducts);
    const selectedInventory = useSelector(selectInventory);

    const [type, setType] = useState(selectedProducts[idSP].type);

    const handleSubmit = async () => {
        if(type!==selectedProducts[idSP].type){
            const response = await dispatch(changeProduct({
                id: idSP,
                type
            }))
            if(response.payload.data){
                toast.success(response.payload.msg)
            }else{
                toast.error(response.payload.msg)
                return;
            }
            handleClose();
            console.log(response)
        }
        if(checkInv.length!==0){
            await Promise.all(checkInv.map(async (inv) => {
                console.log({
                    id: inv.idInv,
                    inv,
                    idSP: idSP
                })
                const response = await dispatch(changeInventory({
                    id: inv.idInv,
                    inv,
                    idSP: idSP
                }))
                if(response.payload.data){
                    toast.success(response.payload.msg)
                }else{
                    toast.error(response.payload.msg)
                    return;
                }
            }))
            setCheckInv([])
            handleClose();
        }
        console.log({
            type,
            checkInv
        })

    }

    const handleDelete = async () => {
        const response = await dispatch(deleteProduct(idSP));
        if(response.payload.data){
            toast.success(response.payload.msg)
        }else{
            toast.error(response.payload.msg)
            return;
        }
        handleClose()
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow} id="addLink">
                <i className='fa-sharp fa-solid fa-gear'></i>
            </Button>
            {/*{console.log(idSP)}*/}
            <Modal show={show} onHide={handleClose} className='md-modal'>
                <Modal.Header >
                    <Modal.Title>Sửa Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {console.log('ID=>>', idSP)}
                    {console.log('Pro=>>>>',selectedProducts[idSP])}
                    {console.log('Inv=>>>>>',selectedInventory[idSP])}
                    {selectedProducts[idSP]&&(<div className="changePContainer">
                        <div className="leftChange">
                            <div>
                                <label>ID Sản Phẩm</label>
                                <input type="text" readOnly value={selectedProducts[idSP].id} name="idSP"/>
                            </div>
                            <div>
                                <label>Tên Sản Phẩm</label>
                                <input type="text" readOnly value={selectedProducts[idSP].name} name="nameSP"/>
                            </div>
                            <div>
                                <label style={{marginBottom: '10px'}}>Sửa số lượng, giá:</label>
                                <div className="selectedPDiv">
                                    {
                                        (Object.keys(selectedInventory[idSP])||[]).map(key=>{
                                            // console.log(key)
                                            // return Object.keys(selectedInventory[idSP][key]).map((cl)=>{
                                                // console.log(cl)
                                                return <InputCreate size={selectedInventory[idSP][key].size} price={selectedInventory[idSP][key].price} color={selectedInventory[idSP][key].color} id={idSP} idInv={key} key={`${key}`} setCheckInv={setCheckInv} type='change'/>
                                            // })
                                        })
                                        // console.log('>>>>>OBJJJJ', selectedP)
                                    }
                                </div>
                            </div>
                            <div>
                                <label>Phân loại</label>
                                <select value={type} onChange={e => {setType(e.target.value)}}>
                                    <option value="phone">Phone</option>
                                    <option value="watch">Watch</option>
                                    <option value="tablet">Tablet</option>
                                </select>
                            </div>
                        </div>
                        <div className="rightChange">
                            <img src={selectedProducts[idSP].img} alt={selectedProducts[idSP].name}/>
                        </div>
                    </div>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={()=>handleDelete()} disabled={!selectedProducts[idSP].available}>
                        Ngừng Bán
                    </Button>
                    <Button variant="primary" onClick={()=>handleSubmit()}>
                        Lưu Thay Đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default ChangeProduct;