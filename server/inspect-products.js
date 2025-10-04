import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './src/shared/db.js';
import Product from './src/modules/product/product.model.js';

dotenv.config();

async function inspectProductData() {
  try {
    console.log('🔍 Inspecting Product Data Structure...\n');
    
    await connectDb();
    
    // Get sample products with full details
    const products = await Product.find({ isActive: true }).limit(5).lean();
    
    console.log(`📊 Found ${products.length} sample products:\n`);
    
    products.forEach((product, index) => {
      console.log(`--- Product ${index + 1} ---`);
      console.log('Name:', product.name);
      console.log('Type:', product.type);
      console.log('Category:', `"${product.category}"`);
      console.log('Status:', product.status);
      console.log('Color Variants:', product.colorVariants);
      console.log('Variants count:', product.variants?.length || 0);
      if (product.variants?.length > 0) {
        console.log('First variant:', {
          name: product.variants[0].name,
          price: product.variants[0].price,
          stock: product.variants[0].stock
        });
      }
      console.log('---\n');
    });

    // Check unique categories and types
    const categories = await Product.distinct('category', { isActive: true });
    const types = await Product.distinct('type', { isActive: true });
    
    console.log('📋 Unique Categories:', categories);
    console.log('📋 Unique Types:', types);
    
    // Check if any products have colorVariants at all
    const withColors = await Product.findOne({ 
      colorVariants: { $exists: true, $ne: [] } 
    }).lean();
    
    if (withColors) {
      console.log('\n🎨 Found product with colors:', withColors.name);
      console.log('Color variants:', withColors.colorVariants);
    } else {
      console.log('\n❌ No products found with color variants');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

inspectProductData();