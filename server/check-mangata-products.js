import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';

async function checkMangataProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/garava');
    console.log('Connected to MongoDB\n');

    // Check for mangata products
    const mangataProducts = await Product.find({ category: 'mangata' });
    console.log(`Found ${mangataProducts.length} products with category="mangata"`);
    mangataProducts.forEach(p => {
      console.log(`  - ${p.name} | category: ${p.category} | type: ${p.type}`);
    });

    // Also check case-insensitive
    const mangataProductsCI = await Product.find({ 
      category: { $regex: /^mangata$/i } 
    });
    console.log(`\nFound ${mangataProductsCI.length} products with category="mangata" (case-insensitive)`);
    
    // Check all fragrance products
    console.log('\n--- All Fragrance Products ---');
    const fragranceProducts = await Product.find({ type: 'fragrance' });
    console.log(`Total fragrance products: ${fragranceProducts.length}`);
    
    const categoryCount = {};
    fragranceProducts.forEach(p => {
      const cat = p.category || 'uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log('\nFragrance products by category:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMangataProducts();
