import dotenv from 'dotenv';
dotenv.config();

async function updateProductStatus() {
  console.log('🚀 Updating All Product Status to Published & Active');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get current product counts by status
    console.log('📊 Current Product Status Distribution:');
    
    const totalProducts = await Product.countDocuments();
    const publishedProducts = await Product.countDocuments({ status: 'published' });
    const draftProducts = await Product.countDocuments({ status: 'draft' });
    const archivedProducts = await Product.countDocuments({ status: 'archived' });
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });
    
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   📝 Draft: ${draftProducts}`);
    console.log(`   ✅ Published: ${publishedProducts}`);
    console.log(`   📦 Archived: ${archivedProducts}`);
    console.log(`   🟢 Active: ${activeProducts}`);
    console.log(`   🔴 Inactive: ${inactiveProducts}`);
    
    // Update all products to published and active
    console.log('\n🔄 Updating all products to published and active...');
    
    const updateResult = await Product.updateMany(
      {}, // Match all products
      {
        $set: {
          status: 'published',
          isActive: true,
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`✅ Update completed!`);
    console.log(`   Products matched: ${updateResult.matchedCount}`);
    console.log(`   Products modified: ${updateResult.modifiedCount}`);
    
    // Verify the update
    console.log('\n📊 Updated Product Status Distribution:');
    
    const updatedPublished = await Product.countDocuments({ status: 'published' });
    const updatedDraft = await Product.countDocuments({ status: 'draft' });
    const updatedArchived = await Product.countDocuments({ status: 'archived' });
    const updatedActive = await Product.countDocuments({ isActive: true });
    const updatedInactive = await Product.countDocuments({ isActive: false });
    
    console.log(`   📝 Draft: ${updatedDraft}`);
    console.log(`   ✅ Published: ${updatedPublished}`);
    console.log(`   📦 Archived: ${updatedArchived}`);
    console.log(`   🟢 Active: ${updatedActive}`);
    console.log(`   🔴 Inactive: ${updatedInactive}`);
    
    // Show sample products with their new status
    console.log('\n📋 Sample Updated Products:');
    const sampleProducts = await Product.find({})
      .limit(5)
      .select('name status isActive updatedAt');
    
    sampleProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name}`);
      console.log(`     Status: ${product.status} | Active: ${product.isActive}`);
      console.log(`     Updated: ${product.updatedAt.toISOString()}`);
      console.log('');
    });
    
    if (updatedPublished === totalProducts && updatedActive === totalProducts) {
      console.log('🎉 Success! All products are now published and active!');
    } else {
      console.log('⚠️  Some products may not have been updated correctly. Please check manually.');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the update
updateProductStatus().catch(console.error);