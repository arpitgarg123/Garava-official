// API endpoints for blog functionality
import  http  from "../../shared/api/http.js";

// Public blog APIs
export const blogAPI = {
  // Get all published blogs with filters
  getBlogs: (params = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    
    const queryString = searchParams.toString();
    return http.get(`/blog${queryString ? `?${queryString}` : ''}`);
  },

  // Get blog by slug
  getBlogBySlug: (slug) => http.get(`/blog/${slug}`),
};

// Admin blog APIs
export const blogAdminAPI = {
  // Get all blogs for admin (including drafts, archived)
  getBlogs: (params = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    
    const queryString = searchParams.toString();
    return http.get(`/admin/blog${queryString ? `?${queryString}` : ''}`);
  },

  // Get blog by ID for admin
  getBlogById: (id) => http.get(`/admin/blog/${id}`),

  // Create new blog
  createBlog: (blogData) => {
    // If blogData contains files, use FormData
    if (blogData instanceof FormData) {
      return http.post('/admin/blog', blogData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // Check if we need to create FormData for file upload
    if (blogData.coverImage) {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(blogData).forEach(key => {
        if (key === 'coverImage') return; // Handle file separately
        if (key === 'tags' && Array.isArray(blogData[key])) {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (blogData[key] !== undefined && blogData[key] !== null && blogData[key] !== '') {
          formData.append(key, blogData[key]);
        }
      });

      // Add cover image
      formData.append('coverImage', blogData.coverImage);

      return http.post('/admin/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Otherwise, send as JSON
    return http.post('/admin/blog', blogData);
  },

  // Update blog
  updateBlog: (id, blogData) => {
    // If blogData contains files, use FormData
    if (blogData instanceof FormData) {
      return http.put(`/admin/blog/${id}`, blogData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // Check if we need to create FormData for file upload
    if (blogData.coverImage) {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(blogData).forEach(key => {
        if (key === 'coverImage') return; // Handle file separately
        if (key === 'tags' && Array.isArray(blogData[key])) {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (blogData[key] !== undefined && blogData[key] !== null && blogData[key] !== '') {
          formData.append(key, blogData[key]);
        }
      });

      // Add cover image
      formData.append('coverImage', blogData.coverImage);

      return http.put(`/admin/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Otherwise, send as JSON
    return http.put(`/admin/blog/${id}`, blogData);
  },

  // Update blog status
  updateBlogStatus: (id, status) => 
    http.patch(`/admin/blog/${id}/status`, { status }),

  // Delete blog
  deleteBlog: (id) => http.delete(`/admin/blog/${id}`),

  // Analyze document for auto-fill
  analyzeDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return http.post('/admin/blog/analyze-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload image for blog content (Quill editor)
  uploadImage: (formData) => {
    return http.post('/admin/blog/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};