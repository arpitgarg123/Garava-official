// src/features/search/selectors.js
export const selectSearchResults = (state) => state.search.results;
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchFilters = (state) => state.search.filters;
export const selectSearchSuggestions = (state) => state.search.suggestions;
export const selectRecentSearches = (state) => state.search.recentSearches;
export const selectPopularSearches = (state) => state.search.popularSearches;

// Derived selectors
export const selectIsSearchLoading = (state) => state.search.results.status === 'loading';
export const selectHasSearchResults = (state) => {
  const products = state.search.results.products;
  return Array.isArray(products) && products.length > 0;
};
export const selectSearchError = (state) => state.search.results.error;