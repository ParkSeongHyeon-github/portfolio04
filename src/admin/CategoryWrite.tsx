import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus } from "react-feather";
import { Insert, SelectOne, Update } from "../api/table-api";
import type { CategoryWriteProps } from "../types/admin-type";
import "../css/write.css";

const CategoryWrite = () => {
    const menuArr = ['상품등록'];

    const {cate_id} = useParams();
    const nav = useNavigate();
    const [category, setCategory] = useState<string[]>(['']);
    const {register, handleSubmit, reset} = useForm<CategoryWriteProps>();

    const ChangeCate = (index : number, value : string) => {
        setCategory(prev => {
            const copy = [...prev];
            copy[index] = value;
            return copy
        })
    } 

    const PlusCate = () => {
        setCategory(prev => [...prev, '']);
    }

    const MinusCate = (index : number) => {
        setCategory(prev => prev.filter((_, idx) => idx !== index));
    }

    const CateMutation = useMutation({
        mutationFn : async (data : CategoryWriteProps) => {
            if(!cate_id){
                const isDuplicate = await SelectOne({menu : data.menu}, "category");
                if(isDuplicate.length > 0){
                    throw new Error("해당 메뉴명관리가 이미 존재합니다.");
                }
                return Insert(data, "category");
            }else{
                return Update(data, "category", cate_id);
            }
        },
        onSuccess : () => {
            if(!cate_id){
                alert("카테고리가 정상적으로 등록되었습니다.");
            }else{
                alert("카테고리가 정상적으로 수정되었습니다.");
            }
            nav("/admin/category/list");
        },
        onError : (error : any) => {
            if(error){
                alert(error.message);
            }else{
                alert("등록에 실패했습니다. \n다시 시도해 주세요.");
            }
        }
    })

    const Upload = (data : CategoryWriteProps) => {
        const newData = {...data, category : category};
        CateMutation.mutate(newData);
    }

    useEffect(() => {
        if(cate_id){
            const load = async() => {
                try{
                    const editData = await SelectOne({Id : cate_id}, "category");
                    reset(editData)
                    setCategory(editData.category)
                }catch{
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [cate_id])

    return(
        <div id="CategoryWrite" className="admin-page write">
            <h1>카테고리 등록</h1>
            <form onSubmit={handleSubmit(Upload)} autoComplete="off">
                <div className="item">
                    <label htmlFor="menu">메뉴명</label>
                    <select {...register("menu")} id="menu" className="input">
                        <option value="">메뉴명을 선택해 주세요.</option>
                        {menuArr.map((val) => {
                            return(
                                <option value={val} key={val}>{val}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="item">
                    <p className="label">카테고리명</p>
                    <div className="cate">
                    {category.map((val, index) => {
                        return(
                            <div key={index}>
                                <label htmlFor={`category${index + 1}`} className="sound_only">카테고리</label>
                                <input type="text" value={val} id={`category${index + 1}`} className="input" onChange={(e : React.ChangeEvent<HTMLInputElement>) => ChangeCate(index, e.currentTarget.value)} />
                                {category.length > 1 && (
                                <button type="button" className="minus-btn" onClick={() => MinusCate(index)} ><Minus size={14}/></button>
                                )}
                            </div>
                        )
                    })}
                    </div>
                    <button type="button" className="plus-btn" onClick={PlusCate}><Plus size={16}/></button>
                </div>
               <ul className="btn-wrap">
                    <li><button type="submit" className="submit-btn">카테고리명 등록</button></li>
                    <li><Link to='/admin/category/list'>목록</Link></li>
                </ul>
            </form>
        </div>
    )
}

export default CategoryWrite;