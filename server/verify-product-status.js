import dotenv from 'dotenv';
dotenv.config();

async function verifyProductStatus() {
  console.log('🔍 Verifying Product Status Update');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get comprehensive product status verification
    const totalProducts = await Product.countDocuments();
    const publishedAndActive = await Product.countDocuments({ 
      status: 'published', 
      isActive: true 
    });
    
    const publishedButInactive = await Product.countDocuments({ 
      status: 'published', 
      isActive: false 
    });
    
    const activeButNotPublished = await Product.countDocuments({ 
      status: { $ne: 'published' }, 
      isActive: true 
    });
    
    const notPublishedNotActive = await Product.countDocuments({ 
      status: { $ne: 'published' }, 
      isActive: false 
    });
    
    console.log('📊 Product Status Verification Results:');
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   ✅ Published & Active: ${publishedAndActive}`);
    console.log(`   ⚠️  Published but Inactive: ${publishedButInactive}`);
    console.log(`   ⚠️  Active but Not Published: ${activeButNotPublished}`);
    console.log(`   ❌ Not Published & Not Active: ${notPublishedNotActive}`);
    
    // Check if all products are properly configured
    if (publishedAndActive === totalProducts) {
      console.log('\n🎉 VERIFICATION SUCCESSFUL!');
      console.log('   ✅ All products are published and active');
      console.log('   ✅ Ready for production use');
    } else {
      console.log('\n⚠️  VERIFICATION ISSUES FOUND:');
      if (publishedButInactive > 0) {
        console.log(`   - ${publishedButInactive} products are published but inactive`);
      }
      if (activeButNotPublished > 0) {
        console.log(`   - ${activeButNotPublished} products are active but not published`);
      }
      if (notPublishedNotActive > 0) {
        console.log(`   - ${notPublishedNotActive} products are neither published nor active`);
      }
    }
    
    // Show product categories and their status
    console.log('\n📋 Products by Category:');
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'published'] }, 1, 0] 
            } 
          },
          active: { 
            $sum: { 
              $cond: ['$isActive', 1, 0] 
            } 
          }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    productsByCategory.forEach(category => {
      console.log(`   ${category._id || 'Uncategorized'}: ${category.count} products`);
      console.log(`     Published: ${category.published}/${category.count}`);
      console.log(`     Active: ${category.active}/${category.count}`);
    });
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the verification
verifyProductStatus().catch(console.error);