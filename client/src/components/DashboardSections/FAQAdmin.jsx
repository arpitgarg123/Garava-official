import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFileText, FiFilter } from 'react-icons/fi';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye, 
  FaToggleOn, 
  FaToggleOff,
  FaDownload,
  FaUpload,
  FaFileImport
} from 'react-icons/fa';
import { BiCategory, BiX } from 'react-icons/bi';
import { 
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQById,
  toggleFAQStatus,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal
} from '../../features/faq/adminSlice.js';
import { bulkCreateFAQsApi } from '../../features/faq/api.js';

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const FAQAdmin = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    list, 
    currentFAQ, 
    createModal,
    editModal 
  } = useSelector(state => state.faqAdmin);
  
  // Local state for immediate UI updates
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Combined filters object
  const filters = {
    search: debouncedSearchTerm,
    category: categoryFilter,
    isActive: statusFilter
  };

  // Load FAQs when filters or page changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== '')
      )
    };
    
    dispatch(getAllFAQs(params));
  }, [dispatch, currentPage, debouncedSearchTerm, categoryFilter, statusFilter]);

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((type, value) => {
    switch (type) {
      case 'category':
        setCategoryFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      default:
        break;
    }
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  // Handle edit
  const handleEdit = (faqId) => {
    dispatch(getFAQById(faqId));
    dispatch(openEditModal(faqId));
  };

  // Handle delete
  const handleDelete = async (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await dispatch(deleteFAQ(faqId)).unwrap();
        // Reload list with current filters
        const params = {
          page: currentPage,
          limit: 10,
          ...Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== '')
          )
        };
        dispatch(getAllFAQs(params));
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (faqId) => {
    try {
      await dispatch(toggleFAQStatus(faqId)).unwrap();
      // Reload list with current filters
      const params = {
        page: currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== '')
        )
      };
      dispatch(getAllFAQs(params));
    } catch (error) {
      console.error('Failed to toggle FAQ status:', error);
    }
  };

  // Category options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'products', label: 'Products' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'returns', label: 'Returns' },
    { value: 'care', label: 'Care Instructions' },
    { value: 'sizing', label: 'Sizing' },
    { value: 'materials', label: 'Materials' },
    { value: 'orders', label: 'Orders' }
  ];

  // Mobile FAQ Card Component
  const MobileFAQCard = ({ faq }) => (
    <div className="bg-white  border border-gray-200 shadow-sm p-4 mb-4">
      <div className="space-y-3">
        {/* Header with status and category */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 flex-1">
            {faq.question}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              faq.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {faq.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {faq.category}
            </span>
          </div>
        </div>
        
        {/* Answer */}
        <p className="text-sm sm:text-sm text-gray-600 line-clamp-3">
          {faq.answer}
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 ">Priority: {faq.priority}</span>
          <span className="bg-gray-100 px-2 py-1 ">Matches: {faq.timesMatched}</span>
          <span className="bg-gray-100 px-2 py-1 ">👍 {faq.helpfulVotes}</span>
          <span className="bg-gray-100 px-2 py-1 ">👎 {faq.unhelpfulVotes}</span>
        </div>

        {/* Keywords */}
        {faq.keywords && faq.keywords.length > 0 && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">Keywords:</span> {faq.keywords.slice(0, 3).join(', ')}
            {faq.keywords.length > 3 && ` +${faq.keywords.length - 3} more`}
          </div>
        )}
        
        {/* Mobile Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={() => handleToggleStatus(faq._id)}
            className={`p-2  transition-colors ${
              faq.isActive
                ? 'text-green-600 hover:bg-green-50'
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={faq.isActive ? 'Deactivate' : 'Activate'}
          >
            {faq.isActive ? <FaToggleOn className="w-4 h-4" /> : <FaToggleOff className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(faq._id)}
              className="p-2 text-blue-600 hover:bg-blue-50  transition-colors"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleDelete(faq._id)}
              className="p-2 text-red-600 hover:bg-red-50  transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b w-full border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 mb-4">
          <div className="min-w-0  max-sm:hidden flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              FAQ Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage chatbot FAQ responses • {list.total || 0} total FAQs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row max-sm:flex-row max-sm:justify-between items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCSVUpload(!showCSVUpload)}
              className="btn-black btn-small flex items-center justify-center gap-2"
            >
              <FaFileImport className="w-4 h-4" />
              <span className="hidden sm:inline">Import CSV</span>
              <span className="sm:hidden">Import</span>
            </button>
            <button
              onClick={() => dispatch(openCreateModal())}
              className="btn-black btn-small flex"
            >
              <FaPlus className="w-3 h-3" />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4 max-sm:mb-0">
          <p className="text-sm text-gray-600">
            {list.faqs?.length || 0} FAQs
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-sm border border-gray-300  hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300  outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300  outline-none"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300  outline-none"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || categoryFilter || statusFilter) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300  hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 lg:hidden ${
          showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileFilters(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${
            showMobileFilters ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="font-semibold text-lg">Filter FAQs</h3>
            <button 
              onClick={() => setShowMobileFilters(false)} 
              className="p-1 rounded-full hover:bg-gray-50"
            >
              <BiX size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300  outline-none"
                />
              </div>
            </div>

            {/* Mobile Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex max-sm:justify-between gap-4">
            <button 
              onClick={handleClearFilters}
              className="btn-small px-4 py-1 border"
            >
              Clear All
            </button>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="btn-black btn-small"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* CSV Upload Panel */}
      <AnimatePresence>
        {showCSVUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-gray-50 overflow-hidden"
          >
            <CSVUploadPanel onClose={() => setShowCSVUpload(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Content Section */}
      <div className="flex-1 overflow-hidden w-full">
        {list.status === 'loading' ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          </div>
        ) : list.faqs?.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter || statusFilter 
                  ? "Try adjusting your search or filters"
                  : "Create your first FAQ to get started"
                }
              </p>
              {(searchTerm || categoryFilter || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {/* Mobile Cards */}
            <div className="block lg:hidden p-4">
              {list.faqs.map((faq) => (
                <MobileFAQCard key={faq._id} faq={faq} />
              ))}
            </div>
            
            {/* Desktop List */}
            <div className="hidden lg:block">
              <div className="divide-y divide-gray-200">
                {list.faqs.map((faq) => (
                  <div key={faq._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 flex-1">
                            {faq.question}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                            faq.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex-shrink-0">
                            {faq.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-3">
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Priority: {faq.priority}</span>
                          <span>Matches: {faq.timesMatched}</span>
                          <span>👍 {faq.helpfulVotes}</span>
                          <span>👎 {faq.unhelpfulVotes}</span>
                          <span>Keywords: {faq.keywords?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleToggleStatus(faq._id)}
                          className={`p-2  transition-colors ${
                            faq.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={faq.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {faq.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(faq._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50  transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 text-red-600 hover:bg-red-50  transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      {list.totalPages > 1 && (
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, list.total)} of {list.total} results
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-600 border border-gray-300  hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Prev
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white  font-medium text-sm min-w-[40px] text-center">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, list.totalPages))}
                disabled={currentPage === list.totalPages}
                className="px-3 py-2 text-gray-600 border border-gray-300  hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300  text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white  text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, list.totalPages))}
                disabled={currentPage === list.totalPages}
                className="px-3 py-1 border border-gray-300  text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FAQCreateModal />
      <FAQEditModal />
    </div>
  );
};

// Create FAQ Modal Component - Responsive
const FAQCreateModal = () => {
  const dispatch = useDispatch();
  const { createModal } = useSelector(state => state.faqAdmin);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    priority: 0,
    keywords: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const faqData = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    await dispatch(createFAQ(faqData));
    
    if (createModal.status === 'succeeded') {
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        priority: 0,
        keywords: '',
        tags: ''
      });
      dispatch(closeCreateModal());
    }
  };

  if (!createModal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white  w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Create New FAQ</h3>
            <button
              onClick={() => dispatch(closeCreateModal())}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300  outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300  outline-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              >
                <option value="general">General</option>
                <option value="products">Products</option>
                <option value="shipping">Shipping</option>
                <option value="returns">Returns</option>
                <option value="care">Care Instructions</option>
                <option value="sizing">Sizing</option>
                <option value="materials">Materials</option>
                <option value="orders">Orders</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              placeholder="jewelry, ring, gold, price..."
              className="w-full px-3 py-2 border border-gray-300  outline-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => dispatch(closeCreateModal())}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300  hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createModal.status === 'loading'}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {createModal.status === 'loading' ? 'Creating...' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit FAQ Modal Component - Responsive (similar structure to create)
const FAQEditModal = () => {
  const dispatch = useDispatch();
  const { editModal, currentFAQ } = useSelector(state => state.faqAdmin);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    priority: 0,
    keywords: '',
    tags: '',
    isActive: true
  });

  useEffect(() => {
    if (currentFAQ.data) {
      setFormData({
        question: currentFAQ.data.question || '',
        answer: currentFAQ.data.answer || '',
        category: currentFAQ.data.category || 'general',
        priority: currentFAQ.data.priority || 0,
        keywords: (currentFAQ.data.keywords || []).join(', '),
        tags: (currentFAQ.data.tags || []).join(', '),
        isActive: currentFAQ.data.isActive !== false
      });
    }
  }, [currentFAQ.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const faqData = {
      id: editModal.faqId,
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    await dispatch(updateFAQ(faqData));
    
    if (editModal.status === 'succeeded') {
      dispatch(closeEditModal());
    }
  };

  if (!editModal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white  w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit FAQ</h3>
            <button
              onClick={() => dispatch(closeEditModal())}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300  outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300  outline-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              >
                <option value="general">General</option>
                <option value="products">Products</option>
                <option value="shipping">Shipping</option>
                <option value="returns">Returns</option>
                <option value="care">Care Instructions</option>
                <option value="sizing">Sizing</option>
                <option value="materials">Materials</option>
                <option value="orders">Orders</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300  outline-none"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>
          
          <div className="flex flex-col sm:flex-row max-sm:justify-between max-sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => dispatch(closeEditModal())}
              className="btn-small px-4 py-1 border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editModal.status === 'loading'}
              className="btn-black btn-small "
            >
              {editModal.status === 'loading' ? 'Updating...' : 'Update FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSV Upload Panel Component - Responsive
const CSVUploadPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setUploadResults(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const downloadTemplate = () => {
    const template = `question,answer,category,priority,keywords
"How do I track my order?","You can track your order using the tracking number sent to your email.","orders",8,"track,order,shipping,status"
"What is your return policy?","We offer 30-day returns for unworn items in original condition.","returns",9,"return,refund,policy,exchange"
"How do I care for gold jewelry?","Clean with mild soap and soft brush. Store in a dry place.","care",7,"care,gold,cleaning,maintenance"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      // Simple CSV parsing - handle quoted values
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const faq = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        value = value.replace(/^"|"$/g, ''); // Remove surrounding quotes
        
        if (header === 'keywords') {
          faq[header] = value ? value.split(',').map(k => k.trim()) : [];
        } else if (header === 'priority') {
          faq[header] = parseInt(value) || 0;
        } else {
          faq[header] = value;
        }
      });
      
      return faq;
    });
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    setIsUploading(true);
    try {
      const csvText = await csvFile.text();
      const faqs = parseCSV(csvText);
      
      // Use the existing API function
      const result = await bulkCreateFAQsApi(faqs);
      
      setUploadResults(result);
      // Refresh the FAQ list
      dispatch(getAllFAQs({ page: 1 }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Import FAQs from CSV</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300  outline-none text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white  hover:bg-gray-700 transition-colors text-sm"
            >
              <FaDownload className="w-4 h-4" />
              Download Template
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!csvFile || isUploading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white  hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <FaUpload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload FAQs'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm sm:text-base">CSV Format Requirements:</h4>
          <ul className="text-sm sm:text-sm text-gray-600 space-y-2">
            <li>• <strong>question</strong>: The FAQ question (required)</li>
            <li>• <strong>answer</strong>: The FAQ answer (required)</li>
            <li>• <strong>category</strong>: Category (general, products, shipping, etc.)</li>
            <li>• <strong>priority</strong>: Number 0-10 (higher = more important)</li>
            <li>• <strong>keywords</strong>: Comma-separated keywords for matching</li>
          </ul>
          
          <div className="text-sm sm:text-sm text-amber-600 bg-amber-50 p-3 ">
            <strong>Tip:</strong> Download the template to see the exact format required.
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 ">
          <h4 className="font-medium text-green-800 mb-2">Upload Results</h4>
          <div className="text-sm space-y-1">
            <p>✅ <strong>{uploadResults.summary.created}</strong> FAQs created successfully</p>
            {uploadResults.summary.failed > 0 && (
              <p>❌ <strong>{uploadResults.summary.failed}</strong> FAQs failed to create</p>
            )}
            <p>📊 Total processed: <strong>{uploadResults.summary.total}</strong></p>
          </div>
          
          {uploadResults.errors.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-red-600 font-medium text-sm">View Errors</summary>
              <div className="mt-2 text-sm sm:text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                {uploadResults.errors.map((error, index) => (
                  <p key={index}>Row {error.index + 2}: {error.error}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQAdmin;