import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { SelectOne } from "../api/table-api";
import "../css/view.css"

const OrderView = () => {
    const {order_id} = useParams()
    const {data} = useQuery({
        queryKey : ['orderList'],
        queryFn : () => SelectOne({Id : order_id}, "order")
    })

    const formatPhone = (num: string) => {
        return num?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };
    
    if(!data){
        return <div>로딩중...</div>
    }

    return(
        <div id="OrderView" className="admin-page view">
            <div className="wrap">
                <div className="title">{data.subject}</div>
                <ul className="user">
                    <li><span>주문자 명</span>{data.userName}</li>
                </ul>
                <ul className="info">
                    <li><span>이름</span>{data.userName}</li>
                    <li><span>연락처</span>{formatPhone(data.userPhone)}</li>
                    <li><span>주소</span>[{data.zonecode}] {data.address} {data.addressDetail}</li>
                    <li><span>배송비</span>{data.delivery === '무료배송' ? "무료배송" : Number(data.delivery || 0).toLocaleString() + '원'}</li>
                    <li><span>총 가격</span>{Number(data.totalprice).toLocaleString()}원</li>
                    <li><span>결제여부</span>{data.orderId ? "결제완료" : "결제대기중"}</li>
                </ul>
                <ul className="option">
                    {data && data.option?.map((val : any, index : number) => {
                        return(
                            <li key={index}>
                                <p>{val.option} - {val.optionName}</p>
                                <div>
                                    <div>수량 : {val.optionQuantity}</div>
                                    <div>가격 {val.optionPrice.toLocaleString()}원</div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <ul className="btn">
                    <li><Link to="/admin/order/list">주문 목록</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default OrderView;