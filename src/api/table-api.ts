const baseUrl = import.meta.env.VITE_API_BASE_URL;
import type { RegisterWriteProps } from "../types/member-type"
import type { CategoryWriteProps, ProductWriteProps } from "../types/admin-type";
import type { StoreWriteProps } from "../types/store-type";

type ApiData = RegisterWriteProps | CategoryWriteProps | ProductWriteProps | StoreWriteProps

export const Insert = async<Data extends ApiData>(data : Data, table : string) => {
    const res = await fetch(baseUrl + `/${table}`, {
        method : "post",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify(data)
    })
    if(!res.ok){
        throw new Error("서버 접속 실패")
    }
    return  await res.json();
}

export const Update = async<Data extends ApiData>(data : Data, table : string, Id : string) => {
    const res = await fetch(baseUrl + `/${table}/${Id}`, {
        method : "put",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify(data)
    })
    if(!res.ok){
        throw new Error("서버 접속 실패")
    }
    const result = await res.json();
    return  result;
}

export const Select = async (params: {page?: number, limit?: number, subject?: string, cate?: string, userName?: string;} = {},table: string) => {
    const query = new URLSearchParams();

    if (params.page) query.append("_page", String(params.page));
    if (params.limit) query.append("_limit", String(params.limit));

    if (params.subject) query.append("subject_like", params.subject);
    if (params.cate) query.append("category_like", params.cate);
    if (params.userName) query.append("userName_like", params.userName);

    const url = `${baseUrl}/${table}?${query.toString()}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("서버 접속 실패");
    }

    console.log(url);

    const totalCount = res.headers.get("X-Total-Count");
    const data = await res.json();

    return {
        data,
        totalCount: Number(totalCount) || 0,
    };
    };
export const SelectOne = async(params : {Id?:string, memberId?:string, menu?:string} = {}, table : string) => {
    let url = baseUrl + `/${table}`;
    if(params.Id){
        url += `/${params.Id}`
    }
    if(params.memberId){
        url += `?memberId=${params.memberId}`
    }
    if(params.menu){
        url += `?menu=${params.menu}`
    }
    const res = await fetch(url);
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }
    return await res.json();
}

export const Delete = async(Id : string, table : string) => {
    const res = await fetch(baseUrl + `/${table}/${Id}`, {
        method : "delete"
    })
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }
    return await res.json();
}