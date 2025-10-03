import http, { authHttp } from "../../shared/api/http";

export const signupApi = (payload) => authHttp.post("/auth/signup", payload);
export const loginApi = (payload) => authHttp.post("/auth/login", payload);
export const logoutApi = () => authHttp.post("/auth/logout");
export const refreshApi = () => {
  return authHttp.post("/auth/refresh");
};
export const resendVerificationApi = (payload) =>
  http.post("/auth/resend-verification", payload);
export const forgotPasswordApi = (payload) =>
  http.post("/auth/forgot-password", payload);
export const resetPasswordApi = (payload) =>
  http.post("/auth/reset-password", payload);
export const verifyEmailApi = (params) =>
  http.get("/auth/verify-email", { params });

// Google OAuth
export const initiateGoogleAuth = () => {
  // Redirect to Google OAuth endpoint
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  window.location.href = `${backendUrl}/auth/google`;
};
