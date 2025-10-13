import dotenv from 'dotenv';
dotenv.config();

async function analyzeDescriptionTypes() {
  console.log('🔍 Analyzing Description Types in Database');
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
    
    console.log(`📊 Analyzing ${products.length} products with descriptions...`);
    
    // Analyze description lengths and characteristics
    let shortDescLike = 0;
    let fullDescLike = 0;
    let lengths = [];
    let wordCounts = [];
    
    console.log('\n📋 Individual Product Analysis:');
    
    products.forEach((product, index) => {
      const desc = product.description || '';
      const length = desc.length;
      const wordCount = desc.split(/\s+/).filter(word => word.length > 0).length;
      const sentences = desc.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      lengths.push(length);
      wordCounts.push(wordCount);
      
      // Classify based on length and content
      let type = '';
      if (length < 150) {
        type = 'SHORT';
        shortDescLike++;
      } else if (length < 500) {
        type = 'MEDIUM';
      } else {
        type = 'FULL';
        fullDescLike++;
      }
      
      // Show first few products for detailed analysis
      if (index < 5) {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Length: ${length} chars | Words: ${wordCount} | Sentences: ${sentences} | Type: ${type}`);
        console.log(`   Text: "${desc.substring(0, 100)}..."`);
        
        // Check if it looks like a short description
        const hasDetailedInfo = desc.includes('specifications') || 
                              desc.includes('materials') || 
                              desc.includes('care instructions') ||
                              desc.includes('shipping') ||
                              desc.includes('payment') ||
                              desc.length > 300;
        
        console.log(`   Contains detailed info: ${hasDetailedInfo ? 'YES (Full)' : 'NO (Short)'}`);
      }
    });
    
    // Calculate statistics
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const avgWords = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);
    
    console.log('\n📊 Statistical Analysis:');
    console.log(`   Average length: ${Math.round(avgLength)} characters`);
    console.log(`   Average words: ${Math.round(avgWords)} words`);
    console.log(`   Shortest description: ${minLength} chars`);
    console.log(`   Longest description: ${maxLength} chars`);
    
    // Length distribution
    const veryShort = lengths.filter(l => l < 100).length;
    const short = lengths.filter(l => l >= 100 && l < 200).length;
    const medium = lengths.filter(l => l >= 200 && l < 500).length;
    const long = lengths.filter(l => l >= 500 && l < 1000).length;
    const veryLong = lengths.filter(l => l >= 1000).length;
    
    console.log('\n📏 Length Distribution:');
    console.log(`   Very Short (< 100 chars): ${veryShort} products`);
    console.log(`   Short (100-199 chars): ${short} products`);
    console.log(`   Medium (200-499 chars): ${medium} products`);
    console.log(`   Long (500-999 chars): ${long} products`);
    console.log(`   Very Long (1000+ chars): ${veryLong} products`);
    
    // Content analysis
    console.log('\n🔍 Content Analysis:');
    let hasPaymentInfo = 0;
    let hasShippingInfo = 0;
    let hasSpecifications = 0;
    let hasHTMLLike = 0;
    let hasMultipleParagraphs = 0;
    
    products.forEach(product => {
      const desc = product.description.toLowerCase();
      
      if (desc.includes('payment') || desc.includes('shipping') || desc.includes('delivery')) {
        hasPaymentInfo++;
      }
      if (desc.includes('specification') || desc.includes('materials') || desc.includes('care')) {
        hasSpecifications++;
      }
      if (desc.includes('garava assurance') || desc.includes('certification')) {
        hasHTMLLike++;
      }
      if (desc.split('\n').length > 1 || desc.includes('  ')) {
        hasMultipleParagraphs++;
      }
    });
    
    console.log(`   With payment/shipping info: ${hasPaymentInfo} products`);
    console.log(`   With specifications: ${hasSpecifications} products`);
    console.log(`   With brand/certification info: ${hasHTMLLike} products`);
    console.log(`   With multiple sections: ${hasMultipleParagraphs} products`);
    
    // Final determination
    console.log('\n🎯 Description Type Determination:');
    
    if (avgLength < 200 && veryShort + short > products.length * 0.7) {
      console.log('   📝 RESULT: These appear to be SHORT DESCRIPTIONS');
      console.log('   💡 Characteristics: Brief, concise, single-sentence style');
    } else if (avgLength > 400 && (long + veryLong) > products.length * 0.5) {
      console.log('   📖 RESULT: These appear to be FULL DESCRIPTIONS');
      console.log('   💡 Characteristics: Detailed, multiple sections, comprehensive info');
    } else {
      console.log('   📋 RESULT: These appear to be MEDIUM-LENGTH DESCRIPTIONS');
      console.log('   💡 Characteristics: More than short, less than full detailed descriptions');
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    
    if (avgLength < 200) {
      console.log('   ✅ Current descriptions work well as short descriptions');
      console.log('   🚀 Consider adding more detailed full descriptions for SEO and product details');
    } else if (avgLength > 500) {
      console.log('   ✅ Current descriptions are comprehensive full descriptions');
      console.log('   🚀 Consider extracting/creating shorter versions for listing pages');
    } else {
      console.log('   ⚠️  Current descriptions are in between - could serve as either');
      console.log('   🚀 Consider deciding on primary use case and optimizing accordingly');
    }
    
    // Show longest and shortest for comparison
    const shortest = products.reduce((min, p) => p.description.length < min.description.length ? p : min);
    const longest = products.reduce((max, p) => p.description.length > max.description.length ? p : max);
    
    console.log('\n📏 Examples for Comparison:');
    console.log(`\nSHORTEST (${shortest.description.length} chars):`);
    console.log(`"${shortest.description}"`);
    
    console.log(`\nLONGEST (${longest.description.length} chars):`);
    console.log(`"${longest.description.substring(0, 200)}..."`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  } finally {
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Run the analysis
analyzeDescriptionTypes().catch(console.error);