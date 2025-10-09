import dotenv from 'dotenv';
dotenv.config();

async function fixStockAndPrices() {
  console.log('🔧 Fixing Product Stock and Price Display');
  console.log('=============================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected'); 

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get all products
    const products = await Product.find({});
    console.log(`📊 Found ${products.length} products`);
    
    console.log('\n📋 Current state (first 5 products):');
    products.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Variants: ${p.variants?.length || 0}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`     Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`       Stock: ${variant.stock}`);
          console.log(`       Price: ${variant.price} paise (${(variant.price / 100).toFixed(2)} rupees)`);
          console.log(`       MRP: ${variant.mrp} paise (${(variant.mrp / 100).toFixed(2)} rupees)`);
        });
      }
      console.log('---');
    });
    
    // Update all product variants
    console.log('\n🔧 Updating all product variants...');
    
    let totalUpdated = 0;
    for (const product of products) {
      if (product.variants && product.variants.length > 0) {
        // Update each variant's stock
        product.variants.forEach(variant => {
          variant.stock = 50;
          variant.stockStatus = 'in_stock';
        });
        await product.save();
        totalUpdated++;
      }
    }
    
    console.log(`✅ Updated ${totalUpdated} products with new stock levels`);
    
    // Verify updates
    console.log('\n✅ Updated state (first 5 products):');
    const updatedProducts = await Product.find({}).limit(5);
    updatedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Variants: ${p.variants?.length || 0}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`     Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`       Stock: ${variant.stock}`);
          console.log(`       Price: ${variant.price} paise (${(variant.price / 100).toFixed(2)} rupees)`);
          console.log(`       MRP: ${variant.mrp} paise (${(variant.mrp / 100).toFixed(2)} rupees)`);
        });
      }
      console.log('---');
    });
    
    console.log('\n🎉 Stock levels updated successfully!');
    console.log('\n📝 Note: Prices are stored correctly in paise in backend.');
    console.log('💡 Frontend should convert to rupees for display (divide by 100).');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixStockAndPrices();