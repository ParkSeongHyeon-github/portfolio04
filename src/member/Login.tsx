const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { LoginProps } from '../types/member-type';
import "./member.css";

interface MemberProps {
    setMbId : (user : string) => void
}

const Login = ({setMbId} : MemberProps) => {
    const nav = useNavigate();
    const {register, handleSubmit} = useForm<LoginProps>();
    const loginMutation = useMutation({
        mutationFn : async(data : LoginProps) => {
            const res = await fetch(baseUrl + `/member?memberId=${data.loginId}&memberPw=${data.loginPw}`)
            if(!res.ok){
                throw new Error("서버 접속 실패")
            }
            return await res.json();
        },
        onSuccess : (res) => {
            if(res.length === 0){
                alert("아이디 또는 비밀번호가 올바르지 않습니다.")
                return;
            }else{
                localStorage.setItem("mb_id", res[0]['memberId']);
                setMbId(res[0]['memberId']);
                alert("로그인 성공")
                nav("/");
            }
        },
        onError : () => {
            alert("로그인 중 오류가 발생했습니다.")
        }
    })

    const Upload = (data : LoginProps) => {
        loginMutation.mutate(data);
    }

    return(
        <div id="login" className="page">
            <h1>MEMBER LOGIN</h1>
            <form onSubmit={handleSubmit(Upload)}>
                <label htmlFor="login_id" className="sound_only">아이디</label>
                <input type="text" {...register("loginId", {required : true})} placeholder="아이디" />
                <label htmlFor="login_password" className="sound_only">비밀번호</label>
                <input type="password" {...register("loginPw", {required : true})} placeholder="비밀번호"/>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default Login;