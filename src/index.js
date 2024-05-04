import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google"
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Provider, useDispatch, useSelector} from "react-redux";
import store from './store'

// 
// useDispatch(loadProducts)
console.log(store.getState().auth.auth)

store.subscribe(()=>{
    console.log('update')
    console.log(store.getState().auth.auth)
    console.log(store.getState())
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId={'597403208777-bdl7hkrkf68ks1co48bg394nrg36j0mn.apps.googleusercontent.com'}>
            <App />
        </GoogleOAuthProvider>
    </Provider>

);
{/*<React.StrictMode>*/}

{/*</React.StrictMode>*/}
// ReactDOM.render(
//     <React.StrictMode>
//         <Provider store={store}>
//             <App />
//         </Provider>
//     </React.StrictMode>,
//     document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
