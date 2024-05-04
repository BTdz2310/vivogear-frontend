import React from "react";
import {useState, useEffect} from "react";
import './Comment.css'
import {useSelector} from "react-redux";
import {selectReview} from "../../features/review/reviewSlice";
import {useLocation} from "react-router-dom";
import {formatTime} from "../VoucherTag/VoucherTag";
import {convertTime} from "../OrderLine/OrderLine";


function Comment (){
    
    const selectedReview = useSelector(selectReview);

    const location = useLocation();
    const idP = location.pathname.split('/')[2];
    
    const [comment, setComment] = useState([]);

    useEffect(()=>{
        if(selectedReview[idP]){
            setComment(selectedReview[idP])
        }
    }, [selectedReview])
    
    return (
        <>
            <div className="review-container">
                {comment.map((review, index)=>{
                    return (
                        <div key={index} className='review-card'>
                            <div className="review-info">
                                <img src={review.avatar} alt={review._id}/>
                                <p>{review.username}</p>
                                <div className="starRate">
                                    {[...Array(5)].map((star, index) => {
                                        index += 1;
                                        return (
                                            <span key={index}
                                                  className={index <= review.rating ? "onStar" : "offStar"}>
                                                &#9733;
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="review-main">
                                <p className='review-time'>{`${convertTime(review.time)} ${formatTime(review.time)}`}</p>
                                <p className='review-comment'>{review.comment}</p>
                                
                            </div>
                        </div>
                    )
                })}
            </div>
            
        </>
    )
}

export default Comment;