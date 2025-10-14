import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://admin_db_user:JudQFQ3BIh8Xpm6v@garavaofficialdb.grj3ngh.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('Product', productSchema);

async function showAllCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📋 COMPLETE PRODUCT CATEGORIZATION\n');
    console.log('='  .repeat(100));

    // Jewellery products
    console.log('\n🔷 JEWELLERY PRODUCTS (type: "jewellery")\n');
    
    const rings = await Product.find({ type: 'jewellery', category: 'rings' }).select('name').lean();
    console.log(`\n📿 RINGS (${rings.length} products):`);
    rings.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const earrings = await Product.find({ type: 'jewellery', category: 'earrings' }).select('name').lean();
    console.log(`\n👂 EARRINGS (${earrings.length} products):`);
    earrings.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const pendants = await Product.find({ type: 'jewellery', category: 'pendants' }).select('name').lean();
    console.log(`\n📿 PENDANTS (${pendants.length} products):`);
    pendants.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    // Fragrance products
    console.log('\n\n🔷 FRAGRANCE PRODUCTS (type: "fragrance")\n');
    
    const sila = await Product.find({ type: 'fragrance', category: 'sila' }).select('name').lean();
    console.log(`\n🌸 SILA (${sila.length} products):`);
    sila.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const evara = await Product.find({ type: 'fragrance', category: 'evara' }).select('name').lean();
    console.log(`\n🌺 EVARA (${evara.length} products):`);
    evara.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const wayfarer = await Product.find({ type: 'fragrance', category: 'wayfarer' }).select('name').lean();
    console.log(`\n🌿 WAYFARER (${wayfarer.length} products):`);
    wayfarer.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const sayonee = await Product.find({ type: 'fragrance', category: 'sayonee' }).select('name').lean();
    console.log(`\n🌹 SAYONEE (${sayonee.length} products):`);
    sayonee.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    const fragranceGeneric = await Product.find({ type: 'fragrance', category: 'fragrance' }).select('name').lean();
    console.log(`\n🎁 GIFT/COMBO SETS (${fragranceGeneric.length} products):`);
    fragranceGeneric.forEach((p, i) => console.log(`   ${i + 1}. ${p.name}`));

    console.log('\n\n' + '='  .repeat(100));
    console.log('\n📊 FINAL SUMMARY:\n');
    console.log(`Total Products: 37`);
    console.log(`\nJewellery (24):`);
    console.log(`   - Rings: ${rings.length}`);
    console.log(`   - Earrings: ${earrings.length}`);
    console.log(`   - Pendants: ${pendants.length}`);
    console.log(`\nFragrance (13):`);
    console.log(`   - Sila: ${sila.length}`);
    console.log(`   - Evara: ${evara.length}`);
    console.log(`   - Wayfarer: ${wayfarer.length}`);
    console.log(`   - Sayonee: ${sayonee.length}`);
    console.log(`   - Gift/Combo Sets: ${fragranceGeneric.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

showAllCategories();
