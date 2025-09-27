import http from "../../shared/api/http.js";

// Cart API functions
export const getCart = async () => {
  console.log('Cart API - Getting cart');
  try {
    const response = await http.get("/api/cart");
    console.log('Cart API - Get cart success:', response.data);
    return response;
  } catch (error) {
    console.error('Cart API - Get cart error:', error.response?.data || error.message);
    throw error;
  }
};

export const addToCart = async (payload) => {
  console.log('Cart API - Making request to add to cart:', payload);
  
  // Validate payload structure
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload: payload must be an object');
  }
  
  if (!payload.productId) {
    throw new Error('Invalid payload: productId is required');
  }
  
  if (!payload.variantId && !payload.variantSku) {
    throw new Error('Invalid payload: either variantId or variantSku is required');
  }
  
  try {
    const response = await http.post('/api/cart', payload);
    console.log('Cart API - Add to cart success:', response.data);
    return response;
  } catch (error) {
    console.error('Cart API - Add to cart error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      payload: payload
    });
    
    // Enhanced error messages based on status codes
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Invalid request. Please check product information.';
      throw new Error(message);
    } else if (error.response?.status === 401) {
      throw new Error('Please log in to add items to cart.');
    } else if (error.response?.status === 404) {
      throw new Error('Product not found. It may have been removed.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
};

export const updateCartItem = async (payload) => {
  console.log('Cart API - Update cart item:', payload);
  try {
    const response = await http.put("/api/cart", payload);
    console.log('Cart API - Update cart item success:', response.data);
    return response;
  } catch (error) {
    console.error('Cart API - Update cart item error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid update request');
    } else if (error.response?.status === 404) {
      throw new Error('Cart item not found');
    }
    throw error;
  }
};

export const removeCartItem = async ({ productId, variantId, variantSku }) => {
  console.log('Cart API - Remove cart item:', { productId, variantId, variantSku });
  
  if (!productId) {
    throw new Error('Product ID is required to remove item');
  }
  if (!variantId && !variantSku) {
    throw new Error('Either variant ID or variant SKU is required to remove item');
  }
  
  const params = new URLSearchParams();
  params.append("productId", productId);
  if (variantId) params.append("variantId", variantId);
  if (variantSku) params.append("variantSku", variantSku);
  
  try {
    const response = await http.delete(`/api/cart/item?${params.toString()}`);
    console.log('Cart API - Remove cart item success:', response.data);
    return response;
  } catch (error) {
    console.error('Cart API - Remove cart item error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('Cart item not found');
    }
    throw error;
  }
};

export const clearCart = async () => {
  console.log('Cart API - Clearing cart');
  try {
    const response = await http.delete("/api/cart");
    console.log('Cart API - Clear cart success:', response.data);
    return response;
  } catch (error) {
    console.error('Cart API - Clear cart error:', error.response?.data || error.message);
    throw error;
  }
};