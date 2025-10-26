import { 
  getFeaturedPostsService, 
  getAllPostsService, 
  createPostService, 
  updatePostService, 
  deletePostService, 
  togglePostStatusService 
} from './instagram.service.js';
import { uploadToImageKitWithRetry } from '../../shared/imagekit.js';

// Helper function to normalize Instagram URL
const normalizeInstagramUrl = (url) => {
  if (!url) return url;
  
  // If URL doesn't start with http or https, add https://
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  
  return url;
};


// GET /api/instagram/featured - Public route
export const getFeaturedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const posts = await getFeaturedPostsService(limit);
    
    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/instagram - Admin route
export const getAllPosts = async (req, res) => {
  try {
    console.log('Instagram getAllPosts called with query:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};
    
    // Parse filters properly - ignore 'undefined' strings
    if (req.query.isActive !== undefined && req.query.isActive !== 'undefined') {
      filters.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.isFeatured !== undefined && req.query.isFeatured !== 'undefined') {
      filters.isFeatured = req.query.isFeatured === 'true';
    }
    
    if (req.query.search) {
      filters.search = req.query.search;
    }
    
    console.log('Parsed filters:', filters);
    
    const result = await getAllPostsService(page, limit, filters);
    
    console.log('Instagram posts result:', {
      postsCount: result.posts.length,
      pagination: result.pagination
    });
    
    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /api/instagram - Admin route
export const createPost = async (req, res) => {
  try {
    const postData = { ...req.body };
    const imageFile = req.file; // multer single file upload
    
    // Validate required fields
    if (!postData.title || !postData.instagramUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and Instagram URL are required'
      });
    }

    // Normalize Instagram URL
    postData.instagramUrl = normalizeInstagramUrl(postData.instagramUrl);

    // Validate image file is provided
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Handle image upload to ImageKit
    let imageData = null;
    try {
      const fileName = `instagram_${Date.now()}_${imageFile.originalname.replace(/\s+/g, "_")}`;
      const uploaded = await uploadToImageKitWithRetry({
        buffer: imageFile.buffer,
        fileName,
        folder: "/instagram",
        mimetype: imageFile.mimetype,
      });
      
      imageData = {
        url: uploaded.url,
        fileId: uploaded.fileId,
        alt: postData.imageAlt || postData.title
      };
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: `Image upload failed: ${uploadError.message}`
      });
    }

    // Parse boolean fields that come as strings from form data
    if (typeof postData.isActive === 'string') {
      postData.isActive = postData.isActive === 'true';
    }
    if (typeof postData.isFeatured === 'string') {
      postData.isFeatured = postData.isFeatured === 'true';
    }
    if (postData.sortOrder !== undefined && postData.sortOrder !== null) {
      postData.sortOrder = parseInt(postData.sortOrder) || 0;
    }

    const finalPostData = {
      ...postData,
      image: imageData
    };

    const post = await createPostService(finalPostData);
    
    res.status(201).json({
      success: true,
      data: post,
      message: 'Instagram post created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/instagram/:id - Admin route
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const imageFile = req.file; // multer single file upload
    
    // Normalize Instagram URL if provided
    if (updateData.instagramUrl) {
      updateData.instagramUrl = normalizeInstagramUrl(updateData.instagramUrl);
    }
    
    // Handle image upload if new file provided
    if (imageFile) {
      try {
        const fileName = `instagram_${Date.now()}_${imageFile.originalname.replace(/\s+/g, "_")}`;
        
        const uploaded = await uploadToImageKitWithRetry({
          buffer: imageFile.buffer,
          fileName,
          folder: "/instagram",
          mimetype: imageFile.mimetype,
        });
        
        updateData.image = {
          url: uploaded.url,
          fileId: uploaded.fileId,
          alt: updateData.imageAlt || updateData.title || ''
        };
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: `Image upload failed: ${uploadError.message}`
        });
      }
    }

    // Parse boolean fields that come as strings from form data
    if (typeof updateData.isActive === 'string') {
      updateData.isActive = updateData.isActive === 'true';
    }
    if (typeof updateData.isFeatured === 'string') {
      updateData.isFeatured = updateData.isFeatured === 'true';
    }
    if (updateData.sortOrder !== undefined && updateData.sortOrder !== null) {
      updateData.sortOrder = parseInt(updateData.sortOrder) || 0;
    }

    // Clean up form data fields that shouldn't be saved
    delete updateData.imageAlt;

    const post = await updatePostService(id, updateData);
    
    res.status(200).json({
      success: true,
      data: post,
      message: 'Instagram post updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/instagram/:id - Admin route
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    await deletePostService(id);
    
    res.status(200).json({
      success: true,
      message: 'Instagram post deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// PATCH /api/instagram/:id/toggle - Admin route
export const togglePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await togglePostStatusService(id);
    
    res.status(200).json({
      success: true,
      data: post,
      message: `Post ${post.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};