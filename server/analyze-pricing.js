import dotenv from 'dotenv';
dotenv.config();

async function analyzePricing() {
  console.log('🔍 COMPLETE PRICING ANALYSIS');
  console.log('============================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();  
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get sample products
    const products = await Product.find({}).limit(3);
    
    console.log('\n📊 DETAILED PRICE ANALYSIS');
    console.log('===========================');
    
    products.forEach((p, i) => {
      console.log(`\nProduct ${i + 1}: ${p.name}`);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((variant, vi) => {
          console.log(`  Variant ${vi + 1}: ${variant.sizeLabel}`);
          console.log(`    Raw price value: ${variant.price}`);
          console.log(`    Raw MRP value: ${variant.mrp}`);
          console.log(`    If stored in PAISE → Display: ₹${(variant.price / 100).toFixed(2)}`);
          console.log(`    If stored in RUPEES → Display: ₹${variant.price}`);
          
          // Determine which makes more sense
          const expectedPriceRange = 'Expected reasonable price range: ₹9.99 to ₹4499';
          console.log(`    ${expectedPriceRange}`);
          
          if (variant.price >= 999 && variant.price <= 449900) {
            console.log(`    🎯 LIKELY STORED IN: PAISE (${variant.price} paise = ₹${(variant.price / 100).toFixed(2)})`);
          } else if (variant.price >= 9.99 && variant.price <= 4499) {
            console.log(`    🎯 LIKELY STORED IN: RUPEES (₹${variant.price})`);
          } else {
            console.log(`    ⚠️  UNUSUAL PRICE RANGE - NEEDS INVESTIGATION`);
          }
          console.log('    ---');
        });
      }
    });
    
    // Check what ranges we're seeing
    console.log('\n📈 PRICE RANGE SUMMARY');
    console.log('======================');
    
    const allPrices = [];
    products.forEach(p => {
      if (p.variants) {
        p.variants.forEach(v => {
          if (v.price) allPrices.push(v.price);
        });
      }
    });
    
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    
    console.log(`Min price in DB: ${minPrice}`);
    console.log(`Max price in DB: ${maxPrice}`);
    console.log(`\nIf PAISE: ₹${(minPrice/100).toFixed(2)} to ₹${(maxPrice/100).toFixed(2)}`);
    console.log(`If RUPEES: ₹${minPrice} to ₹${maxPrice}`);
    
    // Final determination
    console.log('\n🎯 CONCLUSION:');
    if (minPrice >= 999) {
      console.log('✅ Prices are stored in PAISE (as intended by architecture)');
      console.log('❌ But APIs are NOT converting to rupees before sending to frontend');
      console.log('🔧 SOLUTION: Fix API services to use toRupees() conversion');
    } else {
      console.log('❌ Prices appear to be stored in RUPEES (architecture violation)');
      console.log('🔧 SOLUTION: Either convert DB to paise OR remove frontend conversion');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

analyzePricing();