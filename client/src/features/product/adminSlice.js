import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./admin.api";

// Async thunks for admin product operations
export const fetchProductsAdmin = createAsyncThunk(
  "productAdmin/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.listProductsAdmin(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProductAdmin = createAsyncThunk(
  "productAdmin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.createProduct(productData);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProductAdmin = createAsyncThunk(
  "productAdmin/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateProduct(productId, productData);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProductAdmin = createAsyncThunk(
  "productAdmin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await adminApi.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addVariantAdmin = createAsyncThunk(
  "productAdmin/addVariant",
  async ({ productId, variantData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.addVariant(productId, variantData);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateVariantAdmin = createAsyncThunk(
  "productAdmin/updateVariant",
  async ({ productId, variantId, variantData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateVariant(productId, variantId, variantData);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateStockAdmin = createAsyncThunk(
  "productAdmin/updateStock",
  async ({ productId, stockData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateStock(productId, stockData);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  filters: {
    q: '',
    status: '',
    category: '',
  },
  selectedProduct: null,
  loading: false,
  error: null,
  operationLoading: false, // For create, update, delete operations
  operationError: null,
};

const productAdminSlice = createSlice({
  name: "productAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { q: '', status: '', category: '' };
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProductsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create product
      .addCase(createProductAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(createProductAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.products.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProductAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Update product
      .addCase(updateProductAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateProductAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProductAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Delete product
      .addCase(deleteProductAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(deleteProductAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedProduct && state.selectedProduct._id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProductAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Add variant
      .addCase(addVariantAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(addVariantAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(addVariantAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Update variant
      .addCase(updateVariantAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateVariantAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateVariantAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      })
      
      // Update stock
      .addCase(updateStockAdmin.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(updateStockAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateStockAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setSelectedProduct, clearSelectedProduct, clearErrors } = productAdminSlice.actions;

export default productAdminSlice.reducer;