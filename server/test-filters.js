import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function testFilters() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧪 TESTING FILTER QUERIES\n');
    console.log('='  .repeat(80));

    // Test 1: Color Filter
    console.log('\n📝 Test 1: Color Filter (Rose Gold)');
    console.log('Query: { type: "jewellery", "colorVariants.code": { $in: ["rose"] } }\n');
    
    const roseProducts = await Product.find({
      type: 'jewellery',
      isActive: true,
      status: 'published',
      'colorVariants.code': { $in: ['rose'] }
    }).select('name colorVariants').limit(5).lean();
    
    console.log(`Found: ${roseProducts.length} products`);
    if (roseProducts.length > 0) {
      console.log('Sample:');
      roseProducts.forEach((p, i) => {
        const colors = p.colorVariants?.map(cv => cv.code).join(', ');
        console.log(`   ${i + 1}. ${p.name}`);
        console.log(`      Colors: ${colors || 'none'}`);
      });
    }

    // Test 2: Multiple Colors
    console.log('\n\n📝 Test 2: Multiple Color Filter (Rose + Gold)');
    console.log('Query: { type: "jewellery", "colorVariants.code": { $in: ["rose", "gold"] } }\n');
    
    const multiColorProducts = await Product.countDocuments({
      type: 'jewellery',
      isActive: true,
      status: 'published',
      'colorVariants.code': { $in: ['rose', 'gold'] }
    });
    
    console.log(`Found: ${multiColorProducts} products`);

    // Test 3: Price Filter (test with paise)
    console.log('\n\n📝 Test 3: Price Filter (min: 10000 paise = ₹100, max: 50000 paise = ₹500)');
    console.log('Query: { type: "jewellery", "variants.price": { $gte: 10000, $lte: 50000 } }\n');
    
    const priceProducts = await Product.find({
      type: 'jewellery',
      isActive: true,
      status: 'published',
      'variants.price': { $gte: 10000, $lte: 50000 }
    }).select('name variants').limit(5).lean();
    
    console.log(`Found: ${priceProducts.length} products`);
    if (priceProducts.length > 0) {
      console.log('Sample:');
      priceProducts.forEach((p, i) => {
        const prices = p.variants?.map(v => `₹${(v.price / 100).toFixed(2)}`).join(', ');
        console.log(`   ${i + 1}. ${p.name}`);
        console.log(`      Prices: ${prices || 'none'}`);
      });
    }

    // Test 4: Check actual price values in database
    console.log('\n\n📝 Test 4: Checking Price Storage Format');
    const sampleProduct = await Product.findOne({ type: 'jewellery' }).select('name variants').lean();
    
    if (sampleProduct && sampleProduct.variants && sampleProduct.variants.length > 0) {
      console.log(`\nSample Product: ${sampleProduct.name}`);
      console.log('Variant prices in database:');
      sampleProduct.variants.forEach((v, i) => {
        console.log(`   Variant ${i + 1}: ${v.price} (raw value)`);
        console.log(`   As rupees: ₹${(v.price / 100).toFixed(2)}`);
        console.log(`   isPriceOnDemand: ${v.isPriceOnDemand || false}`);
      });
    }

    // Test 5: Check if colorVariants structure is correct
    console.log('\n\n📝 Test 5: Checking ColorVariants Structure');
    const jewelryWithColors = await Product.findOne({ 
      type: 'jewellery',
      colorVariants: { $exists: true, $ne: [] }
    }).select('name colorVariants').lean();
    
    if (jewelryWithColors) {
      console.log(`\nSample Product: ${jewelryWithColors.name}`);
      console.log('ColorVariants structure:');
      jewelryWithColors.colorVariants.forEach((cv, i) => {
        console.log(`   ${i + 1}. ${JSON.stringify(cv, null, 2).split('\n').join('\n      ')}`);
      });
    }

    // Test 6: Combined Filter (Color + Price)
    console.log('\n\n📝 Test 6: Combined Filter (Silver color + price < ₹1000)');
    const combinedFilter = {
      type: 'jewellery',
      isActive: true,
      status: 'published',
      'colorVariants.code': { $in: ['silver'] },
      'variants.price': { $lte: 100000 } // ₹1000 in paise
    };
    console.log('Query:', JSON.stringify(combinedFilter, null, 2));
    
    const combinedProducts = await Product.countDocuments(combinedFilter);
    console.log(`\nFound: ${combinedProducts} products`);

    console.log('\n\n' + '='  .repeat(80));
    console.log('\n📊 SUMMARY:\n');
    
    const totalJewellery = await Product.countDocuments({ type: 'jewellery', isActive: true, status: 'published' });
    const withColors = await Product.countDocuments({ 
      type: 'jewellery', 
      isActive: true,
      status: 'published',
      colorVariants: { $exists: true, $ne: [] } 
    });
    const withPrice = await Product.countDocuments({ 
      type: 'jewellery',
      isActive: true,
      status: 'published',
      'variants.price': { $exists: true } 
    });
    
    console.log(`Total Jewellery Products: ${totalJewellery}`);
    console.log(`With Color Variants: ${withColors} (${Math.round(withColors/totalJewellery*100)}%)`);
    console.log(`With Price Data: ${withPrice} (${Math.round(withPrice/totalJewellery*100)}%)`);
    console.log(`\nFilter Readiness: ${withColors === totalJewellery && withPrice === totalJewellery ? '✅ Ready' : '⚠️ Incomplete'}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testFilters();
