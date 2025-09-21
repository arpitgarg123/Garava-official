import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
  const token = useSelector((s) => s.auth?.accessToken);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
};

export const GuestOnly = () => {
  const token = useSelector((s) => s.auth?.accessToken);
  if (token) return <Navigate to="/" replace />;
  return <Outlet />;
};