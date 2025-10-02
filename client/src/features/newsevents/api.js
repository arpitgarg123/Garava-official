// src/features/newsevents/api.js
import http from "../../shared/api/http.js";

/**
 * Public News & Events API Integration
 * These endpoints are publicly accessible
 */

// Get all news & events with filters
export const listNewsEventsApi = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return http.get(`/newsevents${queryString ? `?${queryString}` : ''}`);
};

// Get events grouped by upcoming/past
export const getEventsGroupedApi = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return http.get(`/newsevents/events/grouped${queryString ? `?${queryString}` : ''}`);
};

// Get media coverage
export const getMediaCoverageApi = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return http.get(`/newsevents/media-coverage${queryString ? `?${queryString}` : ''}`);
};

// Get filter options
export const getFilterOptionsApi = () => {
  return http.get('/newsevents/filter-options');
};

// Get single item by slug
export const getNewsBySlugApi = (slug) => {
  return http.get(`/newsevents/${encodeURIComponent(slug)}`);
};