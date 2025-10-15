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
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  sku: String,
  type: String,
  category: String,
  images: [String],
  variants: [{
    name: String,
    sku: String,
    images: [String],
    price: Number
  }],
  colorVariants: [{
    color: String,
    images: [String]
  }]
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

// SKU mapping to match temp files with products
const SKU_MAPPING = {
  // Rings
  'RG_SR_1': 'RG/SR/1',
  'RG_SR_2': 'RG/SR/2',
  'RG_SR_3': 'RG/SR/3',
  'RG_SR_4': 'RG/SR/4',
  'RG_SR_5': 'RG/SR/5',
  'RG_SR_6': 'RG/SR/6',
  'RG_SR_7': 'RG/SR/7',
  'RG_SR_8': 'RG/SR/8',
  'SR_RG_9': 'RG/SR/9',
  'RG_SR_10': 'RG/SR/10',
  'RG_SR_11': 'RG/SR/11',
  'RG_SR_12': 'RG/SR/12',
  'RG_SR_13': 'RG/SR/13',
  
  // Earrings
  'Er_Sr_1': 'ER/SR/1',
  'Er_Sr_2': 'ER/SR/2',
  'Er_Sr_3': 'ER/SR/3',
  'Er_Sr_4': 'ER/SR/4',
  'Er_Sr_5': 'ER/SR/5',
  'Er_Sr_6': 'ER/SR/6',
  'Er_Sr_7': 'ER/SR/7',
  'Er_Sr_8': 'ER/SR/8',
  'Er_Sr_9': 'ER/SR/9',
  
  // Pendants
  'Pen_Sr_1': 'PEN/SR/1',
  'Pen_Sr_2': 'PEN/SR/2',
  'Pen_Sr_3': 'PEN/SR/3',
  
  // Fragrances
  'FRG_001': 'FRG/001',
  'FRG_002': 'FRG/002',
  'FRG_003': 'FRG/003',
  'FRG_004': 'FRG/004',
  'FRG_005': 'FRG/005',
  'FRG_006': 'FRG/006',
  'FRG_007': 'FRG/007',
};

async function uploadToImageKit(filePath, fileName, folder = 'products') {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const base64 = fileBuffer.toString('base64');
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    
    const result = await imagekit.upload({
      file: base64,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: false
    });
    
    return result.url;
  } catch (error) {
    console.error(`   ❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

async function migrateImagesToImageKit() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const tempImagesPath = path.join(__dirname, 'temp', 'images');
    const imageFiles = await fs.readdir(tempImagesPath);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('       MIGRATE TEMP IMAGES TO IMAGEKIT & UPDATE DB');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📸 Found ${imageFiles.length} images in temp folder\n`);

    // Group files by SKU pattern
    const filesBySKU = {};
    imageFiles.forEach(file => {
      const match = file.match(/^([A-Za-z_]+)_(\d+)_/);
      if (match) {
        const skuPrefix = `${match[1]}_${match[2]}`;
        if (!filesBySKU[skuPrefix]) {
          filesBySKU[skuPrefix] = [];
        }
        filesBySKU[skuPrefix].push(file);
      }
    });

    console.log(`📦 Grouped into ${Object.keys(filesBySKU).length} product SKUs\n`);

    // Stats
    const stats = {
      imagesUploaded: 0,
      productsUpdated: 0,
      imagesFailed: 0,
      productsNotFound: []
    };

    // Process each SKU group
    for (const [tempSKU, files] of Object.entries(filesBySKU)) {
      const actualSKU = SKU_MAPPING[tempSKU];
      
      if (!actualSKU) {
        console.log(`⚠️  No mapping found for ${tempSKU}, skipping...`);
        continue;
      }

      console.log(`\n📦 Processing ${actualSKU} (${files.length} images)`);
      
      // Find product by SKU
      const product = await Product.findOne({ sku: actualSKU });
      
      if (!product) {
        console.log(`   ❌ Product not found for SKU: ${actualSKU}`);
        stats.productsNotFound.push(actualSKU);
        continue;
      }

      console.log(`   ✓ Found product: ${product.name}`);

      // Upload images to ImageKit
      const uploadedUrls = [];
      for (const file of files) {
        const filePath = path.join(tempImagesPath, file);
        console.log(`   📤 Uploading: ${file}`);
        
        const url = await uploadToImageKit(filePath, file);
        if (url) {
          uploadedUrls.push(url);
          stats.imagesUploaded++;
          console.log(`      ✅ ${url}`);
        } else {
          stats.imagesFailed++;
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (uploadedUrls.length === 0) {
        console.log(`   ⚠️  No images uploaded successfully`);
        continue;
      }

      // Update product with ImageKit URLs
      const updates = {};
      
      // 1. Set main product images (all uploaded images)
      updates.images = uploadedUrls;
      
      // 2. Update variants with images
      if (product.variants && product.variants.length > 0) {
        updates.variants = product.variants.map(variant => ({
          ...variant.toObject(),
          images: uploadedUrls  // All variants get all images for now
        }));
      }
      
      // 3. Update color variants for jewellery
      if (product.type === 'jewellery' && product.colorVariants && product.colorVariants.length > 0) {
        updates.colorVariants = product.colorVariants.map(cv => {
          // Try to match color-specific images
          let colorImages = uploadedUrls;
          
          // If we can detect color patterns in future, we can filter here
          // For now, assign all images to all color variants
          
          return {
            ...cv.toObject(),
            images: colorImages
          };
        });
      }

      // Apply updates
      await Product.updateOne({ _id: product._id }, { $set: updates });
      stats.productsUpdated++;
      console.log(`   ✅ Updated product in database`);
    }

    // Final Summary
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                      FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📸 Images uploaded to ImageKit: ${stats.imagesUploaded}`);
    console.log(`❌ Images failed: ${stats.imagesFailed}`);
    console.log(`✅ Products updated: ${stats.productsUpdated}`);
    console.log(`⚠️  Products not found: ${stats.productsNotFound.length}`);
    
    if (stats.productsNotFound.length > 0) {
      console.log(`\nMissing SKUs: ${stats.productsNotFound.join(', ')}`);
    }
    
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

migrateImagesToImageKit();
