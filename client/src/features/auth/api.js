import http, { authHttp } from "../../shared/api/http";

export const signupApi = (payload) => authHttp.post("/api/auth/signup", payload);
export const loginApi = (payload) => authHttp.post("/api/auth/login", payload);
export const logoutApi = () => authHttp.post("/api/auth/logout");
export const refreshApi = () => authHttp.post("/api/auth/refresh");
export const resendVerificationApi = (payload) =>
  http.post("/api/auth/resend-verification", payload);
export const forgotPasswordApi = (payload) =>
  http.post("/api/auth/forgot-password", payload);
export const resetPasswordApi = (payload) =>
  http.post("/api/auth/reset-password", payload);
export const verifyEmailApi = (params) =>
  http.get("/api/auth/verify-email", { params });
