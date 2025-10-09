import dotenv from 'dotenv';
dotenv.config();

async function fixDatabasePrices() {
  console.log('🔧 FIXING DATABASE PRICES (Divide by 100)');
  console.log('===========================================');
  
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
    console.log(`📊 Found ${products.length} products to fix`);
    
    console.log('\n📋 BEFORE - Current wrong prices (first 3 products):');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`   Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`     Wrong Price: ${variant.price} paise = ₹${(variant.price / 100).toFixed(2)} (ABSURD!)`);
          console.log(`     Wrong MRP: ${variant.mrp} paise = ₹${(variant.mrp / 100).toFixed(2)} (ABSURD!)`);
          console.log(`     Should be: ${Math.round(variant.price / 100)} paise = ₹${(variant.price / 10000).toFixed(2)} (CORRECT)`);
        });
      }
      console.log('---');
    });
    
    console.log('\n🔧 Fixing all product prices...');
    
    let totalProductsFixed = 0;
    let totalVariantsFixed = 0;
    
    for (const product of products) {
      let productChanged = false;
      
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          // Fix price - divide by 100
          if (variant.price && variant.price > 0) {
            const oldPrice = variant.price;
            variant.price = Math.round(variant.price / 100);
            console.log(`  Fixed price: ${oldPrice} → ${variant.price} paise (₹${(variant.price / 100).toFixed(2)})`);
            productChanged = true;
            totalVariantsFixed++;
          }
          
          // Fix MRP - divide by 100
          if (variant.mrp && variant.mrp > 0) {
            const oldMrp = variant.mrp;
            variant.mrp = Math.round(variant.mrp / 100);
            console.log(`  Fixed MRP: ${oldMrp} → ${variant.mrp} paise (₹${(variant.mrp / 100).toFixed(2)})`);
            productChanged = true;
          }
        });
        
        if (productChanged) {
          await product.save();
          totalProductsFixed++;
          console.log(`✅ Fixed product: ${product.name}`);
        }
      }
    }
    
    console.log(`\n✅ PRICE FIX COMPLETE!`);
    console.log(`📊 Fixed ${totalProductsFixed} products`);
    console.log(`📊 Fixed ${totalVariantsFixed} variant prices`);
    
    // Verify the fixes
    console.log('\n✅ AFTER - Corrected prices (first 3 products):');
    const fixedProducts = await Product.find({}).limit(3);
    fixedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`   Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`     Correct Price: ${variant.price} paise = ₹${(variant.price / 100).toFixed(2)} ✅`);
          console.log(`     Correct MRP: ${variant.mrp} paise = ₹${(variant.mrp / 100).toFixed(2)} ✅`);
        });
      }
      console.log('---');
    });
    
    console.log('\n🎉 SUCCESS! All prices have been corrected.');
    console.log('💡 Now your website will show reasonable prices like ₹45,999 instead of ₹45,99,900');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixDatabasePrices();