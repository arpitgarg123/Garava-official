// src/features/product/api.js
import http from "../../shared/api/http.js";

// IMPORTANT: use the canonical server path. Backend shows /api/products
export const listProductsApi = (params = {}) =>
  http.get("/product", { params });

export const getProductBySlugApi = (slug) =>
  http.get(`/product/${encodeURIComponent(slug)}`);

export const getProductByIdApi = (id) =>
  http.get(`/product/id/${encodeURIComponent(id)}`);

export const getProductBySkuApi = (sku) =>
  http.get(`/product/sku/${encodeURIComponent(sku)}`);

export const checkPincodeApi = (body) =>
  http.post("/product/check-pincode", body);
