import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  type: String
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

const SKU_MAPPING = {
  'RG_SR_1': 'RG/SR/1', 'RG_SR_2': 'RG/SR/2', 'RG_SR_3': 'RG/SR/3',
  'RG_SR_4': 'RG/SR/4', 'RG_SR_5': 'RG/SR/5', 'RG_SR_6': 'RG/SR/6',
  'RG_SR_7': 'RG/SR/7', 'RG_SR_8': 'RG/SR/8', 'SR_RG_9': 'RG/SR/9',
  'RG_SR_10': 'RG/SR/10', 'RG_SR_11': 'RG/SR/11', 'RG_SR_12': 'RG/SR/12',
  'RG_SR_13': 'RG/SR/13', 'Er_Sr_1': 'ER/SR/1', 'Er_Sr_2': 'ER/SR/2',
  'Er_Sr_3': 'ER/SR/3', 'Er_Sr_4': 'ER/SR/4', 'Er_Sr_5': 'ER/SR/5',
  'Er_Sr_6': 'ER/SR/6', 'Er_Sr_7': 'ER/SR/7', 'Er_Sr_8': 'ER/SR/8',
  'Er_Sr_9': 'ER/SR/9', 'Pen_Sr_1': 'PEN/SR/1', 'Pen_Sr_2': 'PEN/SR/2',
  'Pen_Sr_3': 'PEN/SR/3', 'FRG_001': 'FRG/001', 'FRG_002': 'FRG/002',
  'FRG_003': 'FRG/003', 'FRG_004': 'FRG/004', 'FRG_005': 'FRG/005',
  'FRG_006': 'FRG/006', 'FRG_007': 'FRG/007',
};

async function dryRunMigration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const tempImagesPath = path.join(__dirname, 'temp', 'images');
    const imageFiles = await fs.readdir(tempImagesPath);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('              DRY RUN - MIGRATION PREVIEW');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📸 Found ${imageFiles.length} images in temp/images folder\n`);

    // Group files by SKU
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

    console.log(`📦 Grouped into ${Object.keys(filesBySKU).length} product groups\n`);

    let matchedCount = 0;
    let unmatchedCount = 0;
    let totalImages = 0;

    console.log('MATCHING PREVIEW:\n');
    
    for (const [tempSKU, files] of Object.entries(filesBySKU)) {
      const actualSKU = SKU_MAPPING[tempSKU];
      
      if (!actualSKU) {
        console.log(`❌ ${tempSKU} → NO MAPPING (${files.length} files)`);
        unmatchedCount++;
        continue;
      }

      const product = await Product.findOne({ sku: actualSKU });
      
      if (product) {
        console.log(`✅ ${tempSKU} → ${actualSKU}`);
        console.log(`   Product: ${product.name} (${product.type})`);
        console.log(`   Files (${files.length}): ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}\n`);
        matchedCount++;
        totalImages += files.length;
      } else {
        console.log(`⚠️  ${tempSKU} → ${actualSKU} (PRODUCT NOT FOUND IN DB)`);
        unmatchedCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('                      SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Products that will be updated: ${matchedCount}`);
    console.log(`📸 Total images that will be uploaded: ${totalImages}`);
    console.log(`❌ Unmatched/Not found: ${unmatchedCount}`);
    console.log(`\n⏱️  Estimated time: ~${Math.ceil(totalImages * 0.5 / 60)} minutes`);
    console.log(`💰 ImageKit uploads: ${totalImages} images`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✨ To proceed with migration, run:');
    console.log('   node migrate-images-to-imagekit.js\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

dryRunMigration();
