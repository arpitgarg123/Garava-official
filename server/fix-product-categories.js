import mongoose from 'mongoose';
import fs from 'fs';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

// Standard color variants for jewellery products
const JEWELLERY_COLOR_VARIANTS = [
  {
    name: "Rose Gold",
    code: "rose",
    hexColor: "#e7b9a4",
    isAvailable: true,
    heroImage: { url: "" },
    galleryImages: []
  },
  {
    name: "Silver",
    code: "silver",
    hexColor: "#d9d9d9",
    isAvailable: true,
    heroImage: { url: "" },
    galleryImages: []
  },
  {
    name: "Yellow Gold",
    code: "gold",
    hexColor: "#c79b3a",
    isAvailable: true,
    heroImage: { url: "" },
    galleryImages: []
  }
];

async function fixProductData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read suggestions file
    const suggestions = JSON.parse(fs.readFileSync('category-fix-suggestions.json', 'utf8'));
    
    console.log('🔧 FIXING PRODUCT CATEGORIES AND COLORS\n');
    console.log('='  .repeat(80));
    
    let updated = 0;
    let errors = 0;
    
    for (const suggestion of suggestions) {
      if (!suggestion.needsUpdate && suggestion.hasColorVariants) {
        console.log(`⏭️  Skipping: ${suggestion.name} (already correct)`);
        continue;
      }
      
      try {
        const updateData = {};
        
        // Fix category if needed
        if (suggestion.needsUpdate && suggestion.suggestedCategory !== 'uncategorized') {
          updateData.category = suggestion.suggestedCategory;
        }
        
        // Add color variants for jewellery products if they don't have them
        if (suggestion.type === 'jewellery' && !suggestion.hasColorVariants) {
          updateData.colorVariants = JEWELLERY_COLOR_VARIANTS;
        }
        
        // Only update if we have changes
        if (Object.keys(updateData).length > 0) {
          await Product.updateOne(
            { _id: suggestion.id },
            { $set: updateData }
          );
          
          const changes = [];
          if (updateData.category) changes.push(`category: "${updateData.category}"`);
          if (updateData.colorVariants) changes.push(`added ${updateData.colorVariants.length} color variants`);
          
          console.log(`✅ Updated: ${suggestion.name}`);
          console.log(`   Changes: ${changes.join(', ')}`);
          updated++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${suggestion.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n' + '='  .repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Successfully Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   ⏭️  Skipped: ${suggestions.length - updated - errors}`);
    
    // Verify the changes
    console.log('\n\n🔍 VERIFYING CHANGES...\n');
    
    const jewelryCategories = await Product.distinct('category', { type: 'jewellery' });
    console.log(`Jewellery Categories: ${jewelryCategories.join(', ')}`);
    
    const fragranceCategories = await Product.distinct('category', { type: 'fragrance' });
    console.log(`Fragrance Categories: ${fragranceCategories.join(', ')}`);
    
    const withColors = await Product.countDocuments({ 
      type: 'jewellery',
      colorVariants: { $exists: true, $ne: [] } 
    });
    const totalJewellery = await Product.countDocuments({ type: 'jewellery' });
    console.log(`\nJewellery products with color variants: ${withColors}/${totalJewellery}`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixProductData();
