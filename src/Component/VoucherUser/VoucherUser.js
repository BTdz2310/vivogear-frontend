import React, {Fragment, useState} from 'react';
import './VoucherUser.css'
import {useDispatch, useSelector} from "react-redux";
import {selectVoucher} from "../../features/voucher/voucherSlice";
import {addVoucherUser, selectUser} from "../../features/auth/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VoucherTag from "../VoucherTag/VoucherTag";

const VoucherUser = () => {

    const [code, setCode] = useState('');
    const selectedVoucher = useSelector(selectVoucher);
    const selectedUser = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleAdd = async () => {
        console.log(selectedVoucher)
        if(selectedUser.voucher.map(ele=>ele.code).includes(code)) {
            toast.error('Code Đã Sử Dụng')
            setCode('')
            return;
        }
        if(!selectedVoucher[code]||!selectedVoucher[code].canSave){
            toast.error('Không Áp Dụng Được Voucher Này')
            setCode('')
            return
        }
        if(selectedVoucher[code]&&selectedVoucher[code].canSave){
            console.log('kke')
            await dispatch(addVoucherUser(code))
            toast.success('Thêm Voucher Thành Công')
            setCode('')
        }
    }

    return (
        <>
            <div className="user-voucher__add">
                <label htmlFor="addVoucher">Nhập Mã Voucher</label>
                <input type="text" value={code} onChange={(e)=>setCode(e.target.value)}/>
                <button disabled={!code} onClick={()=>handleAdd()}>Lưu</button>
            </div>
            <div className="user-voucher__list">
                {selectedUser&&selectedVoucher?selectedUser.voucher.map(voucher=>(
                    <Fragment key={voucher.code}>
                        <VoucherTag key={voucher.code} data={selectedVoucher[voucher.code]} user={true} used={voucher.used}/>
                    </Fragment>
                )):undefined}
            </div>
        </>
    );
};

export default VoucherUser;