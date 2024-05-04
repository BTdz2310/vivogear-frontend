import React, {useEffect, useState} from 'react';
import './UserPage.css'
import Header from "../../Component/Header/Header";
import {Link, useLocation, useNavigate} from "react-router-dom";
import ProfileChange from "../../Component/ProfileChange/ProfileChange";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/auth/authSlice";
import PurchaseUser from "../../Component/PurchaseUser/PurchaseUser";
import VoucherUser from "../../Component/VoucherUser/VoucherUser";
import NotifyUser from "../../Component/NotifyUser/NotifyUser";
import ChangePasswordUser from "../../Component/ChangePasswordUser/ChangePasswordUser";
import {getCookie} from "../../utils/cookie";



const UserPage = () => {

    const selectedUser = useSelector(selectUser);
    const navigate = useNavigate();

    const location = useLocation();
    const task = location.pathname.split('/')[2];

    useEffect(()=>{
        if(!getCookie('token')){
            localStorage.setItem('navigate', location.pathname);
            navigate('/login');
        }
    }, [])

    const checkTask = () => {
        switch (task) {
            case 'profile':
            case undefined:
                return <ProfileChange/>
            case 'purchase':
                return <PurchaseUser />
            case 'voucher':
                return <VoucherUser />
            case 'notify':
                return <NotifyUser />
            case 'changepassword':
                return <ChangePasswordUser />
        }
    }

    return (
        <>
            <Header />
            <div className="user-page__container">
                <div className="user-page__navbar">
                    <Link to='/user/profile' className="user-navbar__button" id={task==='profile'||task===undefined?'user-navbar__button--selected':undefined}>
                        <i className="fa-solid fa-address-card"></i>
                        <p>Hồ Sơ</p>
                    </Link>
                    <Link to='/user/purchase' className="user-navbar__button" id={task==='purchase'?'user-navbar__button--selected':undefined}>
                        <i className="fa-solid fa-clipboard-list"></i>
                        <p>Đơn Mua</p>
                    </Link>
                    <Link to='/user/notify' className="user-navbar__button" id={task==='notify'?'user-navbar__button--selected':undefined}>
                        <i className="fa-solid fa-bell"></i>
                        <p>Thông Báo</p>
                    </Link>
                    <Link to='/user/voucher' className="user-navbar__button" id={task==='voucher'?'user-navbar__button--selected':undefined}>
                        <i className="fa-solid fa-ticket"></i>
                        <p>Voucher</p>
                    </Link>
                    <Link to='/user/changepassword' className="user-navbar__button" id={task==='changepassword'?'user-navbar__button--selected':undefined}>
                        <i className="fa-solid fa-lock"></i>
                        <p>Đổi Mật Khẩu</p>
                    </Link>
                </div>
                <div className="user-page__task">
                    {checkTask()}
                </div>
            </div>
        </>
    );
};
// profileUP
// purchaseUP
// notifyUP
// voucherUP
// changePassUP
export default UserPage;