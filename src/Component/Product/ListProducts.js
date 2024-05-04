import React from "react";
import Product from "./Product";
import './item.css'
function ListProducts({data, type, same, sort}){
    // console.log('data')
    // const data = [...data1];
    console.log('>>>>LISTTT',data)
    
    const sorting = (sortType) => {
        // console.log(sortType)
        switch (sortType){
            case 'sort09':
                return data.sort(function(a, b) {
                    return a.price - b.price;
                });
            case 'sort90':
                return data.sort(function(a, b) {
                    return b.price - a.price ;
                });
            case 'sortAZ':
                return data.sort(function(a, b) {
                    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    // return a.name - b.name ;
                })
            case 'sortZA':
                return data.sort(function(a, b) {
                    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1;
                    }

                    // names must be equal
                    return 0;
                    // return a.name - b.name ;
                });
        }
    }
    
    return(
        <div id='product__list'>
            {data&&(sort?sorting(sort):data).map((product,index)=>
            (<Product product1={product} key={index} type={type} same={same}/>)
                // console.log(product1)
            )}
            {/*{console.log('typeof ')}*/}
            {/*{console.log(data)}*/}
        </div>
    )
}

export default ListProducts;