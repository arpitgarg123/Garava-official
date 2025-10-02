/**
 * Stock Synchronization Utility
 * Run this to fix any inconsistencies in stock status across the database
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { syncAllStockStatuses } from "./src/shared/stockManager.js";
import connectDb from "./src/shared/db.js";

dotenv.config();

async function runStockSync() {
  try {
    console.log("🔄 Connecting to database...");
    await connectDb();
    
    console.log("🔄 Starting stock status synchronization...");
    const result = await syncAllStockStatuses();
    
    if (result.success) {
      console.log(`✅ Stock sync completed successfully!`);
      console.log(`📊 Updated ${result.updatedProducts} products`);
    } else {
      console.log("❌ Stock sync failed");
    }
    
    await mongoose.disconnect();
    console.log("📝 Database connection closed");
    
  } catch (error) {
    console.error("❌ Stock sync failed:", error);
    process.exit(1);
  }
}

runStockSync();