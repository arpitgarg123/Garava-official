import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function verifyUpdate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check a sample product
    const sample = await Product.findOne({ type: 'jewellery' }).lean();
    
    console.log('📝 Sample Product Check:\n');
    console.log(`Product: ${sample.name}`);
    console.log(`\nVariants:`);
    
    sample.variants.forEach((v, i) => {
      console.log(`\n  Variant ${i + 1} (${v.sizeLabel}):`);
      console.log(`    isPriceOnDemand: ${v.isPriceOnDemand}`);
      console.log(`    priceOnDemandText: "${v.priceOnDemandText}"`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyUpdate();
