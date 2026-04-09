import { Link } from "react-router-dom";

const PayFail = () => {
    return(
        <>
        <div id="PayFail" className="pay-container">
            <img src="/img/fail-img.png" alt="" />
            <h2>결제를 실패했어요</h2>
            <p>동일한 오류로 접근이 불가능 할 시<br />
                관리자에게 문의 부탁드립니다.</p>
            <ul className="link">
                <li><Link to="/">메인화면으로 돌아가기</Link></li>
            </ul>
        </div>        
        </>
    )
}

export default PayFail;