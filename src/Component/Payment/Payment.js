import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {ModalBody} from "react-bootstrap";
import {useElements, useStripe, PaymentElement, PaymentRequestButtonElement} from "@stripe/react-stripe-js";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {placedOrder} from "../../features/order/orderSlice";

const Payment = ({show, onShow, onHide, cartBuy}) => {

    const [paymentRequest, setPaymentRequest] = useState(null);

    console.log(cartBuy)

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setProcessing] = useState(false);

    useEffect(() => {
        if (stripe) {
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: {
                    label: 'Demo',
                    amount: cartBuy.total,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });

            pr.on('paymentmethod', async (e)=>{
                const response = await fetch('http://vivogear-backend.onrender.com/api/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: cartBuy.total
                    })
                })

                const json = await response.json();

                const {clientSecret} = json;

                setProcessing(true)

                const {error, paymentIntent} = await stripe.confirmPayment({
                   clientSecret,
                    confirmParams: {
                        return_url: 'http://localhost:3000/user/purchase'
                    },
                    redirect: 'if_required'
                })

                if(error){
                    toast.error(error.message)
                    e.complete('fail')
                }else if(paymentIntent && paymentIntent.status === 'succeeded'){
                    await dispatch(placedOrder(cartBuy))

                    toast.success('Đặt Đơn Hàng Thành Công')
                    navigate('/user/purchase')
                    e.complete('success')
                }else{
                    toast.error('Lỗi Ngoài Ý Muốn')
                }

                setProcessing(false)



            })
        }
    }, [stripe, elements]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async () => {

        if(!stripe || !elements){
            return;
        }

        setProcessing(true)

        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/user/purchase'
            },
            redirect: 'if_required'
        })

        if(error){
            toast.error(error.message)
        }else if(paymentIntent && paymentIntent.status === 'succeeded'){
            await dispatch(placedOrder(cartBuy))

            toast.success('Đặt Đơn Hàng Thành Công')
            navigate('/user/purchase')
        }else{
            toast.error('Lỗi Ngoài Ý Muốn')
        }

        setProcessing(false)

    }

    return (
        <Modal show={show} onHide={onHide}>
            <ModalBody>
                <PaymentElement/>
                {paymentRequest&&(<PaymentRequestButtonElement options={{paymentRequest}}/>)}
                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'end'}}>
                    <button type="button" className="btn btn-outline-success" onClick={()=>handleSubmit()} disabled={isProcessing}>{isProcessing?'Chờ Xử Lý...':'Thanh Toán'}</button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default Payment;