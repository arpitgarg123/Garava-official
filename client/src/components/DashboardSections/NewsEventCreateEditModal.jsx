import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { 
  createNewsEventAdmin,
  updateNewsEventAdmin
} from "../../features/newsevents/admin.api";

export default function NewsEventCreateEditModal({ isOpen, item, onClose, onSuccess }) {
  const isEditMode = !!item;

  const [formData, setFormData] = useState({
    title: '', 
    slug: '',
    excerpt: '', 
    content: '',
    type: 'event',
    kind: 'Event',
    date: '',
    city: '',
    location: '',
    rsvpUrl: '',
    outlet: '',
    url: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    publishAt: '',
  });

  const [coverFile, setCoverFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Load item data for editing
  useEffect(() => {
    if (isEditMode && item) {
      setFormData({
        title: item.title || '',
        slug: item.slug || '',
        excerpt: item.excerpt || '',
        content: item.content || '',
        type: item.type || 'event',
        kind: item.kind || 'Event',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        city: item.city || '',
        location: item.location || '',
        rsvpUrl: item.rsvpUrl || '',
        outlet: item.outlet || '',
        url: item.url || '',
        status: item.status || 'draft',
        metaTitle: item.metaTitle || '',
        metaDescription: item.metaDescription || '',
        publishAt: item.publishAt ? new Date(item.publishAt).toISOString().split('T')[0] : '',
      });
      if (item.cover?.url) {
        setImagePreview(item.cover.url);
      }
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        type: 'event',
        kind: 'Event',
        date: '',
        city: '',
        location: '',
        rsvpUrl: '',
        outlet: '',
        url: '',
        status: 'draft',
        metaTitle: '',
        metaDescription: '',
        publishAt: '',
      });
      setCoverFile(null);
      setImagePreview(null);
    }
  }, [isEditMode, item]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }

      return updated;
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.date) errors.date = 'Date is required';
    
    if (formData.type === 'event') {
      if (!formData.kind) errors.kind = 'Kind is required for events';
    }
    
    if (formData.type === 'media-coverage') {
      if (!formData.outlet.trim()) errors.outlet = 'Outlet is required for media coverage';
      if (!formData.url.trim()) errors.url = 'URL is required for media coverage';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });

      // Add cover image if selected
      if (coverFile) {
        submitData.append('cover', coverFile);
      }

      if (isEditMode) {
        await updateNewsEventAdmin(item._id, submitData);
      } else {
        await createNewsEventAdmin(submitData);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit News/Event' : 'Create News/Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="event">Event</option>
                  <option value="media-coverage">Media Coverage</option>
                </select>
                {validationErrors.type && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>
                )}
              </div>

              {formData.type === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kind *
                  </label>
                  <select
                    name="kind"
                    value={formData.kind}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.kind ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Event">Event</option>
                    <option value="News">News</option>
                  </select>
                  {validationErrors.kind && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.kind}</p>
                  )}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.slug && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.date && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
              )}
            </div>

            {/* Event-specific fields */}
            {formData.type === 'event' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RSVP URL
                  </label>
                  <input
                    type="url"
                    name="rsvpUrl"
                    value={formData.rsvpUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Media Coverage-specific fields */}
            {formData.type === 'media-coverage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outlet *
                  </label>
                  <input
                    type="text"
                    name="outlet"
                    value={formData.outlet}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.outlet ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.outlet && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.outlet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.url ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.url && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.url}</p>
                  )}
                </div>
              </div>
            )}

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.excerpt}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <AiOutlineUpload className="w-4 h-4 mr-2" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
            </div>

            {/* Status and Publishing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish At
                </label>
                <input
                  type="date"
                  name="publishAt"
                  value={formData.publishAt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}