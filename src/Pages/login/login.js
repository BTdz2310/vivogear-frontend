import React, {useState} from 'react';
import {Link} from "react-router-dom";
import './login.css'
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch, useSelector} from "react-redux";
import {checkLogin, login} from "../../features/auth/authSlice";
import store from "../../store";
import {createCartUser, getCartUser, selectCart, updateCartUser} from "../../features/cart/cartSlice";
import {selectInventory} from "../../features/products/productsSlice";
import {socket} from "../../App";
import {getCookie} from "../../utils/cookie";
import {getAllAdminOrder, getAllOrder} from "../../features/order/orderSlice";
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import SocialLogin from "../../Component/SocialLogin/SocialLogin";
function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show1, setShow1] = useState(true);

    const selectedInventory = useSelector(selectInventory);

    const loggedIn = useSelector(checkLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await dispatch(login({
            username,
            password
        }));

        console.log('loggin',store.getState().auth.auth.isLoggedIn)
        console.log('res', response)

        if(!getCookie('token')){
            toast.error(response.payload.json)
        }else{
            if(!response.payload.adminIn){
                const fetch1 = await dispatch(getCartUser());
                const fetch2 = await dispatch(getAllOrder());
                const selectedCart = store.getState().cart.cart;
                console.log('CATTTTRRR>>>', selectedCart)
                const data = JSON.parse(localStorage.getItem("cart"));
                await Promise.all(data.map(async (ct)=>{

                    console.log('data>>>>CT', selectedCart.map(cart=>cart.idInv), (ct.idInv) ,selectedCart.map(cart=>cart.idInv).includes(ct.idInv))

                    if(selectedCart.map(cart=>cart.idInv).includes(ct.idInv)){
                        await dispatch(updateCartUser({
                            idInv: ct.idInv,
                            quantity: ct.quantity
                        }))
                    }else{
                        await dispatch(createCartUser(ct))
                    }
                }))
                localStorage.setItem('cart',JSON.stringify([]));
                if(!localStorage.getItem('navigate')){
                    navigate('/');
                }else{
                    navigate(localStorage.getItem('navigate'));
                }
            }
            else{
                navigate('/admin')
            }
            toast.success('Đăng Nhập Thành Công')
        }

    }

    return(
        <div className="container loginForm">
            {/*<div className="row">*/}
            {/*    <div className="col-md-6">*/}
            {/*        <div className="card">*/}
                        <form onSubmit={(e)=>handleSubmit(e)} className="box">
                            <h1>Login</h1>
                            <p className="text-muted"> Vui lòng điền thông tin!</p> 
                            <input type="text" name="" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} style={{width: '274px'}}/>
                            {/*<input type="password" name="" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />*/}
                            <div className="passTxt">
                                <input type={show1?"password":"text"} name="" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className='notW'/>
                                {show1?(<i className="fa-regular fa-eye hidePass" id={password.length===0?'hidePass':undefined} onClick={()=>setShow1(prev=>!prev)}></i>):(<i className="fa-regular fa-eye-slash hidePass" id={password.length===0?'hidePass':undefined} onClick={()=>setShow1(prev=>!prev)}></i>)}
                            </div>
                            <Link className="signup text-muted" to="../register">Chưa có tài khoản?&nbsp; Đăng ký</Link>
                            <input type="submit" name="" value="Login" />
                            <SocialLogin />
                        </form>
                    {/*</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}

export default Login;