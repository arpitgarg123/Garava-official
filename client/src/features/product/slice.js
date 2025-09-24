// src/features/product/slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listProductsApi,
  getProductBySlugApi,
  getProductBySkuApi,
  checkPincodeApi,
} from "./api.js";

// ---- Async thunks ----

// List products
export const fetchProducts = createAsyncThunk(
  "product/fetchList",
  async (params = {}) => {
    const { data } = await listProductsApi(params);

    // normalize response
    if (Array.isArray(data)) {
      return {
        products: data,
        pagination: {
          total: data.length,
          page: params.page || 1,
          limit: params.limit || 20,
        },
      };
    }

    if (data?.products) {
      return {
        products: data.products,
        pagination: data.pagination || {
          total: data.products.length,
          page: params.page || 1,
          limit: params.limit || 20,
        },
      };
    }

    return {
      products: data?.items || [],
      pagination: data?.pagination || {
        total: data?.items?.length || 0,
        page: params.page || 1,
        limit: params.limit || 20,
      },
    };
  }
);

// Product by slug
export const fetchProductBySlug = createAsyncThunk(
  "product/fetchBySlug",
  async (slug) => {
    const { data } = await getProductBySlugApi(slug);
    return data?.product || data;
  }
);

// Product by SKU
export const fetchProductBySku = createAsyncThunk(
  "product/fetchBySku",
  async (sku) => {
    const { data } = await getProductBySkuApi(sku);
    return data;
  }
);

// Pincode check
export const checkPincode = createAsyncThunk(
  "product/checkPincode",
  async (body) => {
    const { data } = await checkPincodeApi(body);
    return data;
  }
);

// ---- Initial state ----
const initialState = {
  list: {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    params: {},
    status: "idle",
    error: null,
    fetchedAt: null,
  },
  bySlug: {}, // slug -> { data, status, error, fetchedAt }
  availability: {}, // key -> data
};

// ---- Slice ----
const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearListCache(state) {
      state.list.fetchedAt = null;
      state.list.items = [];
    },
    clearProductCache(state, action) {
      const slug = action.payload;
      delete state.bySlug[slug];
    },
  },
  extraReducers: (b) => {
    // list
    b.addCase(fetchProducts.pending, (s, a) => {
      s.list.status = "loading";
      s.list.error = null;
      s.list.params = a.meta.arg || {};
    });
    b.addCase(fetchProducts.fulfilled, (s, { payload }) => {
      s.list.status = "succeeded";
      s.list.items = payload.products;
      s.list.total = payload.pagination.total;
      s.list.page = payload.pagination.page;
      s.list.limit = payload.pagination.limit;
      s.list.fetchedAt = Date.now();
    });
    b.addCase(fetchProducts.rejected, (s, { error }) => {
      s.list.status = "failed";
      s.list.error = error?.message || "Failed to load products";
    });

    // product by slug
    b.addCase(fetchProductBySlug.pending, (s, a) => {
      const slug = a.meta.arg;
      s.bySlug[slug] = s.bySlug[slug] || {};
      s.bySlug[slug].status = "loading";
      s.bySlug[slug].error = null;
    });
    b.addCase(fetchProductBySlug.fulfilled, (s, { payload, meta }) => {
      const slug = meta.arg;
      s.bySlug[slug] = {
        data: payload,
        status: "succeeded",
        error: null,
        fetchedAt: Date.now(),
      };
    });
    b.addCase(fetchProductBySlug.rejected, (s, { error, meta }) => {
      const slug = meta.arg;
      s.bySlug[slug] = {
        data: null,
        status: "failed",
        error: error?.message || "Failed to load product",
        fetchedAt: Date.now(),
      };
    });

    // fetch by sku
    b.addCase(fetchProductBySku.fulfilled, (s, { payload }) => {
      const sku = payload?.variant?.sku || payload?.variant?.id;
      if (sku) {
        s.availability[sku] = {
          data: payload,
          fetchedAt: Date.now(),
        };
      }
    });

    // pincode check
    b.addCase(checkPincode.fulfilled, (s, { payload, meta }) => {
      const key = JSON.stringify(meta.arg || {});
      s.availability[key] = { data: payload, fetchedAt: Date.now() };
    });
  },
});

export const { clearListCache, clearProductCache } = slice.actions;
export default slice.reducer;
