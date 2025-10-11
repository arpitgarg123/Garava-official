import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaStar, 
  FaRegStar, 
  FaGoogle, 
  FaUser,
  FaChartBar,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  toggleFeaturedStatus,
  fetchGoogleReviews,
  fetchTestimonialStats,
  clearError,
  clearSuccessMessage,
  setCurrentTestimonial
} from '../../features/testimonial/slice';
import {
  selectTestimonials,
  selectTestimonialPagination,
  selectTestimonialStats,
  selectTestimonialsLoading,
  selectTestimonialActionLoading,
  selectTestimonialGoogleLoading,
  selectTestimonialStatsLoading,
  selectTestimonialError,
  selectTestimonialSuccessMessage,
  selectCurrentTestimonial
} from '../../features/testimonial/selectors';

const TestimonialAdmin = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const testimonials = useSelector(selectTestimonials);
  const pagination = useSelector(selectTestimonialPagination);
  const stats = useSelector(selectTestimonialStats);
  const currentTestimonial = useSelector(selectCurrentTestimonial);
  const loading = useSelector(selectTestimonialsLoading);
  const actionLoading = useSelector(selectTestimonialActionLoading);
  const googleLoading = useSelector(selectTestimonialGoogleLoading);
  const statsLoading = useSelector(selectTestimonialStatsLoading);
  const error = useSelector(selectTestimonialError);
  const successMessage = useSelector(selectTestimonialSuccessMessage);

  // Component state
  const [activeTab, setActiveTab] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'google'
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    source: '',
    isActive: '', // This will show all testimonials by default
    isFeatured: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    rating: 5,
    location: '',
    designation: '',
    isActive: true,
    isFeatured: false
  });

  // Google form state
  const [googleData, setGoogleData] = useState({
    placeId: '',
    apiKey: ''
  });

  // Effects
  useEffect(() => {
    dispatch(fetchTestimonials(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      dispatch(fetchTestimonialStats());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const openModal = (type, testimonial = null) => {
    setModalType(type);
    if (type === 'edit' && testimonial) {
      setFormData({
        name: testimonial.name || '',
        email: testimonial.email || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        location: testimonial.location || '',
        designation: testimonial.designation || '',
        isActive: testimonial.isActive,
        isFeatured: testimonial.isFeatured
      });
      dispatch(setCurrentTestimonial(testimonial));
    } else {
      setFormData({
        name: '',
        email: '',
        content: '',
        rating: 5,
        location: '',
        designation: '',
        isActive: true,
        isFeatured: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('create');
    setFormData({
      name: '',
      email: '',
      content: '',
      rating: 5,
      location: '',
      designation: '',
      isActive: true,
      isFeatured: false
    });
    setGoogleData({
      placeId: '',
      apiKey: ''
    });
    dispatch(setCurrentTestimonial(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalType === 'create') {
      dispatch(createTestimonial(formData)).then((result) => {
        if (!result.error) {
          closeModal();
          dispatch(fetchTestimonials(filters));
        }
      });
    } else if (modalType === 'edit' && currentTestimonial) {
      dispatch(updateTestimonial({ 
        id: currentTestimonial._id, 
        data: formData 
      })).then((result) => {
        if (!result.error) {
          closeModal();
          dispatch(fetchTestimonials(filters));
        }
      });
    }
  };

  const handleGoogleFetch = async () => {
    dispatch(fetchGoogleReviews()).then((result) => {
      if (!result.error) {
        dispatch(fetchTestimonials(filters));
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      dispatch(deleteTestimonial(id)).then((result) => {
        if (!result.error) {
          dispatch(fetchTestimonials(filters));
        }
      });
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleTestimonialStatus(id)).then((result) => {
      if (!result.error) {
        dispatch(fetchTestimonials(filters));
      }
    });
  };

  const handleToggleFeatured = (id) => {
    dispatch(toggleFeaturedStatus(id)).then((result) => {
      if (!result.error) {
        dispatch(fetchTestimonials(filters));
      }
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-yellow-400">
        {i < rating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white  p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'create' && 'Create Testimonial'}
              {modalType === 'edit' && 'Edit Testimonial'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border  px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border  px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full border  px-3 py-2 h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full border  px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border  px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full border  px-3 py-2"
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border  hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? <FaSave className="animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Testimonial Management</h1>
        <p className="text-gray-600">Manage customer testimonials and reviews</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Testimonials
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {activeTab === 'list' && (
        <>
          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => openModal('create')}
                className="bg-blue-600 text-white px-4 py-2  hover:bg-blue-700 flex items-center space-x-2"
              >
                <FaPlus /> <span>Add Manual</span>
              </button>
              <button
                onClick={handleGoogleFetch}
                disabled={googleLoading}
                className="bg-green-600 text-white px-4 py-2  hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <FaGoogle /> <span>{googleLoading ? 'Fetching...' : 'Fetch Google'}</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search testimonials..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="border border-gray-300 outline-none   px-3 py-2"
            />
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="border border-gray-300  px-3 py-2"
            >
              <option value="">All Sources</option>
              <option value="manual">Manual</option>
              <option value="google">Google</option>
            </select>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="border border-gray-300  px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={filters.isFeatured}
              onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
              className="border border-gray-300  px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="true">Featured</option>
              <option value="false">Regular</option>
            </select>
          </div>

          {/* Testimonials List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white shadow-sm  overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testimonials && testimonials.length > 0 ? testimonials.map((testimonial) => (
                    <tr key={testimonial._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                          </div>
                          {testimonial.location && (
                            <div className="text-sm text-gray-500">{testimonial.location}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {testimonial.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          testimonial.source === 'google' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {testimonial.source === 'google' ? <FaGoogle className="mr-1" /> : <FaUser className="mr-1" />}
                          {testimonial.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            testimonial.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {testimonial.isFeatured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <FaStar className="mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('edit', testimonial)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(testimonial._id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {testimonial.isActive ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(testimonial._id)}
                            className={testimonial.isFeatured ? 'text-yellow-600' : 'text-gray-400'}
                          >
                            <FaStar />
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h6a2 2 0 002-2V8m0 0H7m5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {filters.search || filters.source || filters.isActive || filters.isFeatured 
                              ? "Try adjusting your filters or search term."
                              : "Get started by adding your first testimonial."
                            }
                          </p>
                          {!filters.search && !filters.source && !filters.isActive && !filters.isFeatured && (
                            <div className="mt-6">
                              <button
                                onClick={() => openModal('create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium  text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <FaPlus className="mr-2" />
                                Add First Testimonial
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2  ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="bg-white p-6  shadow">
                <div className="flex items-center">
                  <FaChartBar className="text-blue-600 text-2xl" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6  shadow">
                <div className="flex items-center">
                  <FaEye className="text-green-600 text-2xl" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6  shadow">
                <div className="flex items-center">
                  <FaStar className="text-yellow-600 text-2xl" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Featured</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.featured}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6  shadow">
                <div className="flex items-center">
                  <FaGoogle className="text-red-600 text-2xl" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Google</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.google}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {renderModal()}
    </div>
  );
};

export default TestimonialAdmin;