import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SelectOne, Insert, Update } from "../api/table-api";
import { Plus, Minus } from "react-feather";
import { ChangeNumber } from "../utils/number";
import type { ProductWriteProps, ProductOptionProps } from "../types/admin-type";

const ProductWrite = () => {
    const {product_id} = useParams();
    const nav = useNavigate();
    const [optionCateVal, setOptionCateVal] = useState<string>('');
    const [optionCate, setOptionCate] = useState<string[]>([]);
    const [option, setOption] = useState<ProductOptionProps[]>([]);
    const [contentImg ,setContentImg] = useState<string>('');
    const [Img, setImg] = useState<string[]>([]);
    const {register, handleSubmit, reset} = useForm<ProductWriteProps>();

    const {data, isLoading, isError} = useQuery({
        queryKey : ['categoryList'],
        queryFn : () => SelectOne({menu : "상품등록"}, "category")
    })

    const PlusOptionCate = () => {
        if(!optionCateVal){
            alert("옵션 분류명을 먼저 입력해 주세요.");
            return;
        }
        setOptionCate(prev => [...prev, optionCateVal])
        setOption(prev => [...prev, {
            optionCate : optionCateVal,
            optionVal : [{
                optionName : '',
                optionPrice : 0
            }]
        }])
        setOptionCateVal('');
    }

    const MinusOptionCate = (cate : string, index : number) => {
        setOptionCate(prev => prev.filter(val => val !== cate));
        setOption(prev => prev.filter((_, i) => i !== index));
    }

    const PlusOption = (optionCate : string) =>{
        setOption(prev => prev.map(val => val.optionCate === optionCate 
            ? {...val, optionVal : [...val.optionVal, {optionName : '', optionPrice : 0}]} : val
        ))
    }

    const MinusOption = (index : number, cate : string) => {
        setOption(prev => prev.map((val) => val.optionCate === cate ? {...val, optionVal : val.optionVal.filter((_, i) => i !== index)} : val))
    }

    const ChangeOption = (cateIndex: number, valIndex: number, key: 'optionName' | 'optionPrice', value: string | number) => {
        setOption(prev => 
            prev.map((cate, i) => i === cateIndex 
            ? {...cate, optionVal : cate.optionVal.map((val, j) => j === valIndex 
            ? {...val, [key] : value} 
            : val)} 
            : cate));
    }

    const productMutation = useMutation({
        mutationFn : (data : ProductWriteProps) => {
            if(!product_id){
                return Insert(data, "products")
            }else{
                return Update(data, "products", product_id)
            }
        },
        onSuccess : () => {
            if(!product_id){
                alert("상품이 정상적으로 등록되었습니다.");
            }else{
                alert("상품이 정상적으로 수정되었습니다.");
            }
            nav("/admin/product/list");
        },
        onError : () => {
            alert("등록에 실패했습니다. \n다시 시도해 주세요.");
        }
    })

    const onSubmit = async(data : ProductWriteProps) => {
        const contentImage = data.contentImage as any;
        const ImageFiles = data.Image as any;

        const newValue = {
            ...data,
            option,
            contentImage: contentImage?.[0]?.name || contentImg,
            Image:
                ImageFiles && ImageFiles.length > 0
                    ? typeof ImageFiles[0] === "string"
                        ? ImageFiles
                        : Array.from(ImageFiles).map((file: any) => file.name)
                    : Img
        };
        productMutation.mutate(newValue)
    }

    useEffect(() => {
        if(product_id){
            const load = async() => {
                try{
                    const result = await SelectOne({Id : product_id}, "products");
                    reset(result);
                    setOptionCate(result.option.map((val : any) => val.optionCate))
                    setOption(result.option);
                    setContentImg(result.contentImage)
                    setImg(result.Image.map((val : any) => val))
                }catch{
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [product_id])

    if(!data || isLoading) return <div>로딩중...</div>;
    if(isError) return <div>에러 발생</div>;

    return(
        <div id="ProductWrite" className="admin-page write">
            <h1>상품 등록</h1>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="item">
                    <label htmlFor="category">카테고리</label>
                    <select {...register("category", {required : true})} id="category" className="input">
                        <option value="">분류를 선택해 주세요.</option>
                        {data?.[0]?.category?.map((val : string) => {
                            return(
                                <option value={val} key={val}>{val}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="subject">상품명</label>
                    <input type="text" {...register("subject", {required : true})} id="subject" className="input full" />
                </div>
                <div className="item">
                    <label htmlFor="cost">원가</label>
                    <div>
                        <input type="text" {...register("cost", {required : true})} id="cost" className="input" onInput={ChangeNumber} />원
                    </div>
                </div>
                <div className="item">
                    <label htmlFor="price">판매가</label>
                    <div>
                        <input type="text" {...register("price", {required : true})} id="price" className="input" onInput={ChangeNumber} />%
                    </div>
                </div>
                <div className="item">
                    <label htmlFor="delivery">배송정보</label>
                    <input type="text" {...register("delivery", {required : true})} id="delivery" className="input half" placeholder="무료배송 또는 배송비를 입력해주세요." />
                </div>
                <div className="item">
                    <label htmlFor="optionInfo">옵션정보</label>
                    <input type="text" value={optionCateVal} id="optionInfo" className="input half" placeholder="설정 할 옵션 분류명(사이즈, 컬러...)을 입력 후 추가버튼을 눌러주세요." onChange={(e : React.ChangeEvent<HTMLInputElement>) => setOptionCateVal(e.currentTarget.value)} />
                    <button type="button" className="plus-btn"><Plus size={16} onClick={PlusOptionCate}/></button>
                </div>
                {optionCate.map((cate: string, index : number) => {
                    const current = option.find(opt => opt.optionCate === cate);
                    return (
                        <div className="item" key={cate}>
                            <p className="label">{cate}</p>
                            <div className="cate">
                                {current?.optionVal.map((val, index) => (
                                    <div key={index}>
                                        <label htmlFor={`option${index}`} className="sound_only">옵션명</label>
                                        <input type="text" value={val.optionName} id={`option${index}`} className="input" placeholder="옵션명" onChange={e => ChangeOption(optionCate.indexOf(cate), index, 'optionName', e.target.value)} />
                                        <label htmlFor={`price${index}`} className="sound_only">옵션가격</label>
                                        <input type="text" value={val.optionPrice} id={`price${index}`} className="input" placeholder="옵션가격" onInput={ChangeNumber} onChange={e => ChangeOption(optionCate.indexOf(cate), index, 'optionPrice', Number(e.target.value))} />
                                        {current?.optionVal.length > 1 && (
                                        <button type="button" className="minus-btn" onClick={() => MinusOption(index, cate)}><Minus size={14}/></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="cate-minus-btn" onClick={() => MinusOptionCate(cate, index)}><Minus size={16}/></button>
                            <button type="button" className="plus-btn" onClick={() => PlusOption(cate)}><Plus size={16}/></button>
                        </div>
                    )
                })}
                <div className="item">
                    <label htmlFor="content">상세정보</label>
                    <textarea {...register("content")} id="content" placeholder="상세정보를 입력해 주세요. 파일로 업로드할 경우 아래 상세정보 이미지를 통하여 파일을 업로드해 주세요." className="input full"></textarea>
                </div>
                <div className="item">
                    <label htmlFor="contentImage">상세정보 이미지</label>
                    <div className="file-container">
                        <input type="file" {...register("contentImage")} id="contentImage" className="input file" />
                        {contentImg && (
                            <div>현재 파일명 : {contentImg}</div>
                        )}
                    </div>

                </div>
                <div className="item">
                    <label htmlFor="Image">상품 이미지</label>
                    <div className="file-container">
                        <input type="file" multiple {...register("Image")} id="Image" className="input file" />
                        {Img && (
                            <div>현재 파일명 : {Img.join(', ')}</div>
                        )}
                    </div>
                </div>
                <ul className="btn-wrap">
                    <li><button type="submit" className="submit-btn">상품 등록</button></li>
                    <li><Link to='/admin/product/list'>목록</Link></li>
                </ul>
            </form>
        </div>
    )
}

export default ProductWrite;