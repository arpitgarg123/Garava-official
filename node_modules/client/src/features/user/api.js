import http from "../../shared/api/http.js";

// User profile APIs (corrected based on backend docs)
export const getMeApi = () => http.get("/user/profile");
export const updateMeApi = (payload) => http.put("/user/profile/update", payload);

// Address APIs (corrected based on backend docs)
export const getAddressesApi = () => http.get("/address/");
export const createAddressApi = (payload) => http.post("/address/create", payload);
export const updateAddressApi = (id, payload) => http.put(`/address/update/${id}`, payload);
export const deleteAddressApi = (id) => http.delete(`/address/delete/${id}`);

// Order APIs (these look correct)
export const getOrdersApi = (params = {}) => http.get("/order", { params });
export const getOrderByIdApi = (id) => http.get(`/order/${id}`);

// Wishlist APIs (corrected based on backend docs)
export const getWishlistApi = () => http.get("/wishlist/");
export const addToWishlistApi = (productId) => http.post(`/wishlist/${productId}`);
export const removeFromWishlistApi = (productId) => http.delete(`/wishlist/${productId}`);
export const toggleWishlistApi = (productId) => http.get(`/wishlist/toggle/${productId}`);

// Auth APIs (corrected based on backend docs)
export const changePasswordApi = (payload) => http.post("/user/change-password", payload);