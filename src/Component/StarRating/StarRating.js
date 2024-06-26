import React, {useEffect, useState} from "react";
import './StarRating.css'
const StarRating = ({rating, setRating, disabledStar}) => {
    // const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "onStar" : "offStar"}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        disabled={!disabledStar}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
