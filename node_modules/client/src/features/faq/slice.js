// src/features/faq/slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api.js';

// Search FAQs for chatbot
export const searchFAQs = createAsyncThunk(
  'faq/searchFAQs',
  async ({ query, category = null }) => {
    return await api.searchFAQsApi(query, category);
  }
);

// Get FAQ categories
export const getFAQCategories = createAsyncThunk(
  'faq/getCategories',
  async () => {
    return await api.getFAQCategoriesApi();
  }
);

// Record FAQ match
export const recordFAQMatch = createAsyncThunk(
  'faq/recordMatch',
  async (faqId) => {
    return await api.recordFAQMatchApi(faqId);
  }
);

// Vote on FAQ
export const voteFAQ = createAsyncThunk(
  'faq/vote',
  async ({ faqId, isHelpful }) => {
    return await api.voteFAQApi(faqId, isHelpful);
  }
);

const faqSlice = createSlice({
  name: 'faq',
  initialState: {
    // Chatbot search results
    searchResults: {
      faqs: [],
      total: 0,
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
      lastQuery: ''
    },
    
    // Categories
    categories: {
      items: [],
      status: 'idle',
      error: null
    },
    
    // Chat conversation state
    conversation: {
      messages: [],
      isTyping: false,
      currentContext: null // Current FAQ being discussed
    }
  },
  reducers: {
    // Chat message management
    addMessage: (state, action) => {
      const { role, text, faqId = null, timestamp = Date.now() } = action.payload;
      state.conversation.messages.push({
        id: `${role}-${timestamp}`,
        role,
        text,
        faqId,
        timestamp
      });
    },
    
    setTyping: (state, action) => {
      state.conversation.isTyping = action.payload;
    },
    
    clearConversation: (state) => {
      state.conversation.messages = [];
      state.conversation.currentContext = null;
    },
    
    setCurrentContext: (state, action) => {
      state.conversation.currentContext = action.payload;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = {
        faqs: [],
        total: 0,
        status: 'idle',
        error: null,
        lastQuery: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Search FAQs
      .addCase(searchFAQs.pending, (state, action) => {
        state.searchResults.status = 'loading';
        state.searchResults.error = null;
        state.searchResults.lastQuery = action.meta.arg.query;
      })
      .addCase(searchFAQs.fulfilled, (state, action) => {
        state.searchResults.status = 'succeeded';
        state.searchResults.faqs = action.payload.data || [];
        state.searchResults.total = action.payload.total || 0;
        state.searchResults.error = null;
      })
      .addCase(searchFAQs.rejected, (state, action) => {
        state.searchResults.status = 'failed';
        state.searchResults.error = action.error.message;
        state.searchResults.faqs = [];
        state.searchResults.total = 0;
      })
      
      // Get categories
      .addCase(getFAQCategories.pending, (state) => {
        state.categories.status = 'loading';
      })
      .addCase(getFAQCategories.fulfilled, (state, action) => {
        state.categories.status = 'succeeded';
        state.categories.items = action.payload.data || [];
        state.categories.error = null;
      })
      .addCase(getFAQCategories.rejected, (state, action) => {
        state.categories.status = 'failed';
        state.categories.error = action.error.message;
      })
      
      // Record match (no UI state changes needed)
      .addCase(recordFAQMatch.fulfilled, () => {
        // Silently record the match
      })
      
      // Vote on FAQ (no UI state changes needed)
      .addCase(voteFAQ.fulfilled, () => {
        // Silently record the vote
      });
  }
});

export const {
  addMessage,
  setTyping,
  clearConversation,
  setCurrentContext,
  clearSearchResults
} = faqSlice.actions;

export default faqSlice.reducer;