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
  async (rawParams = {}, { getState }) => {
    const { product } = getState();
    const merged = { ...product.filters, ...rawParams };

    // Build backend params (omit empties)
    const params = {
      page: merged.page,
      limit: merged.limit,
      sort: merged.sort,
    };
    if (merged.type) params.type = merged.type;
    if (merged.category && !merged.category.startsWith("all-")) params.category = merged.category;
    if (merged.priceMin != null && merged.priceMin !== "") params.priceMin = merged.priceMin;
    if (merged.priceMax != null && merged.priceMax !== "") params.priceMax = merged.priceMax;

    const signature = JSON.stringify(params);
    if (
      product.list.paramsSignature === signature &&
      product.list.status === "succeeded"
    ) {
      // Return cached (still goes through fulfilled, no network)
      return {
        products: product.list.items,
        pagination: {
          total: product.list.total,
          page: product.list.page,
          limit: product.list.limit,
        },
        _cached: true
      };
    }

    const { data } = await listProductsApi(params);

    if (Array.isArray(data)) {
      return {
        products: data,
        pagination: {
          total: data.length,
          page: params.page || 1,
          limit: params.limit || 20,
        },
        _cached: false,
        _signature: signature
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
        _cached: false,
        _signature: signature
      };
    }
    return {
      products: data?.items || [],
      pagination: data?.pagination || {
        total: data?.items?.length || 0,
        page: params.page || 1,
        limit: params.limit || 20,
      },
      _cached: false,
      _signature: signature
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

// NEW: fetchCategoryCounts (sequential to prevent 429)
export const fetchCategoryCounts = createAsyncThunk(
  "product/fetchCategoryCounts",
  async ({ type, categories = [] }) => {
    const counts = {};

    // Total for "All"
    const { data: allData } = await listProductsApi({ type, page: 1, limit: 1 });
    const allTotal =
      allData?.pagination?.total ??
      allData?.total ??
      (allData?.products ? allData.products.length : Array.isArray(allData) ? allData.length : 0);
    counts.__all = allTotal;

    // Each category
    for (const c of categories) {
      if (c.startsWith("all-")) continue;
      const { data } = await listProductsApi({ type, category: c, page: 1, limit: 1 });
      const total =
        data?.pagination?.total ??
        data?.total ??
        (data?.products ? data.products.length : Array.isArray(data) ? data.length : 0);
      counts[c] = total;
    }

    return { type, counts };
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
    paramsSignature: null,            // ADD
    status: "idle",
    error: null,
    fetchedAt: null,
  },
  bySlug: {},
  availability: {},
  filters: {
    type: "",
    category: "",
    priceMin: null,
    priceMax: null,
    sort: "newest",
    page: 1,
    limit: 20,
  },
  categoryCounts: {},          // NEW: { [type]: { __all: number, rings: n, ... } }
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
    // ADD
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {
        type: "",
        category: "",
        priceMin: null,
        priceMax: null,
        sort: "newest",
        page: 1,
        limit: 20
      };
    }
  },
  extraReducers: (b) => {
    // list
    b.addCase(fetchProducts.pending, (s, a) => {
      s.list.status = "loading";
      s.list.error = null;
      // store the effective params (after mapping) for reference
      s.list.params = a.meta.arg || {};
    });
    b.addCase(fetchProducts.fulfilled, (s, { payload }) => {
      s.list.status = "succeeded";
      s.list.items = payload.products;
      s.list.total = payload.pagination.total;
      s.list.page = payload.pagination.page;
      s.list.limit = payload.pagination.limit;
      s.list.fetchedAt = Date.now();
      if (payload._signature) {
        s.list.paramsSignature = payload._signature;
      }
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

    // Category counts
    b.addCase(fetchCategoryCounts.fulfilled, (s, { payload }) => {
      const { type, counts } = payload;
      s.categoryCounts[type] = counts;
    });
  },
});

export const { clearListCache, clearProductCache, setFilters, clearFilters } = slice.actions;
export default slice.reducer;
