import React from "react";
import {useState, useEffect} from "react";
import './Review.css'
import {useSelector} from "react-redux";
import {selectReview} from "../../features/review/reviewSlice";
import {useLocation} from "react-router-dom";

function Review (){

    const selectedReview = useSelector(selectReview);

    const location = useLocation();
    const idP = location.pathname.split('/')[2];
    const [rating, setRating] = useState([]);
    
    useEffect(()=>{
        if(selectedReview[idP]){
            setRating(selectedReview[idP].map(review=>review.rating));
        }
    }, [selectedReview])
    
    
    return (
        <>
            <div className="reviewRating">
                <div className="starContainer">
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <span key={index}
                                  className={index <= (rating!==[]?rating.reduce((a, b) => a + b, 0)/rating.length:0) ? "onStar star" : "star offStar"}>
                                                &#9733;
                                            </span>
                        );
                    })}
                </div>
                <p>{`${rating.length>0?((rating.reduce((a, b) => a + b, 0)/rating.length).toFixed(1)):0} dựa trên ${rating.length} đánh giá`} </p>
                {console.log(rating)}
                {console.log('DJALOWNDJAJIADOW')}
            </div>
            <div className="countRating">
                <div className="rowStar">
                    <div className="side">
                        <div>5 &#9733;</div>
                    </div>
                    <div className="middle">
                        <div className="bar-container">
                            <div style={{
                                width: `${rating.length>0?(rating.filter(rev => rev === 5).length) * 100 / rating.length:0 }%`,
                                height: '18px',
                                backgroundColor: '#FFD700',
                            }}></div>
                        </div>
                    </div>
                    <div className="side right">
                        <div>{rating?rating.filter(rev=>rev===5).length:0}</div>
                    </div>
                    <div className="side">
                        <div>4 &#9733;</div>
                    </div>
                    <div className="middle">
                        <div className="bar-container">
                            <div style={{
                                width: `${rating.length>0?(rating.filter(rev => rev === 4).length) * 100 / rating.length:0 }%`,
                                height: '18px',
                                backgroundColor: '#FFDC00',
                            }}></div>
                        </div>
                    </div>
                    <div className="side right">
                        <div>{rating?rating.filter(rev=>rev===4).length:0}</div>
                    </div>
                    <div className="side">
                        <div>3 &#9733;</div>
                    </div>
                    <div className="middle">
                        <div className="bar-container">
                            <div style={{
                                width: `${rating.length>0?(rating.filter(rev => rev === 3).length) * 100 / rating.length:0 }%`,
                                height: '18px',
                                backgroundColor: '#FFA500',
                            }}></div>
                        </div>
                    </div>
                    <div className="side right">
                        <div>{rating?rating.filter(rev=>rev===3).length:0}</div>
                    </div>
                    <div className="side">
                        <div>2 &#9733;</div>
                    </div>
                    <div className="middle">
                        <div className="bar-container">
                            <div style={{
                                width: `${rating.length>0?(rating.filter(rev => rev === 2).length) * 100 / rating.length:0 }%`,
                                height: '18px',
                                backgroundColor: '#FF7F00',
                            }}></div>
                        </div>
                    </div>
                    <div className="side right">
                        <div>{rating?rating.filter(rev=>rev===2).length:0}</div>
                    </div>
                    <div className="side">
                        <div>1 &#9733;</div>
                    </div>
                    <div className="middle">
                        <div className="bar-container">
                            <div style={{
                                width: `${rating.length>0?(rating.filter(rev => rev === 1).length) * 100 / rating.length:0 }%`,
                                height: '18px',
                                backgroundColor: '#FF0000',
                            }}></div>
                        </div>
                    </div>
                    <div className="side right">
                        <div>{rating?rating.filter(rev=>rev===1).length:0}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Review