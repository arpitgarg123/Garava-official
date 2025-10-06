import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineUpload, AiOutlineEye } from "react-icons/ai";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createBlogAdmin,
  updateBlogAdmin,
  fetchBlogAdminById,
  closeModal,
  selectBlogAdminModals,
  selectBlogAdminSelectedId,
  selectBlogAdminCurrentBlog,
  selectBlogAdminActionLoading,
  selectBlogAdminError
} from "../../features/blogs/blogAdminSlice";

export default function BlogCreateEditModal() {
  const dispatch = useDispatch();
  const modals = useSelector(selectBlogAdminModals);
  const selectedBlogId = useSelector(selectBlogAdminSelectedId);
  const currentBlog = useSelector(selectBlogAdminCurrentBlog);
  const actionLoading = useSelector(selectBlogAdminActionLoading);
  const error = useSelector(selectBlogAdminError);

  const isOpen = modals.create || modals.edit;
  const isEditMode = modals.edit && selectedBlogId;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    publishAt: '',
    coverImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load blog data for editing
  useEffect(() => {
    if (isEditMode && selectedBlogId && !currentBlog) {
      dispatch(fetchBlogAdminById(selectedBlogId));
    }
  }, [dispatch, isEditMode, selectedBlogId, currentBlog]);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        slug: currentBlog.slug || '',
        excerpt: currentBlog.excerpt || '',
        content: currentBlog.content || '',
        category: currentBlog.category || '',
        tags: Array.isArray(currentBlog.tags) ? currentBlog.tags.join(', ') : '',
        status: currentBlog.status || 'draft',
        metaTitle: currentBlog.metaTitle || '',
        metaDescription: currentBlog.metaDescription || '',
        publishAt: currentBlog.publishAt ? new Date(currentBlog.publishAt).toISOString().slice(0, 16) : '',
        coverImage: null,
      });
      setImagePreview(currentBlog.coverImage?.url || null);
    } else if (!isEditMode) {
      // Reset form for create mode
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        status: 'draft',
        metaTitle: '',
        metaDescription: '',
        publishAt: '',
        coverImage: null,
      });
      setImagePreview(null);
    }
  }, [isEditMode, currentBlog]);

  // Clear validation errors when form data changes
  useEffect(() => {
    setValidationErrors({});
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (formData.status === 'scheduled' && !formData.publishAt) {
      errors.publishAt = 'Publish date is required for scheduled posts';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare blog data as a plain object (API will create FormData)
      const submitData = { ...formData };
      
      // Convert tags string to array
      if (submitData.tags) {
        submitData.tags = submitData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      // Ensure publishAt is in correct format
      if (submitData.publishAt) {
        submitData.publishAt = new Date(submitData.publishAt).toISOString();
      }

      if (isEditMode) {
        await dispatch(updateBlogAdmin({ id: selectedBlogId, blogData: submitData })).unwrap();
      } else {
        await dispatch(createBlogAdmin(submitData)).unwrap();
      }

      handleClose();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleClose = () => {
    dispatch(closeModal(isEditMode ? 'edit' : 'create'));
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      publishAt: '',
      coverImage: null,
    });
    setImagePreview(null);
    setValidationErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {(isEditMode && !currentBlog && actionLoading) ? (
            // Loading state
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading blog data...</span>
              </div>
            </div>
          ) : (
            // Form content
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-800 text-md">
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-md font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      validationErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter blog title"
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-md text-red-600">{validationErrors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="sm:col-span-2">
                  <label htmlFor="slug" className="block text-md font-medium text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      validationErrors.slug ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="url-friendly-slug"
                  />
                  {validationErrors.slug && (
                    <p className="mt-1 text-md text-red-600">{validationErrors.slug}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-md font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      validationErrors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="fragrance">Fragrance</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="guide">Guide</option>
                    <option value="news">News</option>
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-md text-red-600">{validationErrors.category}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-md font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {/* Publish Date (for scheduled posts) */}
                {formData.status === 'scheduled' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="publishAt" className="block text-md font-medium text-gray-700">
                      Publish Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="publishAt"
                      id="publishAt"
                      value={formData.publishAt}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        validationErrors.publishAt ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.publishAt && (
                      <p className="mt-1 text-md text-red-600">{validationErrors.publishAt}</p>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label htmlFor="tags" className="block text-md font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="mt-1 text-md text-gray-500">Separate tags with commas</p>
                </div>

                {/* Excerpt */}
                <div className="sm:col-span-2">
                  <label htmlFor="excerpt" className="block text-md font-medium text-gray-700">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    id="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of the blog post"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-md font-medium text-gray-700">
                  Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg" />
                      </div>
                    ) : (
                      <AiOutlineUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-md text-gray-600">
                      <label
                        htmlFor="coverImage"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>{imagePreview ? 'Change image' : 'Upload a file'}</span>
                        <input
                          id="coverImage"
                          name="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Content */}
          <div className={`border rounded-md ${
  validationErrors.content ? 'border-red-300' : 'border-gray-300'
}`}>
  <ReactQuill
    theme="snow"
    value={formData.content}
    onChange={handleContentChange}
    placeholder="Write your blog content here..."
    modules={{
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }}
    formats={[
      'header', 'bold', 'italic', 'underline', 'strike',
      'list', 'bullet', 'indent',
      'link', 'image', 'color', 'background', 'align'
    ]}
    style={{ minHeight: '200px' }}
  />
</div>
              {/* SEO Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="metaTitle" className="block text-md font-medium text-gray-700">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <label htmlFor="metaDescription" className="block text-md font-medium text-gray-700">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      id="metaDescription"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="SEO description for search engines"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    isEditMode ? 'Update Blog' : 'Create Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}