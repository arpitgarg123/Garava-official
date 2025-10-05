// src/features/product/slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listProductsApi,
  getProductBySlugApi,
  getProductBySkuApi,
  checkPincodeApi,
} from "./api.js";

// ---- Async thunks ----

// Request deduplication for fetchProducts
let productRequestPromises = {};

// List products
export const fetchProducts = createAsyncThunk(
  "product/fetchList",
  async (rawParams = {}, { getState, rejectWithValue }) => {
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
    if (merged.colors && Array.isArray(merged.colors) && merged.colors.length > 0) {
      params.colors = merged.colors.join(',');
    }

    const signature = JSON.stringify(params);
    
    // Check cache first
    if (
      product.list.paramsSignature === signature &&
      product.list.status === "succeeded" &&
      product.list.items.length > 0 // Only use cache if we have actual items
    ) {
      console.log('Product slice - Using cached products for:', params);
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

    // Check for duplicate requests
    if (productRequestPromises[signature]) {
      console.log('Product slice - Deduplicating product request for:', params);
      try {
        const result = await productRequestPromises[signature];
        return result;
      } catch (error) {
        return rejectWithValue(error);
      }
    }

    // Create new request promise
    const requestPromise = (async () => {
      try {
        console.log('Product slice - Fetching products with params:', params);
        const { data } = await listProductsApi(params);
        
        const result = {
          _cached: false,
          _signature: signature
        };

        if (Array.isArray(data)) {
          result.products = data;
          result.pagination = {
            total: data.length,
            page: params.page || 1,
            limit: params.limit || 20,
          };
        } else if (data?.products) {
          result.products = data.products;
          result.pagination = data.pagination || {
            total: data.products.length,
            page: params.page || 1,
            limit: params.limit || 20,
          };
        } else {
          result.products = data?.items || [];
          result.pagination = data?.pagination || {
            total: data?.items?.length || 0,
            page: params.page || 1,
            limit: params.limit || 20,
          };
        }
        
        return result;
      } finally {
        // Clean up the promise
        delete productRequestPromises[signature];
      }
    })();

    // Store the promise for deduplication
    productRequestPromises[signature] = requestPromise;
    
    return requestPromise;
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

// Smart category counts with caching and deduplication
let categoryCountsCache = {};
let categoryCountsPromises = {};
const COUNTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export const fetchCategoryCounts = createAsyncThunk(
  "product/fetchCategoryCounts",
  async ({ type, categories = [] }, { getState, rejectWithValue }) => {
    const cacheKey = `${type}-${categories.sort().join(',')}`;
    const now = Date.now();
    
    // Check if we have fresh cached data
    const cached = categoryCountsCache[cacheKey];
    if (cached && now - cached.timestamp < COUNTS_CACHE_TTL) {
      console.log('Product slice - Using cached category counts for:', type);
      return { type, counts: cached.counts, _cached: true };
    }
    
    // Check if there's already a pending request for this cache key
    if (categoryCountsPromises[cacheKey]) {
      console.log('Product slice - Deduplicating category counts request for:', type);
      try {
        const result = await categoryCountsPromises[cacheKey];
        return result;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
    
    // Create new request promise
    const requestPromise = (async () => {
      try {
        console.log('Product slice - Fetching category counts for:', type, categories);
        const counts = {};

        // Use Promise.allSettled for parallel requests to handle failures gracefully
        const requests = [
          // Total for "All"
          listProductsApi({ type, page: 1, limit: 1 })
            .then(({ data }) => {
              const total = data?.pagination?.total ?? data?.total ?? 
                (data?.products ? data.products.length : Array.isArray(data) ? data.length : 0);
              counts.__all = total;
            })
            .catch((error) => {
              console.warn(`Failed to fetch total count for ${type}:`, error.message);
              counts.__all = 0; // Default to 0 if blocked
            })
        ];

        // Add category requests
        for (const c of categories) {
          if (c.startsWith("all-")) continue;
          requests.push(
            listProductsApi({ type, category: c, page: 1, limit: 1 })
              .then(({ data }) => {
                const total = data?.pagination?.total ?? data?.total ?? 
                  (data?.products ? data.products.length : Array.isArray(data) ? data.length : 0);
                counts[c] = total;
              })
              .catch((error) => {
                console.warn(`Failed to fetch count for ${type}/${c}:`, error.message);
                counts[c] = 0; // Default to 0 if blocked
              })
          );
        }

        // Wait for all requests to complete (including failed ones)
        await Promise.allSettled(requests);
        
        // Cache the results
        categoryCountsCache[cacheKey] = {
          counts,
          timestamp: Date.now()
        };
        
        return { type, counts, _cached: false };
      } finally {
        // Clean up the promise
        delete categoryCountsPromises[cacheKey];
      }
    })();
    
    // Store the promise for deduplication
    categoryCountsPromises[cacheKey] = requestPromise;
    
    return requestPromise;
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
    colors: [], // Add colors array
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
        colors: [],
        sort: "newest",
        page: 1,
        limit: 20
      };
      // Also clear cache to force fresh data
      state.list.paramsSignature = null;
      state.list.fetchedAt = null;
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
