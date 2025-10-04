// Utility functions for filter management
export const resetFiltersForNavigation = (newType) => {
  return {
    type: newType,
    category: "",
    priceMin: null,
    priceMax: null,
    colors: [],
    sort: "newest",
    page: 1,
    limit: 20
  };
};

export const buildFilterParams = (filters) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 20,
    sort: filters.sort || "newest",
  };

  if (filters.type) params.type = filters.type;
  if (filters.category && !filters.category.startsWith("all-")) {
    params.category = filters.category;
  }
  if (filters.priceMin != null && filters.priceMin !== "") {
    params.priceMin = filters.priceMin;
  }
  if (filters.priceMax != null && filters.priceMax !== "") {
    params.priceMax = filters.priceMax;
  }
  if (filters.colors && Array.isArray(filters.colors) && filters.colors.length > 0) {
    params.colors = filters.colors.join(',');
  }

  return params;
};