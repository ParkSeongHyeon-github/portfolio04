import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Insert, SelectOne } from '../api/table-api';
import type { RegisterWriteProps } from '../types/member-type';
import "./member.css";

const Register = () => {
    const nav = useNavigate()
    const [pwCk, setPwCk] = useState<string>('');
    const [idCk, setIdCk] = useState<boolean>(false);
    const {register, handleSubmit, watch} = useForm<RegisterWriteProps>();
    const mbId = watch("memberId");

    const checkMutation = useMutation({
        mutationFn : (memberId : string) => SelectOne({memberId : memberId}, "member"),
        onSuccess : (res) => {
            if(res.length > 0){
                alert("이미 존재하는 아이디입니다.");
                return;
            } else{
                alert("사용 가능한 아이디입니다.");
                setIdCk(true);
            }
        },
        onError : () => {
            alert("확인 실패");
        }
    })

    const checkId = () => {
        if(!mbId){
            alert("아이디를 입력해주세요.");
            return;
        }
        checkMutation.mutate(mbId);
    }

    const signupMutation = useMutation({
        mutationFn : (data : RegisterWriteProps) => {
            const newValue = {...data, memberLevel : 2}
            return Insert(newValue, "member")
        },
        onSuccess : () => {
            alert("회원가입이 완료되었습니다.");
            nav('/login');
        },
        onError : () => {
            alert("회원가입에 실패했습니다.\n다시 시도해주세요.");
        }   
    })

    const Upload = async(data : RegisterWriteProps) => {
        if(!idCk){
            alert("아이디 중복 확인을 진행해주세요.");
            return;
        }
        if(data.memberPw !== pwCk){
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        signupMutation.mutate(data);
    }

    return(
        <div id="register" className="page">
            <h1>SIGN UP <span>회원가입 정보입력</span></h1>
            <form onSubmit={handleSubmit(Upload)} autoComplete='off'>
                <div className="mb info">
                    <h2>사이트 이용정보 입력</h2>
                    <div className="member-id">
                        <label htmlFor="memberId" className="sound_only">아이디</label>
                        <input {...register("memberId", {required : true, onChange: () => setIdCk(false)})} id="memberId" placeholder='아이디'/>
                        <button type="button" className={idCk ? "complete" : ""} onClick={checkId}>{checkMutation.isPending ? "확인중" : idCk ? "확인완료" : "중복확인"}</button>
                    </div>
                    
                    <label htmlFor="memberPw" className="sound_only">비밀번호</label>
                    <input type="password" {...register("memberPw", {required : true}) } id="memberPw"  placeholder="비밀번호 (영문 및 숫자가 포함되어 있어야 합니다.)"/>
                    
                    <label htmlFor="memberPwCk" className="sound_only">비밀번호 확인</label>
                    <input type="password" id="memberPwCk" placeholder="비밀번호 확인" onChange={(e : React.ChangeEvent<HTMLInputElement>) => setPwCk(e.currentTarget.value)} />
                </div>
                <div className="user info">
                    <h2>개인정보 입력</h2>
                    <label htmlFor="memberEmail" className="sound_only">E-mail</label>
                    <input {...register("memberEmail", {required : true}) } id="memberEmail" placeholder="E-mail"/>

                    <label htmlFor="memberName" className="sound_only">성함</label>
                    <input {...register("memberName", {required : true}) } id="memberName" placeholder="성함" />

                    <label htmlFor="memberPhone" className="sound_only">연락처</label>
                    <input {...register("memberPhone", {required : true}) } id="memberPhone" placeholder="연락처" />
                </div>
                <div className="btn-container">
                    <Link to='/'>취소</Link>
                    <button type="submit" disabled={signupMutation.isPending}>{signupMutation.isPending ? "가입중..." : "회원가입"}</button>
                </div>
            </form>
        </div>
    )
}

export default Register;