import React, {useEffect} from 'react';
import './NotifyUser.css'
import {useDispatch, useSelector} from "react-redux";
import {loadNotity, readAll, selectNotify} from "../../features/notify/notifySlice";
import {checkNImg, formatCreatedUtc} from "../../utils/math";
import {Link} from "react-router-dom";
import socket from "../../socketClient";
import store from "../../store";
import {getCookie} from "../../utils/cookie";
const NotifyUser = () => {
    const selectedNotify = useSelector(selectNotify);
    const dispatch = useDispatch();

    const handleRead = () => {
        socket.emit('CENReadAll', store.getState().auth.auth.id)
        dispatch(readAll());
    }

    return (
        <>
            <div className="user-notify__read-all">
                <p onClick={()=>handleRead()}>Đánh Dấu Là Đã Đọc</p>
            </div>
            <div className="user-notify__list">
                {selectedNotify?selectedNotify.map(notify=>(
                    <Link key={notify.createTime} to={notify.url} className={notify.isRead?'user-notify__line user-notify__line--read':'user-notify__line'}>
                        <div className="user-notify__img">{checkNImg(notify.image)}</div>
                        <div className="user-notify__content">
                            <h4 className='user-notify__title'>{notify.text}</h4>
                            <p className='user-notify__text'>{notify.content}</p>
                            <p className='user-notify__time'>{`${formatCreatedUtc(Number(notify.createTime))} trước`}</p>
                        </div>
                    </Link>
                )):undefined}
            </div>
        </>
    );
};

export default NotifyUser;