/**
 * SMART IMAGE MIGRATION SOLUTION
 * 
 * Since products don't have SKU, we'll:
 * 1. Upload temp images to ImageKit
 * 2. Create mapping based on product names/slugs
 * 3. Update database with ImageKit URLs
 */

import mongoose from 'mongoose';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Product Schema
const productSchema = new mongoose.Schema({}, { collection: 'products', strict: false });
const Product = mongoose.model('Product', productSchema);

// Product name matching patterns
const PRODUCT_PATTERNS = {
  // Rings
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
  
  // Earrings
  'Er_Sr_1': ['Celestial Round Solitaire Earrings', 'celestial-round-solitaire-earrings'],
  'Er_Sr_2': ['Elegant Princess cut Solitaire Earrings', 'elegant-princess-cut-solitaire-earrings'],
  'Er_Sr_3': ['Opulent Emerald cut Solitaire Earrings', 'opulent-emerald-cut-solitaire-earrings'],
  'Er_Sr_4': ['Graceful Pear Solitaire Earrings', 'graceful-pear-solitaire-earrings'],
  'Er_Sr_5': ['Charming Classic Oval Solitaire Earrings', 'charming-classic-oval-solitaire-earrings'],
  'Er_Sr_6': ['Brilliant Round Diamond Earrings with Diamond Halo', 'brilliant-round-diamond-earrings-with-diamond-halo'],
  'Er_Sr_7': ['Brilliant Round Diamond Earrings with Halo', 'brilliant-round-diamond-earrings-with-halo'],
  
  // Pendants
  'Pen_Sr_1': ['Spotlight Round Solitaire Diamond Gold Pendant', 'spotlight-round-solitaire-diamond-gold-pendant'],
  'Pen_Sr_2': ['Spotlight Round Solitaire Diamond Gold Halo Pendant', 'spotlight-round-solitaire-diamond-gold-halo-pendant'],
  'Pen_Sr_3': ['Spotlight Round Solitaire Diamond Pendant with 4 Prongs', 'spotlight-round-solitaire-diamond-pendant-with-4-prongs'],
  
  // Fragrances
  'FRG_001': ['GARAVA Sila 50 ml', 'garava-sila-50-ml'],
  'FRG_002': ['GARAVA Wayfarer 50 ml', 'garava-wayfarer-50-ml'],
  'FRG_003': ['GARAVA Mångata 50 ml', 'garava-mangata-50-ml'],
  'FRG_004': ['GARAVA Evara 50 ml', 'garava-evara-50-ml'],
  'FRG_005': ['GARAVA Sayonee 50 ml', 'garava-sayonee-50-ml'],
};

async function uploadToImageKit(filePath, fileName) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const base64 = fileBuffer.toString('base64');
    
    const result = await imagekit.upload({
      file: base64,
      fileName: fileName,
      folder: 'products',
      useUniqueFileName: false
    });
    
    return result.url;
  } catch (error) {
    console.error(`   ❌ Upload failed for ${fileName}:`, error.message);
    return null;
  }
}

async function smartImageMigration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const tempImagesPath = path.join(__dirname, 'temp', 'images');
    const imageFiles = await fs.readdir(tempImagesPath);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('         SMART IMAGE MIGRATION TO IMAGEKIT');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📸 Found ${imageFiles.length} images\n`);

    // Group files by pattern
    const filesByPattern = {};
    imageFiles.forEach(file => {
      const match = file.match(/^([A-Za-z_]+)_(\d+)_/);
      if (match) {
        const pattern = `${match[1]}_${match[2]}`;
        if (!filesByPattern[pattern]) {
          filesByPattern[pattern] = [];
        }
        filesByPattern[pattern].push(file);
      }
    });

    const stats = {
      uploaded: 0,
      failed: 0,
      productsUpdated: 0,
      productsNotFound: 0
    };

    // Process each product pattern
    for (const [pattern, files] of Object.entries(filesByPattern)) {
      const productInfo = PRODUCT_PATTERNS[pattern];
      
      if (!productInfo) {
        console.log(`⚠️  ${pattern}: No mapping found`);
        continue;
      }

      console.log(`\n📦 Processing ${pattern} (${files.length} images)`);
      
      // Find product by name or slug
      const [name, slug] = productInfo;
      const product = await Product.findOne({
        $or: [
          { name: { $regex: new RegExp(name, 'i') } },
          { slug: slug }
        ]
      });

      if (!product) {
        console.log(`   ❌ Product not found: ${name}`);
        stats.productsNotFound++;
        continue;
      }

      console.log(`   ✓ Found: ${product.name}`);

      // Upload images
      const uploadedUrls = [];
      for (const file of files) {
        const filePath = path.join(tempImagesPath, file);
        console.log(`   📤 Uploading: ${file}`);
        
        const url = await uploadToImageKit(filePath, file);
        if (url) {
          uploadedUrls.push(url);
          stats.uploaded++;
          console.log(`      ✅ Success`);
        } else {
          stats.failed++;
        }
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (uploadedUrls.length === 0) {
        console.log(`   ⚠️  No images uploaded`);
        continue;
      }

      // Update product
      const updates = {
        images: uploadedUrls
      };

      // Update variants
      if (product.variants && product.variants.length > 0) {
        updates.variants = product.variants.map(v => ({
          ...v,
          images: uploadedUrls
        }));
      }

      // Update color variants for jewellery
      if (product.type === 'jewellery' && product.colorVariants && product.colorVariants.length > 0) {
        updates.colorVariants = product.colorVariants.map(cv => ({
          ...cv,
          images: uploadedUrls
        }));
      }

      await Product.updateOne({ _id: product._id }, { $set: updates });
      stats.productsUpdated++;
      console.log(`   ✅ Database updated`);
    }

    // Summary
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                    FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📸 Images uploaded: ${stats.uploaded}`);
    console.log(`❌ Upload failures: ${stats.failed}`);
    console.log(`✅ Products updated: ${stats.productsUpdated}`);
    console.log(`⚠️  Products not found: ${stats.productsNotFound}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

smartImageMigration();
