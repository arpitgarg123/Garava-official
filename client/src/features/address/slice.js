// src/features/address/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressApi } from './api';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddresses();
      return response.addresses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAddress = createAsyncThunk(
  'address/fetchAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddress(addressId);
      return response.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(addressData);
      return response.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressApi.updateAddress(addressId, addressData);
      return response.address;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await addressApi.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  addresses: [],
  selectedAddress: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
    setDefaultAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single address
      .addCase(fetchAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create address
      .addCase(createAddress.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isCreating = false;
        state.addresses.push(action.payload);
        
        // If this is the first address, make it default
        if (state.addresses.length === 1) {
          state.addresses[0].isDefault = true;
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        if (state.selectedAddress?._id === action.payload._id) {
          state.selectedAddress = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
        if (state.selectedAddress?._id === action.payload) {
          state.selectedAddress = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  selectAddress, 
  clearSelectedAddress, 
  setDefaultAddress 
} = addressSlice.actions;

export default addressSlice.reducer;