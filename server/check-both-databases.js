import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';

async function checkBothDatabases() {
  try {
    // Check garava database
    console.log('=== Checking "garava" database ===');
    await mongoose.connect('mongodb://localhost:27017/garava');
    let products = await Product.find({});
    console.log(`Total products: ${products.length}\n`);
    
    const typeCount1 = {};
    products.forEach(p => {
      const type = p.type || 'uncategorized';
      typeCount1[type] = (typeCount1[type] || 0) + 1;
    });
    console.log('Products by type:');
    Object.entries(typeCount1).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    await mongoose.disconnect();

    // Check garava_db database
    console.log('\n=== Checking "garava_db" database ===');
    await mongoose.connect('mongodb://localhost:27017/garava_db');
    products = await Product.find({});
    console.log(`Total products: ${products.length}\n`);
    
    const typeCount2 = {};
    products.forEach(p => {
      const type = p.type || 'uncategorized';
      typeCount2[type] = (typeCount2[type] || 0) + 1;
    });
    console.log('Products by type:');
    Object.entries(typeCount2).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    // Show fragrance categories if any
    const fragrances = products.filter(p => p.type === 'fragrance');
    if (fragrances.length > 0) {
      console.log('\nFragrance categories:');
      const fragCats = {};
      fragrances.forEach(p => {
        const cat = p.category || 'uncategorized';
        fragCats[cat] = (fragCats[cat] || 0) + 1;
      });
      Object.entries(fragCats).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} products`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBothDatabases();
