/**
 * Debug script to understand stock availability issue
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./server/src/modules/product/product.model.js";
import { getVariantStock } from "./server/src/shared/stockManager.js";

dotenv.config({ path: './server/.env' });

async function debugStock() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");
    
    // Find a product with high stock that's failing
    console.log("\n🔍 Searching for products with variants...");
    const products = await Product.find({ 
      isActive: true, 
      'variants.0': { $exists: true },
      'variants.stock': { $gt: 1000 } // Find products with high stock
    }).limit(3);
    
    for (const product of products) {
      console.log(`\n📦 Product: ${product.name}`);
      
      for (const variant of product.variants.slice(0, 2)) { // Check first 2 variants
        console.log(`  📋 Variant: ${variant.sku}`);
        console.log(`     Stock: ${variant.stock}`);
        console.log(`     Stock Status: ${variant.stockStatus}`);
        console.log(`     Is Active: ${variant.isActive}`);
        
        // Test getVariantStock function
        const stockInfo = await getVariantStock({
          variantId: variant._id,
          variantSku: variant.sku,
          productId: product._id
        });
        
        console.log(`     Stock Manager Result:`, {
          status: stockInfo.status,
          available: stockInfo.available,
          message: stockInfo.message
        });
        
        // Check the specific availability calculation
        const isAvailable = variant.stock > 0 && 
                           variant.stockStatus !== 'out_of_stock' && 
                           variant.isActive !== false;
        console.log(`     Manual Availability Check: ${isAvailable}`);
        console.log(`       - Stock > 0: ${variant.stock > 0}`);
        console.log(`       - Status !== 'out_of_stock': ${variant.stockStatus !== 'out_of_stock'}`);
        console.log(`       - IsActive !== false: ${variant.isActive !== false}`);
      }
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  }
}

debugStock();