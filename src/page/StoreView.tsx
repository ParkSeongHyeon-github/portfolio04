import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SelectOne, Insert } from "../api/table-api";
import { Swiper, SwiperSlide } from "swiper/react";
import type { StoreWriteProps, OptionProps } from "../types/store-type";
import { Minus, Plus , X } from "react-feather";
import StoreUserInfo from "./StoreUserInfo";
import StorePay from "./StorePay";
import "../css/page.css"

const StoreView = () => {
    const {store_id} = useParams();
    const {data} = useQuery({
        queryKey : ['storeview'],
        queryFn : () => SelectOne({Id : store_id}, "products")
    })

    const [optionList, setOptionList] = useState<OptionProps[]>([]);
    const [orderId, setOrderId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [payResult, setPayResult] = useState<boolean>(false);

    const {register, handleSubmit, setValue, watch} = useForm<StoreWriteProps>();
    const orderName = watch("userName");

    const ChangeOption = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const {name} = e.currentTarget;
        const Cate = e.currentTarget.dataset.cate;
        const Name = e.currentTarget.selectedOptions[0].dataset.name;
        const Price = e.currentTarget.selectedOptions[0].dataset.price;
        if(Name === undefined || Price === undefined){
            return;
        }if(name === 'multi'){
            const ckDuplication = optionList.find((val) => val.optionName === Name);
            if(ckDuplication){
                alert("이미 선택된 옵션입니다.");
                return;
            }
            setOptionList(prev => [...prev, {option : String(Cate), basicPrice : Number(Price), optionName : String(Name), optionPrice : Number(Price), optionQuantity : 1}])
        }else{
            setOptionList(prev => {
                const multiOptions = prev.filter(val => val.option === "추가상품 (선택)");
                const others = prev.filter(val => val.option !== "추가상품 (선택)" && val.option !== Cate);
                return [
                    ...multiOptions,
                    ...others,
                    {
                        option: String(Cate),
                        basicPrice: Number(Price),
                        optionName: String(Name),
                        optionPrice: Number(Price),
                        optionQuantity: 1
                    }
                ];
            });
        }
        e.currentTarget.selectedIndex = 0;
    }

    const optionPlus = (index : number) => {
        setOptionList(prev => prev.map((val, i) => i === index 
        ? {...val, optionQuantity : val.optionQuantity + 1, optionPrice : val.basicPrice * (val.optionQuantity + 1) } : val))
    }

    const optionMinus = (index : number) => {
        if(optionList[index].optionQuantity === 1){
            alert("1 ~ 999개까지만 선택 가능합니다.");
            return;
        }
        setOptionList(prev => prev.map((val, i) => i === index 
        ? {...val, optionQuantity : val.optionQuantity - 1, 
            optionPrice : val.optionPrice - (val.basicPrice) } : val))
    }

    const optionDelete = (index : number) => {
        setOptionList(prev => prev.filter((_, i) => i !== index))
    }

    const checkRequiredOptions = () => {
        const requiredOptions = data.option.filter((val: any) => val.optionCate !== "추가상품 (선택)");
        const selectedOptions = optionList.map((val) => val.option);
        const isValid = requiredOptions.every((val: any) =>
            selectedOptions.includes(val.optionCate)
        );
        return isValid;
    };

    const StoreMutation = useMutation({
        mutationFn : (data : StoreWriteProps) => Insert(data, "order"),
        onSuccess : (res) => {
            setOrderId(String(res.id));
            setPayResult(true);
            setIsOpen(false)
        },
        onError : () => {
            alert("주문에 실패했습니다. \n다시 시도해 주세요.");
        }
    })

    const Upload = (data : StoreWriteProps) => {
        const newValue = {...data, option : optionList}
        StoreMutation.mutate(newValue);
    }

    const deliveryPay = data?.delivery !== '무료배송' ? Number(data?.delivery) : 0;
    const totalPrice = optionList.reduce((acc, cur) => {
        return acc + cur.optionPrice;
    }, 0);

    useEffect(() => {
        if (!data) return;
        setValue("totalprice", totalPrice + deliveryPay);
    }, [data, totalPrice, deliveryPay]);

    if(!data){
        return <div>로딩중...</div>
    }

    return(
        <div id="StoreView">
            {payResult && <StorePay orderId={orderId} orderSub={data.subject} orderName={orderName} Price={totalPrice + deliveryPay} onClose={() => setPayResult(false)} />}
            <form onSubmit={handleSubmit(Upload)}>
                {isOpen && (
                    <StoreUserInfo 
                        register={register}
                        setValue={setValue}
                        onClose={() => setIsOpen(false)}
                        totalPrice={totalPrice}
                        delivary={deliveryPay}
                        optionList={optionList}
                    />
                )}
                <input type="hidden" {...register("category", {required : true})} value={data.category} />
                <input type="hidden" {...register("subject", {required : true})} value={data.subject} />
                <input type="hidden" {...register("delivery", {required : true})} value={data.delivery} />
                <input type="hidden" {...register("totalprice", { required: true })} />
                <div className="top">
                    <div className="left">
                        <Swiper>
                            {data.Image.map((val : any) => {
                                return(
                                    <SwiperSlide key={val}>
                                        <img src={`/img/product/${val}`} alt={val} />
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                    <div className="right">
                        <div className="cate"><Link to="/">{data.category}</Link></div>
                        <h2>{data.subject}</h2>
                        <div className="cost">
                            <div className="discount">
                                <span>{Math.floor((Number(data.cost) - Number(data.price)) / Number(data.cost) * 100)}%</span>
                                <span>{Number(data.cost).toLocaleString()}원</span>
                            </div>
                            <div className="price">{Number(data.price).toLocaleString()}원</div>
                        </div>
                        <div className="delivery">
                            <span>배송</span>
                            <ul>
                                <li>
                                    {data.delivery === '무료배송' ? '무료배송' : `${Number(data.delivery).toLocaleString()}원 선결제`}
                                </li>
                                <li>업체직접배송</li>
                                <li>제주도/도서산간 지역 배송 불가</li>
                            </ul>
                        </div>
                        <div className="option">
                            {data.option.map((val : any, index : number) => {
                                return(
                                    <div key={val.optionCate}>
                                        <span className="select-arrow"></span>
                                        <label htmlFor={`option${index}`}></label>
                                        <select name={val.optionCate !== '추가상품 (선택)' ? val.optionCate : 'multi'} id={`option${index}`} data-cate={val.optionCate} onChange={ChangeOption}>
                                            <option value="">{val.optionCate}</option>
                                            {val.optionVal.map((val : any, index : number) => {
                                                return(
                                                    <option value={val.optionName} key={index} data-name={val.optionName} data-price={val.optionPrice}>
                                                        {val.optionName} ({Number(val.optionPrice).toLocaleString()}원)
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                )
                            })}
                            <div className="select-option">
                                {optionList.map((val, index) => {
                                    return(
                                        <div key={val.optionName}>
                                            <button type="button" className="x-btn">
                                                <span onClick={() => optionDelete(index)}><X size={16}/></span>
                                            </button>
                                            <p className="selectItem">{val.option}: {val.optionName}</p>
                                            <div className="option-btn-wrap">
                                                <div className="qu">
                                                    <button type="button" onClick={() => optionMinus(index)}><Minus size={16} /></button>
                                                    <div>{val.optionQuantity}</div>
                                                    <button type="button" onClick={() => optionPlus(index)}><Plus size={16} /></button>
                                                </div>
                                                <div className="option-price">{Number(val.optionPrice).toLocaleString()}원</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="totalPrice">주문금액 <span>{totalPrice.toLocaleString()}원</span></div>
                        <ul className="btn-wrap">
                            <li><button type="button" onClick={() => {if (!checkRequiredOptions()) {alert("필수 옵션을 모두 선택해주세요.");return;}setIsOpen(true);}}>바로구매</button></li>
                        </ul>
                    </div>
                </div>
            </form>
            <div className="bottom">
                <nav className="nav">
                    <div className="bg"></div>
                    <div className="item">상품정보</div>
                </nav>
                <div className="content">
                    {data.content !== '' && (
                        <div>{data.content}</div>
                    )}
                    {data.contentImage && (
                        <img src={`/img/product/${data.contentImage}`} alt="상세이미지" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default StoreView;