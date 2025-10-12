import dotenv from 'dotenv';
dotenv.config();

async function cleanProductDescriptions() {
  console.log('🧹 Cleaning Product Descriptions');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get all products with descriptions
    console.log('📊 Analyzing product descriptions...');
    const products = await Product.find({
      $or: [
        { description: { $exists: true, $ne: null, $ne: '' } },
        { shortDescription: { $exists: true, $ne: null, $ne: '' } }
      ]
    }).select('name description shortDescription');
    
    console.log(`Found ${products.length} products with descriptions to clean`);
    
    // Function to clean description text
    const cleanDescription = (text) => {
      if (!text || typeof text !== 'string') return text;
      
      let cleaned = text;
      
      // Remove HTML tags
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      
      // Remove HTML entities
      cleaned = cleaned.replace(/&nbsp;/g, ' ');
      cleaned = cleaned.replace(/&amp;/g, '&');
      cleaned = cleaned.replace(/&lt;/g, '<');
      cleaned = cleaned.replace(/&gt;/g, '>');
      cleaned = cleaned.replace(/&quot;/g, '"');
      cleaned = cleaned.replace(/&#39;/g, "'");
      
      // Remove \n and \r characters
      cleaned = cleaned.replace(/\\n/g, ' ');
      cleaned = cleaned.replace(/\\r/g, ' ');
      cleaned = cleaned.replace(/\n/g, ' ');
      cleaned = cleaned.replace(/\r/g, ' ');
      
      // Remove specific keywords (case insensitive)
      cleaned = cleaned.replace(/Description&nbsp;/gi, '');
      cleaned = cleaned.replace(/Description /gi, '');
      cleaned = cleaned.replace(/Lab-Grown/gi, 'Lab Grown'); // Replace with clean version
      
      // Clean up extra spaces
      cleaned = cleaned.replace(/\s+/g, ' ');
      cleaned = cleaned.trim();
      
      return cleaned;
    };
    
    let updatedCount = 0;
    let processedCount = 0;
    
    console.log('\n🔄 Processing products...');
    
    // Process each product
    for (const product of products) {
      processedCount++;
      let hasChanges = false;
      let updates = {};
      
      console.log(`\n📦 Processing ${processedCount}/${products.length}: ${product.name}`);
      
      // Clean description
      if (product.description) {
        const originalDesc = product.description;
        const cleanedDesc = cleanDescription(originalDesc);
        
        if (originalDesc !== cleanedDesc) {
          updates.description = cleanedDesc;
          hasChanges = true;
          console.log('   📝 Description cleaned');
          console.log(`   Before: ${originalDesc.substring(0, 100)}...`);
          console.log(`   After:  ${cleanedDesc.substring(0, 100)}...`);
        }
      }
      
      // Clean short description
      if (product.shortDescription) {
        const originalShortDesc = product.shortDescription;
        const cleanedShortDesc = cleanDescription(originalShortDesc);
        
        if (originalShortDesc !== cleanedShortDesc) {
          updates.shortDescription = cleanedShortDesc;
          hasChanges = true;
          console.log('   📄 Short description cleaned');
        }
      }
      
      // Update the product if there are changes
      if (hasChanges) {
        await Product.findByIdAndUpdate(product._id, {
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        });
        updatedCount++;
        console.log('   ✅ Product updated');
      } else {
        console.log('   ℹ️  No changes needed');
      }
    }
    
    console.log('\n📊 Cleaning Summary:');
    console.log(`   Products processed: ${processedCount}`);
    console.log(`   Products updated: ${updatedCount}`);
    console.log(`   Products unchanged: ${processedCount - updatedCount}`);
    
    // Show sample cleaned products
    console.log('\n📋 Sample Cleaned Products:');
    const sampleProducts = await Product.find({
      description: { $exists: true, $ne: null, $ne: '' }
    }).limit(3).select('name description shortDescription');
    
    sampleProducts.forEach((product, index) => {
      console.log(`\n  ${index + 1}. ${product.name}`);
      if (product.shortDescription) {
        console.log(`     Short: ${product.shortDescription.substring(0, 80)}...`);
      }
      if (product.description) {
        console.log(`     Desc:  ${product.description.substring(0, 80)}...`);
      }
    });
    
    console.log('\n🎉 Description cleaning completed!');
    
  } catch (error) {
    console.error('❌ Cleaning failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the cleaning
cleanProductDescriptions().catch(console.error);