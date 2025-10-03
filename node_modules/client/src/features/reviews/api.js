import http from '../../shared/api/http';

// User review APIs
export const reviewAPI = {
  // Get reviews for a product
  getReviews: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return http.get(`/reviews${queryString ? `?${queryString}` : ''}`);
  },
  
  // Create or update review for a product
  createReview: (productId, reviewData) => {
    return http.post(`/reviews/${productId}`, reviewData);
  },
  
  // Update existing review
  updateReview: (reviewId, reviewData) => {
    return http.put(`/reviews/${reviewId}`, reviewData);
  },
  
  // Vote on a review (helpful/unhelpful)
  voteOnReview: (reviewId, type) => {
    return http.post(`/reviews/${reviewId}/vote`, { type });
  }
};

// Admin review APIs
export const reviewAdminAPI = {
  // Get all reviews for admin (including drafts, flagged)
  getReviews: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return http.get(`/reviews/admin${queryString ? `?${queryString}` : ''}`);
  },
  
  // Moderate review (approve, deny, flag)
  moderateReview: (reviewId, moderationData) => {
    return http.post(`/reviews/admin/${reviewId}/moderate`, moderationData);
  },
  
  // Delete review (admin only)
  deleteReview: (reviewId) => {
    return http.delete(`/reviews/${reviewId}`);
  }
};