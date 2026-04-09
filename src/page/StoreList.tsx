import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select } from "../api/table-api";
import "../css/page.css"

const StoreList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const curpage = Number(searchParams.get("page")) || 1;
    const curCate = searchParams.get("category") || '';
    const curSearch = searchParams.get("search") || '';
    const [totalCount , setTotalCount] = useState<number>(1);
    
    const limit = 24;
    
    const {data : cateData} = useQuery({
        queryKey : ['catelist'],
        queryFn : () => Select({}, "category")
    })
    const cateList : string[] = cateData?.data[0].category;

    const {data : storeData} = useQuery({
        queryKey : ['storelist', curCate, curpage, curSearch],
        queryFn : () => Select({page : curpage, limit : limit, cate : String(curCate), subject : curSearch}, "products")
    })

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
    
    useEffect(() => {
        if(storeData){
            setTotalCount(Math.ceil(storeData.totalCount / limit))
        }
    }, [storeData])

    if(!cateData || !storeData){
        return <div>로딩중...</div>
    }

    return(
        <div id="StoreList">
            <h2>카테고리</h2>
            <div className="cate-wrap">
                {cateList.map((val) => {
                    return(
                        <div key={val}>
                            <Link to={`/store/list?category=${val}`}>
                                <img src={`/img/cate/${val}.png`} alt={val} />
                                <h3 className={curCate === val ? 'on' : ''}>{val}</h3>
                            </Link>
                        </div>
                    )
                })}
            </div>
            <div className="item-wrap">
                {storeData.data.length === 0 ? (
                    <div className="no-data">상품이 없습니다.</div>
                ) : (
                    storeData.data.map((val: any) => {
                        return(
                            <div key={val.id}>
                                <Link to={`/store/view/${val.id}`}>
                                    <img src={`/img/product/${val.Image[0]}`} alt="" />
                                    <h3>{val.subject}</h3>
                                    <div className="price">
                                        <span>{Math.floor((Number(val.cost) - Number(val.price)) / Number(val.cost) * 100)}%</span>
                                        {Number(val.price).toLocaleString()}원
                                    </div>
                                    <div className="delivery">
                                        {val.delivery === '무료배송' ? '무료배송' : '배송비 별도'}
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                )}
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

export default StoreList;