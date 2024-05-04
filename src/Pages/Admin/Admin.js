import React, {useEffect, useState} from "react";
import './Admin.css'
import CreateProduct from "../../Component/Admin/CreateProduct/CreateProduct";
import CreateVoucher from "../../Component/Admin/CreateVoucher/CreateVoucher";
import UpdateProduct from "../../Component/Admin/UpdateProduct/UpdateProduct";
import OrderAdmin from "../../Component/Admin/OrderAdmin/OrderAdmin";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getAllAdminOrder} from "../../features/order/orderSlice";
import {getCookie} from "../../utils/cookie";

function Admin(){
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [task, setTask] = useState(0);
    // const [isLoaded, setIsLoaded] = useState(false);

    // const selectedUser = useSelector((state)=>state.auth.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect( ()=>{
        const checkAdmin = async () => {
            const response = await fetch('https://vivogear-backend.onrender.com/api/checkAdmin', {
                method: 'GET',
                headers: {
                    // "Content-Type": "application/json",
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            })
            const json = await response.json();
            const isAdmin = json.isAdmin;

            if(!isAdmin){
                alert('Bạn Không Có Quyền Truy Cập!');
                // toast.warning('Bạn Không Có Quyền Truy Cập!');
                navigate('/')
            }else{
                dispatch(getAllAdminOrder());
            }
        }

        checkAdmin();

    }, [])

    const checkTask = (task) => {
        switch(task) {
            case 0:
                return <OrderAdmin />
            case 1:
                return <CreateProduct />;
            case 2:
                return <CreateVoucher />
            case 3:
                return <UpdateProduct />
        }
    }

    return(
        <>
            {console.log(task,'TASK')}
            <div className="admin-page__container">
                <div className="admin-navbar__container">
                    <h1>Admin</h1>
                    <div className="admin-navbar__item">
                        <p className='admin-navbar__head'>Đơn Hàng<i className="fa-solid fa-bag-shopping" style={{marginLeft:'10px'}}></i></p>
                        <div className="admin-navbar__button" id={task===0?'admin-navbar__button--selected':undefined}  onClick={()=>setTask(0)}>
                            <i className="fa-solid fa-clipboard-list"></i>
                            <p>Xử Lý Đơn Hàng</p>
                        </div>
                    </div>
                    <div className="admin-navbar__item">
                        <p className='admin-navbar__head'>Sản Phẩm<i className="fa-solid fa-box" style={{marginLeft:'10px'}}></i></p>
                        <div className="admin-navbar__button" id={task===1?'admin-navbar__button--selected':undefined}  onClick={()=>setTask(1)}>
                            <i className="fa-solid fa-plus"></i>
                            <p>Thêm Sản Phẩm</p>
                        </div>
                        <div className="admin-navbar__button" id={task===3?'admin-navbar__button--selected':undefined}  onClick={()=>setTask(3)}>
                            {/*<i className="fa-solid fa-gear"></i>*/}
                            <i className="fa-solid fa-pen-to-square"></i>
                            <p>Sửa Sản Phẩm</p>
                        </div>
                    </div>
                    <div className="admin-navbar__item">
                        <p className='admin-navbar__head'>Voucher<i className="fa-solid fa-ticket" style={{marginLeft: '10px'}}></i></p>
                        <div className="admin-navbar__button" id={task===2?'admin-navbar__button--selected':undefined} onClick={()=>setTask(2)}>
                            <i className="fa-solid fa-gear"></i>
                            <p>Voucher</p>
                        </div>
                        {/*<div className="admin-navbar__button">*/}
                        {/*    <i className="fa-solid fa-gear"></i>*/}
                        {/*    <p className='admin-navbar__button'>Sửa Sản Phẩm</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="admin-task__container">
                    {checkTask(task)}
                </div>
            </div>

        </>
    )
}

export default Admin;