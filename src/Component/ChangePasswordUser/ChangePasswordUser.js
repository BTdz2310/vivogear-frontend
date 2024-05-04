import React, {useState} from 'react';
import './ChangePasswordUser.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";
import {changePassword} from "../../features/auth/authSlice";

const ChangePasswordUser = () => {

    const [oldpass, setOldpass] = useState('');
    const [newpass, setNewpass] = useState('');
    const [confirmpass, setConfirmpass] = useState('');
    const dispatch = useDispatch();

    const handleSubmit =async () => {
        if(newpass.length<8){
            toast.error('Mật Khẩu Phải Có Tối Thiểu 8 Ký Tự')
            return;
        }
        if(newpass!==confirmpass){
            toast.error('Xác Nhận Mật Khẩu Không Đúng')
            return;
        }
        const response = await dispatch(changePassword({
            oldPassword: oldpass,
            newPassword: newpass
        }))
        console.log(response)
        if(response.payload.data){
            toast.success(response.payload.msg)
        }else{
            toast.error(response.payload.msg)
        }
        setOldpass('')
        setNewpass('')
        setConfirmpass('')
    }

    return (
        <>
            <div className="user-change-password">
                <table>
                    <tbody>
                        <tr>
                            <td>Mật Khẩu Cũ</td>
                            <td><input type="password" className={oldpass.length>=8?'validPass':(oldpass.length===0?undefined:'invalidPass')} value={oldpass} onChange={(e)=>setOldpass(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <td>Mật Khẩu Mới</td>
                            <td><input type="password" className={newpass.length>=8?'validPass':(newpass.length===0?undefined:'invalidPass')} value={newpass} onChange={(e)=>setNewpass(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <td>Xác Nhận Mật Khẩu Mới</td>
                            <td><input type="password" className={confirmpass===newpass&&confirmpass.length!==0?'validPass':(confirmpass.length===0?undefined:'invalidPass')} value={confirmpass} onChange={(e)=>setConfirmpass(e.target.value)}/></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button className='btn btn-info text-dark mt-4' onClick={()=>handleSubmit()}>Xác Nhận</button>
                </div>
            </div>
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
        </>
    );
};

export default ChangePasswordUser;