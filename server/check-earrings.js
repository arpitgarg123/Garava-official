import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function checkEarrings() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all products with "earring" in the name
    const products = await Product.find({
      type: 'jewellery',
      name: { $regex: 'earring', $options: 'i' }
    }).select('name category').lean();

    console.log('🔍 EARRING PRODUCTS ANALYSIS\n');
    console.log('='  .repeat(80));
    
    console.log(`\nFound ${products.length} products with "earring" in the name:\n`);
    
    products.forEach((product, index) => {
      const isWrong = product.category !== 'earrings';
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Current Category: "${product.category}" ${isWrong ? '❌' : '✅'}`);
      if (isWrong) {
        console.log(`   Should be: "earrings" ✅`);
      }
      console.log('');
    });

    // Also check for "stud" in the name
    const studs = await Product.find({
      type: 'jewellery',
      name: { $regex: 'stud', $options: 'i' }
    }).select('name category').lean();

    if (studs.length > 0) {
      console.log('='  .repeat(80));
      console.log(`\nFound ${studs.length} products with "stud" in the name:\n`);
      
      studs.forEach((product, index) => {
        const isWrong = product.category !== 'earrings';
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Current Category: "${product.category}" ${isWrong ? '❌' : '✅'}`);
        if (isWrong) {
          console.log(`   Should be: "earrings" ✅`);
        }
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEarrings();
