import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function cleanAllDescriptions() {
    console.log('🧹 Cleaning All Product Descriptions');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get all products with descriptions
        const products = await Product.find({
            $or: [
                { description: { $exists: true, $ne: null, $ne: '' } },
                { shortDescription: { $exists: true, $ne: null, $ne: '' } }
            ]
        });
        
        console.log(`📝 Found ${products.length} products to clean`);
        
        let updatedCount = 0;
        let skippedCount = 0;
        
        for (const product of products) {
            try {
                const updateData = {};
                let hasChanges = false;
                
                // Clean main description
                if (product.description) {
                    const cleanedDescription = cleanText(product.description);
                    if (cleanedDescription !== product.description) {
                        updateData.description = cleanedDescription;
                        hasChanges = true;
                    }
                }
                
                // Clean short description
                if (product.shortDescription) {
                    const cleanedShortDescription = cleanText(product.shortDescription);
                    if (cleanedShortDescription !== product.shortDescription) {
                        updateData.shortDescription = cleanedShortDescription;
                        hasChanges = true;
                    }
                }
                
                if (hasChanges) {
                    await Product.findByIdAndUpdate(product._id, updateData);
                    updatedCount++;
                    
                    console.log(`✅ Cleaned: ${product.name}`);
                    
                    // Show before/after for first few products
                    if (updatedCount <= 3) {
                        if (updateData.description) {
                            console.log(`   📝 Description cleaned (${updateData.description.length} chars): ${updateData.description.substring(0, 100)}...`);
                        }
                        if (updateData.shortDescription) {
                            console.log(`   📄 Short desc cleaned (${updateData.shortDescription.length} chars): ${updateData.shortDescription.substring(0, 80)}...`);
                        }
                        console.log('');
                    }
                } else {
                    skippedCount++;
                    if (skippedCount <= 3) {
                        console.log(`⏭️  No cleaning needed: ${product.name}`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error cleaning ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Cleaning Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products cleaned: ${updatedCount}`);
        console.log(`⏭️  Products skipped (already clean): ${skippedCount}`);
        console.log(`📝 Total products processed: ${products.length}`);
        
        // Verify cleaning on a few products
        console.log('\n🔍 Verification - Checking cleaned products:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const verifyProducts = await Product.find({
            $and: [
                { description: { $exists: true, $ne: null, $ne: '' } },
                { shortDescription: { $exists: true, $ne: null, $ne: '' } }
            ]
        }).limit(3).lean();
        
        verifyProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            console.log(`   📝 Description (${product.description?.length || 0} chars):`);
            console.log(`      ${product.description?.substring(0, 150) || 'None'}...`);
            console.log(`   📄 Short Desc (${product.shortDescription?.length || 0} chars):`);
            console.log(`      ${product.shortDescription?.substring(0, 120) || 'None'}...`);
            
            // Check if any unwanted text remains
            const badWords = ['&nbsp;', 'Lab-Grown', '[html_block', '\\n'];
            const foundBadWords = [];
            
            badWords.forEach(word => {
                if (product.description?.includes(word) || product.shortDescription?.includes(word)) {
                    foundBadWords.push(word);
                }
            });
            
            if (foundBadWords.length > 0) {
                console.log(`   ⚠️  Still contains: ${foundBadWords.join(', ')}`);
            } else {
                console.log(`   ✅ Clean - no unwanted text found`);
            }
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

function cleanText(text) {
    if (!text) return text;
    
    return text
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        
        // Remove &nbsp; entities
        .replace(/&nbsp;/g, ' ')
        
        // Remove "Lab-Grown" text (case insensitive)
        .replace(/Lab-Grown/gi, 'Lab Grown')
        
        // Remove HTML block references
        .replace(/\[html_block[^\]]*\]/g, '')
        
        // Remove literal \n characters
        .replace(/\\n/g, ' ')
        
        // Remove actual newlines and replace with spaces
        .replace(/\n+/g, ' ')
        
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        
        // Trim whitespace
        .trim();
}

cleanAllDescriptions();