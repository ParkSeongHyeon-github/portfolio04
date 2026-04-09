import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Select } from "../../api/table-api";
import { Autoplay } from "swiper/modules";

const Section02 = () => {
    const {data} = useQuery({
        queryKey : ['bestList'],
        queryFn : () => Select({limit : 8}, "products")
    })
    if(!data){
        return <div>로딩중...</div>
    }
    return(
        <div id="Section02">
            <h2>베스트</h2>
            <Swiper 
                loop={true} 
                speed={1000} 
                slidesPerView={3}
                spaceBetween={20} 
                autoplay={{ delay: 2500, disableOnInteraction: false }} 
                modules={[Autoplay]}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    480: { slidesPerView: 1.2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }}
                >
                {data.data.map((val : any) => {
                    return(
                        <SwiperSlide>
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
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}

export default Section02;