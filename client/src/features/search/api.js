// src/features/search/api.js
import http from "../../shared/api/http.js";

// Search products using the existing product API with query parameter
export const searchProductsApi = async (params = {}) => {
  const cleanParams = {
    ...params,
    page: params.page || 1,
    limit: params.limit || 20
  };
  
  // Remove empty values
  Object.keys(cleanParams).forEach(key => {
    if (cleanParams[key] === '' || cleanParams[key] === null || cleanParams[key] === undefined) {
      delete cleanParams[key];
    }
  });
  
  const response = await http.get("/product", { params: cleanParams });
  
  // Handle different response structures like the product slice does
  const data = response.data;
  
  if (Array.isArray(data)) {
    return {
      products: data,
      total: data.length,
      page: cleanParams.page || 1,
      totalPages: Math.ceil(data.length / (cleanParams.limit || 20))
    };
  } else if (data?.products) {
    return {
      products: data.products,
      total: data.pagination?.total || data.products.length,
      page: data.pagination?.page || cleanParams.page || 1,
      totalPages: data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.products.length) / (cleanParams.limit || 20))
    };
  } else {
    return {
      products: data?.items || [],
      total: data?.pagination?.total || (data?.items?.length || 0),
      page: data?.pagination?.page || cleanParams.page || 1,
      totalPages: data?.pagination?.totalPages || Math.ceil((data?.pagination?.total || (data?.items?.length || 0)) / (cleanParams.limit || 20))
    };
  }
};

// Get popular search terms (can be enhanced with backend tracking)
export const getPopularSearchesApi = () => {
  // For now returning mock data, can be replaced with actual API call
  return Promise.resolve([
    'Diamond Rings',
    'Gold Earrings',
    'Wedding Jewellery',
    'Fragrance Collection',
    'Silver Pendants',
    'Bracelets',
    'Chains',
    'Perfumes'
  ]);
};

// Search suggestions based on query (can be enhanced with backend)
export const getSearchSuggestionsApi = (query) => {
  // Mock implementation - can be replaced with actual API
  const suggestions = [
    'Diamond Rings',
    'Diamond Earrings', 
    'Diamond Pendants',
    'Gold Rings',
    'Gold Earrings',
    'Gold Chains',
    'Silver Rings',
    'Silver Earrings',
    'Silver Pendants',
    'Wedding Rings',
    'Wedding Sets',
    'Engagement Rings',
    'Fragrance Collection',
    'Perfumes for Women',
    'Perfumes for Men',
    'Daily Wear Jewellery',
    'Party Wear Jewellery',
    'Bracelets',
    'Bangles',
    'Necklaces'
  ];
  
  return Promise.resolve(
    suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
  );
};