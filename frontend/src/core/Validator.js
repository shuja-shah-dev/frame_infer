import { useEffect } from "react";
import { useAuth } from "../bin/authProvider";
import { Navigate, Outlet } from "react-router-dom";

const Validator = ({ children }) => {
  const { accessToken } = useAuth();
  useEffect(() => {}, [accessToken]);
  return accessToken ? children : <Navigate to="/login" replace={true} />;
};
export default Validator;
