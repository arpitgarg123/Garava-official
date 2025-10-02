/**
 * Quick script to fix stock status inconsistencies
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./server/src/modules/product/product.model.js";

dotenv.config({ path: './server/.env' });

async function fixStockStatuses() {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to database");
    
    console.log("🔍 Finding products with stock status inconsistencies...");
    
    const products = await Product.find({});
    let fixedCount = 0;
    
    for (const product of products) {
      let hasUpdates = false;
      
      for (const variant of product.variants) {
        const stock = variant.stock || 0;
        const currentStatus = variant.stockStatus;
        const correctStatus = stock > 0 ? 'in_stock' : 'out_of_stock';
        
        if (currentStatus !== correctStatus) {
          console.log(`Fixing ${product.name} - ${variant.sku}: stock=${stock}, status=${currentStatus} → ${correctStatus}`);
          variant.stockStatus = correctStatus;
          hasUpdates = true;
        }
      }
      
      if (hasUpdates) {
        await product.save();
        fixedCount++;
      }
    }
    
    console.log(`✅ Fixed stock statuses for ${fixedCount} products`);
    await mongoose.disconnect();
    
  } catch (error) {
    console.error("❌ Fix failed:", error);
    process.exit(1);
  }
}

fixStockStatuses();