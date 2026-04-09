import { useLocation} from "react-router-dom";
const Footer = () => {
    const Location = useLocation();
    const isAdmin = Location.pathname.startsWith("/admin");

    return(
        <footer id="Footer" className={isAdmin ? "admin-footer" : ''}>
            <div className="footer-inner">
                <div className="footer-info">
                    <h2 className="footer-title">고객센터</h2>
                    <p className="footer-tel">1544-1544</p>
                    <p className="footer-time">운영시간 : 09:00 - 18:00</p>
                    <p className="footer-desc">평일 : 전체 문의 상담</p>
                    <p className="footer-desc">토요일/공휴일 : 일부 상담 제한</p>
                    <p className="footer-desc">일요일 : 휴무</p>
                </div>
                <div className="footer-copy">© 2026 Portfolio Project. All rights reserved.</div>
            </div>
        </footer>
    )
}

export default Footer;