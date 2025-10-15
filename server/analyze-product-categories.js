import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function analyzeAndSuggestFixes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({}).select('name type category subcategory colorVariants').lean();
    
    console.log('🔍 ANALYSIS OF PRODUCT CATEGORIES\n');
    console.log('='  .repeat(80));
    
    // Categorize products based on their names
    const categorySuggestions = [];
    
    products.forEach(product => {
      const nameLower = product.name.toLowerCase();
      let suggestedCategory = product.category;
      
      // Detect category from product name
      if (product.type === 'jewellery') {
        if (nameLower.includes('ring')) {
          suggestedCategory = 'rings';
        } else if (nameLower.includes('necklace')) {
          suggestedCategory = 'necklaces';
        } else if (nameLower.includes('earring') || nameLower.includes('stud')) {
          suggestedCategory = 'earrings';
        } else if (nameLower.includes('pendant')) {
          suggestedCategory = 'pendants';
        } else if (nameLower.includes('bracelet')) {
          suggestedCategory = 'bracelets';
        } else {
          suggestedCategory = 'uncategorized';
        }
      } else if (product.type === 'fragrance') {
        if (nameLower.includes('sila')) {
          suggestedCategory = 'sila';
        } else if (nameLower.includes('evara')) {
          suggestedCategory = 'evara';
        } else if (nameLower.includes('wayfarer')) {
          suggestedCategory = 'wayfarer';
        } else if (nameLower.includes('sayonee')) {
          suggestedCategory = 'sayonee';
        } else if (nameLower.includes('mangata')) {
          suggestedCategory = 'mangata';
        } else {
          suggestedCategory = 'uncategorized';
        }
      } else if (product.type === 'high_jewellery') {
        if (nameLower.includes('solitaire') && nameLower.includes('ring')) {
          suggestedCategory = 'solitaire-rings';
        } else if (nameLower.includes('solitaire') && (nameLower.includes('stud') || nameLower.includes('earring'))) {
          suggestedCategory = 'solitaire-studs';
        } else if (nameLower.includes('earring')) {
          suggestedCategory = 'daily-earrings';
        } else {
          suggestedCategory = 'uncategorized';
        }
      }
      
      categorySuggestions.push({
        id: product._id,
        name: product.name,
        type: product.type,
        currentCategory: product.category,
        suggestedCategory: suggestedCategory,
        needsUpdate: product.category !== suggestedCategory,
        hasColorVariants: product.colorVariants && product.colorVariants.length > 0
      });
    });
    
    // Show products that need updates
    const needsUpdate = categorySuggestions.filter(p => p.needsUpdate);
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Need Category Update: ${needsUpdate.length}`);
    console.log(`   Products with Color Variants: ${categorySuggestions.filter(p => p.hasColorVariants).length}`);
    
    console.log(`\n\n🔧 PRODUCTS NEEDING CATEGORY UPDATES:\n`);
    console.log('='  .repeat(80));
    
    needsUpdate.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Type: ${product.type}`);
      console.log(`   Current Category: "${product.currentCategory}" ❌`);
      console.log(`   Suggested Category: "${product.suggestedCategory}" ✅`);
      console.log(`   Has Color Variants: ${product.hasColorVariants ? 'Yes ✅' : 'No ❌'}`);
    });
    
    // Show breakdown by type
    console.log(`\n\n📋 SUGGESTED CATEGORIES BY TYPE:\n`);
    console.log('='  .repeat(80));
    
    const byType = {};
    categorySuggestions.forEach(p => {
      if (!byType[p.type]) byType[p.type] = {};
      if (!byType[p.type][p.suggestedCategory]) byType[p.type][p.suggestedCategory] = 0;
      byType[p.type][p.suggestedCategory]++;
    });
    
    Object.entries(byType).forEach(([type, categories]) => {
      console.log(`\n${type.toUpperCase()}:`);
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} products`);
      });
    });
    
    // Save suggestions to file for the fix script
    const fs = await import('fs');
    fs.writeFileSync(
      'category-fix-suggestions.json',
      JSON.stringify(categorySuggestions, null, 2)
    );
    console.log(`\n\n💾 Suggestions saved to: category-fix-suggestions.json`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeAndSuggestFixes();
