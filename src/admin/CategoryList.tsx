import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Select, Delete } from "../api/table-api";
import "../css/list.css";

const CategoryList = () => {
    const {data, isLoading, isError, refetch} = useQuery({
        queryKey : ['categoryList'],
        queryFn : () => Select({}, "category")
    })

    const deleteMutation = useMutation({
        mutationFn : (id : string) => Delete(id, "category"),
        onSuccess : () => {
            alert("게시글이 정상적으로 삭제 되었습니다.");
            refetch();
        },
        onError : () => {
            alert("게시글 삭제에 실패했습니다. \n다시 시도해주세요.")
        }
    })

    const handleDelete = (id : string) => {
        const CkDelete = confirm("해당 게시글을 삭제하시겠습니까? \n삭제 후 복구는 불가능합니다.");
        if(CkDelete){
            deleteMutation.mutate(id);
        }else{
            return;
        }
    }

    if(!data || isLoading) return <div>로딩중...</div>;
    if(isError) return <div>에러 발생</div>;
    if(!data.data) return <div>로딩중...</div>

    return(
        <div id="CategoryList" className="admin-page list">
            <h1>카테고리 관리</h1>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th className="number">번호</th>
                            <th>메뉴명</th>
                            <th className="cate">카테고리</th>
                            <th className="edit">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="no-data">카테고리가 없습니다.</td>
                            </tr>
                        ) : (
                            data.data.map((val: any, index: number) => {
                                const cate = val.category.join(', ');
                                return(
                                    <tr key={val.id}>
                                        <td>{index + 1}</td>
                                        <td className="sub">{val.menu}</td>
                                        <td className="category">[ {cate} ]</td>
                                        <td className="edit-wrap">
                                            <ul>
                                                <li><Link to={`/admin/category/write/${val.id}`}>수정</Link></li>
                                                <li><button onClick={() => handleDelete(val.id)}>삭제</button></li>
                                            </ul>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <ul className="admin-btn">
                <li><Link to="/admin/category/write">카테고리 작성</Link></li>
            </ul>
        </div>
    )
}

export default CategoryList;