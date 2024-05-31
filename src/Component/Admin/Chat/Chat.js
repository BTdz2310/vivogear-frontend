import React, {Fragment, useEffect, useRef, useState} from 'react';
import {getCookie} from "../../../utils/cookie";
import './Chat.css'
import socket from "../../../socketClient";
import {toast} from "react-toastify";

const Chat = () => {

    const [data, setData] = useState('');
    const [user, setUser] = useState('');
    const [idUser, setIdUser] = useState('');
    const [text, setText] = useState('');

    const chatRef = useRef(null);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await fetch('http://vivogear-backend.onrender.com/api/chatAdmin',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const json = await response.json();
            if(response.status===200){
                setData(json.data);
                // toast.success(json.data)
            }
            console.log(json)
            // else toast.error(json.msg)
        }
        fetchApi();
    }, []);

    useEffect(() => {
        if(data.length){
            setUser(Object.keys(checkChat(data))[0]);
            // user&&setIdUser(checkChat(data)[user][0].idUser._id)
        }
    }, [data]);

    useEffect(() => {
        if (chatRef) {
            chatRef.current?.scroll({ top: chatRef.current?.scrollHeight, behavior: 'smooth' })
        }
    }, [user]);

    socket.on('receiveMsg', (e)=>{
        console.log(e)
        setData(e)
    })

    const checkChat = (data) => {
        const chatMap = {};

        for(let i=0; i<data.length; i++){
            if(!chatMap[data[i].idUser.username]){
                chatMap[data[i].idUser.username] = [data[i]]
            }else{
                chatMap[data[i].idUser.username] = [...chatMap[data[i].idUser.username], data[i]]
            }
        }

        console.log(chatMap)

        return chatMap;
    }

    const handleScroll = () => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }

    const handleSubmit = () => {
        if(!text.trim()){
            toast.error('Tin nhắn trống');
            return;
        }
        socket.emit('sendMsg', {
            created_at: Date.now(),
            side: 0,
            content: text,
            idUser: checkChat(data)[user][0].idUser._id
        })
        setText('')
    }

    const handleKey = (e) => {
        if (e.keyCode == 13 && !e.shiftKey){
            e.preventDefault()
            handleSubmit();
        }
    }

    return (
        <>
            <div className="admin-task__head">Tin Nhắn</div>
            <div className="admin-task__action __chat-admin">
                <div className="admin-task__action-left">
                    {Object.keys(checkChat(data)).map(user1=>(
                        <p key={user1} onClick={()=>setUser(user1)} className={user1===user?'__chat--user-selected':undefined}>{user1}</p>
                    ))}
                </div>
                <div className="admin-task__action-right">
                    <div className="__chat--admin-head">
                        <p>{user}</p>
                    </div>
                    <div className="__chat--admin-main" ref={chatRef}>
                        {console.log(checkChat(data), user)}
                        {data&&user&&checkChat(data)[user].map((chat)=>(
                            <Fragment key={chat._id}>
                                {chat.side===0?(
                                    <p className='__chat-box--msg __chat--admin-side'>{chat.content}</p>
                                ):(
                                    <p className='__chat-box--msg __chat--user-side'>{chat.content}</p>
                                )}
                            </Fragment>
                        ))}
                    </div>
                    <div className="__chat--admin-footer">
                        <textarea onKeyDown={(e)=>handleKey(e)} value={text} onChange={(e)=>setText(e.target.value)}></textarea>
                        <div className="__chat--admin-send" onClick={()=>handleSubmit()}>
                            <i className="fa-regular fa-paper-plane"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;