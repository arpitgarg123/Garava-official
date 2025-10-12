import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function updateAllProductStock() {
    console.log('📦 Updating Stock to 1000 for All Products');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get all products
        const products = await Product.find({});
        
        console.log(`📝 Processing ${products.length} products...`);
        
        let updatedCount = 0;
        let variantCount = 0;
        
        for (const product of products) {
            try {
                let hasChanges = false;
                
                // Update variants stock
                if (product.variants && product.variants.length > 0) {
                    product.variants.forEach(variant => {
                        if (variant.stock !== 1000) {
                            variant.stock = 1000;
                            variant.stockStatus = 'in_stock'; // Also update stock status
                            hasChanges = true;
                            variantCount++;
                        }
                    });
                }
                
                if (hasChanges) {
                    await product.save();
                    updatedCount++;
                    
                    console.log(`✅ Updated: ${product.name} (${product.variants.length} variants)`);
                    
                    // Show details for first few products
                    if (updatedCount <= 3) {
                        product.variants.forEach((variant, index) => {
                            console.log(`   Variant ${index + 1}: ${variant.sizeLabel} - Stock: ${variant.stock}`);
                        });
                        console.log('');
                    }
                } else {
                    if (updatedCount < 3) {
                        console.log(`⏭️  Already has 1000 stock: ${product.name}`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error updating ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Stock Update Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products updated: ${updatedCount}`);
        console.log(`📦 Total variants updated: ${variantCount}`);
        console.log(`📝 Total products processed: ${products.length}`);
        
        // Verify stock updates
        console.log('\n🔍 Verification - Checking updated stock:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const stockStats = await Product.aggregate([
            { $unwind: '$variants' },
            { 
                $group: {
                    _id: '$variants.stock',
                    count: { $sum: 1 },
                    products: { $addToSet: '$name' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        console.log('Stock distribution:');
        stockStats.forEach(stat => {
            console.log(`Stock ${stat._id}: ${stat.count} variants`);
            if (stat._id !== 1000 && stat.products.length <= 3) {
                console.log(`   Products: ${stat.products.slice(0, 3).join(', ')}`);
            }
        });
        
        // Check for any remaining issues
        const lowStockProducts = await Product.find({
            'variants.stock': { $lt: 1000 }
        }, { name: 1, 'variants.stock': 1, 'variants.sizeLabel': 1 });
        
        if (lowStockProducts.length > 0) {
            console.log(`\n⚠️  ${lowStockProducts.length} products still have variants with stock < 1000:`);
            lowStockProducts.slice(0, 5).forEach(product => {
                const lowVariants = product.variants.filter(v => v.stock < 1000);
                console.log(`   ${product.name}: ${lowVariants.length} variants with low stock`);
            });
        } else {
            console.log('\n✅ All variants now have stock = 1000');
        }
        
        // Sample verification
        console.log('\n📋 Sample Products After Update:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const sampleProducts = await Product.find({}, { 
            name: 1, 
            'variants.sizeLabel': 1, 
            'variants.stock': 1,
            'variants.stockStatus': 1
        }).limit(3);
        
        sampleProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            product.variants.forEach(variant => {
                console.log(`   ${variant.sizeLabel}: Stock ${variant.stock}, Status: ${variant.stockStatus}`);
            });
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

updateAllProductStock();