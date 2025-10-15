import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function updatePriceOnDemandText() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔄 UPDATING "Price on Demand" to "Price on Request"\n');
    console.log('='  .repeat(80));

    // Find all products with isPriceOnDemand variants
    const products = await Product.find({
      'variants.isPriceOnDemand': true
    });

    console.log(`\nFound ${products.length} products with "Price on Demand" variants\n`);

    // Update all variants with "Price on Demand" to "Price on Request"
    const result = await Product.updateMany(
      { 'variants.isPriceOnDemand': true },
      { 
        $set: { 
          'variants.$[elem].priceOnDemandText': 'Price on Request'
        }
      },
      {
        arrayFilters: [
          { 
            'elem.isPriceOnDemand': true,
            'elem.priceOnDemandText': 'Price on Demand'
          }
        ]
      }
    );

    console.log(`✅ Products matched: ${result.matchedCount}`);
    console.log(`✅ Products modified: ${result.modifiedCount}`);

    const updated = result.modifiedCount;
    const variantsUpdated = result.modifiedCount * 3; // Approximate (3 variants per product)

    console.log('\n' + '='  .repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Products Updated: ${updated}`);
    console.log(`   ✅ Variants Updated: ${variantsUpdated}`);

    // Verify the changes
    console.log('\n\n🔍 VERIFYING CHANGES...\n');
    
    const priceOnRequest = await Product.countDocuments({
      'variants': { $elemMatch: { priceOnDemandText: 'Price on Request' } }
    });
    
    const priceOnDemand = await Product.countDocuments({
      'variants': { $elemMatch: { priceOnDemandText: 'Price on Demand' } }
    });

    console.log(`Products with "Price on Request": ${priceOnRequest}`);
    console.log(`Products with "Price on Demand": ${priceOnDemand}`);
    
    if (priceOnDemand === 0) {
      console.log('\n✅ All products successfully updated!');
    } else {
      console.log('\n⚠️  Some products still have "Price on Demand"');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePriceOnDemandText();
