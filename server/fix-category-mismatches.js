import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './src/shared/db.js';
import Product from './src/modules/product/product.model.js';

dotenv.config();

async function fixCategoryMismatches() {
  try {
    console.log('🔧 FIXING CATEGORY MISMATCHES');
    console.log('===============================\n');
    
    await connectDb(); 
    
    // 1. Fix high jewellery category mismatch
    console.log('1️⃣ Fixing High Jewellery Categories...');
    
    const highJewelleryProduct = await Product.findOne({ 
      type: 'high_jewellery',
      name: { $regex: /daily earrings/i }
    });
    
    if (highJewelleryProduct) {
      console.log(`Found: ${highJewelleryProduct.name}`);
      console.log(`Current category: "${highJewelleryProduct.category}"`);
      
      // Update to match navbar expectation
      await Product.updateOne(
        { _id: highJewelleryProduct._id },
        { $set: { category: 'daily-earrings' } }
      );
      console.log('✅ Updated to: "daily-earrings"');
    }
    
    // 2. Create sample fragrance products with proper categories
    console.log('\n2️⃣ Fixing Fragrance Categories...');
    
    const fragranceUpdates = [
      { namePattern: /sila/i, newCategory: 'sila' },
      { namePattern: /evara/i, newCategory: 'evara' }, 
      { namePattern: /wayfarer/i, newCategory: 'wayfarer' }
    ];
    
    for (const update of fragranceUpdates) {
      const product = await Product.findOne({ 
        type: 'fragrance',
        name: update.namePattern
      });
      
      if (product) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { category: update.newCategory } }
        );
        console.log(`✅ Updated "${product.name}" to category: "${update.newCategory}"`);
      } else {
        console.log(`❌ No product found matching: ${update.namePattern}`);
      }
    }
    
    // 3. Create additional high jewellery products for testing
    console.log('\n3️⃣ Creating Additional High Jewellery Products...');
    
    const highJewelleryProducts = [
      {
        name: 'Platinum Solitaire Rings',
        slug: 'platinum-solitaire-rings',
        type: 'high_jewellery',
        category: 'solitaire-rings',
        description: 'Exquisite platinum solitaire rings with premium diamonds',
        colorVariants: [
          { name: 'Platinum', code: 'silver', hexColor: '#E5E4E2', isAvailable: true },
          { name: 'White Gold', code: 'gold', hexColor: '#FFFFCC', isAvailable: true }
        ],
        variants: [
          { 
            name: 'Standard', 
            sku: 'HJ-SR-001',
            sizeLabel: 'Adjustable',
            price: 15000, 
            stock: 5 
          }
        ],
        isActive: true,
        status: 'published'
      },
      {
        name: 'Diamond Solitaire Studs',
        slug: 'diamond-solitaire-studs',
        type: 'high_jewellery', 
        category: 'solitaire-studs',
        description: 'Premium diamond solitaire stud earrings',
        colorVariants: [
          { name: 'Rose Gold', code: 'rose', hexColor: '#E8B4B8', isAvailable: true },
          { name: 'White Gold', code: 'gold', hexColor: '#FFFFCC', isAvailable: true },
          { name: 'Platinum', code: 'silver', hexColor: '#E5E4E2', isAvailable: true }
        ],
        variants: [
          { 
            name: 'Standard', 
            sku: 'HJ-SS-001',
            sizeLabel: 'One Size',
            price: 12000, 
            stock: 8 
          }
        ],
        isActive: true,
        status: 'published'
      }
    ];
    
    for (const productData of highJewelleryProducts) {
      const existing = await Product.findOne({ name: productData.name });
      if (!existing) {
        const newProduct = new Product(productData);
        await newProduct.save();
        console.log(`✅ Created: ${productData.name}`);
      } else {
        console.log(`⚠️  Already exists: ${productData.name}`);
      }
    }
    
    // 4. Verify the fixes
    console.log('\n4️⃣ Verification...');
    
    const testQueries = [
      { type: 'high_jewellery', category: 'daily-earrings' },
      { type: 'high_jewellery', category: 'solitaire-rings' },
      { type: 'high_jewellery', category: 'solitaire-studs' },
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
    
    console.log('\n🎉 Category alignment complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixCategoryMismatches();