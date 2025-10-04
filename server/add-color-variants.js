import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './src/shared/db.js';
import Product from './src/modules/product/product.model.js';

dotenv.config();

const sampleColorVariants = [
  {
    name: "Rose Gold",
    code: "rose",
    hexColor: "#e7b9a4",
    isAvailable: true
  },
  {
    name: "Silver",
    code: "silver", 
    hexColor: "#d9d9d9",
    isAvailable: true
  },
  {
    name: "Yellow Gold",
    code: "gold",
    hexColor: "#c79b3a", 
    isAvailable: true
  }
];

async function addColorVariants() {
  try {
    console.log('🔧 Adding color variants to jewellery products...');
    
    // Find all jewellery products that don't have color variants
    const jewelleryProducts = await Product.find({
      type: { $in: ['jewellery', 'high_jewellery'] },
      $or: [
        { colorVariants: { $exists: false } },
        { colorVariants: { $size: 0 } }
      ]
    });

    console.log(`Found ${jewelleryProducts.length} jewellery products without color variants`);

    let updated = 0;
    for (const product of jewelleryProducts) {
      // Add random 1-3 color variants for demo purposes
      const numColors = Math.floor(Math.random() * 3) + 1;
      const selectedColors = sampleColorVariants
        .sort(() => 0.5 - Math.random())
        .slice(0, numColors);

      await Product.findByIdAndUpdate(product._id, {
        $set: { colorVariants: selectedColors }
      });

      console.log(`✅ Added ${selectedColors.length} colors to "${product.name}"`);
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} products with color variants!`);
    
    // Display sample of updated products
    const sampleUpdated = await Product.find({
      type: { $in: ['jewellery', 'high_jewellery'] },
      colorVariants: { $exists: true, $ne: [] }
    }).limit(5);

    console.log('\n📋 Sample updated products:');
    sampleUpdated.forEach(product => {
      console.log(`- ${product.name}: ${product.colorVariants.map(c => c.name).join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Error adding color variants:', error);
  } finally {
    process.exit(0);
  }
}

addColorVariants();