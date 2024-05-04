import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectUser, updateUser} from "../../features/auth/authSlice";
import './ProfileChange.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import AddressInput from "../AddressInput/AddressInput";

const checkAddress = (address) => {
    const arr = address.split(' - ');
        console.log('->>ADD',arr, address.length)
    // console.log()
    // return true;
    if(address.length===0) return false;
    if(arr.length!==4) return true;
    let count = 0;
    for(let i=0; i<4; i++){
        if(arr[i].length===0) count++;
    }
    return !(count === 0);
}

const ProfileChange = () => {

    const selectedUser = useSelector(selectUser);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [uploadAvatar, setUploadAvatar] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if(selectedUser){
            setAvatar(selectedUser.avatar)
            setFullname(selectedUser.fullname)
            setPhone(selectedUser.phone)
            setEmail(selectedUser.email)
            setAddress(selectedUser.address)
        }
    }, [selectedUser]);

    useEffect(() => {
        if(address.length){
            const arr = address.split(' - ');
            let count = 0;
            for(let i=0; i<4; i++){
                if(arr[i].length===0) count++;
            }
            if(count===4) setAddress('')
        }
    }, [address]);

    const previewAvatar = (event) => {
        const file = event.target.files[0];
        setUploadAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setAvatar('');
        }

    }

    const handleSubmit = async () => {
        // if(!(address.split(' - ').length===4||address.length===0)){
        //     console.log('>>CEHCKADD', address.split(' - ').length)
        //     toast.error("Vui Lòng Chỉnh Sửa Lại Địa Chỉ")
        //     return;
        // }
        console.log('>>>>ADD', address)
        if(checkAddress(address)){
            // console.log('>>CEHCKADD', address.split(' - ').length)
            toast.error("Vui Lòng Chỉnh Sửa Lại Địa Chỉ")
            return;
        }
        if(Number(phone)!==0&&(!Number(phone)||phone.match(/\d/g).length!==10)){
            toast.error('Vui Lòng Nhập Đầy Đủ Số Điện Thoại')
            return;
        }
        setLoading(true);
        if(uploadAvatar){
            const formData = new FormData();
            formData.append('file', uploadAvatar);
            formData.append('upload_preset', 'an5vueim');

            const response = await fetch('https://api.cloudinary.com/v1_1/dmcrzul2v/image/upload', {
                method: 'POST',
                body: formData
            })
            const json = await response.json();
            const imgAvatar = json.url;
            const res = await dispatch(updateUser({
                id: selectedUser._id,
                data: {
                    fullname,
                    phone,
                    address,
                    email,
                    avatar: imgAvatar
                }
            }))
            if(res.payload.data){
                toast.success(res.payload.msg)
            }else{
                toast.error(res.payload.msg)
                return;
            }
        }else{
            const res = await dispatch(updateUser({
                id: selectedUser._id,
                data: {
                    fullname,
                    phone,
                    address,
                    email,
                }
            }))
            if(res.payload.data){
                toast.success(res.payload.msg)
            }else{
                toast.error(res.payload.msg)
                return;
            }
        }
        setLoading(false)
    }

    return (
        <>
            {loading?(<div className='__spinner'><Spinner animation="grow" /></div>):(
                <>
                    {selectedUser&&(<div className="user-profile__info">
                        {/*<label htmlFor='avatarChangeUser'>*/}
                        <div>
                            <label htmlFor='avatarChangeUser' className="user-img" style={{backgroundImage: `url(${avatar})`}}>
                                <span className='user-img__button--in'>Thay Đổi</span>
                            </label>
                            <label htmlFor='avatarChangeUser' className='user-img__button--out'>Chọn Ảnh</label>
                        </div>
                        {/*</label>*/}
                        <input type="file" name='avatarChangeUser' id='avatarChangeUser' accept='.jpg,.jpeg,.png"' onChange={(e)=>previewAvatar(e)}/>
                        <div>
                            <h4>{selectedUser.username}</h4>
                            <p>{`Điểm Đổi: ${selectedUser.point}`}</p>
                        </div>
                    </div>)}
                    <div className="user-profile__table">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    Tên Đầy Đủ
                                </td>
                                <td>
                                    <input type="text" name='fullname' value={fullname} onChange={(e)=>setFullname(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Số Điện Thoại
                                </td>
                                <td>
                                    <input type="text" name='phone' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Địa Chỉ Giao Hàng</p>
                                </td>
                                <td>


                                    <AddressInput setAddress={setAddress} address={address} addressFirst={selectedUser?selectedUser.address:''}/>



                                    {/*<input type="text" name='address' value={address} onChange={(e)=>setAddress(e.target.value)}/>*/}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Email
                                </td>
                                <td>
                                    <input type="text" name='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{marginTop: '40px'}}>
                        <button className='btn btn-info text-dark' onClick={()=>handleSubmit()}>Xác Nhận</button>
                    </div>
                </>
            )}
        </>
    );
};

export default ProfileChange;