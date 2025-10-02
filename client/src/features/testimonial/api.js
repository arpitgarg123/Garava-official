import  http  from '../../shared/api/http.js';

const API_BASE = '/testimonials';

// Public API calls
export const getTestimonialsApi = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `${API_BASE}?${queryParams}` : API_BASE;
  return http.get(url);
};

export const getFeaturedTestimonialsApi = async (limit = 8) => {
  return http.get(`${API_BASE}/featured?limit=${limit}`);
};

export const getLatestTestimonialsApi = async (limit = 10) => {
  return http.get(`${API_BASE}/latest?limit=${limit}`);
};

export const getTestimonialByIdApi = async (id) => {
  return http.get(`${API_BASE}/${id}`);
};

// Admin API calls
export const createTestimonialApi = async (testimonialData) => {
  return http.post(API_BASE, testimonialData);
};

export const updateTestimonialApi = async (id, testimonialData) => {
  return http.put(`${API_BASE}/${id}`, testimonialData);
};

export const deleteTestimonialApi = async (id) => {
  return http.delete(`${API_BASE}/${id}`);
};

export const toggleTestimonialStatusApi = async (id) => {
  return http.patch(`${API_BASE}/${id}/toggle-status`);
};

export const toggleFeaturedStatusApi = async (id) => {
  return http.patch(`${API_BASE}/${id}/toggle-featured`);
};

export const bulkUpdateOrderApi = async (updates) => {
  return http.patch(`${API_BASE}/bulk/order`, { updates });
};

export const fetchGoogleReviewsApi = async () => {
  return http.post(`${API_BASE}/google/fetch`);
};

export const getTestimonialStatsApi = async () => {
  return http.get(`${API_BASE}/admin/stats`);
};