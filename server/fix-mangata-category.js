import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixMangataCategory() {
  try {
    console.log('=== Fixing Mångata Product Categories ===\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database\n');
    
    // Find products with "Mångata" in name but wrong category
    const mangataProducts = await Product.find({
      name: { $regex: /mångata|mangata/i }
    });
    
    console.log(`Found ${mangataProducts.length} Mångata products:\n`);
    
    for (const product of mangataProducts) {
      console.log(`Before: ${product.name}`);
      console.log(`  Category: ${product.category}`);
      
      // Update to correct category
      product.category = 'mangata';
      await product.save();
      
      console.log(`  ✅ Updated to: mangata\n`);
    }
    
    console.log('All Mångata products updated successfully!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixMangataCategory();
