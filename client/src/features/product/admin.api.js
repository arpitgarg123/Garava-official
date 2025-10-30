import { authHttp } from "../../shared/api/http";

/**
 * Product Admin API Integration
 * All endpoints require admin authentication
 */

// List all products with pagination and filters
export const listProductsAdmin = (params = {}) => {
  const { page = 1, limit = 20, q, status, category } = params;
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (q) queryParams.append('q', q);
  if (status) queryParams.append('status', status);
  if (category) queryParams.append('category', category);
  
  return authHttp.get(`/admin/product?${queryParams.toString()}`);
};

// Create a new product
export const createProduct = (productData) => {
  // If productData contains files, use FormData with extended timeout
  if (productData instanceof FormData) {
    return authHttp.post('/admin/product', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
    });
  }
  
  // Otherwise, send as JSON
  return authHttp.post('/admin/product', productData);
};

// Update an existing product
export const updateProduct = (productId, productData) => {
  // If productData contains files, use FormData with extended timeout
  if (productData instanceof FormData) {
    return authHttp.put(`/admin/product/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
    });
  }
  
  // Otherwise, send as JSON
  return authHttp.put(`/admin/product/${productId}`, productData);
};

// Soft delete (archive) a product
export const deleteProduct = (productId) => {
  return authHttp.delete(`/admin/product/${productId}`);
};

// Add a variant to an existing product
export const addVariant = (productId, variantData) => {
  return authHttp.post(`/admin/product/${productId}/variants`, variantData);
};

// Update a specific variant
export const updateVariant = (productId, variantId, variantData) => {
  return authHttp.put(`/admin/product/${productId}/variants/${variantId}`, variantData);
};

// Update stock for a specific variant
export const updateStock = (productId, stockData) => {
  return authHttp.patch(`/admin/product/${productId}/stock`, stockData);
};

// Helper function to prepare product data for FormData
export const prepareProductFormData = (productData) => {
  const formData = new FormData();
  
  // Handle files separately
  const { heroImage, gallery, newGalleryFiles, galleryToDelete, colorVariantImages, ...otherData } = productData;
  
  // Add hero image file if provided
  if (heroImage instanceof File) {
    formData.append('heroImage', heroImage);
  } else if (heroImage && typeof heroImage === 'object') {
    // If heroImage is an object with url/fileId, include it in the JSON data
    otherData.heroImage = heroImage;
  }
  
  // Handle gallery - existing images to keep (add to otherData, not formData)
  if (gallery && Array.isArray(gallery)) {
    // Filter out File objects and keep only URL objects for JSON (existing images)
    const galleryUrls = gallery.filter(item => item && typeof item === 'object' && item.url);
    if (galleryUrls.length > 0) {
      otherData.gallery = galleryUrls;
    } else {
      // Explicitly set empty array if no existing images to keep
      otherData.gallery = [];
    }
  } else if (gallery !== undefined) {
    // If gallery is explicitly undefined or null, set empty array
    otherData.gallery = [];
  }
  
  // Add gallery fileIds to delete (add to otherData)
  if (galleryToDelete && Array.isArray(galleryToDelete) && galleryToDelete.length > 0) {
    otherData.galleryToDelete = galleryToDelete;
  }
  
  // Handle color variant images
  if (colorVariantImages && typeof colorVariantImages === 'object') {
    Object.keys(colorVariantImages).forEach(colorIndex => {
      const colorImages = colorVariantImages[colorIndex];
      
      // Add color hero image
      if (colorImages.heroImage instanceof File) {
        formData.append(`colorVariant_${colorIndex}_heroImage`, colorImages.heroImage);
      }
      
      // Add color gallery images
      if (colorImages.gallery && Array.isArray(colorImages.gallery)) {
        colorImages.gallery.forEach((file) => {
          if (file instanceof File) {
            formData.append(`colorVariant_${colorIndex}_gallery`, file);
          }
        });
      }
    });
  }
  
  // Add all other data as JSON strings FIRST
  Object.keys(otherData).forEach(key => {
    const value = otherData[key];
    if (value !== undefined && value !== null) {
      // Special handling for array fields to prevent stringification loops
      if (key === 'badges' || key === 'tags' || key === 'collections') {
        if (Array.isArray(value)) {
          // Filter to ensure only valid strings
          const cleanArray = value.filter(item => typeof item === 'string' && item.trim() !== '');
          formData.append(key, JSON.stringify(cleanArray));
        }
        return;
      }
      
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  // Add new gallery files to upload AFTER other data (important!)
  // Use a different field name than 'gallery' to avoid conflict with existing gallery JSON
  if (newGalleryFiles && Array.isArray(newGalleryFiles)) {
    newGalleryFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('newGalleryImages', file);  // Different field name to avoid conflict
      }
    });
  }
  
  return formData;
};