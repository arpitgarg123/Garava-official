import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './src/shared/db.js';
import Product from './src/modules/product/product.model.js';

dotenv.config();

async function createFragranceProducts() {
  try {
    console.log('🌸 CREATING FRAGRANCE PRODUCTS');
    console.log('===============================\n');
    
    await connectDb();
    
    const fragranceProducts = [
      {
        name: 'Sila Fragrance',
        slug: 'sila-fragrance',
        type: 'fragrance',
        category: 'sila',
        description: 'A captivating floral fragrance with notes of jasmine and rose',
        colorVariants: [
          { name: 'Original', code: 'original', hexColor: '#8B4513', isAvailable: true }
        ],
        variants: [
          { sku: 'SILA-50ML', sizeLabel: '50ml', price: 2500, stock: 20 },
          { sku: 'SILA-100ML', sizeLabel: '100ml', price: 4000, stock: 15 }
        ],
        isActive: true,
        status: 'published'
      },
      {
        name: 'Wayfarer Fragrance',
        slug: 'wayfarer-fragrance',
        type: 'fragrance',
        category: 'wayfarer',
        description: 'An adventurous scent inspired by wanderlust and freedom',
        colorVariants: [
          { name: 'Original', code: 'original', hexColor: '#8B4513', isAvailable: true }
        ],
        variants: [
          { sku: 'WAYF-50ML', sizeLabel: '50ml', price: 2800, stock: 18 },
          { sku: 'WAYF-100ML', sizeLabel: '100ml', price: 4500, stock: 12 }
        ],
        isActive: true,
        status: 'published'
      }
    ];
    
    for (const productData of fragranceProducts) {
      const existing = await Product.findOne({ slug: productData.slug });
      if (!existing) {
        const newProduct = new Product(productData);
        await newProduct.save();
        console.log(`✅ Created: ${productData.name} (${productData.category})`);
      } else {
        console.log(`⚠️  Already exists: ${productData.name}`);
      }
    }
    
    console.log('\n📊 Final verification...');
    const testQueries = [
      { type: 'fragrance', category: 'sila' },
      { type: 'fragrance', category: 'evara' },
      { type: 'fragrance', category: 'wayfarer' }
    ];
    
    for (const query of testQueries) {
      const count = await Product.countDocuments({ 
        ...query, 
        isActive: true, 
        status: 'published' 
      });
      console.log(`${query.type}/${query.category}: ${count} products`);
    }
    
    console.log('\n🎉 Fragrance products created!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createFragranceProducts();