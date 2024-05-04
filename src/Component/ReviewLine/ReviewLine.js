import React, {useEffect, useState} from 'react';
import StarRating from "../StarRating/StarRating";
import {useDispatch, useSelector} from "react-redux";
import {selectInventory} from "../../features/products/productsSlice";
import './ReviewLine.css'
import {selectUser} from "../../features/auth/authSlice";
import socket from "../../socketClient";
import {createReview, selectReview} from "../../features/review/reviewSlice";
import Spinner from "react-bootstrap/Spinner";
import {toast} from "react-toastify";

const ReviewLine = ({inv, orderId}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [disabledRate, setDisabledRate] = useState(false);
    const dispatch = useDispatch();
    const selectedInventory = useSelector(selectInventory);
    const selectedUser = useSelector(selectUser);
    const selectedReview = useSelector(selectReview);

    const buttonJSX = () => {
        if(!disabledRate) return (
            <button className='btn btn-success review-line-send' onClick={()=>handleSend()}>Gửi</button>
        )
        return (
            <button className='btn btn-secondary' disabled>Đã Gửi</button>
        )
    }

    useEffect(() => {
        if(selectedReview[inv.productId]){
            const review = selectedReview[inv.productId].filter(review=>review.orderId===orderId&&review.inventoryId===inv.inventoryId)[0];
            console.log('RVCHECK>>>',review)
            if(review){
                setRating(review.rating);
                setComment(review.comment);
                setDisabledRate(true);
            }
        }
    }, [selectedReview]);

    console.log('CHECK', selectedReview)

    const handleSend = async () => {
        setIsLoading(true);
        const review = {
            rating,
            comment,
            time: Date.now(),
            userId: selectedUser._id,
            inventoryId: inv.inventoryId,
            productId: inv.productId,
            orderId: orderId,
            username: selectedUser.username,
            avatar: selectedUser.avatar
        }
        const response = await dispatch(createReview(review));
        toast.error(JSON.stringify(review))
        setIsLoading(false);
    }

    return (
        <>
            {isLoading?(
                <div className='review-line'>
                    <Spinner />
                    {/*{console.log('>>>FFF', )}*/}
                </div>
            ):(
                <div className='review-line'>
                    {selectedReview[inv.productId]&&console.log('data',selectedReview[inv.productId].map(review=>review.orderId))}
                    <div className="review-line-info">
                        <p className='review-line-name'>{inv.name}</p>
                        <img src={inv.img} alt={inv.name}/>
                        <p className='review-line-type'>{`${selectedInventory[inv.productId]?selectedInventory[inv.productId][inv.inventoryId].size:''} - ${selectedInventory[inv.productId]?selectedInventory[inv.productId][inv.inventoryId].color:''}`}</p>
                    </div>
                    <div className="review-line-rating">
                        <StarRating rating={rating} setRating={setRating} disabledStar={!disabledRate}/>
                        <textarea disabled={disabledRate} rows={5} placeholder='Viết Nhận Xét ...' className='review-line-comment' value={comment} onChange={(e)=>setComment(e.target.value)}/>
                    </div>
                    {buttonJSX()}
                </div>
            )}
        </>
    );
};

export default ReviewLine;