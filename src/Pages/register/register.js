import React, {useState} from 'react';
import {Link} from "react-router-dom";
import '../login/login.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import socket from "../../socketClient";
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import SocialLogin from "../../Component/SocialLogin/SocialLogin";

function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pass2, setPass2] = useState('');
    // const [phone, setPhone] = useState('');
    // const [address, setAddress] = useState('');

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let k = 0;
        if(username.length<6){
            toast.error('Username phải dài hơn 6 kí tự!')
            k = 1;
        }
        if(password.length<8){
            toast.error('Mật khẩu phải dài hơn 8 kí tự!')
            k = 1;
            return
        }
        if(password!==pass2){
            toast.error('Xác nhận mật khẩu không đúng!')
            k = 1;
        }
        
        if(k===1) return;
        
        const response = await fetch('https://vivogear-backend.onrender.com/api/register', {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'Content-Type': 'application/json; charset=utf-8',
            },
            // mode: 'no-cors',
            body: JSON.stringify({
                username,
                password,
                // phone,
                // address
            })
        })

        const json = await response.json();
        if(response.status===200){
            toast.success('Tạo tài khoản thành công!')
            socket.emit('CENRegister', {
                username: json.username,
                idUser: json._id,
                createTime: Date.now()
            })
            navigate('/login');
        }else if(response.status===400){
            toast.error('Tên tài khoản đã tồn tại!')
        }else{
            toast.error('Lỗi Server!')
        }
    }
    

    return(
        <div className="container loginForm">
            {/*<div className="row">*/}
            {/*    <div className="col-md-6">*/}
            {/*        <div className="card">*/}
            <form onSubmit={(e)=>handleSubmit(e)} className="box">
                <h1>Register</h1>
                <p className="text-muted"> Vui lòng điền thông tin!</p>
                <input id={username.length>=6?'validTxt':(username===''?undefined:'nvalidTxt')} type="text" name="" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <input id={password.length>=8?'validTxt':(password===''?undefined:'nvalidTxt')} type="password" name="" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <input id={password===pass2&&password!==''?'validTxt':(pass2===''?undefined:'nvalidTxt')} type="password" name="" placeholder="Confirm Password" value={pass2} onChange={(e)=>setPass2(e.target.value)}/>
                {/*<input id={phone.length>=6?'validTxt':(phone===''?undefined:'nvalidTxt')} type="number" name="" placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />*/}
                {/*<input id={address.length>0?'validTxt':(address===''?undefined:'nvalidTxt')} type="text" name="" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />*/}
                <input type="submit" name="" value="Register" />
                <SocialLogin />
            </form>
        </div>
    )
}

export default Register;