import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  listNewsEventsApi,
  getEventsGroupedApi,
  getMediaCoverageApi,
  getFilterOptionsApi,
  getNewsBySlugApi
} from "./api.js";

// Async thunks
export const fetchNewsEvents = createAsyncThunk(
  "newsevents/fetchNewsEvents",
  async (params, { rejectWithValue }) => {
    try {
      const response = await listNewsEventsApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEventsGrouped = createAsyncThunk(
  "newsevents/fetchEventsGrouped",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getEventsGroupedApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMediaCoverage = createAsyncThunk(
  "newsevents/fetchMediaCoverage",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getMediaCoverageApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFilterOptions = createAsyncThunk(
  "newsevents/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFilterOptionsApi();
      return response.data.options;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchNewsEventBySlug = createAsyncThunk(
  "newsevents/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await getNewsBySlugApi(slug);
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  // General list
  items: [],
  currentItem: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Events specific
  eventsGrouped: {
    upcoming: { items: [], pagination: {} },
    past: { items: [], pagination: {} },
  },
  
  // Media coverage
  mediaCoverage: {
    items: [],
    pagination: {},
  },
  
  // Filter options
  filterOptions: {
    cities: [],
    outlets: [],
    years: [],
    kinds: [],
  },
  
  // UI state
  filters: {
    search: '',
    type: '', // 'event' or 'media-coverage'
    kind: '', // 'Event' or 'News'
    city: '',
    year: '',
    outlet: '',
    sort: 'newest',
  },
  
  loading: false,
  error: null,
};

// Slice
const newsEventsSlice = createSlice({
  name: "newsevents",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch news & events
      .addCase(fetchNewsEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNewsEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch events grouped
      .addCase(fetchEventsGrouped.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsGrouped.fulfilled, (state, action) => {
        state.loading = false;
        state.eventsGrouped = action.payload;
      })
      .addCase(fetchEventsGrouped.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch media coverage
      .addCase(fetchMediaCoverage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaCoverage.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaCoverage = action.payload;
      })
      .addCase(fetchMediaCoverage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch filter options
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      
      // Fetch by slug
      .addCase(fetchNewsEventBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsEventBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchNewsEventBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentItem } = newsEventsSlice.actions;

// Selectors
export const selectNewsEventsItems = (state) => state.newsevents.items;
export const selectNewsEventsCurrentItem = (state) => state.newsevents.currentItem;
export const selectNewsEventsPagination = (state) => state.newsevents.pagination;
export const selectNewsEventsGrouped = (state) => state.newsevents.eventsGrouped;
export const selectNewsEventsMediaCoverage = (state) => state.newsevents.mediaCoverage;
export const selectNewsEventsFilterOptions = (state) => state.newsevents.filterOptions;
export const selectNewsEventsFilters = (state) => state.newsevents.filters;
export const selectNewsEventsLoading = (state) => state.newsevents.loading;
export const selectNewsEventsError = (state) => state.newsevents.error;

export default newsEventsSlice.reducer;