import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SelectOne, Update } from "../api/table-api";
import { nanoid } from "nanoid";
import type { StoreProps } from "../types/store-type";

const PaySuccess = () => {
    const [searchParams] = useSearchParams();
    const Id= searchParams.get("orderId");
    const [orderData, setOrderData] = useState<StoreProps>();

    const formatPhone = (num: string) => {
        return num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    useEffect(() => {
        if(Id){
            const load = async() => {
                try{
                    const result = await SelectOne({Id : Id}, "order");
                    setOrderData(result);
                }catch{
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [])
    useEffect(() => {
        if(orderData && Id && !orderData.orderId){
            const load = async() =>{
                try{
                    const newData = {...orderData, orderId : nanoid(10)}
                    await Update(newData, "order", Id);
                }catch{
                    alert("올바른 접근이 아닙니다.")
                }
            }
            load()
        }
    }, [orderData])

    if(!orderData){
        return <div>loading...</div>
    }
    return(
        <>
        <div id="PaySuccess" className="pay-container">
            <img src="/img/check-blue-spot-ending-frame.png" alt="체크완료" />
            <h2>결제를 완료했어요</h2>
            <ul className="user-info">
                <li><span>상품명</span>{orderData.subject}</li>
                {orderData.option && orderData.option.map((val, index) => {
                    return(
                        <li><span>옵션 {index + 1}</span>{val.optionName}</li>
                    )
                })}
                <li><span>이름</span>{orderData.userName}</li>
                <li><span>연락처</span>{formatPhone(orderData.userPhone)}</li>
                <li><span>주소</span>{orderData.address} {orderData.addressDetail}</li>
                <li><span>결제 금액</span>{Number(searchParams.get("amount")).toLocaleString()}원</li>
            </ul>
            <ul className="link">
                <li><Link to="/">메인화면으로 돌아가기</Link></li>
            </ul>
        </div>
        </>
    )
}

export default PaySuccess;