import './App.css';
import {
    BrowserRouter,
    Route,
    Routes, useLocation
} from 'react-router-dom';
import SearchPage from "./Pages/SearchPage/SearchPage";
import Home from "./Pages/Home/Home";
import React, {useEffect, useState} from "react";
import Admin from "./Pages/Admin/Admin";
import {useDispatch, useSelector} from "react-redux";
import {
    getAllInventory,
    getAllProducts,
    updateQuantity
} from "./features/products/productsSlice";
import {ProductDetails} from "./Pages/ProductDetails/ProductDetails";
import Login from "./Pages/login/login";
import Register from "./Pages/register/register";
import {getCookie, setCookie} from "./utils/cookie";
import {credential, rtnVoucher, selectUser, updateUser, updateVoucherUser,} from "./features/auth/authSlice";
import {clearCartUser, getCartUser, loadCart} from "./features/cart/cartSlice";
import {loadNotity, newNotify} from "./features/notify/notifySlice";
import Checkout from "./Pages/Checkout/Checkout";
import {getAllVoucher} from "./features/voucher/voucherSlice";
import UserPage from "./Pages/UserPage/UserPage";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {getAllOrder, updateOrder} from "./features/order/orderSlice";
import socket from "./socketClient";
import {loadReview, newReview} from "./features/review/reviewSlice";
import AboutMe from "./Component/AboutMe/AboutMe";
import Success from "./Component/Success/Success";

// export const socket = io('http://localhost:5001');

const useReactPath = () => {
    const [path, setPath] = React.useState(window.location.pathname);
    const listenToPopstate = () => {
        const winPath = window.location.pathname;
        setPath(winPath);
    };
    React.useEffect(() => {
        window.addEventListener("popstate", listenToPopstate);
        return () => {
            window.removeEventListener("popstate", listenToPopstate);
        };
    }, []);
    return path;
};

function App() {
    const dispatch = useDispatch();

    const selectedUser = useSelector(selectUser);

    // const path = useReactPath();
    //
    // useEffect(() => {
    //     localStorage.setItem('navigate', path)
    //     toast.error(path)
    // }, [path]);




    useEffect(() => {
        // socket.emit('exampleEvent', { data: 'Hello from client' });
        socket.connect();
        // console.log('>>>>TOKEN', getCookie('token'))

        socket.on('SEOSuccess', (orderRtn)=>{
            dispatch(updateVoucherUser(orderRtn.voucher))
            dispatch(updateOrder(orderRtn));
            dispatch(clearCartUser());
        })

        socket.on('SEError', (e)=>{
            toast.error(e.msg)
        })

        socket.on('test', ()=>{
            toast.error('KEKEKE');
        })

        socket.on('SERNew', (review)=>{
            dispatch(newReview(review));
        })

        socket.on('SEIQuantity', (quantityArr) => {
            dispatch(updateQuantity(quantityArr));
        })

        socket.on('SENNew', (notify) => {
            dispatch(newNotify(notify));
        })

        socket.on('SEVReturn', (voucher) => {
            dispatch(rtnVoucher(voucher));
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.connect();

        if(getCookie('token')) socket.emit('credential', getCookie('token'))

        return () => {
            socket.disconnect();
        };
    }, [selectedUser]);

    useEffect( () => {
        const check = async()=>{
            if(getCookie('token')){
                const response = await fetch('http://localhost:5001/api/credential', {
                    method: 'GET',
                    headers: {
                        // "Content-Type": "application/json",
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': `Bearer ${getCookie('token')}`
                    },
                })
                const json = await response.json();
                console.log("???>>>>>JSON>>>>>>CRE", response)
                if(response.status===200) dispatch(credential(json))
                else{
                    setCookie('token', '', -1)
                    window.location.replace("/login");
                }
            }
        }
        check()
    },[getCookie('token')])

    // useEffect( () => {
    //     const check = async()=>{
    //         if(getCookie('token')){
    //             const response = await fetch('http://localhost:5001/api/credential', {
    //                 method: 'GET',
    //                 headers: {
    //                     // "Content-Type": "application/json",
    //                     'Content-Type': 'application/json; charset=utf-8',
    //                     'Authorization': `Bearer ${getCookie('token')}`
    //                 },
    //             })
    //             const json = await response.json();
    //             console.log("???>>>>>JSON>>>>>>CRE", response)
    //             if(response.status===200) dispatch(credential(json))
    //             else{
    //                 setCookie('token', '', -1)
    //                 window.location.replace("/login");
    //             }
    //         }
    //     }
    //     check()
    // },[getCookie('token')])

    useEffect(()=>{
        let ignore = false;
        const fetch = async () => {
            dispatch(getAllProducts())
        }
        if(!ignore) fetch();
        return () => {
            ignore = true;
        }
    }, [])

    useEffect(()=>{
        console.log('LOADDIIII')
        dispatch(getAllInventory())
    }, [])

    useEffect(()=>{
        dispatch(getAllVoucher())
    }, [])

    useEffect(()=>{
        dispatch(loadReview())
    }, [])

    useEffect(()=>{
        console.log('LOAD ORDER->>>')
        if(getCookie('token')) {
            dispatch(getAllOrder())
        }
    }, [getCookie('token')])

    useEffect(()=>{
        console.log('LOAD CART->>>')
        if(getCookie('token')){
            dispatch(getCartUser())
        }else{
            if(JSON.parse(localStorage.getItem('cart'))===null) localStorage.setItem('cart',JSON.stringify([]));
            else{
                dispatch(loadCart(JSON.parse(localStorage.getItem("cart"))));
            }
        }
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}>
                        
                    </Route>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/aboutMe' element={<AboutMe />} />
                    <Route path='/search'>
                        <Route path='' element={<SearchPage />}/>
                        <Route path=':typeId' element={<SearchPage />}/>
                    </Route>
                    <Route path='/admin' element={<Admin/>}/>
                    <Route path='/success' element={<Success/>}/>
                    <Route path='/user' element={<UserPage />}>
                    </Route>
                    <Route path='/user/:userTask' element={<UserPage />} />

                    <Route path='/product' >
                        <Route path=':productId' element={<ProductDetails />}/>
                    </Route>
                    <Route path='/checkout' element={<Checkout />}/>
                </Routes>
            </BrowserRouter>
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
}

export default App;
