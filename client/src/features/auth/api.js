import http from "../../shared/api/http";

export const signupApi = (payload) => http.post("/api/auth/signup", payload);
export const loginApi = (payload) => http.post("/api/auth/login", payload);
export const logoutApi = () => http.post("/api/auth/logout");
export const refreshApi = () => http.post("/api/auth/refresh");
export const resendVerificationApi = (payload) =>
  http.post("/api/auth/resend-verification", payload);
export const forgotPasswordApi = (payload) =>
  http.post("/api/auth/forgot-password", payload);
export const resetPasswordApi = (payload) =>
  http.post("/api/auth/reset-password", payload);
export const verifyEmailApi = (params) =>
  http.get("/api/auth/verify-email", { params });
