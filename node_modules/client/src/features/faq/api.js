// src/features/faq/api.js
import http from "../../shared/api/http.js";

// Search FAQs for chatbot
export const searchFAQsApi = async (query, category = null) => {
  const params = { q: query };
  if (category) params.category = category;
  
  const response = await http.get("/faq/search", { params });
  return response.data;
};

// Get FAQ categories
export const getFAQCategoriesApi = async () => {
  const response = await http.get("/faq/categories");
  return response.data;
};

// Record FAQ match for analytics
export const recordFAQMatchApi = async (faqId) => {
  const response = await http.post(`/faq/${faqId}/match`);
  return response.data;
};

// Vote on FAQ helpfulness
export const voteFAQApi = async (faqId, isHelpful) => {
  const response = await http.post(`/faq/${faqId}/vote`, { helpful: isHelpful });
  return response.data;
};

// Admin APIs
export const getAllFAQsApi = async (params = {}) => {
  const response = await http.get("/admin/faq", { params });
  return response.data;
};

export const createFAQApi = async (faqData) => {
  const response = await http.post("/admin/faq", faqData);
  return response.data;
};

export const updateFAQApi = async (id, faqData) => {
  const response = await http.put(`/admin/faq/${id}`, faqData);
  return response.data;
};

export const deleteFAQApi = async (id) => {
  const response = await http.delete(`/admin/faq/${id}`);
  return response.data;
};

export const getFAQByIdApi = async (id) => {
  const response = await http.get(`/admin/faq/${id}`);
  return response.data;
};

export const toggleFAQStatusApi = async (id) => {
  const response = await http.patch(`/admin/faq/${id}/toggle`);
  return response.data;
};

export const bulkCreateFAQsApi = async (faqs) => {
  const response = await http.post("/admin/faq/bulk", { faqs });
  return response.data;
};

export const getFAQAnalyticsApi = async () => {
  const response = await http.get("/admin/faq/analytics");
  return response.data;
};