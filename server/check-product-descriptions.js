import dotenv from 'dotenv';
dotenv.config();

async function checkProductDescriptions() {
  console.log('🔍 Checking Product Descriptions in Database');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    // Get all products
    console.log('📊 Analyzing product descriptions...');
    const totalProducts = await Product.countDocuments();
    
    // Check descriptions
    const withDescription = await Product.countDocuments({
      description: { $exists: true, $ne: null, $ne: '' }
    });
    
    const withoutDescription = await Product.countDocuments({
      $or: [
        { description: { $exists: false } },
        { description: null },
        { description: '' }
      ]
    });
    
    // Check short descriptions
    const withShortDescription = await Product.countDocuments({
      shortDescription: { $exists: true, $ne: null, $ne: '' }
    });
    
    const withoutShortDescription = await Product.countDocuments({
      $or: [
        { shortDescription: { $exists: false } },
        { shortDescription: null },
        { shortDescription: '' }
      ]
    });
    
    // Products with both
    const withBoth = await Product.countDocuments({
      description: { $exists: true, $ne: null, $ne: '' },
      shortDescription: { $exists: true, $ne: null, $ne: '' }
    });
    
    // Products with neither
    const withNeither = await Product.countDocuments({
      $and: [
        {
          $or: [
            { description: { $exists: false } },
            { description: null },
            { description: '' }
          ]
        },
        {
          $or: [
            { shortDescription: { $exists: false } },
            { shortDescription: null },
            { shortDescription: '' }
          ]
        }
      ]
    });
    
    console.log('\n📊 Description Analysis Results:');
    console.log(`   Total Products: ${totalProducts}`);
    console.log('');
    console.log('📝 Full Descriptions:');
    console.log(`   ✅ With Description: ${withDescription}`);
    console.log(`   ❌ Without Description: ${withoutDescription}`);
    console.log('');
    console.log('📄 Short Descriptions:');
    console.log(`   ✅ With Short Description: ${withShortDescription}`);
    console.log(`   ❌ Without Short Description: ${withoutShortDescription}`);
    console.log('');
    console.log('📋 Combined Status:');
    console.log(`   ✅ With Both: ${withBoth}`);
    console.log(`   ❌ With Neither: ${withNeither}`);
    
    // Show sample products with descriptions
    console.log('\n📋 Sample Products with Descriptions:');
    const sampleWithBoth = await Product.find({
      description: { $exists: true, $ne: null, $ne: '' },
      shortDescription: { $exists: true, $ne: null, $ne: '' }
    }).limit(3).select('name description shortDescription');
    
    sampleWithBoth.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Short: "${product.shortDescription?.substring(0, 60)}..."`);
      console.log(`   Full:  "${product.description?.substring(0, 80)}..."`);
    });
    
    // Show products without descriptions (if any)
    const samplesWithoutDesc = await Product.find({
      $or: [
        { description: { $exists: false } },
        { description: null },
        { description: '' }
      ]
    }).limit(3).select('name description shortDescription');
    
    if (samplesWithoutDesc.length > 0) {
      console.log('\n⚠️  Products Missing Descriptions:');
      samplesWithoutDesc.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Missing full description`);
      });
    }
    
    // Show products without short descriptions (if any)
    const samplesWithoutShortDesc = await Product.find({
      $or: [
        { shortDescription: { $exists: false } },
        { shortDescription: null },
        { shortDescription: '' }
      ]
    }).limit(3).select('name description shortDescription');
    
    if (samplesWithoutShortDesc.length > 0) {
      console.log('\n⚠️  Products Missing Short Descriptions:');
      samplesWithoutShortDesc.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Missing short description`);
      });
    }
    
    // Summary
    console.log('\n📈 Summary:');
    const descriptionCoverage = ((withDescription / totalProducts) * 100).toFixed(1);
    const shortDescCoverage = ((withShortDescription / totalProducts) * 100).toFixed(1);
    const bothCoverage = ((withBoth / totalProducts) * 100).toFixed(1);
    
    console.log(`   Description Coverage: ${descriptionCoverage}%`);
    console.log(`   Short Description Coverage: ${shortDescCoverage}%`);
    console.log(`   Both Descriptions Coverage: ${bothCoverage}%`);
    
    if (withBoth === totalProducts) {
      console.log('\n🎉 EXCELLENT! All products have both descriptions!');
    } else if (withDescription === totalProducts) {
      console.log('\n✅ Good! All products have full descriptions');
      console.log('⚠️  Some products missing short descriptions');
    } else {
      console.log('\n⚠️  Some products are missing descriptions');
      console.log('📝 Consider adding missing descriptions for better SEO');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the check
checkProductDescriptions().catch(console.error);