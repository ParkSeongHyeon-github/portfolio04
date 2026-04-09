import { useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { Search, User, Edit, BarChart, AlignLeft } from "react-feather";
import type { RegisterProps } from "../types/member-type";

interface HeaderProps {
    setMbId : (user : string) => void,
    mbData : RegisterProps | null,
    setMbData : (user : RegisterProps | null) => void
    setReady : (ready : boolean) => void
}

const Header = ({setMbId, mbData, setMbData, setReady} : HeaderProps) => {
    const nav = useNavigate();
    const Location = useLocation();
    const isAdmin = Location.pathname.startsWith("/admin");
    const [search, setSearch] = useState<string>('');

    const Logout = () => {
        setMbData(null);
        localStorage.removeItem("mb_id");
        setMbId('')
        nav('/');
        setReady(false);
    }

    const IntegratedSearch = () => {
        setSearch('');
        nav(`/store/list?search=${search}`);
    }

    if(!isAdmin) {
        return(
            <header className="main">
                <div id="Header">
                    <div className="logo">
                        <Link to="/">SAMPLE</Link>
                    </div>
                    <div className="search">
                        <button onClick={IntegratedSearch}><Search size={18}/></button>
                        <label htmlFor="search" className="sound_only">통합검색</label>
                        <input type="text" value={search} id="search" placeholder="통합검색" onChange={(e : React.ChangeEvent<HTMLInputElement>) => {setSearch(e.target.value)}} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if (e.key === 'Enter') {IntegratedSearch();}}}/>
                    </div>
                    {!mbData && (
                    <ul className="user">
                        <li><Link to="/login">로그인</Link></li>
                        <li><Link to="/register">회원가입</Link></li>
                    </ul>
                    )}
                    {mbData && mbData.memberLevel === 2 && (
                    <ul className="user">
                        <li><Link to="/login">저장</Link></li>
                        <li><button type="button" onClick={Logout}>로그아웃</button></li>
                    </ul>
                    )}
                    {mbData && mbData.memberLevel === 10 && (
                    <ul className="user">
                        <li><Link to="/admin/order/list">관리자</Link></li>
                        <li><button type="button" onClick={Logout}>로그아웃</button></li>
                    </ul>
                    )}
                </div>
            </header>
        )
    }else if(mbData && isAdmin){
        return(
            <header>
                <div id="AdminHeader">
                    <div className="logo">
                        <Link to="/">SAMPLE</Link>
                    </div>
                    <div className="user">
                        <div className="profile"><User /></div>
                        <div className="mbId">{mbData.memberId}</div>
                        <div className="mbName">{mbData.memberName}</div>
                    </div>
                    {mbData && mbData.memberLevel === 10 && (
                    <ul className="cate">
                        <li><Link to="/admin/product/write"><span><Edit size={23}/></span>상품등록</Link></li>
                        <li><Link to="/admin/order/list"><span><BarChart size={23}/></span>주문 관리</Link></li>
                        <li><Link to="/admin/category/write"><span><AlignLeft size={23}/></span>카테고리 관리</Link></li>
                    </ul>
                    )}
                </div>
            </header>
        )
    }

}

export default Header;