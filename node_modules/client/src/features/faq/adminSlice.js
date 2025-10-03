// src/features/faq/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api.js';

// Get all FAQs (admin)
export const getAllFAQs = createAsyncThunk(
  'faqAdmin/getAllFAQs',
  async (params = {}) => {
    return await api.getAllFAQsApi(params);
  }
);

// Create FAQ
export const createFAQ = createAsyncThunk(
  'faqAdmin/createFAQ',
  async (faqData) => {
    return await api.createFAQApi(faqData);
  }
);

// Update FAQ
export const updateFAQ = createAsyncThunk(
  'faqAdmin/updateFAQ',
  async ({ id, ...faqData }) => {
    return await api.updateFAQApi(id, faqData);
  }
);

// Delete FAQ
export const deleteFAQ = createAsyncThunk(
  'faqAdmin/deleteFAQ',
  async (id) => {
    await api.deleteFAQApi(id);
    return id;
  }
);

// Get FAQ by ID
export const getFAQById = createAsyncThunk(
  'faqAdmin/getFAQById',
  async (id) => {
    return await api.getFAQByIdApi(id);
  }
);

// Toggle FAQ status
export const toggleFAQStatus = createAsyncThunk(
  'faqAdmin/toggleStatus',
  async (id) => {
    return await api.toggleFAQStatusApi(id);
  }
);

// Bulk create FAQs
export const bulkCreateFAQs = createAsyncThunk(
  'faqAdmin/bulkCreate',
  async (faqs) => {
    return await api.bulkCreateFAQsApi(faqs);
  }
);

// Get analytics
export const getFAQAnalytics = createAsyncThunk(
  'faqAdmin/getAnalytics',
  async () => {
    return await api.getFAQAnalyticsApi();
  }
);

const faqAdminSlice = createSlice({
  name: 'faqAdmin',
  initialState: {
    // FAQ list
    list: {
      faqs: [],
      total: 0,
      page: 1,
      totalPages: 0,
      status: 'idle',
      error: null
    },
    
    // Current FAQ being edited
    currentFAQ: {
      data: null,
      status: 'idle',
      error: null
    },
    
    // Analytics
    analytics: {
      data: null,
      status: 'idle',
      error: null
    },
    
    // UI states
    createModal: {
      isOpen: false,
      status: 'idle',
      error: null
    },
    
    editModal: {
      isOpen: false,
      faqId: null,
      status: 'idle',
      error: null
    }
  },
  reducers: {
    // Modal management
    openCreateModal: (state) => {
      state.createModal.isOpen = true;
      state.createModal.error = null;
    },
    
    closeCreateModal: (state) => {
      state.createModal.isOpen = false;
      state.createModal.status = 'idle';
      state.createModal.error = null;
    },
    
    openEditModal: (state, action) => {
      state.editModal.isOpen = true;
      state.editModal.faqId = action.payload;
      state.editModal.error = null;
    },
    
    closeEditModal: (state) => {
      state.editModal.isOpen = false;
      state.editModal.faqId = null;
      state.editModal.status = 'idle';
      state.editModal.error = null;
      state.currentFAQ.data = null;
    },
    
    // Clear current FAQ
    clearCurrentFAQ: (state) => {
      state.currentFAQ.data = null;
      state.currentFAQ.status = 'idle';
      state.currentFAQ.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all FAQs
      .addCase(getAllFAQs.pending, (state) => {
        state.list.status = 'loading';
      })
      .addCase(getAllFAQs.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.faqs = action.payload.faqs || [];
        state.list.total = action.payload.total || 0;
        state.list.page = action.payload.page || 1;
        state.list.totalPages = action.payload.totalPages || 0;
        state.list.error = null;
      })
      .addCase(getAllFAQs.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error = action.error.message;
      })
      
      // Create FAQ
      .addCase(createFAQ.pending, (state) => {
        state.createModal.status = 'loading';
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.createModal.status = 'succeeded';
        state.list.faqs.unshift(action.payload.data);
        state.list.total += 1;
        state.createModal.isOpen = false;
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.createModal.status = 'failed';
        state.createModal.error = action.error.message;
      })
      
      // Update FAQ
      .addCase(updateFAQ.pending, (state) => {
        state.editModal.status = 'loading';
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.editModal.status = 'succeeded';
        const index = state.list.faqs.findIndex(faq => faq._id === action.payload.data._id);
        if (index !== -1) {
          state.list.faqs[index] = action.payload.data;
        }
        state.editModal.isOpen = false;
        state.currentFAQ.data = action.payload.data;
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.editModal.status = 'failed';
        state.editModal.error = action.error.message;
      })
      
      // Delete FAQ
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.list.faqs = state.list.faqs.filter(faq => faq._id !== action.payload);
        state.list.total -= 1;
      })
      
      // Get FAQ by ID
      .addCase(getFAQById.pending, (state) => {
        state.currentFAQ.status = 'loading';
      })
      .addCase(getFAQById.fulfilled, (state, action) => {
        state.currentFAQ.status = 'succeeded';
        state.currentFAQ.data = action.payload.data;
        state.currentFAQ.error = null;
      })
      .addCase(getFAQById.rejected, (state, action) => {
        state.currentFAQ.status = 'failed';
        state.currentFAQ.error = action.error.message;
      })
      
      // Toggle status
      .addCase(toggleFAQStatus.fulfilled, (state, action) => {
        const index = state.list.faqs.findIndex(faq => faq._id === action.payload.data._id);
        if (index !== -1) {
          state.list.faqs[index] = action.payload.data;
        }
      })
      
      // Analytics
      .addCase(getFAQAnalytics.pending, (state) => {
        state.analytics.status = 'loading';
      })
      .addCase(getFAQAnalytics.fulfilled, (state, action) => {
        state.analytics.status = 'succeeded';
        state.analytics.data = action.payload.data;
        state.analytics.error = null;
      })
      .addCase(getFAQAnalytics.rejected, (state, action) => {
        state.analytics.status = 'failed';
        state.analytics.error = action.error.message;
      });
  }
});

export const {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  clearCurrentFAQ
} = faqAdminSlice.actions;

export default faqAdminSlice.reducer;