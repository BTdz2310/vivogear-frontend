import React from 'react';
import './Header.css'
import {Link, Outlet, Route, Routes} from 'react-router-dom';
import Cart from "../Cart/Cart";
import Notify from "../Notify/Notify";
import {getCookie} from "../../utils/cookie";
import {useDispatch, useSelector} from "react-redux";
import {checkLogin, logout} from "../../features/auth/authSlice";

function Header () {

    const dispatch = useDispatch();
    const loggedIn = useSelector(checkLogin)

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <>
                <div className="header">
                    <div className='header__left'>
                        <Link to='/' className='logo'>vivogear</Link>
                    </div>
                    <div className='header__center'>
                        <div className="header-center__collapse">
                            <div className="header-center__dropdown-toggle">
                                <Link to="" className="header-navbar__link">
                                    Product
                                    <svg
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                        height="1em"
                                        width="1em"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.553 6.776a.5.5 0 01.67-.223L8 9.44l5.776-2.888a.5.5 0 11.448.894l-6 3a.5.5 0 01-.448 0l-6-3a.5.5 0 01-.223-.67z"
                                        />
                                    </svg>
                                </Link>
                                <ul className="header-center__dropdown-menu">
                                    <li>
                                        <Link to='/search/phone'><p>Phone</p></Link>
                                    </li>
                                    <li>
                                        <Link to='/search/watch'><p>Smartwatch</p></Link>
                                    </li>
                                    <li>
                                        <Link to='/search/tablet'><p>Tablet</p></Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <Link to="/aboutMe" className='header-navbar__link'>About Us</Link>
                            </div>
                            <div>
                                {getCookie('token')?(<Link className='header-navbar__link' to="." onClick={()=>handleLogout()}>Logout</Link>):(<Link className='header-navbar__link' to="/login">Login</Link>)}
                            </div>
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header-right__container">
                            {getCookie('token')&&(<div className="header-right__icon">
                                <Notify />
                            </div>)}
                            {getCookie('token')&&(<div className="header-right__icon">
                                <Link to='/user'>
                                    {/*<i className='fa-solid fa-user'></i>*/}
                                    <svg
                                        fill="none"
                                        className='header__svg--stroke'
                                        stroke="black"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        height="32px"
                                        width="32px"
                                    >
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <path d="M16 7 A4 4 0 0 1 12 11 A4 4 0 0 1 8 7 A4 4 0 0 1 16 7 z" />
                                    </svg>
                                </Link>
                            </div>)}
                            <div className="header-right__icon" id="cartHover">
                                <Cart />
                            </div>
                        </div>
                    </div>
                </div>
            {/*</header>*/}
            {/*<main>*/}
            {/*    <Outlet />*/}
            {/*</main>*/}
        </>
    )
}

export default Header;