/**
 * Database cleanup script to fix blog slugs with trailing hyphens
 * Run this script once after deploying the slug generation fix
 */

import mongoose from 'mongoose';
import Blog from '../modules/blogs/blog.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function cleanBlogSlugs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all blogs with slugs ending in hyphens
    const blogsWithBadSlugs = await Blog.find({
      slug: /-$/
    }).select('_id title slug');

    console.log(`📊 Found ${blogsWithBadSlugs.length} blogs with trailing hyphens\n`);

    if (blogsWithBadSlugs.length === 0) {
      console.log('✅ No blogs need cleaning. All slugs are valid!');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Display blogs that will be updated
    console.log('📝 Blogs to be updated:');
    blogsWithBadSlugs.forEach((blog, index) => {
      const cleanSlug = blog.slug.replace(/^-+|-+$/g, '');
      console.log(`${index + 1}. "${blog.title}"`);
      console.log(`   Old slug: ${blog.slug}`);
      console.log(`   New slug: ${cleanSlug}\n`);
    });

    // Ask for confirmation (in production, you might want to add a prompt)
    console.log('🔧 Updating blog slugs...\n');

    let updated = 0;
    let failed = 0;

    for (const blog of blogsWithBadSlugs) {
      try {
        const cleanSlug = blog.slug.replace(/^-+|-+$/g, '');
        
        // Check if clean slug already exists
        const existing = await Blog.findOne({ 
          slug: cleanSlug, 
          _id: { $ne: blog._id } 
        });

        if (existing) {
          console.log(`⚠️  Warning: Slug "${cleanSlug}" already exists for another blog`);
          console.log(`   Skipping: "${blog.title}"`);
          failed++;
          continue;
        }

        // Update the slug
        await Blog.updateOne(
          { _id: blog._id },
          { $set: { slug: cleanSlug } }
        );

        console.log(`✅ Updated: "${blog.title}" → ${cleanSlug}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update "${blog.title}":`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Cleanup Summary:');
    console.log(`   Total found: ${blogsWithBadSlugs.length}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('='.repeat(50) + '\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the cleanup
cleanBlogSlugs();
