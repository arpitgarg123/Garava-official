import mongoose from 'mongoose';
import InstagramPost from './src/modules/instagram/instagram.model.js';
import { env } from './src/config/env.js';

async function checkInstagramPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Count all posts
    const totalPosts = await InstagramPost.countDocuments({});
    console.log(`Total Instagram posts in database: ${totalPosts}`);

    // Get all posts
    const posts = await InstagramPost.find({}).sort({ createdAt: -1 });
    console.log('All Instagram posts:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - Active: ${post.isActive}, Featured: ${post.isFeatured}`);
      console.log(`   URL: ${post.instagramUrl}`);
      console.log(`   Image: ${post.image?.url}`);
      console.log(`   Created: ${post.createdAt}`);
      console.log('   ---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking Instagram posts:', error);
    process.exit(1);
  }
}

checkInstagramPosts();