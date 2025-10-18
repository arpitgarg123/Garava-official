import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineSearch, AiOutlinePlus, AiOutlineEdit, AiOutlineEye } from 'react-icons/ai';
import { FiImage, FiInstagram, FiEye, FiEyeOff } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdToggleOn, MdToggleOff } from 'react-icons/md';
import { 
  fetchInstagramPostsAdmin,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
  toggleInstagramPostStatus,
  setFilters,
  clearError,
  selectInstagramPosts,
  selectInstagramLoading,
  selectInstagramActionLoading,
  selectInstagramError,
  selectInstagramPagination,
  selectInstagramFilters
} from '../../features/instagram/slice.js';

const InstagramAdmin = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectInstagramPosts);
  const loading = useSelector(selectInstagramLoading);
  const actionLoading = useSelector(selectInstagramActionLoading);
  const error = useSelector(selectInstagramError);
  const pagination = useSelector(selectInstagramPagination);
  const filters = useSelector(selectInstagramFilters);

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageFile: null,
    imageAlt: '',
    instagramUrl: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0
  });
  const [imagePreview, setImagePreview] = useState('');

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.isActive);
  const [featuredFilter, setFeaturedFilter] = useState(filters.isFeatured);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filters, pagination.page]);

  const loadPosts = () => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters
    };
    dispatch(fetchInstagramPostsAdmin(params));
  };

  const handleSearch = () => {
    dispatch(setFilters({ 
      search: searchTerm,
      isActive: statusFilter,
      isFeatured: featuredFilter
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(undefined);
    setFeaturedFilter(undefined);
    dispatch(setFilters({ search: '', isActive: undefined, isFeatured: undefined }));
  };

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title || '',
        imageFile: null,
        imageAlt: post.image?.alt || '',
        instagramUrl: post.instagramUrl || '',
        isActive: post.isActive,
        isFeatured: post.isFeatured,
        sortOrder: post.sortOrder || 0
      });
      setImagePreview(post.image?.url || '');
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        imageFile: null,
        imageAlt: '',
        instagramUrl: '',
        isActive: true,
        isFeatured: false,
        sortOrder: 0
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setImagePreview('');
    dispatch(clearError());
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateInstagramUrl = (url) => {
    if (!url) return false;
    // Check if it's a valid Instagram URL pattern
    return /^(https?:\/\/)?(www\.)?instagram\.com\/.+/.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.instagramUrl) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate Instagram URL format
    if (!validateInstagramUrl(formData.instagramUrl)) {
      alert('Please enter a valid Instagram URL (e.g., instagram.com/username or instagram.com/p/postid)');
      return;
    }
    
    if (!editingPost && !formData.imageFile) {
      alert('Please select an image file');
      return;
    }
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('title', formData.title);
      submitData.append('instagramUrl', formData.instagramUrl);
      submitData.append('isActive', formData.isActive.toString());
      submitData.append('isFeatured', formData.isFeatured.toString());
      submitData.append('sortOrder', formData.sortOrder.toString());
      submitData.append('imageAlt', formData.imageAlt);
      
      // Add image file if selected
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      }

      if (editingPost) {
        await dispatch(updateInstagramPost({ 
          id: editingPost._id, 
          postData: submitData 
        })).unwrap();
      } else {
        await dispatch(createInstagramPost(submitData)).unwrap();
      }
      closeModal();
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Instagram post?')) {
      try {
        await dispatch(deleteInstagramPost(id)).unwrap();
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleInstagramPostStatus(id)).unwrap();
      loadPosts();
    } catch (error) {
      console.error('Error toggling post status:', error);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FiInstagram className="text-pink-500" />
                Instagram Posts
              </h1>
              <p className="mt-2 text-gray-600">
                Manage Instagram posts displayed on your website
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="btn-black btn-small flex"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Add New Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="  shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300  outline-none "
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter === undefined ? '' : statusFilter.toString()}
                onChange={(e) => setStatusFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300  outline-none "
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured
              </label>
              <select
                value={featuredFilter === undefined ? '' : featuredFilter.toString()}
                onChange={(e) => setFeaturedFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300  outline-none "
              >
                <option value="">All Posts</option>
                <option value="true">Featured</option>
                <option value="false">Not Featured</option>
              </select>
            </div>

            <div className="flex items-end justify-between">
              <button
                onClick={handleSearch}
                className="btn-black btn-small self-end  "
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="btn  self-end "
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3  mb-6">
            {error}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No Instagram posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="  shadow-sm overflow-hidden">
                {/* Post Image */}
                <div className="aspect-square relative">
                  <img
                    src={post.image.url}
                    alt={post.image.alt || post.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                      post.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {post.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {post.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-600 flex items-center gap-1 text-sm"
                    >
                      <FiInstagram className="w-4 h-4" />
                      View on Instagram
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(post._id)}
                        className={`p-1 rounded-full ${
                          post.isActive 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={post.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {post.isActive ? (
                          <FiEye className="w-4 h-4" />
                        ) : (
                          <FiEyeOff className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => openModal(post)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <AiOutlineEdit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <RiDeleteBin6Line className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-sm text-gray-500">
                      Order: {post.sortOrder}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="  max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPost ? 'Edit Instagram Post' : 'Add New Instagram Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  outline-none "
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Upload *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full px-3 py-2 border border-gray-300  outline-none "
                      required={!editingPost}
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-3">
                        <label className="block text-sm text-gray-500 mb-1">Preview</label>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover  border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL *
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/p/ABC123/ or instagram.com/username"
                    className="w-full px-3 py-2 border border-gray-300  outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Examples: instagram.com/garavaofficial, www.instagram.com/p/ABC123/, https://instagram.com/reel/XYZ456/
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300  outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    Active
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn border border-gray-300  text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn-black"
                  >
                    {actionLoading ? 'Saving...' : (editingPost ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramAdmin;