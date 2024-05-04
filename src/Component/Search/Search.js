import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import './Search.css'
import {useDispatch} from "react-redux";
import {resetChose} from "../../features/filters/filtersSlice";

function Search(){
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleClick = () => {
        dispatch(resetChose());
        navigate('/search')
    }
    
    return(
        <>
            <Link to="/search">
                Sản Phẩm
            </Link>
        </>
    )
}

export default Search;