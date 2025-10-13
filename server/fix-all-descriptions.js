import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function fixAllDescriptions() {
    console.log('🔄 Fixing All Product Descriptions from CSV');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Read CSV file
        const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';
        
        if (!fs.existsSync(csvPath)) {
            console.error('❌ CSV file not found at:', csvPath);
            return;
        }
        
        console.log('📖 Reading CSV file...');
        const csvData = [];
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (row) => {
                    csvData.push(row);
                })
                .on('end', resolve)
                .on('error', reject);
        });
        
        console.log(`✅ CSV loaded: ${csvData.length} rows`);
        
        // Filter products that have descriptions
        const productsWithDescriptions = csvData.filter(row => 
            row.Name && 
            (row.Description || row['Short description']) &&
            row.Type !== 'variation' // Skip variations for now
        );
        
        console.log(`📝 Found ${productsWithDescriptions.length} products with descriptions in CSV`);
        
        let updatedCount = 0;
        let notFoundCount = 0;
        let skippedCount = 0;
        
        for (const csvProduct of productsWithDescriptions) {
            try {
                const productName = csvProduct.Name.trim();
                const description = csvProduct.Description ? csvProduct.Description.trim() : '';
                const shortDescription = csvProduct['Short description'] ? csvProduct['Short description'].trim() : '';
                
                // Skip if no descriptions
                if (!description && !shortDescription) {
                    console.log(`⏭️  Skipping ${productName} - no descriptions in CSV`);
                    skippedCount++;
                    continue;
                }
                
                // Find product in database
                const dbProduct = await Product.findOne({
                    name: { $regex: new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
                });
                
                if (!dbProduct) {
                    console.log(`❌ Product not found in DB: ${productName}`);
                    notFoundCount++;
                    continue;
                }
                
                // Prepare update data
                const updateData = {};
                
                if (description) {
                    // Clean description (remove HTML tags, extra spaces)
                    const cleanDescription = description
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .replace(/\n+/g, ' ')    // Replace newlines with spaces
                        .replace(/\s+/g, ' ')    // Replace multiple spaces with single
                        .trim();
                    
                    if (cleanDescription && cleanDescription !== dbProduct.description) {
                        updateData.description = cleanDescription;
                    }
                }
                
                if (shortDescription) {
                    // Clean short description
                    const cleanShortDescription = shortDescription
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .replace(/\n+/g, ' ')    // Replace newlines with spaces
                        .replace(/\s+/g, ' ')    // Replace multiple spaces with single
                        .trim();
                    
                    if (cleanShortDescription && cleanShortDescription !== dbProduct.shortDescription) {
                        updateData.shortDescription = cleanShortDescription;
                    }
                }
                
                // Update if there are changes
                if (Object.keys(updateData).length > 0) {
                    await Product.findByIdAndUpdate(dbProduct._id, updateData);
                    updatedCount++;
                    
                    console.log(`✅ Updated: ${productName}`);
                    if (updateData.description) {
                        console.log(`   📝 Description: ${updateData.description.substring(0, 100)}...`);
                    }
                    if (updateData.shortDescription) {
                        console.log(`   📄 Short Desc: ${updateData.shortDescription.substring(0, 80)}...`);
                    }
                    console.log('');
                } else {
                    console.log(`⏭️  No changes needed: ${productName}`);
                    skippedCount++;
                }
                
            } catch (error) {
                console.error(`❌ Error processing ${csvProduct.Name}:`, error.message);
            }
        }
        
        console.log('\n📊 Update Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products updated: ${updatedCount}`);
        console.log(`❌ Products not found in DB: ${notFoundCount}`);
        console.log(`⏭️  Products skipped: ${skippedCount}`);
        console.log(`📝 Total CSV products processed: ${productsWithDescriptions.length}`);
        
        // Verify a few updated products
        console.log('\n🔍 Verification - Checking some updated products:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const verifyProducts = await Product.find({
            $and: [
                { description: { $exists: true, $ne: null, $ne: '' } },
                { shortDescription: { $exists: true, $ne: null, $ne: '' } }
            ]
        }).limit(3).lean();
        
        verifyProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            console.log(`   📝 Desc (${product.description?.length || 0} chars): ${product.description?.substring(0, 100) || 'None'}...`);
            console.log(`   📄 Short (${product.shortDescription?.length || 0} chars): ${product.shortDescription?.substring(0, 80) || 'None'}...`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

fixAllDescriptions();