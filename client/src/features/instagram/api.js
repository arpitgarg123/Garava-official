import { authHttp } from '../../shared/api/http.js';

const API_BASE = '/instagram';

// Public API calls
export const getFeaturedPostsApi = async (limit = 4) => {
  return authHttp.get(`${API_BASE}/featured?limit=${limit}`);
};

// Admin API calls
export const getAllPostsApi = async (params = {}) => {
  // Filter out undefined values to avoid sending 'undefined' strings
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined && value !== null && value !== '')
  );
  
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_BASE}?${queryParams}` : API_BASE;
  
  try {
    const response = await authHttp.get(url);
    return response;
  } catch (error) {
    console.error('getAllPostsApi error:', error);
    throw error;
  }
};

export const createPostApi = async (postData) => {
  // Handle FormData for file uploads
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return authHttp.post(API_BASE, postData, config);
};

export const updatePostApi = async (id, postData) => {
  // Handle FormData for file uploads
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return authHttp.put(`${API_BASE}/${id}`, postData, config);
};

export const deletePostApi = async (id) => {
  return authHttp.delete(`${API_BASE}/${id}`);
};

export const togglePostStatusApi = async (id) => {
  return authHttp.patch(`${API_BASE}/${id}/toggle`);
};