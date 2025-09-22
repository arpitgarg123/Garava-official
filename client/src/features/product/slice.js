// src/features/product/slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listProductsApi,
  getProductBySlugApi,
  getProductBySkuApi,
  checkPincodeApi,
} from "./api.js";

const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes cache TTL for product detail/list

export const fetchProducts = createAsyncThunk(
  "product/fetchList",
  async (params = {}) => {
    const { data } = await listProductsApi(params);
    return data;
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "product/fetchBySlug",
  async (slug) => {
    const { data } = await getProductBySlugApi(slug);
    return data;
  }
);

export const fetchProductBySku = createAsyncThunk(
  "product/fetchBySku",
  async (sku) => {
    const { data } = await getProductBySkuApi(sku);
    return data;
  }
);

export const checkPincode = createAsyncThunk(
  "product/checkPincode",
  async (body) => {
    const { data } = await checkPincodeApi(body);
    return data;
  }
);

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
    b.addCase(fetchProducts.fulfilled, (s, { payload, meta }) => {
      s.list.status = "succeeded";
      // backend returns normalized object or items; support both
      if (Array.isArray(payload)) {
        s.list.items = payload;
        s.list.total = payload.length;
      } else {
        s.list.items = payload?.products || payload?.items || [];
        s.list.total = payload?.pagination?.total || payload?.total || s.list.items.length;
        s.list.page = payload?.pagination?.page || s.list.page;
        s.list.limit = payload?.pagination?.limit || s.list.limit;
      }
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

    // fetch by sku (used for validation)
    b.addCase(fetchProductBySku.fulfilled, (s, { payload }) => {
      // payload is product/variant info, store under availability map by SKU
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
