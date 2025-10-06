import InstagramPost from './instagram.model.js';
import { deleteFromImageKit } from '../../shared/imagekit.js';

// Get featured posts for public display (max 4 for the grid)
export const getFeaturedPostsService = async (limit = 4) => {
  try {
    const posts = await InstagramPost.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
    
    return posts;
  } catch (error) {
    throw new Error(`Error fetching featured posts: ${error.message}`);
  }
};

// Get all posts for admin with pagination
export const getAllPostsService = async (page = 1, limit = 10, filters = {}) => {
  try {
    console.log('getAllPostsService called with:', { page, limit, filters });
    
    const skip = (page - 1) * limit;
    const query = {};
    
    // Apply filters
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    console.log('MongoDB query:', query);
    
    const total = await InstagramPost.countDocuments(query);
    console.log('Total posts found:', total);
    
    const posts = await InstagramPost.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log('Posts retrieved:', posts.length);
    
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllPostsService:', error);
    throw new Error(`Error fetching posts: ${error.message}`);
  }
};

// Create new post
export const createPostService = async (postData) => {
  try {
    const post = new InstagramPost(postData);
    await post.save();
    return post;
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`);
  }
};

// Update post
export const updatePostService = async (postId, updateData) => {
  try {
    const post = await InstagramPost.findByIdAndUpdate(
      postId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
};

// Delete post
export const deletePostService = async (postId) => {
  try {
    const post = await InstagramPost.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Delete image from ImageKit if fileId exists
    if (post.image?.fileId) {
      await deleteFromImageKit(post.image.fileId);
    }
    
    // Delete the post from database
    await InstagramPost.findByIdAndDelete(postId);
    
    return post;
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};

// Toggle post status (active/inactive)
export const togglePostStatusService = async (postId) => {
  try {
    const post = await InstagramPost.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    post.isActive = !post.isActive;
    await post.save();
    
    return post;
  } catch (error) {
    throw new Error(`Error toggling post status: ${error.message}`);
  }
};