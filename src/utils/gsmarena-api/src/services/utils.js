// import axios from "axios";
// import cors from 'axios-cors'
export const getDataFromUrl = async (url) => {
    // const response = await axios.get(`https://www.gsmarena.com${url}`,{
    //     mode: 'no-cors',
    //     headers: {
    //         "Access-Control-Allow-Origin": '*',
    //         "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //         "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
    //     },
    //     withCredentials: true,
    //     credentials: 'same-origin'
    // });
    const response = await fetch(`https://www.gsmarena.com${url}`);
    // console.log((await response).data)
    // console.log('>>>>RES',response)
    // const html = await response.data;
    const html = await response.text();
    // console.log('>>>html', html)
    return html;
};

export const getPrice = (text) => {
    const value = text.replace(',', '').split(' ');
    return {
        currency: value[0],
        price: parseFloat(value[1]),
    };
};
