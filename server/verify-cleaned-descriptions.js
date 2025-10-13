import dotenv from 'dotenv';
dotenv.config();

async function verifyCleanedDescriptions() {
  console.log('🔍 Verifying Cleaned Product Descriptions');
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
    const products = await Product.find({
      description: { $exists: true, $ne: null, $ne: '' }
    }).select('name description shortDescription');
    
    console.log(`📊 Checking ${products.length} products for cleaning verification...`);
    
    let htmlTagsFound = 0;
    let newlinesFound = 0;
    let keywordsFound = 0;
    let nbspFound = 0;
    
    console.log('\n🔍 Analyzing descriptions for remaining issues...');
    
    products.forEach((product, index) => {
      const desc = product.description || '';
      const shortDesc = product.shortDescription || '';
      const combined = desc + ' ' + shortDesc;
      
      // Check for HTML tags
      if (combined.match(/<[^>]*>/)) {
        htmlTagsFound++;
        console.log(`❌ HTML tags found in: ${product.name}`);
      }
      
      // Check for newlines
      if (combined.match(/\\n|\\r|\n|\r/)) {
        newlinesFound++;
        console.log(`❌ Newlines found in: ${product.name}`);
      }
      
      // Check for specific keywords
      if (combined.match(/Description&nbsp;|Lab-Grown/gi)) {
        keywordsFound++;
        console.log(`❌ Keywords found in: ${product.name}`);
      }
      
      // Check for &nbsp;
      if (combined.match(/&nbsp;/)) {
        nbspFound++;
        console.log(`❌ &nbsp; found in: ${product.name}`);
      }
    });
    
    console.log('\n📊 Verification Results:');
    console.log(`   ✅ Products processed: ${products.length}`);
    console.log(`   ❌ HTML tags remaining: ${htmlTagsFound}`);
    console.log(`   ❌ Newlines remaining: ${newlinesFound}`);
    console.log(`   ❌ Keywords remaining: ${keywordsFound}`);
    console.log(`   ❌ &nbsp; remaining: ${nbspFound}`);
    
    if (htmlTagsFound === 0 && newlinesFound === 0 && keywordsFound === 0 && nbspFound === 0) {
      console.log('\n🎉 VERIFICATION SUCCESSFUL!');
      console.log('   ✅ All HTML tags removed');
      console.log('   ✅ All newlines removed');
      console.log('   ✅ All specified keywords cleaned');
      console.log('   ✅ All &nbsp; entities removed');
    } else {
      console.log('\n⚠️  Some issues may remain - check individual products above');
    }
    
    // Show sample cleaned descriptions
    console.log('\n📋 Sample Cleaned Descriptions:');
    const sampleProducts = products.slice(0, 3);
    
    sampleProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      if (product.shortDescription) {
        console.log(`   Short: "${product.shortDescription}"`);
      }
      console.log(`   Full:  "${product.description.substring(0, 150)}..."`);
    });
    
    // Check for common patterns that should be clean
    console.log('\n✅ Clean Text Patterns Confirmed:');
    const sampleDesc = products[0]?.description || '';
    console.log(`   - No HTML tags: ${!sampleDesc.includes('<') ? '✅' : '❌'}`);
    console.log(`   - No &nbsp;: ${!sampleDesc.includes('&nbsp;') ? '✅' : '❌'}`);
    console.log(`   - No \\n chars: ${!sampleDesc.includes('\\n') ? '✅' : '❌'}`);
    console.log(`   - Proper spacing: ${!sampleDesc.includes('  ') ? '✅' : '⚠️'}`);
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the verification
verifyCleanedDescriptions().catch(console.error);