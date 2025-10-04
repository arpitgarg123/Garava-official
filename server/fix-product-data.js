import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './src/shared/db.js';
import Product from './src/modules/product/product.model.js';

dotenv.config();

async function fixProductData() {
  try {
    console.log('🔧 Starting Product Data Migration...\n');
    
    await connectDb();
    
    // Step 1: Standardize types
    console.log('1️⃣ Standardizing product types...');
    await Product.updateMany(
      { type: 'jewelry' },
      { $set: { type: 'jewellery' } }
    );
    console.log('✅ Fixed jewelry → jewellery');

    // Step 2: Standardize categories 
    console.log('\n2️⃣ Standardizing categories...');
    
    // Fragrance categories
    await Product.updateMany(
      { category: { $in: ['Fragrance', 'Perfume', 'perfume'] } },
      { $set: { category: 'fragrance' } }
    );
    console.log('✅ Fixed fragrance categories');

    // Jewellery categories - fix products with wrong categories
    const jewelleryProducts = await Product.find({ 
      type: { $in: ['jewellery', 'high_jewellery'] },
      category: { $in: ['Fragrance', 'fragrance'] }
    });

    for (let product of jewelleryProducts) {
      // Assign appropriate jewellery category based on name or default to 'rings'
      let newCategory = 'rings'; // default
      const name = product.name.toLowerCase();
      
      if (name.includes('necklace')) newCategory = 'necklaces';
      else if (name.includes('earring')) newCategory = 'earrings';
      else if (name.includes('bracelet')) newCategory = 'bracelets';
      else if (name.includes('ring')) newCategory = 'rings';
      
      await Product.updateOne(
        { _id: product._id },
        { $set: { category: newCategory } }
      );
    }
    console.log(`✅ Fixed ${jewelleryProducts.length} jewellery products with wrong categories`);

    // Step 3: Add colorVariants field to all products that don't have it
    console.log('\n3️⃣ Adding colorVariants field...');
    
    const productsWithoutColors = await Product.find({
      colorVariants: { $exists: false }
    });

    for (let product of productsWithoutColors) {
      let defaultColors = [];
      
      // Add appropriate default colors based on type
      if (product.type === 'jewellery' || product.type === 'high_jewellery') {
        defaultColors = [
          { name: 'Rose Gold', code: 'rose', hexColor: '#E8B4B8', isAvailable: true },
          { name: 'Gold', code: 'gold', hexColor: '#FFD700', isAvailable: true },
          { name: 'Silver', code: 'silver', hexColor: '#C0C0C0', isAvailable: true }
        ];
      } else if (product.type === 'fragrance') {
        defaultColors = [
          { name: 'Original', code: 'original', hexColor: '#8B4513', isAvailable: true }
        ];
      }
      
      await Product.updateOne(
        { _id: product._id },
        { $set: { colorVariants: defaultColors } }
      );
    }
    console.log(`✅ Added colorVariants to ${productsWithoutColors.length} products`);

    // Step 4: Fix Earrings category case
    await Product.updateMany(
      { category: 'Earrings' },
      { $set: { category: 'earrings' } }
    );
    console.log('✅ Fixed Earrings → earrings');

    // Step 5: Ensure jewellery category consistency
    await Product.updateMany(
      { category: 'jewellery' },
      { $set: { category: 'rings' } } // Convert generic 'jewellery' to specific category
    );
    console.log('✅ Fixed generic jewellery → rings');

    console.log('\n📊 Final verification...');
    
    // Verify changes
    const finalCategories = await Product.distinct('category', { isActive: true });
    const finalTypes = await Product.distinct('type', { isActive: true });
    const withColors = await Product.countDocuments({ 
      colorVariants: { $exists: true, $ne: [] } 
    });
    
    console.log('Final Categories:', finalCategories);
    console.log('Final Types:', finalTypes);
    console.log('Products with colors:', withColors);
    
    console.log('\n🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixProductData();