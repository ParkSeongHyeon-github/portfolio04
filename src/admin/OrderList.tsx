import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Select, SelectOne } from "../api/table-api";
import { RefreshCw } from 'react-feather';

const OrderList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const curpage = Number(searchParams.get("page")) || 1;

    const [totalCount , setTotalCount] = useState<number>(1);
    const [inputCate, setInputCate] = useState("");
    const [inputProduct, setInputProduct] = useState("");
    const [inputName, setInputName] = useState("");
    const [searchCate, setSearchCate] = useState("");
    const [searchProduct, setSearchProduct] = useState("");
    const [searchName, setSearchName] = useState("");
    const limit = 10;

    const {data : orderData} = useQuery({
        queryKey : ['orderList', curpage, searchCate, searchProduct, searchName],
        queryFn : () => Select({
            page: curpage,
            limit: limit,
            cate: searchCate,
            subject: searchProduct,
            userName: searchName
        }, "order")
    })

    const {data : cateData} = useQuery({
        queryKey : ['cateList'],
        queryFn : () => SelectOne({menu : "상품등록"}, "category")
    })

    const ChangePage = (pagenum: string) => {
        setSearchParams({
            page: pagenum,
            cate: searchCate,
            subject: searchProduct,
            name: searchName
        });
    };

    const handleSearch = () => {
        setSearchCate(inputCate);
        setSearchProduct(inputProduct);
        setSearchName(inputName);

        setSearchParams({
            page: "1",
            cate: inputCate,
            subject: inputProduct,
            name: inputName
        });
    };

    const Reload = () => {
        setSearchParams({ page: "1" });
        setInputCate('');
        setInputProduct('');
        setInputName('');
        setSearchCate('');
        setSearchProduct('');
        setSearchName('');
    }

    const pageGroup = Math.ceil(curpage / 10);
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalCount)

    const pagingArr = Array.from({ length : (endPage - startPage + 1)}, (_,i) => startPage + i);

    const prevGroup = () => {
        if(startPage > 1){
            ChangePage(String(startPage - 1));
        }
    }
    const nextGroup = () => {
        if (endPage < totalCount) {
            ChangePage(String(endPage + 1));
        }
    }

    useEffect(() => {
        if(orderData){
            setTotalCount(Math.ceil(orderData.totalCount / limit))
        }
    }, [orderData])

    if(!orderData || !cateData){
        return<div>로딩중...</div>
    }
    return(
        <div id="OrderList" className="admin-page list">
            <h1>주문 관리</h1>
            <div className="search-head">
                <div className="select-wrap item">
                    <label htmlFor="search-cate">카테고리</label>
                    <select id="search-cate" onChange={(e) => setInputCate(e.target.value)}>
                        <option value="">카테고리 선택</option>
                        {cateData && cateData[0].category?.map((val : any) => {
                            return(
                                <option value={val} key={val}>{val}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="input-wrap item">
                    <label htmlFor="search-product">상품명 검색</label>
                    <input type="text" value={inputProduct} id="search-product" onChange={(e) => setInputProduct(e.target.value)}/>
                </div>
                <div className="input-wrap item">
                    <label htmlFor="search-name">주문자명 검색</label>
                    <input type="text" value={inputName} id="search-name" onChange={(e) => setInputName(e.target.value)}/>
                </div>
                <div className="item btn-wrap">
                    <button type="button" className="search-submit-btn" onClick={handleSearch}>통합검색</button>
                    <button className='refresh-btn' onClick={Reload}><RefreshCw size={18}/></button>
                </div>
            </div>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>카테고리</th>
                            <th>상품명</th>
                            <th>주문자 명</th>
                            <th>결제여부</th>
                            <th>총 금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.data && orderData.data.length > 0 ? (
                            orderData.data.map((val: any, index: number) => {
                                return (
                                    <tr key={val.id}>
                                        <td>{index + 1}</td>
                                        <td>{val.category}</td>
                                        <td className="link-td">
                                            <Link to={`/admin/order/view/${val.id}`}>{val.subject}</Link>
                                        </td>
                                        <td>{val.userName}</td>
                                        <td>{val.orderId ? "결제완료" : "결제대기중"}</td>
                                        <td>{Number(val.totalprice || 0).toLocaleString()}원</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                {startPage > 1 && (
                    <button onClick={prevGroup}>이전</button>
                )}
                {pagingArr.map((val) => (
                    <button key={val} type="button" onClick={() => ChangePage(String(val))} className={val === curpage ? 'active' : ''}>{val}</button>
                ))}
                {endPage < totalCount && (
                    <button onClick={nextGroup}>다음</button>
                )}
            </div>
        </div>
    )
}

export default OrderList;