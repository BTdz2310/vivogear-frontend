import React, {useEffect, useState} from 'react';
import {arrAdr} from "../../utils/dataADR";
// import {arr} from '../../utils/dataADR'
import('./AddressInput.css')

const AddressInput = ({setAddress ,address, addressFirst}) => {
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [plus, setPlus] = useState('');

    useEffect(()=>{
        if(addressFirst){
            const arr = addressFirst.split(' - ');
            setCity(arr[3]);
            setDistrict(arr[2]);
            setWard(arr[1]);
            setPlus(arr[0]);
        }
    }, [addressFirst])

    useEffect(() => {
        // if(plus){
            setAddress(`${plus} - ${ward} - ${district} - ${city}`);
        // }
    }, [plus, ward, district, city]);

    return (
        <div className='addressInput'>
            <select name="city" value={city} onChange={(e)=>setCity(e.target.value)}>
                <option value={''}>Chọn Tỉnh Thành</option>
                {Object.keys(arrAdr).map(city1=>(<option key={city1} value={city1}>{city1}</option>))}
            </select>
            {city&&(
                <select name="district" value={district} onChange={(e)=>setDistrict(e.target.value)}>
                    <option value={''}>Chọn Quận Huyện</option>
                    {city&&Object.keys(arrAdr[city]).map(district1=>(<option key={district1} value={district1}>{district1}</option>))}
                </select>
            )}
            {district&&(
                <select name="ward" value={ward} onChange={(e)=>setWard(e.target.value)}>
                    <option value={''}>Chọn Phường Xã</option>
                    {district&&(arrAdr[city][district].map(ward1=>(<option key={ward1} value={ward1}>{ward1}</option>)))}
                </select>
            )}
            {ward&&<textarea placeholder='Địa Chỉ Cụ Thể' rows={2} cols={40} value={plus} onChange={(e)=>setPlus(e.target.value)}></textarea>}
        </div>
    );
};

export default AddressInput;