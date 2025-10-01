import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
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
import { BiCategory } from 'react-icons/bi';
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

const FAQAdmin = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    list, 
    currentFAQ, 
    createModal,
    editModal 
  } = useSelector(state => state.faqAdmin);
  
  // Local state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isActive: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

  // Load FAQs on component mount
  useEffect(() => {
    dispatch(getAllFAQs({ 
      page: currentPage, 
      ...filters 
    }));
  }, [dispatch, currentPage, filters]);

  // Handle search
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle edit
  const handleEdit = (faqId) => {
    dispatch(getFAQById(faqId));
    dispatch(openEditModal(faqId));
  };

  // Handle delete
  const handleDelete = async (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      await dispatch(deleteFAQ(faqId));
      dispatch(getAllFAQs({ page: currentPage, ...filters }));
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (faqId) => {
    await dispatch(toggleFAQStatus(faqId));
    dispatch(getAllFAQs({ page: currentPage, ...filters }));
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
          <p className="text-gray-600 mt-1">Manage chatbot FAQ responses</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCSVUpload(!showCSVUpload)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaFileImport />
            Import CSV
          </button>
          <button
            onClick={() => dispatch(openCreateModal())}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus />
            Add FAQ
          </button>
        </div>
      </div>

      {/* CSV Upload Panel */}
      <AnimatePresence>
        {showCSVUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-gray-50"
          >
            <CSVUploadPanel onClose={() => setShowCSVUpload(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* FAQ List */}
      <div className="flex-1 overflow-auto">
        {list.status === 'loading' ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : list.faqs.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {list.faqs.map((faq) => (
              <div key={faq._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                        {faq.question}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        faq.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
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
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(faq._id)}
                      className={`p-2 rounded-lg transition-colors ${
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {list.totalPages > 1 && (
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, list.total)} of {list.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, list.totalPages))}
                disabled={currentPage === list.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

// Create FAQ Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Create New FAQ</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(closeCreateModal())}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createModal.status === 'loading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createModal.status === 'loading' ? 'Creating...' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit FAQ Modal Component (similar structure to create)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-[90vh] overflow-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Edit FAQ</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => dispatch(closeEditModal())}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editModal.status === 'loading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {editModal.status === 'loading' ? 'Updating...' : 'Update FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSV Upload Panel Component
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Import FAQs from CSV</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaDownload />
              Download Template
            </button>
            
            <button
              onClick={handleUpload}
              disabled={!csvFile || isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload />
              {isUploading ? 'Uploading...' : 'Upload FAQs'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h4 className="font-medium">CSV Format Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• <strong>question</strong>: The FAQ question (required)</li>
            <li>• <strong>answer</strong>: The FAQ answer (required)</li>
            <li>• <strong>category</strong>: Category (general, products, shipping, etc.)</li>
            <li>• <strong>priority</strong>: Number 0-10 (higher = more important)</li>
            <li>• <strong>keywords</strong>: Comma-separated keywords for matching</li>
          </ul>
          
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <strong>Tip:</strong> Download the template to see the exact format required.
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
              <summary className="cursor-pointer text-red-600 font-medium">View Errors</summary>
              <div className="mt-2 text-sm text-red-700 space-y-1">
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