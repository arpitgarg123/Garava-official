import http from "../../shared/api/http.js";

// Wishlist API functions
export const getWishlist = async (params = {}) => {
  console.log('Wishlist API - Getting wishlist:', params);
  try {
    const response = await http.get("/api/wishlist", { params });
    console.log('Wishlist API - Get wishlist success:', response.data);
    return response;
  } catch (error) {
    console.error('Wishlist API - Get wishlist error:', error.response?.data || error.message);
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  console.log('Wishlist API - Adding to wishlist:', productId);
  
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.post(`/api/wishlist/${productId}`);
    console.log('Wishlist API - Add to wishlist success:', response.data);
    return response;
  } catch (error) {
    console.error('Wishlist API - Add to wishlist error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
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
  console.log('Wishlist API - Removing from wishlist:', productId);
  
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.delete(`/api/wishlist/${productId}`);
    console.log('Wishlist API - Remove from wishlist success:', response.data);
    return response;
  } catch (error) {
    console.error('Wishlist API - Remove from wishlist error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 404) {
      throw new Error('Product not found in wishlist');
    }
    throw error;
  }
};

export const toggleWishlist = async (productId) => {
  console.log('Wishlist API - Toggling wishlist:', productId);
  
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  try {
    const response = await http.post(`/api/wishlist/toggle/${productId}`);
    console.log('Wishlist API - Toggle wishlist success:', response.data);
    return response;
  } catch (error) {
    console.error('Wishlist API - Toggle wishlist error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
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