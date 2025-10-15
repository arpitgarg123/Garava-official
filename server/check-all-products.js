import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';

async function checkAllProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/garava');
    console.log('Connected to MongoDB\n');

    // Check all products
    const allProducts = await Product.find({});
    console.log(`Total products in database: ${allProducts.length}\n`);

    // Group by type
    const typeCount = {};
    allProducts.forEach(p => {
      const type = p.type || 'uncategorized';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    console.log('Products by type:');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} products`);
    });

    // Show first 10 products with their details
    console.log('\n--- Sample Products (first 10) ---');
    allProducts.slice(0, 10).forEach(p => {
      console.log(`${p.name}`);
      console.log(`  Type: ${p.type} | Category: ${p.category || 'none'}`);
      console.log(`  Slug: ${p.slug}`);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAllProducts();
