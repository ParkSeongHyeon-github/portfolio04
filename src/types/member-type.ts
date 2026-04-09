export interface RegisterProps{
    id : string,
    memberId : string,
    memberPw : string,
    memberLevel : number,
    memberEmail : string,
    memberName : string,
    memberPhone : string
}

export interface LoginProps{
    loginId : string,
    loginPw: string
}

export type RegisterWriteProps = Omit<RegisterProps, "id">