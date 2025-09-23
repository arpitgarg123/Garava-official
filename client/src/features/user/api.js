import http from "../../shared/api/http.js";

// User profile APIs (corrected based on backend docs)
export const getMeApi = () => http.get("/api/user/profile");
export const updateMeApi = (payload) => http.put("/api/user/profile/update", payload);

// Address APIs (corrected based on backend docs)
export const getAddressesApi = () => http.get("/api/address/");
export const createAddressApi = (payload) => http.post("/api/address/create", payload);
export const updateAddressApi = (id, payload) => http.put(`/api/address/update/${id}`, payload);
export const deleteAddressApi = (id) => http.delete(`/api/address/delete/${id}`);

// Order APIs (these look correct)
export const getOrdersApi = (params = {}) => http.get("/api/order", { params });
export const getOrderByIdApi = (id) => http.get(`/api/order/${id}`);

// Wishlist APIs (corrected based on backend docs)
export const getWishlistApi = () => http.get("/api/wishlist/");
export const addToWishlistApi = (productId) => http.post(`/api/wishlist/${productId}`);
export const removeFromWishlistApi = (productId) => http.delete(`/api/wishlist/${productId}`);
export const toggleWishlistApi = (productId) => http.get(`/api/wishlist/toggle/${productId}`);

// Auth APIs (corrected based on backend docs)
export const changePasswordApi = (payload) => http.post("/api/user/change-password", payload);