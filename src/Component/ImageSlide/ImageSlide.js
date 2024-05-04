import React, {Component, useEffect, useRef} from "react";
import './ImageSlide.css'
import {useState} from "react";
import Modal from "react-bootstrap/Modal";


function ImageSlide({images}){
    const [index, setIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [imgCurrent, setImgCurrent] = useState(null);
    const [show, setShow] = useState(false);
    const [long, setLong] = useState(null);


    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        getMeta(images[index], (err, img) => {
            if(img.naturalWidth>img.naturalHeight) setLong('width')
            else setLong('height')
        })
    };
    
    const setImg = () => {
        if(long==='width') return {
            width: '750px'
        }
        return {
            height: '600px'
        }
    }
    
    // useEffect(()=>{
    //     console.log(index)
    // },[index])
    
    // const prevIndex = useRef(index)
    
    useEffect(()=>{
        // console.log(`prev:  ${index}`);
        // console.log(`keke ${document.querySelector('.content').scrollLeft}`)
        document.querySelector('.content').scrollLeft = 128*index;
        // console.log(document.querySelector('.content'))
        document.getElementById(`img${index}`).classList.add('currentImg');
    },[index])


    const prevImg = () => {
        document.getElementById(`img${index}`).classList.remove('currentImg');
        if(index===0) setIndex(images.length-1);
        else setIndex(prevState => prevState-1);
    }
    
    const nextImg = () => {
        document.getElementById(`img${index}`).classList.remove('currentImg');
        if(index===images.length-1) setIndex(0);
        else setIndex(prevState => prevState+1);
    }
    
    const swipeSlide = (e) => {
        if(touchStartX<e.changedTouches[0].clientX){
            prevImg();
        }else{
            nextImg();
        }
    }
    
    const handleClick = (ind) => {
        if(ind!==index){
            document.getElementById(`img${index}`).classList.remove('currentImg');
            setIndex(ind);
        }
    }

    const getMeta = (url, cb) => {
        const img = new Image();
        img.onload = () => cb(null, img);
        img.onerror = (err) => cb(err);
        img.src = url;
    };
    
    return(
        <>
            <div className='imgShow'>
                {/*<div className="btnDiv" onClick={()=>prevImg()}>*/}
                {/*    <i className="fa-solid fa-backward fa-2xl"></i>*/}
                {/*</div>*/}
                <div className='containImg' onTouchStart={(e)=>setTouchStartX(e.touches[0].clientX)} onTouchEnd={(e)=>swipeSlide(e)}>
                    <div style={{
                        backgroundImage: `url(${images[index]}`,
                        backgroundSize: "contain",
                        backgroundRepeat: 'no-repeat',
                        // height: '500px',
                        width: '100%',
                    }} className='imgD' onClick={handleShow}>
                    </div>
                </div>
                {/*<button onClick={()=>nextImg()} className='btnRight'><i className="fa-solid fa-forward fa-2xl"></i></button>*/}
                {/*<div className="btnDiv" onClick={()=>nextImg()}>*/}
                {/*    <i className="fa-solid fa-forward fa-2xl" ></i>*/}
                {/*</div>*/}
            </div>
            
            
            <Modal show={show} onHide={handleClose}>
                <img src={images[index]}  id='zoomImg' style={setImg()}/>
                
            </Modal>
            
            
            <div className='imgThumb'>
                
                <div className="content">
                    {/*<div className="previous-btn">*/}
                    {/*    <i className="fa-solid fa-circle-chevron-left fa-2xl"></i>*/}
                    {/*</div>*/}

                    <div className="images">
                        {images.map((img, ind)=>{
                            return (
                                // <div style={{
                                //     backgroundImage: `url(${img}`,
                                //     backgroundSize: "contain",
                                //     backgroundRepeat: 'no-repeat',
                                //     opacity: 0.6
                                //     // height: '80px',
                                //     // width: '80px',
                                // }} className='image' key={ind} id={`img${ind}`} onClick={()=>handleClick(ind)}>
                                // </div>

                                <img src={img} alt={`img${ind}`} key={ind} className='image' id={`img${ind}`} onClick={()=>handleClick(ind)} loading='lazy'/>
                                
                            )
                        })}
                    </div>
    
                    {/*<div className="next-btn">*/}
                    {/*    <i className="fa-solid fa-circle-chevron-right fa-2xl"></i>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}

export default ImageSlide;