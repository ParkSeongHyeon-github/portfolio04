import { X } from 'react-feather';
import type { ProductProps } from '../types/admin-type';
import "./css/style.css"

interface RoomInfoProps {
    data : ProductProps | null,
    onClose : () => void;
}

const ProductView = ({data, onClose} : RoomInfoProps) => {
    if(!data){
        return <div>로딩중...</div>
    }

    return(
        <div id="ProductView">
            <div className="wrap">
                <button type="button" className="close-btn" onClick={onClose}><X size="30"/></button>
                <div className="top">
                    <div className="left">
                        <img src={`/img/product/${data.Image[0]}`} alt={data.subject}/>
                    </div>
                    <div className="right">
                        <div className="category">{data.category}</div>
                        <div className="subject">{data.subject}</div>
                        <ul>
                            <li><span>원가</span>{Number(data.cost).toLocaleString()}원</li>
                            <li><span>판매가</span>{Number(data.price).toLocaleString()}원</li>
                            <li><span>할인율</span>{Math.floor((Number(data.cost) - Number(data.price)) / Number(data.cost) * 100)}%</li>
                            <li><span>배송정보</span>{data.delivery}</li>
                        </ul>
                    </div>
                </div>
                <div className="bottom">
                    {data?.option.map((val) => {
                        return(
                        <div key={val.optionCate} className="item-wrap">
                            <p>옵션정보 ({val.optionCate})</p>
                            <ul>
                                {val.optionVal.map((val) => {
                                    return(
                                        <li key={val.optionName}><span>{val.optionName}{"\u00A0\u00A0:\u00A0\u00A0"}</span>{val.optionPrice.toLocaleString()}원</li>
                                    )
                                })}
                            </ul>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProductView;