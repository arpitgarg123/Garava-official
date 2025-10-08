import http, { retryRequest } from "../../shared/api/http.js";

// Wishlist API functions with retry mechanism
export const getWishlist = async (params = {}, cancelToken) => {
  try {
    const response = await retryRequest(() => 
      http.get("/wishlist", { params, cancelToken })
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.post(`/wishlist/${productId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid wishlist request');
    } else if (error.response?.status === 404) {
      throw new Error('Product not found');
    } else if (error.response?.status === 409) {
      throw new Error('Product already in wishlist');
    }
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.delete(`/wishlist/${productId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Product not found in wishlist');
    }
    throw error;
  }
};

export const toggleWishlist = async (productId) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.post(`/wishlist/toggle/${productId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Product not found');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed - please login again');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred');
    }
    throw error;
  }
};