import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function fixEarringCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔧 FIXING EARRING CATEGORIES\n');
    console.log('='  .repeat(80));

    // Find and fix all products with "earring" in the name
    const earringProducts = await Product.find({
      type: 'jewellery',
      name: { $regex: 'earring', $options: 'i' },
      category: { $ne: 'earrings' }
    }).select('name category');

    console.log(`\nFound ${earringProducts.length} earring products with wrong category\n`);

    let updated = 0;
    let errors = 0;

    for (const product of earringProducts) {
      try {
        await Product.updateOne(
          { _id: product._id },
          { $set: { category: 'earrings' } }
        );
        
        console.log(`✅ Fixed: ${product.name}`);
        console.log(`   Changed: "${product.category}" → "earrings"\n`);
        updated++;
      } catch (error) {
        console.error(`❌ Error fixing ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log('='  .repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Successfully Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);

    // Verify the changes
    console.log('\n\n🔍 VERIFYING CHANGES...\n');
    
    const rings = await Product.countDocuments({ type: 'jewellery', category: 'rings' });
    const earrings = await Product.countDocuments({ type: 'jewellery', category: 'earrings' });
    const pendants = await Product.countDocuments({ type: 'jewellery', category: 'pendants' });
    
    console.log(`Jewellery Categories:`);
    console.log(`   Rings: ${rings}`);
    console.log(`   Earrings: ${earrings}`);
    console.log(`   Pendants: ${pendants}`);
    console.log(`   Total: ${rings + earrings + pendants}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixEarringCategories();
