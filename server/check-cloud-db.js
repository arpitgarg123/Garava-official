import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkCloudDatabase() {
  try {
    console.log('=== Checking MongoDB Atlas (Cloud Database) ===');
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to: ${mongoUri.split('@')[1]?.split('?')[0] || 'cloud'}\n`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!\n');
    
    const products = await Product.find({});
    console.log(`Total products: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('No products found in cloud database');
      await mongoose.disconnect();
      return;
    }
    
    // Group by type
    const typeCount = {};
    products.forEach(p => {
      const type = p.type || 'uncategorized';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    console.log('Products by type:');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} products`);
    });

    // Show fragrance products if any
    const fragrances = products.filter(p => p.type === 'fragrance');
    if (fragrances.length > 0) {
      console.log('\n--- Fragrance Products ---');
      const fragCats = {};
      fragrances.forEach(p => {
        const cat = p.category || 'uncategorized';
        fragCats[cat] = (fragCats[cat] || 0) + 1;
      });
      console.log('Fragrance categories:');
      Object.entries(fragCats).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} products`);
      });
      
      console.log('\nFragrance products list:');
      fragrances.forEach(p => {
        console.log(`  - ${p.name} (${p.category})`);
      });
    }

    // Show jewellery if any
    const jewellery = products.filter(p => p.type === 'jewellery');
    if (jewellery.length > 0) {
      console.log('\n--- Jewellery Products ---');
      console.log(`Total: ${jewellery.length} products`);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCloudDatabase();
