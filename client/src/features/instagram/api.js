import  http  from '../../shared/api/http.js';

const API_BASE = '/instagram';

// Public API calls
export const getFeaturedPostsApi = async (limit = 4) => {
  return http.get(`${API_BASE}/featured?limit=${limit}`);
};

// Admin API calls
export const getAllPostsApi = async (params = {}) => {
  console.log('getAllPostsApi called with params:', params);
  
  // Filter out undefined values to avoid sending 'undefined' strings
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined && value !== null && value !== '')
  );
  
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = queryParams ? `${API_BASE}?${queryParams}` : API_BASE;
  console.log('Making request to:', url);
  
  try {
    const response = await http.get(url);
    console.log('getAllPostsApi response:', response.data);
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
  return http.post(API_BASE, postData, config);
};

export const updatePostApi = async (id, postData) => {
  // Handle FormData for file uploads
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.put(`${API_BASE}/${id}`, postData, config);
};

export const deletePostApi = async (id) => {
  return http.delete(`${API_BASE}/${id}`);
};

export const togglePostStatusApi = async (id) => {
  return http.patch(`${API_BASE}/${id}/toggle`);
};