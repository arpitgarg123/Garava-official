import { authHttp } from "../../shared/api/http.js";

/**
 * News & Events Admin API Integration
 * All endpoints require admin authentication
 */

// List all news & events with pagination and filters (admin)
export const listNewsEventsAdmin = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return authHttp.get(`/admin/newsevents${queryString ? `?${queryString}` : ''}`);
};

// Get single news/event by ID (admin)
export const getNewsEventByIdAdmin = (id) => {
  return authHttp.get(`/admin/newsevents/${id}`);
};

// Create a new news/event
export const createNewsEventAdmin = (data) => {
  // If data contains files, use FormData
  if (data instanceof FormData) {
    return authHttp.post('/admin/newsevents', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  return authHttp.post('/admin/newsevents', data);
};

// Update news/event
export const updateNewsEventAdmin = (id, data) => {
  // If data contains files, use FormData
  if (data instanceof FormData) {
    return authHttp.put(`/admin/newsevents/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  return authHttp.put(`/admin/newsevents/${id}`, data);
};

// Delete news/event
export const deleteNewsEventAdmin = (id) => {
  return authHttp.delete(`/admin/newsevents/${id}`);
};

// Update news/event status
export const updateNewsEventStatusAdmin = (id, status) => {
  return authHttp.patch(`/admin/newsevents/${id}/status`, { status });
};

// Get admin statistics
export const getNewsEventStatsAdmin = () => {
  return authHttp.get('/admin/newsevents/stats');
};

// Bulk update status
export const bulkUpdateStatusAdmin = (ids, status) => {
  return authHttp.patch('/admin/newsevents/bulk-status', { ids, status });
};