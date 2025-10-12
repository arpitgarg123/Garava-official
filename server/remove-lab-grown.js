import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function removeLabGrownKeyword() {
    console.log('🔄 Removing "Lab Grown" Keyword from All Descriptions');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get all products
        const products = await Product.find({}).lean();
        
        console.log(`📝 Processing ${products.length} products...`);
        
        let updatedCount = 0;
        let changesCount = 0;
        
        for (const product of products) {
            try {
                const updateData = {};
                let hasChanges = false;
                
                // Clean main description
                if (product.description) {
                    const cleanedDescription = removeLabGrownCarefully(product.description);
                    if (cleanedDescription !== product.description) {
                        updateData.description = cleanedDescription;
                        hasChanges = true;
                        changesCount++;
                    }
                }
                
                // Clean short description
                if (product.shortDescription) {
                    const cleanedShortDescription = removeLabGrownCarefully(product.shortDescription);
                    if (cleanedShortDescription !== product.shortDescription) {
                        updateData.shortDescription = cleanedShortDescription;
                        hasChanges = true;
                        changesCount++;
                    }
                }
                
                // Clean structured description sections
                if (product.structuredDescription) {
                    const structuredUpdate = {};
                    let structuredChanged = false;
                    
                    Object.keys(product.structuredDescription).forEach(key => {
                        const originalValue = product.structuredDescription[key];
                        if (originalValue && typeof originalValue === 'string') {
                            const cleanedValue = removeLabGrownCarefully(originalValue);
                            if (cleanedValue !== originalValue) {
                                structuredUpdate[`structuredDescription.${key}`] = cleanedValue;
                                structuredChanged = true;
                                changesCount++;
                            }
                        }
                    });
                    
                    if (structuredChanged) {
                        Object.assign(updateData, structuredUpdate);
                        hasChanges = true;
                    }
                }
                
                if (hasChanges) {
                    await Product.findByIdAndUpdate(product._id, updateData);
                    updatedCount++;
                    
                    console.log(`✅ Updated: ${product.name}`);
                    
                    // Show changes for first few products
                    if (updatedCount <= 3) {
                        console.log('   🔄 Changes made:');
                        if (updateData.description) {
                            const preview = updateData.description.substring(0, 100);
                            console.log(`     Description: ${preview}...`);
                        }
                        if (updateData.shortDescription) {
                            const preview = updateData.shortDescription.substring(0, 80);
                            console.log(`     Short Desc: ${preview}...`);
                        }
                        Object.keys(updateData).forEach(key => {
                            if (key.startsWith('structuredDescription.')) {
                                const section = key.split('.')[1];
                                const preview = updateData[key].substring(0, 60);
                                console.log(`     ${section}: ${preview}...`);
                            }
                        });
                        console.log('');
                    }
                } else {
                    if (updatedCount < 3) {
                        console.log(`⏭️  No "Lab Grown" found: ${product.name}`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error processing ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Cleanup Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products updated: ${updatedCount}`);
        console.log(`🔄 Total field changes: ${changesCount}`);
        console.log(`📝 Products processed: ${products.length}`);
        
        // Verify cleanup
        console.log('\n🔍 Verification - Checking for remaining "Lab Grown":');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const remainingProducts = await Product.find({
            $or: [
                { description: /Lab Grown/i },
                { shortDescription: /Lab Grown/i },
                { 'structuredDescription.description': /Lab Grown/i },
                { 'structuredDescription.productDetails': /Lab Grown/i },
                { 'structuredDescription.careInstructions': /Lab Grown/i },
                { 'structuredDescription.materials': /Lab Grown/i },
                { 'structuredDescription.shippingInfo': /Lab Grown/i }
            ]
        }, { name: 1 });
        
        if (remainingProducts.length > 0) {
            console.log(`⚠️  ${remainingProducts.length} products still contain "Lab Grown":`);
            remainingProducts.slice(0, 5).forEach(product => {
                console.log(`   • ${product.name}`);
            });
            if (remainingProducts.length > 5) {
                console.log(`   • ... and ${remainingProducts.length - 5} more`);
            }
        } else {
            console.log('✅ No "Lab Grown" keyword found in any product!');
        }
        
        console.log('\n📋 Sample cleaned content:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const sampleProduct = await Product.findOne({ name: /Emerald/i }, { 
            shortDescription: 1, 
            name: 1,
            'structuredDescription.materials': 1 
        }).lean();
        
        if (sampleProduct) {
            console.log(`Product: ${sampleProduct.name}`);
            if (sampleProduct.shortDescription) {
                console.log(`Short Desc: ${sampleProduct.shortDescription.substring(0, 150)}...`);
            }
            if (sampleProduct.structuredDescription?.materials) {
                console.log(`Materials: ${sampleProduct.structuredDescription.materials.substring(0, 150)}...`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

function removeLabGrownCarefully(text) {
    if (!text) return text;
    
    return text
        // Remove "Lab Grown" with various cases and spacing
        .replace(/\bLab[\s-]Grown\b/gi, 'lab grown')  // Convert to lowercase first
        .replace(/\blab[\s-]grown\b/gi, 'lab grown')  // Normalize spacing
        .replace(/\blab\s+grown\b/gi, 'lab grown')    // Multiple spaces
        
        // Now remove the normalized version
        .replace(/\blab grown\s+/gi, '')              // "lab grown " (with space after)
        .replace(/\s+lab grown\b/gi, '')              // " lab grown" (with space before)
        .replace(/\blab grown\b/gi, '')               // "lab grown" (standalone)
        
        // Clean up any double spaces that might result
        .replace(/\s+/g, ' ')
        
        // Clean up any awkward grammar that might result
        .replace(/\ba\s+diamond/gi, 'a diamond')      // Fix "a  diamond"
        .replace(/\bwith\s+diamond/gi, 'with diamond') // Fix "with  diamond"
        .replace(/\bthe\s+diamond/gi, 'the diamond')   // Fix "the  diamond"
        .replace(/\bdiamond\s+or\s+a/gi, 'diamond or a') // Fix spacing issues
        
        // Trim any leading/trailing spaces
        .trim();
}

removeLabGrownKeyword();