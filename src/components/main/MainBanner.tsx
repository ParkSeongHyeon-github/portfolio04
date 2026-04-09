import banner1 from "./img/Mainbanner01.jpg";
import banner2 from "./img/Mainbanner02.jpg";
import banner3 from "./img/Mainbanner03.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import '../../../node_modules/swiper/swiper-bundle.css';

const Mainbanner = () => {
    return(
        <div id="MainBanner">
            <Swiper loop={true} speed={1000} spaceBetween={10} autoplay={{ delay: 2500, disableOnInteraction: false }} modules={[Autoplay]} slidesPerView={1}>
                <SwiperSlide>
                    <div>
                        <img src={banner1} alt="" />
                        <h2>제주의 25평 아파트, 발품들인 만큼 만족스러운 반셀프</h2>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div>
                        <img src={banner2} alt="" />
                        <h2>추구미는 따뜻함 우드러버의 로망을 실편한 신혼집</h2>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div>
                        <img src={banner3} alt="" />
                        <h2>화이트톤으로 넓어 보이는 스타일링, 행복주택</h2>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Mainbanner;