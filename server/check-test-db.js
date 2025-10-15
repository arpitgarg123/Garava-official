import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';

async function checkTestDatabase() {
  try {
    console.log('=== Checking "test" database ===');
    await mongoose.connect('mongodb://localhost:27017/test');
    
    const products = await Product.find({});
    console.log(`Total products: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('No products found in test database');
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
      
      console.log('\nSample fragrance products:');
      fragrances.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.category})`);
      });
    }

    // Show all products summary
    console.log('\n--- All Products Summary ---');
    products.forEach(p => {
      console.log(`${p.name} | Type: ${p.type} | Category: ${p.category || 'none'}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTestDatabase();
