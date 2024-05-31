import React, {Fragment, useEffect, useRef, useState} from 'react';
import './ChatBox.css'
import {getCookie} from "../../utils/cookie";
import {useNavigate} from "react-router-dom";
import socket from "../../socketClient";
import {useSelector} from "react-redux";
import {selectUser} from "../../features/auth/authSlice";
import {toast} from "react-toastify";

const ChatBox = () => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const chatRef = useRef(null);

    const selectedUser = useSelector(selectUser);

    useEffect( () => {

        const fetchApi = async () => {
            const response = await fetch('http://vivogear-backend.onrender.com/api/chats',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });
            const json = await response.json();
            // console.log('>>>DWA',json)
            if(response.status===200){
                setData(json.data);
                // toast.success(json.data)
            }
            // else toast.error(json.msg)
        }
        fetchApi();

    }, []);

    useEffect(() => {
        if (chatRef) {
            chatRef.current?.scroll({ top: chatRef.current?.scrollHeight, behavior: 'smooth' })
        }
    }, [show]);

    socket.on('receiveMsg', (e)=>{
        setData(e)
    })

    // useEffect(() => {
    //     if(show===true){
    //         if(!getCookie('token')){
    //             navigate('/login');
    //         }
    //         setShow(false);
    //     }
    // }, [show]);

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
            side: 1,
            content: text,
            idUser: selectedUser._id
        })
        setText('')
        handleScroll();
    }

    const handleKey = (e) => {
        if (e.keyCode == 13 && !e.shiftKey){
            e.preventDefault()
            handleSubmit();
        }
    }

    return (
        <div className='__chat-box'>
            {show ? (
                <div className='__chat-box--button' onClick={()=>handleSubmit()}>
                    <i className="fa-solid fa-paper-plane"></i>
                </div>
            ) : (
                <div className='__chat-box--button' onClick={()=> {
                    if(!getCookie('token')){
                        navigate('/login');
                    }else setShow(true)
                }}>
                    <i className="fa-brands fa-rocketchat"></i>
                </div>
            )}
            <div className="__chat-box--container" style={{opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden', transition: '0.2s'}}>
                <div className="__chat-box--head">
                    <h2>Chat Với Admin</h2>
                    <i className="fa-solid fa-x" onClick={()=>setShow(false)}></i>
                </div>
                <div className="__chat-box--main" ref={chatRef}>
                    {data.map((chat)=>(
                        <Fragment key={chat._id}>
                            {chat.side===0?(
                                <p className='__chat-box--msg __chat-box--msg-admin'>{chat.content}</p>
                            ):(
                                <p className='__chat-box--msg __chat-box--msg-user'>{chat.content}</p>
                            )}
                        </Fragment>
                    ))}
                </div>
                <div className="__chat-box--footer">
                    <div className="__chat-box--input">
                        <textarea onKeyDown={(e)=>handleKey(e)} placeholder='Nhập tin nhắn...' value={text} onChange={(e)=>setText(e.target.value)}></textarea>
                        <div className="__chat-box--link">
                            <i className="fa-solid fa-paperclip"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;