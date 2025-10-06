import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getFeaturedPostsApi, 
  getAllPostsApi, 
  createPostApi, 
  updatePostApi, 
  deletePostApi, 
  togglePostStatusApi 
} from './api.js';

// Async thunks

// Fetch featured posts for public display
export const fetchFeaturedPosts = createAsyncThunk(
  'instagram/fetchFeaturedPosts',
  async (limit = 4, { rejectWithValue }) => {
    try {
      const response = await getFeaturedPostsApi(limit);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured posts');
    }
  }
);

// Admin: Fetch all posts with pagination
export const fetchInstagramPostsAdmin = createAsyncThunk(
  'instagram/fetchInstagramPostsAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAllPostsApi(params);
      return {
        posts: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Instagram posts');
    }
  }
);

// Admin: Create post
export const createInstagramPost = createAsyncThunk(
  'instagram/createInstagramPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await createPostApi(postData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create Instagram post');
    }
  }
);

// Admin: Update post
export const updateInstagramPost = createAsyncThunk(
  'instagram/updateInstagramPost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await updatePostApi(id, postData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update Instagram post');
    }
  }
);

// Admin: Delete post
export const deleteInstagramPost = createAsyncThunk(
  'instagram/deleteInstagramPost',
  async (id, { rejectWithValue }) => {
    try {
      await deletePostApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete Instagram post');
    }
  }
);

// Admin: Toggle post status
export const toggleInstagramPostStatus = createAsyncThunk(
  'instagram/toggleInstagramPostStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await togglePostStatusApi(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle post status');
    }
  }
);

const initialState = {
  // Public featured posts
  featuredPosts: [],
  featuredLoading: false,
  featuredError: null,

  // Admin posts management
  posts: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  actionLoading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    isActive: undefined,
    isFeatured: undefined
  }
};

const instagramSlice = createSlice({
  name: 'instagram',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.featuredError = null;
    },
    resetPagination: (state) => {
      state.pagination.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch featured posts
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredPosts = action.payload;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
      })

      // Fetch Instagram posts admin
      .addCase(fetchInstagramPostsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstagramPostsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInstagramPostsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Instagram post
      .addCase(createInstagramPost.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createInstagramPost.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createInstagramPost.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update Instagram post
      .addCase(updateInstagramPost.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateInstagramPost.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updateInstagramPost.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete Instagram post
      .addCase(deleteInstagramPost.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteInstagramPost.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(deleteInstagramPost.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Toggle Instagram post status
      .addCase(toggleInstagramPostStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleInstagramPostStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(toggleInstagramPostStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearError, resetPagination } = instagramSlice.actions;

// Selectors
export const selectFeaturedPosts = (state) => state.instagram.featuredPosts;
export const selectFeaturedLoading = (state) => state.instagram.featuredLoading;
export const selectFeaturedError = (state) => state.instagram.featuredError;

export const selectInstagramPosts = (state) => state.instagram.posts;
export const selectInstagramLoading = (state) => state.instagram.loading;
export const selectInstagramActionLoading = (state) => state.instagram.actionLoading;
export const selectInstagramError = (state) => state.instagram.error;
export const selectInstagramPagination = (state) => state.instagram.pagination;
export const selectInstagramFilters = (state) => state.instagram.filters;

export default instagramSlice.reducer;