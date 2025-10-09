import dotenv from 'dotenv';
dotenv.config();

async function fixPricesCorrectly() {
  console.log('🔧 FIXING PRICES CORRECTLY (Multiply by 100)');
  console.log('===============================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get sample products to check current values
    const products = await Product.find({}).limit(3);
    
    console.log('\n📋 CURRENT PRICES AFTER FIRST FIX:');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`   Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`     Current: ${variant.price} paise = ₹${(variant.price / 100).toFixed(2)}`);
          console.log(`     Should be: ${variant.price * 100} paise = ₹${variant.price}`);
        });
      }
      console.log('---');
    });
    
    console.log('\n🎯 ANALYSIS:');
    console.log('Our first fix divided by 100, but now prices are too low!');
    console.log('Correct solution: Multiply by 100 to get proper paise values');
    console.log('Example: 40 paise × 100 = 4000 paise = ₹40.00 ✅');
    
    console.log('\n🔧 Applying correct fix...');
    
    const allProducts = await Product.find({});
    let totalFixed = 0;
    
    for (const product of allProducts) {
      let productChanged = false;
      
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          // Multiply by 100 to get correct paise values
          if (variant.price && variant.price > 0) {
            const oldPrice = variant.price;
            variant.price = variant.price * 100;
            productChanged = true;
          }
          
          if (variant.mrp && variant.mrp > 0) {
            const oldMrp = variant.mrp;
            variant.mrp = variant.mrp * 100;
            productChanged = true;
          }
        });
        
        if (productChanged) {
          await product.save();
          totalFixed++;
        }
      }
    }
    
    console.log(`✅ Fixed ${totalFixed} products`);
    
    // Verify the final results
    console.log('\n✅ FINAL CORRECTED PRICES:');
    const finalProducts = await Product.find({}).limit(3);
    finalProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`   Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`     Final: ${variant.price} paise = ₹${(variant.price / 100).toFixed(2)} ✅`);
        });
      }
      console.log('---');
    });
    
    console.log('\n🎉 SUCCESS! Now prices should match production site values.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixPricesCorrectly();