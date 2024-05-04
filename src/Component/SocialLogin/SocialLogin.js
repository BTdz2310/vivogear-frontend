import React from 'react';
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import {useGoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {socialLogin} from "../../features/auth/authSlice";
import {setCookie} from "../../utils/cookie";
import {useNavigate} from "react-router-dom";

const SocialLogin = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginToGoogle = useGoogleLogin({
        onSuccess:  async (tokenResponse) => {
            const response = await fetch(`http://localhost:5001/api/google/login?accessToken=${tokenResponse.access_token}`);
            const json = await response.json();
            if(response.status===200){
                setCookie('token', json.access_token, 1);
                dispatch(socialLogin(json.user));
                toast.success(json.msg);
                navigate('/');
            }else{
                toast.error(json.msg);
            }
            console.log('>>>SON',json)
        },
    })


    const loginToGithub = () => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=39ffe20d53ddbf0bf30f`)
    }


    return (
        <div className="login__social">
            <div className="login__social--or">
                <div className="login__social--line"></div>
                <span style={{color: 'rgb(108, 117, 125)'}}>hoặc</span>
                <div className="login__social--line"></div>
            </div>
            <div className="login__social-container">
                <GoogleLoginButton text='Google' onClick={()=>loginToGoogle()}/>
                <GithubLoginButton text='Github' onClick={()=>loginToGithub()}/>
            </div>
        </div>
    );
};

export default SocialLogin;