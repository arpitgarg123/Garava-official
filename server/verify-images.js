import dotenv from 'dotenv';
dotenv.config();

async function verifyImportWithImages() {
  console.log('🔍 Verifying Product Import with Images');
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
    
    // Get products with images
    const productsWithHeroImage = await Product.countDocuments({
      'heroImage.url': { $exists: true, $ne: null }
    });
    
    const productsWithGallery = await Product.countDocuments({
      gallery: { $exists: true, $not: { $size: 0 } }
    });
    
    console.log(`🖼️  Products with hero image: ${productsWithHeroImage}`);
    console.log(`🖼️  Products with gallery images: ${productsWithGallery}`);
    
    // Show sample products with images
    console.log('\\n📋 Sample Products with Images:');
    const sampleProductsWithImages = await Product.find({
      $or: [
        { 'heroImage.url': { $exists: true, $ne: null } },
        { gallery: { $exists: true, $not: { $size: 0 } } }
      ]
    }).limit(5).select('name heroImage gallery variants');
    
    sampleProductsWithImages.forEach((product, index) => {
      const hasHero = product.heroImage && product.heroImage.url;
      const galleryCount = product.gallery ? product.gallery.length : 0;
      console.log(`  ${index + 1}. ${product.name}`);
      console.log(`     Hero Image: ${hasHero ? '✅' : '❌'} ${hasHero ? product.heroImage.url.substring(0, 50) + '...' : ''}`);
      console.log(`     Gallery: ${galleryCount} images`);
      console.log(`     Variants: ${product.variants.length}`);
      console.log('');
    });
    
    // Check if there are products without images
    const productsWithoutImages = await Product.countDocuments({
      $and: [
        { $or: [{ 'heroImage.url': { $exists: false } }, { 'heroImage.url': null }] },
        { $or: [{ gallery: { $exists: false } }, { gallery: { $size: 0 } }] }
      ]
    });
    
    console.log(`⚠️  Products without any images: ${productsWithoutImages}`);
    
    // Sample products without images
    if (productsWithoutImages > 0) {
      console.log('\\n📋 Sample Products WITHOUT Images:');
      const sampleProductsWithoutImages = await Product.find({
        $and: [
          { $or: [{ 'heroImage.url': { $exists: false } }, { 'heroImage.url': null }] },
          { $or: [{ gallery: { $exists: false } }, { gallery: { $size: 0 } }] }
        ]
      }).limit(3).select('name heroImage gallery');
      
      sampleProductsWithoutImages.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name}`);
        console.log(`     Hero Image: ${product.heroImage}`);
        console.log(`     Gallery: ${product.gallery}`);
        console.log('');
      });
    }
    
    console.log('\\n✅ Image verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    process.exit(0);
  }
}

verifyImportWithImages();