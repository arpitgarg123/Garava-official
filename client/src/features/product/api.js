// src/features/product/api.js
import http from "../../shared/api/http.js";

// IMPORTANT: use the canonical server path. Backend shows /api/products
export const listProductsApi = (params = {}) =>
  http.get("/api/product", { params });

export const getProductBySlugApi = (slug) =>
  http.get(`/api/product/${encodeURIComponent(slug)}`);

export const getProductBySkuApi = (sku) =>
  http.get(`/api/product/sku/${encodeURIComponent(sku)}`);

export const checkPincodeApi = (body) =>
  http.post("/api/product/check-pincode", body);
