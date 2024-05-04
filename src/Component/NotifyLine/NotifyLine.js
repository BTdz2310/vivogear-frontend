import React from 'react';
import {checkNImg, formatCreatedUtc} from "../../utils/math";
import {Link} from "react-router-dom";

const NotifyLine = ({data}) => {
    return (
        <>
            <div style={{alignSelf: 'center'}}>{checkNImg(data.image)}</div>
            <div>
                <div className="notify-line__text">{data.text}</div>
                <div className="">{data.content}</div>
                <div className="notify-line__time">{`${formatCreatedUtc(Number(data.createTime))} trước`}</div>
            </div>
        </>
    );
};

export default NotifyLine;