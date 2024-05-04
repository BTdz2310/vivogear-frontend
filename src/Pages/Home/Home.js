import React, {useEffect, useState} from "react";
import Header from "../../Component/Header/Header";
import {Link} from "react-router-dom";
import {getAccessTokenGithub} from "../../utils/math";
import {setCookie} from "../../utils/cookie";
import {socialLogin} from "../../features/auth/authSlice";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import('./Home.css')

function Home(){

    const dispatch = useDispatch();
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const codeParam = urlParams.get("code");

    useEffect(() => {
        if(codeParam){
            getAccessTokenGithub(codeParam).then(async (resp) => {
                const response = await fetch(`https://vivogear-backend.onrender.com/api/github/login?accessToken=${resp.access_token}`);
                const json = await response.json();
                console.log(json)
                if(response.status===200){
                    setCookie('token', json.access_token, 1);
                    dispatch(socialLogin(json.user));
                    toast.success(json.msg);
                }else{
                    toast.error(json.msg);
                }
            })
        }
    }, [codeParam]);
    
    return(
        <>
            <div className='home-page'>
                <div className="home-page__container">
                    <Header />
                    <div className="home-page__slogan">
                        <h1>Tinh Tế <i>Và</i> Tiện Lợi</h1>
                        <div>
                            <h3>Tất Cả Nằm Trong Tay Bạn Nhưng Tiền Thì Không.</h3>
                            <Link to='/search/phone'>MUA NGAY</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;