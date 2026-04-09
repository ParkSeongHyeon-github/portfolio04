const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Select, Delete } from "../api/table-api";
import { Search, RefreshCw } from "react-feather";
import ProductView from "./ProductView";
import type { ProductProps } from "../types/admin-type";

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const curpage = Number(searchParams.get("page")) || 1;
    const cursub = searchParams.get("subject") || ''

    const [ckView, setCkView] = useState<boolean>(false);
    const [searchSub, setSearchSub] = useState<string>(cursub);
    const [totalCount , setTotalCount] = useState<number>(1);
    const [curData, setCurData] = useState<ProductProps | null>(null);

    const limit = 10;

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey : ['productList', curpage, cursub],
        queryFn : () => Select({page : curpage, limit : limit, subject : searchSub}, "products")
    })

    const deleteMutation = useMutation({
        mutationFn : (id : string) => Delete(id, "products"),
        onSuccess : () => {
            alert("게시글이 정상적으로 삭제 되었습니다.");
            refetch();
        },
        onError : () => {
            alert("게시글 삭제에 실패했습니다. \n다시 시도해주세요.")
        }
    })

    const handleDelete = (id : string) => {
        const CkDelete = confirm("해당 게시글을 삭제하시겠습니까? \n삭제 후 복구는 불가능합니다.");
        if(CkDelete){
            deleteMutation.mutate(id);
        }else{
            return;
        }
    }
    const ChangePage = (pagenum : string) => {
        setSearchParams({page : pagenum})
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

    const SearchSubject = () => {
        setSearchParams({"subject" : searchSub, "page" : "1"});
    } 

    const Refresh = () => {
        setSearchParams({});
        setSearchSub('');
    }

    const ClickInfo = async(id : string) => {
        setCkView(true);
        try{
            const res = await fetch(baseUrl+`/products/${id}`);
            const result = await res.json();
            setCurData(result);
        }catch{
            alert('올바른 접근이 아닙니다.');
        }
    }

    useEffect(() => {
        if(data){
            setTotalCount(Math.ceil(data.totalCount / limit))
        }
    }, [data])

    if(!data || isLoading) return <div>로딩중...</div>;
    if(isError) return <div>에러 발생</div>;

    return(
        <div id="ProductList" className="admin-page list">
            {ckView && <ProductView data={curData} onClose={() => setCkView(false)} />}
            <h1>상품 관리</h1>
            <div className="search"> 
                <div className="search-wrap">
                    <input type="text" value={searchSub} placeholder='검색어를 입력해 주세요.' onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchSub(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {SearchSubject();}}}/>
                    <button type="button" onClick={SearchSubject}><Search size={20}/></button>
                </div>
                <button className="refresh-btn" onClick={Refresh}><RefreshCw size={20}/></button>
            </div>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th className="number">번호</th>
                            <th className="cate">카테고리</th>
                            <th>상품명</th>
                            <th>원가</th>
                            <th>판매가</th>
                            <th>할인율</th>
                            <th>배송정보</th>
                            <th className="edit">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="no-data">상품이 없습니다.</td>
                            </tr>
                        ) : (
                            data.data.map((val: any, index: number) => {
                                return(
                                    <tr key={val.id}>
                                        <td>{index + 1}</td>
                                        <td>{val.category}</td>
                                        <td className="link-td" onClick={() => ClickInfo(val.id)}>{val.subject}</td>
                                        <td>{Number(val.cost).toLocaleString()}원</td>
                                        <td>{Number(val.price).toLocaleString()}원</td>
                                        <td>{Math.floor((Number(val.cost) - Number(val.price)) / Number(val.cost) * 100)}%</td>
                                        <td>{val.delivery === '무료배송' ? '무료배송' : `${Number(val.delivery).toLocaleString()}원` }</td>
                                        <td className="edit-wrap">
                                            <ul>
                                                <li><Link to={`/admin/product/write/${val.id}`}>수정</Link></li>
                                                <li><button onClick={() => handleDelete(val.id)}>삭제</button></li>
                                            </ul>
                                        </td>
                                    </tr>
                                )
                            })
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

export default ProductList;