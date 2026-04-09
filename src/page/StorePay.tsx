
import { useEffect, useRef } from "react"
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk"
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"
import { X } from 'react-feather';
import "../css/pay.css";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
const customerKey = "@@ANONYMOUS";

interface Payprops{
    orderId : string,
    orderSub : string,
    orderName : string,
    Price : number,
    onClose : () => void;
}

const StorePay = ({orderId, orderSub, orderName, Price, onClose} : Payprops) => {

    console.log(orderId);
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
    const price = Price

    useEffect(() => {
        (async () => {
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey)
        paymentWidget.renderPaymentMethods("#payment-widget", price)
        paymentWidgetRef.current = paymentWidget
        })()
    }, [])

    return( 
        <div id="StorePay">
             <div className="wrap">
                <button type="button" className="close-btn" onClick={onClose}><X size="30"/></button>
                <h1>주문서</h1>
                <div id="payment-widget" />
                <button
                    className="pay-btn"
                    onClick={async() => {
                    const paymentWidget = paymentWidgetRef.current

                    try {
                        await paymentWidget?.requestPayment({
                            orderId: orderId,
                            orderName: orderSub,
                            customerName: orderName,
                            successUrl: `${window.location.origin}/pay/success`,
                            failUrl: `${window.location.origin}/pay/fail`,
                        }) 
                    } catch (err) {
                        console.log(err)
                    }
                }}
            >
                결제하기
            </button>
            </div>
        </div>
    )
}

export default StorePay;