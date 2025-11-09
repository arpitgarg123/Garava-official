// src/features/search/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api.js';

// Search products with query and filters
export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (params = {}) => {
    return await api.searchProductsApi(params);
  }
);

// Get search suggestions (recent searches, popular terms)
export const getSearchSuggestions = createAsyncThunk(
  'search/getSearchSuggestions',
  async (query) => {
    // For now, return mock suggestions, can be enhanced with backend API
    const suggestions = [
      'Diamond Rings',
      'Gold Earrings',
      'Silver Pendants',
      'Fragrance Collection',
      'Wedding Jewellery',
      'Daily Wear'
    ].filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
    return suggestions;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    // Search results
    results: {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null
    },
    
    // Search state
    query: '',
    filters: {
      type: '', // 'jewellery' | 'fragrance'
      category: '',
      priceMin: '',
      priceMax: '',
      sort: 'relevance' // 'relevance' | 'price-asc' | 'price-desc' | 'newest'
    },
    
    // Search suggestions
    suggestions: {
      items: [],
      status: 'idle',
      error: null
    },
    
    // Recent searches (stored locally)
    recentSearches: [],
    
    // Popular searches
    popularSearches: [
      'Diamond Rings',
      'Gold Earrings',
      'Wedding Jewellery',
      'Fragrance Collection',
      'Silver Pendants',
      'Bracelets'
    ]
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        type: '',
        category: '',
        priceMin: '',
        priceMax: '',
        sort: 'relevance'
      };
    },
    
    addRecentSearch: (state, action) => {
      const query = action.payload.trim();
      if (query && !state.recentSearches.includes(query)) {
        state.recentSearches.unshift(query);
        // Keep only last 10 searches
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    removeRecentSearch: (state, action) => {
      state.recentSearches = state.recentSearches.filter(
        search => search !== action.payload
      );
    },
    
    clearResults: (state) => {
      state.results = {
        products: [],
        total: 0,
        page: 1,
        totalPages: 0,
        status: 'idle',
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.results.status = 'loading';
        state.results.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.results.status = 'succeeded';
        const response = action.payload;
        state.results.products = response.products || [];
        state.results.total = response.total || 0;
        state.results.page = response.page || 1;
        state.results.totalPages = response.totalPages || 0;
        state.results.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.results.status = 'failed';
        state.results.error = action.error.message;
        state.results.products = [];
      })
      
      // Search suggestions
      .addCase(getSearchSuggestions.pending, (state) => {
        state.suggestions.status = 'loading';
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions.status = 'succeeded';
        state.suggestions.items = action.payload;
        state.suggestions.error = null;
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.suggestions.status = 'failed';
        state.suggestions.error = action.error.message;
        state.suggestions.items = [];
      });
  }
});

export const {
  setQuery,
  setFilters,
  clearFilters,
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  clearResults
} = searchSlice.actions;

export default searchSlice.reducer;
