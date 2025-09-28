import http, { authHttp } from "../../shared/api/http";

export const signupApi = (payload) => authHttp.post("/auth/signup", payload);
export const loginApi = (payload) => authHttp.post("/auth/login", payload);
export const logoutApi = () => authHttp.post("/auth/logout");
export const refreshApi = () => authHttp.post("/auth/refresh");
export const resendVerificationApi = (payload) =>
  http.post("/auth/resend-verification", payload);
export const forgotPasswordApi = (payload) =>
  http.post("/auth/forgot-password", payload);
export const resetPasswordApi = (payload) =>
  http.post("/auth/reset-password", payload);
export const verifyEmailApi = (params) =>
  http.get("/auth/verify-email", { params });
