export const formatCreatedUtc = (createdUtc) => {
    const now = Date.now();
    const diff = (now - createdUtc)/1000;

    // console.log('DIFFFF',createdUtc, now ,diff)

    if(diff < 0) return 'Hết Hạn Sử Dụng'

    if (diff < 60) {
        return "1 phút";
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)} phút`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} giờ`;
    } else if (diff < 2592000) {
        return `${Math.floor(diff / 86400)} ngày`;
    } else if (diff < 31104000) {
        return `${Math.floor(diff / 2592000)} tháng`;
    } else {
        return `${Math.floor(diff / 31104000)} năm`;
    }
};

export const formatExpired = (createdUtc) => {
    const now = Date.now();
    const diff = (createdUtc - now)/1000;

    // console.log('DIFFFF',createdUtc, now ,diff)

    if(diff < 0) return -1;

    if (diff < 60) {
        return "1 phút";
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)} phút`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} giờ`;
    } else if (diff < 2592000) {
        return `${Math.floor(diff / 86400)} ngày`;
    } else if (diff < 31104000) {
        return `${Math.floor(diff / 2592000)} tháng`;
    } else {
        return `${Math.floor(diff / 31104000)} năm`;
    }
};

export const checkNImg = (img) => {
    switch (img){
        case 'user':
            return <i className="fa-solid fa-user"></i>
        case 'voucher':
            return <i className="fa-solid fa-ticket"></i>
        case 'order':
            return <i className="fa-solid fa-bag-shopping"></i>
    }
}

export const getAccessTokenGithub = async (code) => {
    const response = await fetch(`http://localhost:5001/api/github/accessToken?code=${code}`);
    console.log('RE<<<>>>>>>>',response)
    const json = await response.json();
    return json;
}

// export const getUserDataGithub = async (accessToken) => {
//     console.log('accTO',accessToken)
//     const response = await fetch(`http://localhost:5001/api/github/login?accessToken=${accessToken}`);
//     const json = await response.json();
//     return json;
// }