import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select } from "../../api/table-api";
import img1 from "./img/section01_img01.jpg";
import img2 from "./img/section01_img02.jpg";
import img3 from "./img/section01_img03.jpg";

const Section01 = () => {
    const {data} = useQuery({
        queryKey : ['catelist'],
        queryFn : () => Select({}, "category")
    })
    const cateList : string[] = data?.data[0].category;
    if(!data){
        return <div>로딩중...</div>
    }
    return(
        <div id="Section01">
            <div className="cate">
                <h2>카테고리별 상품찾기</h2>
                <div className="cate-wrap">
                {cateList.map((val) => {
                    return(
                        <div key={val}>
                            <Link to={`/store/list?category=${val}`}>
                                <img src={`/img/cate/${val}.png`} alt={val} />
                                <h3>{val}</h3>
                            </Link>
                        </div>
                    )
                })}
                </div>
            </div>
            <div className="review">
                <h2>유저들의 인테리어 시공 리뷰</h2>
                <div className="review-wrap">
                    <div>
                        <img src={img1} alt="코드디자인인테리어" />
                        <div>
                            <h3>코드디자인인테리어</h3>
                            <p className="pl">제가 여러 업체 실측&상담을 한 끝에 디자인 코드를 선택했습니다
                            모든면에서 다 좋았지만!
                            정해진 예산에 최대한으로 맞춰 도와주셨구
                            무엇보다 소통이 정말 잘됐습니다
                            전체공사라 의논할게 정말 많았는데 밤낮 가리지않고
                            소통을 잘 해주셔서 정말 만족스러운 결과물이 나왔습니다
                            제 지인들께도 무조건 추천 할꼬에욧</p>
                        </div>
                    </div>
                    <div>
                        <img src={img2} alt="요즘인테리어" />
                        <div>
                            <h3>요즘인테리어</h3>
                            <p className="pl">저희는 구축 아파트를 계약해서 
                            무조건 올수리 인테리어를 생각했던 예비 신혼 부부입니다 
                            여러 업체를 상담했지만 인테리어는 처음이라 판단이 잘 안섰는데 
                            현실적으로 실현 가능한 인테리어를 고민해주시고 소통도 가장 잘된다고 
                            느꼈던 대표님과 최종 계약을 진행했습니다 
                            결과적으로는 기대하던 것 보다도 훨씬 인테리어가 잘 나와서 너무나도 만족스럽습니다☺️</p>
                        </div>
                    </div>
                    <div>
                        <img src={img3} alt="ABLY_design" />
                        <div>
                            <h3>ABLY_design</h3>
                            <p className="pl">구○빈 팀장님께서 소통도 원할히 잘 해주시고 젊은 감각으로  
                            이런저런 부자재들을 트렌디한 것으로 잘 추천해주셨습니다. 
                            첫 미팅때부터 3D 도면 준비해서 설명해주시니 이해도 잘 되고 
                            저희 예산에 최대한 맞춰주시려고 애쓰셨습니다. 
                            공사 후에도 A/S 요청 편히 받아주시고 최대한 불편함 없도록 신경써 주셨습니다. </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Section01;