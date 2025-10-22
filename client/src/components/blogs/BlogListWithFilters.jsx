import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogCard from './BlogCard';
import { 
  fetchBlogs, 
  setFilters, 
  setCurrentPage,
  selectBlogs,
  selectBlogLoading,
  selectBlogError,
  selectBlogPagination,
  selectBlogFilters
} from '../../features/blogs/slice';
import { AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai';
import Pagination from '../Pagination';

const BlogList = ({ showHeader = true, limit = 12 }) => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const loading = useSelector(selectBlogLoading);
  const error = useSelector(selectBlogError);
  const pagination = useSelector(selectBlogPagination);
  const filters = useSelector(selectBlogFilters);

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs({ ...filters, limit }));
  }, [dispatch, filters, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: localSearch }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchBlogs({ ...filters, page, limit }));
  };

  const clearFilters = () => {
    setLocalSearch('');
    dispatch(setFilters({
      search: '',
      category: '',
      tag: '',
      sort: 'newest'
    }));
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => dispatch(fetchBlogs({ ...filters, limit }))}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showHeader && (
        <div className="mb-8">
          
          {/* Search and Filters */}
          <div className="mb-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none  "
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <AiOutlineFilter />
                Filters
              </button>
            </form>

            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange({ category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Fragrance">Fragrance</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Tips">Tips</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange({ sort: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="views">Most Viewed</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No blogs found</div>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {loading && blogs.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default BlogList;