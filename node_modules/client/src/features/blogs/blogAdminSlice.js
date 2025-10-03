// Admin blog slice for blog management functionality
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogAdminAPI } from "./api.js";

// Async thunks
export const fetchBlogsAdmin = createAsyncThunk(
  "blogAdmin/fetchBlogs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogAdminAPI.getBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchBlogAdminById = createAsyncThunk(
  "blogAdmin/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogAdminAPI.getBlogById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBlogAdmin = createAsyncThunk(
  "blogAdmin/createBlog",
  async (blogData, { rejectWithValue, dispatch }) => {
    try {
      const response = await blogAdminAPI.createBlog(blogData);
      // Refresh the blog list after creation
      dispatch(fetchBlogsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBlogAdmin = createAsyncThunk(
  "blogAdmin/updateBlog",
  async ({ id, blogData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await blogAdminAPI.updateBlog(id, blogData);
      // Refresh the blog list after update
      dispatch(fetchBlogsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBlogStatusAdmin = createAsyncThunk(
  "blogAdmin/updateBlogStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await blogAdminAPI.updateBlogStatus(id, status);
      // Refresh the blog list after status update
      dispatch(fetchBlogsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBlogAdmin = createAsyncThunk(
  "blogAdmin/deleteBlog",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await blogAdminAPI.deleteBlog(id);
      // Refresh the blog list after deletion
      dispatch(fetchBlogsAdmin({ page: 1 }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  blogs: [],
  currentBlog: null,
  selectedBlogId: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: 'all',
    category: '',
    search: '',
    sort: 'newest',
  },
  modals: {
    create: false,
    edit: false,
    delete: false,
    details: false,
  },
  loading: false,
  actionLoading: false, // For create/update/delete actions
  error: null,
};

// Slice
const blogAdminSlice = createSlice({
  name: "blogAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    openModal: (state, action) => {
      const { modalType, blogId } = action.payload;
      state.modals[modalType] = true;
      if (blogId) {
        state.selectedBlogId = blogId;
      }
    },
    closeModal: (state, action) => {
      const modalType = action.payload;
      state.modals[modalType] = false;
      if (modalType === 'edit' || modalType === 'create') {
        state.selectedBlogId = null;
        state.currentBlog = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
      state.selectedBlogId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs admin
      .addCase(fetchBlogsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.items || action.payload.blogs || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchBlogsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch blog by ID
      .addCase(fetchBlogAdminById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogAdminById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentBlog = action.payload.post || action.payload.blog;
      })
      .addCase(fetchBlogAdminById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlogAdmin.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBlogAdmin.fulfilled, (state) => {
        state.actionLoading = false;
        state.modals.create = false;
      })
      .addCase(createBlogAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Update blog
      .addCase(updateBlogAdmin.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBlogAdmin.fulfilled, (state) => {
        state.actionLoading = false;
        state.modals.edit = false;
        state.selectedBlogId = null;
        state.currentBlog = null;
      })
      .addCase(updateBlogAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateBlogStatusAdmin.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateBlogStatusAdmin.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateBlogStatusAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Delete blog
      .addCase(deleteBlogAdmin.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteBlogAdmin.fulfilled, (state) => {
        state.actionLoading = false;
        state.modals.delete = false;
        state.selectedBlogId = null;
      })
      .addCase(deleteBlogAdmin.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { 
  setFilters, 
  setCurrentPage, 
  openModal, 
  closeModal, 
  clearError, 
  clearCurrentBlog 
} = blogAdminSlice.actions;

// Selectors
export const selectBlogAdminBlogs = (state) => state.blogAdmin.blogs;
export const selectBlogAdminCurrentBlog = (state) => state.blogAdmin.currentBlog;
export const selectBlogAdminSelectedId = (state) => state.blogAdmin.selectedBlogId;
export const selectBlogAdminLoading = (state) => state.blogAdmin.loading;
export const selectBlogAdminActionLoading = (state) => state.blogAdmin.actionLoading;
export const selectBlogAdminError = (state) => state.blogAdmin.error;
export const selectBlogAdminPagination = (state) => state.blogAdmin.pagination;
export const selectBlogAdminFilters = (state) => state.blogAdmin.filters;
export const selectBlogAdminModals = (state) => state.blogAdmin.modals;

// Computed selectors
export const selectBlogsByStatus = (state) => {
  const blogs = state.blogAdmin.blogs;
  return {
    total: blogs.length,
    published: blogs.filter(blog => blog.status === 'published').length,
    draft: blogs.filter(blog => blog.status === 'draft').length,
    archived: blogs.filter(blog => blog.status === 'archived').length,
  };
};

export default blogAdminSlice.reducer;