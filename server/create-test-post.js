import dotenv from 'dotenv';
import mongoose from 'mongoose';
import InstagramPost from './src/modules/instagram/instagram.model.js';

// Load environment variables
dotenv.config();

const createTestPost = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test post
    const testPost = new InstagramPost({
      title: 'Test Instagram Post',
      image: {
        url: 'https://via.placeholder.com/400x400',
        alt: 'Test post image'
      },
      instagramUrl: 'https://www.instagram.com/p/test123/',
      isActive: true,
      isFeatured: true,
      sortOrder: 1
    });

    const savedPost = await testPost.save();
    console.log('Test post created:', savedPost);

    // Now check all posts
    const allPosts = await InstagramPost.find({});
    console.log(`\nTotal posts in database: ${allPosts.length}`);
    
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - Active: ${post.isActive}, Featured: ${post.isFeatured}`);
      console.log(`   URL: ${post.instagramUrl}`);
      console.log(`   Image: ${post.image?.url}`);
      console.log(`   Created: ${post.createdAt}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('Error creating test post:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createTestPost();