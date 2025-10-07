import dotenv from 'dotenv';
import mongoose from 'mongoose';
import InstagramPost from './src/modules/instagram/instagram.model.js';

// Load environment variables
dotenv.config();

const cleanupInstagramPosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find and remove posts with undefined title or image
    const postsToDelete = await InstagramPost.find({
      $or: [
        { title: { $exists: false } }, 
        { title: undefined },
        { title: null },
        { title: '' },
        { imageUrl: { $exists: false } },
        { imageUrl: undefined },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    });

    console.log(`Found ${postsToDelete.length} posts to clean up:`);
    postsToDelete.forEach((post, index) => {
      console.log(`${index + 1}. ID: ${post._id} - Title: ${post.title} - Image: ${post.imageUrl}`);
    });

    if (postsToDelete.length > 0) {
      const result = await InstagramPost.deleteMany({
        $or: [
          { title: { $exists: false } },
          { title: undefined },
          { title: null },
          { title: '' },
          { imageUrl: { $exists: false } },
          { imageUrl: undefined },
          { imageUrl: null },
          { imageUrl: '' }
        ]
      });
      console.log(`\nDeleted ${result.deletedCount} invalid posts`);
    }

    // Check remaining posts
    const remainingPosts = await InstagramPost.find({});
    console.log(`\nRemaining posts: ${remainingPosts.length}`);
    remainingPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - Active: ${post.isActive}, Featured: ${post.isFeatured}`);
      console.log(`   URL: ${post.instagramUrl}`);
      console.log(`   Image: ${post.imageUrl}`);
      console.log(`   Created: ${post.createdAt}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('Error cleaning up Instagram posts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

cleanupInstagramPosts();