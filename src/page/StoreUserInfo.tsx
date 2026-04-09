import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import type { OptionProps } from '../types/store-type';
import { X } from 'react-feather';
type Props = {
    register : any,
    setValue : any,
    onClose: () => void,
    totalPrice: number,
    delivary : number,
    optionList: OptionProps[]
};

const StoreUserInfo = ({ register, setValue, onClose, totalPrice, delivary, optionList }: Props) => {
    const [address, setAddress] = useState<string>('');
    const [zoneCode, setZoneCode] = useState<string>('');
    const [postView, setPostView] = useState<boolean>(false);

   const handleComplete = (data: any) => {
        setAddress(data.address);
        setZoneCode(data.zonecode);

        setValue("zonecode", data.zonecode);
        setValue("address", data.address);
    };

    return(
       <div className="modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}><X/></button>
                <h3>주문 정보</h3>
                <div className="item">
                    <label htmlFor='userName' className='sound_only'>이름</label>
                    <input type="text" {...register("userName", {requierd : true})} id="userName" placeholder='이름'/>
                </div>
                <div className="item">
                    <label htmlFor='userPhone' className='sound_only'>연락처</label>
                    <input type="text" {...register("userPhone", {requierd : true})} id="userPhone" placeholder='연락처'/>
                </div>
                <div className="input-wrap">
                    <button type="button" className="add-btn" onClick={() => setPostView(prev => !prev)}>주소 검색</button>
                    <label htmlFor="land_postcode" className="sound_only">우편번호</label>
                    <input type="text" {...register("zonecode", {requierd : true})} value={zoneCode} id="land_postcode" className="input postcode" readOnly placeholder='우편번호'/>
                    <label htmlFor="land_add" className="sound_only">주소</label>
                    <input type="text" {...register("address", {requierd : true})} value={address} id="land_add" className="input add" readOnly placeholder='주소를 검색해주세요'/>
                    <label htmlFor="land_add_detail" className="sound_only">주소</label>
                    <input type="text" {...register("addressDetail")} id="land_add_detail" className="input add_detail" placeholder='상세주소를 입력해주세요.'/>
                </div>
                {postView && <DaumPostcode onComplete={handleComplete}/>}
                <ul className="option">
                    {optionList.map((val) => {
                        return(
                            <li key={val.optionName}>
                                <p>{val.option} - {val.optionName}</p>
                                <div>
                                    <div><span>수량 : </span>{val.optionQuantity}</div>
                                    <div className='option-price'>{val.optionPrice.toLocaleString()}원</div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <ul className="price">
                    <li><span>주문 금액</span>{totalPrice.toLocaleString()}원</li>
                    <li><span>배달비</span>{delivary.toLocaleString()}원</li>
                    <li><span>총 금액</span>{Number(totalPrice + delivary).toLocaleString()}원</li>
                </ul>
                <button type="submit" className='submit-btn'>결제하기</button>
            </div>
        </div>
    )
}

export default StoreUserInfo;