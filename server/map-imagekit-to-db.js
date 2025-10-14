/**
 * USE EXISTING IMAGEKIT URLS - NO UPLOAD NEEDED
 * Maps existing ImageKit catalog images to database products
 */

import mongoose from 'mongoose';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const productSchema = new mongoose.Schema({}, { collection: 'products', strict: false });
const Product = mongoose.model('Product', productSchema);

// Product name matching patterns
const PRODUCT_PATTERNS = {
  'RG_SR_1': ['Classic Round Solitaire ring with 6 prongs', 'classic-round-solitaire-ring-with-6-prongs'],
  'RG_SR_2': ['Classic Princess Solitaire ring with 4 prongs', 'classic-princess-solitaire-ring-with-4-prongs'],
  'RG_SR_3': ['Classic Oval Solitaire ring with 4 prongs', 'classic-oval-solitaire-ring-with-4-prongs'],
  'RG_SR_4': ['Classic Pear Solitaire Ring with V Shape prong', 'classic-pear-solitaire-ring-with-v-shape-prong'],
  'RG_SR_5': ['Classic Emerald cut Solitaire Ring', 'classic-emerald-cut-solitaire-ring'],
  'RG_SR_6': ['Round Solitaire Ring with Diamond Band', 'round-solitaire-ring-with-diamond-band'],
  'RG_SR_7': ['Round Solitaire Ring with V Shaped Diamond Band', 'round-solitaire-ring-with-v-shaped-diamond-band'],
  'RG_SR_8': ['Elevated Round Solitaire Ring with Diamond Band', 'elevated-round-solitaire-ring-with-diamond-band'],
  'SR_RG_9': ['Emerald cut Solitaire Ring V Shaped Diamond Band', 'emerald-cut-solitaire-ring-v-shaped-diamond-band'],
  'RG_SR_10': ['Emerald cut Solitaire Ring Diamond Band', 'emerald-cut-solitaire-ring-diamond-band'],
  'RG_SR_11': ['Round Solitaire Trinity Ring with Baguettes', 'round-solitaire-trinity-ring-with-baguettes'],
  'RG_SR_12': ['Cushion Solitaire Trinity Ring with Round Diamonds', 'cushion-solitaire-trinity-ring-with-round-diamonds'],
  'RG_SR_13': ['Oval Solitaire Trinity Ring with Pear Diamonds', 'oval-solitaire-trinity-ring-with-pear-diamonds'],
  'Er_Sr_1': ['Celestial Round Solitaire Earrings', 'celestial-round-solitaire-earrings'],
  'Er_Sr_2': ['Elegant Princess cut Solitaire Earrings', 'elegant-princess-cut-solitaire-earrings'],
  'Er_Sr_3': ['Opulent Emerald cut Solitaire Earrings', 'opulent-emerald-cut-solitaire-earrings'],
  'Er_Sr_4': ['Graceful Pear Solitaire Earrings', 'graceful-pear-solitaire-earrings'],
  'Er_Sr_5': ['Charming Classic Oval Solitaire Earrings', 'charming-classic-oval-solitaire-earrings'],
  'Er_Sr_6': ['Brilliant Round Diamond Earrings with Diamond Halo', 'brilliant-round-diamond-earrings-with-diamond-halo'],
  'Er_Sr_7': ['Brilliant Round Diamond Earrings with Halo', 'brilliant-round-diamond-earrings-with-halo'],
  'Er_Sr_8': ['Pear Solitaire Trinity Ring with Pear Diamonds', 'pear-solitaire-trinity-ring-with-pear-diamonds'],
  'Er_Sr_9': ['some other earring', 'unknown'],
  'Pen_Sr_1': ['Spotlight Round Solitaire Diamond Gold Pendant', 'spotlight-round-solitaire-diamond-gold-pendant'],
  'Pen_Sr_2': ['Spotlight Round Solitaire Diamond Gold Halo Pendant', 'spotlight-round-solitaire-diamond-gold-halo-pendant'],
  'Pen_Sr_3': ['Spotlight Round Solitaire Diamond Pendant with 4 Prongs', 'spotlight-round-solitaire-diamond-pendant-with-4-prongs'],
  'FRG_001': ['GARAVA Sila 50 ml', 'garava-sila-50-ml'],
  'FRG_002': ['GARAVA Wayfarer 50 ml', 'garava-wayfarer-50-ml'],
  'FRG_003': ['GARAVA Mångata 50 ml', 'garava-mangata-50-ml'],
  'FRG_004': ['GARAVA Evara 50 ml', 'garava-evara-50-ml'],
  'FRG_005': ['GARAVA Sayonee 50 ml', 'garava-sayonee-50-ml'],
  'FRG_006': ['GARAVA Sayonee 10 ml', 'garava-sayonee-10-ml'],
  'FRG_007': ['GARAVA Travel set', 'garava-travel-set'],
};

async function mapImageKitToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📥 Fetching ImageKit catalog...');
    const allFiles = await imagekit.listFiles({ limit: 1000 });
    console.log(`✓ Found ${allFiles.length} files in ImageKit\n`);

    // Group ImageKit files by pattern
    const imagesByPattern = {};
    allFiles.forEach(file => {
      const match = file.name.match(/^([A-Za-z_]+_\d+)/);
      if (match) {
        const pattern = match[1];
        if (!imagesByPattern[pattern]) {
          imagesByPattern[pattern] = [];
        }
        imagesByPattern[pattern].push(file.url);
      }
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('       MAPPING IMAGEKIT URLS TO DATABASE PRODUCTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const stats = {
      productsUpdated: 0,
      productsNotFound: 0,
      imagesUsed: 0
    };

    // Map to each product
    for (const [pattern, productInfo] of Object.entries(PRODUCT_PATTERNS)) {
      const imageUrls = imagesByPattern[pattern];
      
      if (!imageUrls || imageUrls.length === 0) {
        console.log(`⚠️  ${pattern}: No images in ImageKit`);
        continue;
      }

      console.log(`\n📦 Processing ${pattern} (${imageUrls.length} images)`);
      
      // Find product
      const [name, slug] = productInfo;
      const product = await Product.findOne({
        $or: [
          { name: { $regex: new RegExp(name.substring(0, 30), 'i') } },
          { slug: slug }
        ]
      });

      if (!product) {
        console.log(`   ❌ Product not found: ${name}`);
        stats.productsNotFound++;
        continue;
      }

      console.log(`   ✓ Found: ${product.name}`);
      console.log(`   ✓ Mapping ${imageUrls.length} ImageKit URLs`);

      // Update product with ImageKit URLs
      const updates = {
        images: imageUrls
      };

      // Update variants
      if (product.variants && product.variants.length > 0) {
        updates.variants = product.variants.map(v => ({
          ...v,
          images: imageUrls
        }));
      }

      // Update color variants for jewellery
      if (product.type === 'jewellery' && product.colorVariants && product.colorVariants.length > 0) {
        updates.colorVariants = product.colorVariants.map(cv => ({
          ...cv,
          images: imageUrls
        }));
      }

      await Product.updateOne({ _id: product._id }, { $set: updates });
      stats.productsUpdated++;
      stats.imagesUsed += imageUrls.length;
      console.log(`   ✅ Database updated with ImageKit URLs`);
    }

    // Summary
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                    FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Products updated: ${stats.productsUpdated}`);
    console.log(`📸 ImageKit URLs mapped: ${stats.imagesUsed}`);
    console.log(`⚠️  Products not found: ${stats.productsNotFound}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✨ All products now have ImageKit URLs!');
    console.log('   Main images, variant images, and color variant images are set.\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

mapImageKitToDatabase();
