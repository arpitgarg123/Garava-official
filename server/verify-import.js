import dotenv from 'dotenv';
dotenv.config();

async function verifyImport() {
  console.log('🔍 Verifying Product Import');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);
    
    // Get product breakdown by type
    const fragmentProducts = await Product.countDocuments({ type: 'fragrance' });
    const jewelryProducts = await Product.countDocuments({ type: 'jewellery' });
    
    console.log(`🌸 Fragrance products: ${fragmentProducts}`);
    console.log(`💎 Jewelry products: ${jewelryProducts}`);
    
    // Show some sample products
    console.log('\\n📋 Sample Products:');
    const sampleProducts = await Product.find().limit(5).select('name category type variants');
    
    sampleProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.type}) - ${product.variants.length} variants`);
    });
    
    // Check variants
    const totalVariants = await Product.aggregate([
      { $unwind: '$variants' },
      { $count: 'totalVariants' }
    ]);
    
    console.log(`\\n📦 Total variants across all products: ${totalVariants[0]?.totalVariants || 0}`);
    
    console.log('\\n✅ Import verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    process.exit(0);
  }
}

verifyImport();