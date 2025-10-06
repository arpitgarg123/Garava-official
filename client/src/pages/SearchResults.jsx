import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { CiSearch, CiFilter } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { RiHistoryLine, RiFireLine, RiArrowRightLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";

// Redux
import { 
  searchProducts, 
  setQuery, 
  setFilters, 
  clearFilters,
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  clearResults,
  getSearchSuggestions
} from '../features/search/slice.js';

import {
  selectSearchResults,
  selectSearchQuery,
  selectSearchFilters,
  selectSearchSuggestions,
  selectRecentSearches,
  selectPopularSearches,
  selectIsSearchLoading,
  selectHasSearchResults
} from '../features/search/selectors.js';

// Components
import ProductCard from '../components/Products/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import BackButton from '../components/BackButton.jsx';

// Simple debounce utility
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);
      
      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer]
  );

  return debouncedCallback;
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state
  const [inputQuery, setInputQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'jewellery', 'fragrance'

  // Redux selectors
  const searchResults = useSelector(selectSearchResults);
  const currentQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectSearchFilters);
  const suggestions = useSelector(selectSearchSuggestions);
  const recentSearches = useSelector(selectRecentSearches);
  const popularSearches = useSelector(selectPopularSearches);
  const isLoading = useSelector(selectIsSearchLoading);
  const hasResults = useSelector(selectHasSearchResults);

  // Debug logging
  useEffect(() => {
    console.log('Search Results:', searchResults);
    console.log('Has Results:', hasResults);
    console.log('Is Loading:', isLoading);
  }, [searchResults, hasResults, isLoading]);

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlType = searchParams.get('type') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlPage = searchParams.get('page') || '1';
    
    setInputQuery(urlQuery);
    dispatch(setQuery(urlQuery));
    
    if (urlType || urlCategory) {
      dispatch(setFilters({ 
        type: urlType, 
        category: urlCategory,
        page: parseInt(urlPage)
      }));
    }
    
    if (urlType) {
      setActiveTab(urlType);
    }
    
    // Perform search if there's a query
    if (urlQuery.trim()) {
      handleSearch(urlQuery, { type: urlType, category: urlCategory, page: parseInt(urlPage) });
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useDebounce((query, searchFilters = {}) => {
    if (query.trim()) {
      dispatch(searchProducts({
        q: query,
        ...filters,
        ...searchFilters
      }));
    }
  }, 300);

  // Handle search
  const handleSearch = (query = inputQuery, searchFilters = {}) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Update redux state
    dispatch(setQuery(trimmedQuery));
    dispatch(addRecentSearch(trimmedQuery));
    
    // Update URL
    const newParams = new URLSearchParams();
    newParams.set('q', trimmedQuery);
    
    const finalFilters = { ...filters, ...searchFilters };
    if (finalFilters.type) newParams.set('type', finalFilters.type);
    if (finalFilters.category) newParams.set('category', finalFilters.category);
    if (finalFilters.page && finalFilters.page > 1) newParams.set('page', finalFilters.page.toString());
    
    setSearchParams(newParams);
    
    // Hide suggestions
    setShowSuggestions(false);
    
    // Perform search
    debouncedSearch(trimmedQuery, searchFilters);
  };

  // Handle input change and show suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputQuery(value);
    setShowSuggestions(true);
    
    if (value.trim()) {
      dispatch(getSearchSuggestions(value));
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (query) => {
    setInputQuery(query);
    handleSearch(query);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    if (currentQuery) {
      handleSearch(currentQuery, newFilters);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const typeFilter = tab === 'all' ? '' : tab;
    handleFilterChange({ type: typeFilter, page: 1 });
  };

  // Handle page change
  const handlePageChange = (page) => {
    handleFilterChange({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50  md:pt-32">
      {/* Header */}
      <div className=" border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
           <div className="sticky top-56 z-10 mb-3">
                 <BackButton />
               </div>
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Search for jewelry, fragrance..."
                  className="block w-full pl-10 pr-12 py-3 outline-none border border-gray-300 rounded-xl  focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                />
                {inputQuery && (
                  <button
                    onClick={() => {
                      setInputQuery('');
                      dispatch(clearResults());
                      setSearchParams({});
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <IoCloseOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (inputQuery.length > 0 || recentSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
                  >
                    {/* Suggestions */}
                    {inputQuery.length > 0 && suggestions.items.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 flex items-center gap-2">
                          <CiSearch className="h-3 w-3" />
                          Suggestions
                        </div>
                        {suggestions.items.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                          >
                            <RiArrowRightLine className="h-4 w-4 text-gray-400" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Recent Searches */}
                    {inputQuery.length === 0 && recentSearches.length > 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 flex items-center gap-2 justify-between">
                          <span className="flex items-center gap-2">
                            <RiHistoryLine className="h-3 w-3" />
                            Recent Searches
                          </span>
                          <button
                            onClick={() => dispatch(clearRecentSearches())}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Clear All
                          </button>
                        </div>
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button
                              onClick={() => handleRecentSearchClick(search)}
                              className="flex-1 text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                            >
                              <RiHistoryLine className="h-4 w-4 text-gray-400" />
                              {search}
                            </button>
                            <button
                              onClick={() => dispatch(removeRecentSearch(search))}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <IoCloseOutline className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Popular Searches */}
                    {inputQuery.length === 0 && (
                      <div className="p-2 border-t border-gray-100">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 flex items-center gap-2">
                          <RiFireLine className="h-3 w-3" />
                          Popular Searches
                        </div>
                        {popularSearches.slice(0, 4).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                          >
                            <FiTrendingUp className="h-4 w-4 text-gray-400" />
                            {search}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                showFilters 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <CiFilter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowSuggestions(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        {/* Category Tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'jewellery', label: 'Jewellery' },
              { id: 'fragrance', label: 'Fragrance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-2 rounded-lg text-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="text-md text-red-500 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange({ priceMin: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange({ priceMax: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Category (if jewellery is selected) */}
                {activeTab === 'jewellery' && (
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange({ category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    >
                      <option value="">All Categories</option>
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="pendants">Pendants</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="chains">Chains</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        {currentQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    `${searchResults.total || 0} results found for "${currentQuery}"`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {searchResults.error && (
          <div className="text-center py-10">
            <div className="text-red-500 mb-2">Error: {searchResults.error}</div>
            <button
              onClick={() => handleSearch(currentQuery)}
              className="text-blue-500 hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && currentQuery && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
            <div className="text-md text-yellow-700">
              <div>Status: {searchResults.status}</div>
              <div>Products Count: {searchResults.products?.length || 0}</div>
              <div>Total: {searchResults.total}</div>
              <div>Has Results: {hasResults ? 'Yes' : 'No'}</div>
              <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
              {searchResults.error && <div>Error: {searchResults.error}</div>}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {searchResults.products.map((product, index) => (
                <ProductCard key={product._id || product.id || index} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {searchResults.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={searchResults.page}
                  totalPages={searchResults.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && currentQuery && !hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <CiSearch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{currentQuery}". Try different keywords or browse our categories.
              </p>
              <div className="space-y-2">
                <p className="text-md font-medium text-gray-700">Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 4).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-3 py-1 bg-gray-50 text-gray-700 text-md rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State (No search performed) */}
        {!currentQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="max-w-lg mx-auto">
              <CiSearch className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Discover Amazing Products
              </h2>
              <p className="text-gray-600 mb-8">
                Search through our collection of premium jewelry and fragrances
              </p>
              
              {/* Popular Searches */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTabChange('jewellery')}
                  className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">💎</div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-yellow-800">Jewellery</h4>
                  <p className="text-md text-gray-600">Rings, Earrings, Pendants</p>
                </button>
                
                <button
                  onClick={() => handleTabChange('fragrance')}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">🌸</div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-purple-800">Fragrance</h4>
                  <p className="text-md text-gray-600">Premium Perfumes</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
