import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function checkFilters() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check total products
    const totalCount = await Product.countDocuments();
    console.log(`📊 Total Products: ${totalCount}\n`);

    // Check products by type
    console.log('📦 Products by Type:');
    const types = await Product.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    types.forEach(t => console.log(`   ${t._id || 'null'}: ${t.count}`));
    console.log('');

    // Check products by category
    console.log('📂 Products by Category:');
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    categories.forEach(c => console.log(`   ${c._id || 'null'}: ${c.count}`));
    console.log('');

    // Check color variants
    console.log('🎨 Products with Color Variants:');
    const withColorVariants = await Product.countDocuments({ colorVariants: { $exists: true, $ne: [] } });
    const withoutColorVariants = await Product.countDocuments({ $or: [{ colorVariants: { $exists: false } }, { colorVariants: [] }] });
    console.log(`   With Color Variants: ${withColorVariants}`);
    console.log(`   Without Color Variants: ${withoutColorVariants}`);
    console.log('');

    // Sample products for each type
    console.log('📝 Sample Products:');
    const samples = await Product.find({}).limit(5).select('name type category colorVariants');
    samples.forEach(p => {
      console.log(`   - ${p.name}`);
      console.log(`     Type: ${p.type || 'null'}`);
      console.log(`     Category: ${p.category || 'null'}`);
      const colorCodes = p.colorVariants?.map(cv => cv.code || cv.name).join(', ') || 'none';
      console.log(`     Color Variants: ${colorCodes}`);
    });
    console.log('');

    // Check unique categories per type
    console.log('🔍 Categories by Type:');
    const jewelryCategories = await Product.distinct('category', { type: 'jewellery' });
    console.log(`   Jewellery: ${jewelryCategories.join(', ')}`);
    
    const fragranceCategories = await Product.distinct('category', { type: 'fragrance' });
    console.log(`   Fragrance: ${fragranceCategories.join(', ')}`);
    
    const highJewelryCategories = await Product.distinct('category', { type: 'high_jewellery' });
    console.log(`   High Jewellery: ${highJewelryCategories.join(', ')}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkFilters();
