import { Navigate, Outlet } from "react-router-dom";
import type { RegisterProps } from "../types/member-type";

interface Props {
  mbData : RegisterProps | null,
  ready : boolean
}

const AdminRoute = ({mbData, ready }: Props) => {
  if(!ready || !mbData){
    return;
  }
  if (mbData.memberLevel !== 10) {
    alert("올바른 접근이 아닙니다.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;