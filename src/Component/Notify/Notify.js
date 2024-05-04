import React, {useEffect, useState} from 'react';
import './Notify.css'
import NotifyLine from "../NotifyLine/NotifyLine";
import {useDispatch, useSelector} from "react-redux";
import {loadNotity, readAll, selectNotify} from "../../features/notify/notifySlice";
import {getCookie} from "../../utils/cookie";
import {Link} from "react-router-dom";
import socket from "../../socketClient";
import store from "../../store";

const Notify = () => {
    const [show, setShow] = useState(false)

    const selectedNotify = useSelector(selectNotify);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(getCookie('token')) dispatch(loadNotity())
    }, [show])

    const handleRead = () => {
        socket.emit('CENReadAll', store.getState().auth.auth.id)
        dispatch(readAll());

    }

    return (
        <>
            {selectedNotify?(<>
                {/*<i className="fa-solid fa-bell" onClick={() => setShow(prev => !prev)}>*/}
                {/*</i>*/}
                <svg
                    className='header__svg--fill'
                    viewBox="0 0 24 24"
                    fill="black"
                    height="32px"
                    width="32px"
                    onClick={()=>setShow(!show)}
                >
                    {selectedNotify.filter(notify => !notify.isRead).length > 0 &&
                        <span className="header-notify__count">{selectedNotify.filter(notify => !notify.isRead).length}</span>}
                    <path d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 003 16v2a1 1 0 001 1h16a1 1 0 001-1v-2a.996.996 0 00-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 007 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 002.818-2H9.182A2.98 2.98 0 0012 22z" />
                </svg>
                <div className='header-notify__table' id={show?'--visible':undefined}>
                    {/*<div className="cartContent">*/}
                    <div>
                        <ul className="header-notify__list">
                            {selectedNotify && selectedNotify.map(notify => (<li key={notify._id}>
                                <Link className='header-notify__line' to={notify.url} id={notify.isRead ? '--read-notify' : undefined}>
                                    <NotifyLine data={notify}/>
                                </Link>
                            </li>))}
                            {/*<li className='notifyLine'>*/}
                            {/*    <NotifyLine />*/}
                            {/*</li>*/}
                            {/*<li className='notifyLine'>*/}
                            {/*    <NotifyLine />*/}
                            {/*</li>*/}
                        </ul>
                        {getCookie('token') && (<p className="header-notify__read-all" onClick={() => handleRead()}>
                            Đánh dấu là đã đọc
                        </p>)}
                    </div>

                </div>
            </>):undefined
}
        </>
    );
};

export default Notify;