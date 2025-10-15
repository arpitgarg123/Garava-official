import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function setJewelryToPriceOnDemand() {
    console.log('💎 Setting All Jewelry Products to Price on Demand');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get all jewelry products (excluding fragrances)
        const jewelryProducts = await Product.find({
            $or: [
                { type: 'jewellery' },
                { type: 'jewelry' },
                { category: 'jewellery' },
                { category: 'jewelry' },
                { type: 'high_jewellery' },
                { category: 'high_jewellery' }
            ]
        });
        
        console.log(`📝 Found ${jewelryProducts.length} jewelry products to update...`);
        
        let updatedCount = 0;
        let variantCount = 0;
        
        for (const product of jewelryProducts) {
            try {
                let hasChanges = false;
                
                // Set product-level price on demand
                if (!product.isPriceOnDemand) {
                    product.isPriceOnDemand = true;
                    hasChanges = true;
                }
                
                // Update all variants to price on demand
                if (product.variants && product.variants.length > 0) {
                    product.variants.forEach(variant => {
                        if (!variant.isPriceOnDemand) {
                            variant.isPriceOnDemand = true;
                            variant.priceOnDemandText = "Price on Request";
                            // Remove the price requirement by setting it to undefined/null
                            variant.price = undefined;
                            variant.mrp = undefined;
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
                        console.log(`   Product isPriceOnDemand: ${product.isPriceOnDemand}`);
                        product.variants.forEach((variant, index) => {
                            console.log(`   Variant ${index + 1}: ${variant.sizeLabel} - Price on Demand: ${variant.isPriceOnDemand}`);
                        });
                        console.log('');
                    }
                } else {
                    if (updatedCount < 3) {
                        console.log(`⏭️  Already price on demand: ${product.name}`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error updating ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Price on Demand Update Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Jewelry products updated: ${updatedCount}`);
        console.log(`💎 Total variants updated: ${variantCount}`);
        console.log(`📝 Total jewelry products processed: ${jewelryProducts.length}`);
        
        // Check fragrance products to ensure they weren't affected
        const fragranceProducts = await Product.find({
            $or: [
                { type: 'fragrance' },
                { category: 'fragrance' }
            ]
        });
        
        console.log(`🌸 Fragrance products (unchanged): ${fragranceProducts.length}`);
        
        // Verify the changes
        console.log('\n🔍 Verification - Checking Price on Demand status:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const priceOnDemandJewelry = await Product.countDocuments({
            $and: [
                {
                    $or: [
                        { type: 'jewellery' },
                        { type: 'jewelry' },
                        { category: 'jewellery' },
                        { category: 'jewelry' },
                        { type: 'high_jewellery' },
                        { category: 'high_jewellery' }
                    ]
                },
                { isPriceOnDemand: true }
            ]
        });
        
        const regularPriceJewelry = await Product.countDocuments({
            $and: [
                {
                    $or: [
                        { type: 'jewellery' },
                        { type: 'jewelry' },
                        { category: 'jewellery' },
                        { category: 'jewelry' },
                        { type: 'high_jewellery' },
                        { category: 'high_jewellery' }
                    ]
                },
                { isPriceOnDemand: { $ne: true } }
            ]
        });
        
        console.log(`✅ Jewelry products with Price on Demand: ${priceOnDemandJewelry}`);
        console.log(`⚠️  Jewelry products with regular pricing: ${regularPriceJewelry}`);
        
        if (regularPriceJewelry > 0) {
            const remainingProducts = await Product.find({
                $and: [
                    {
                        $or: [
                            { type: 'jewellery' },
                            { type: 'jewelry' },
                            { category: 'jewellery' },
                            { category: 'jewelry' },
                            { type: 'high_jewellery' },
                            { category: 'high_jewellery' }
                        ]
                    },
                    { isPriceOnDemand: { $ne: true } }
                ]
            }, { name: 1, type: 1, category: 1 });
            
            console.log('Products still with regular pricing:');
            remainingProducts.forEach(product => {
                console.log(`   • ${product.name} (${product.type}/${product.category})`);
            });
        }
        
        // Sample verification
        console.log('\n📋 Sample Updated Products:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const sampleProducts = await Product.find({
            isPriceOnDemand: true
        }, { 
            name: 1, 
            type: 1,
            isPriceOnDemand: 1,
            'variants.sizeLabel': 1, 
            'variants.isPriceOnDemand': 1,
            'variants.priceOnDemandText': 1
        }).limit(3);
        
        sampleProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name} (${product.type})`);
            console.log(`   Product isPriceOnDemand: ${product.isPriceOnDemand}`);
            if (product.variants && product.variants.length > 0) {
                product.variants.forEach(variant => {
                    console.log(`   ${variant.sizeLabel}: isPriceOnDemand=${variant.isPriceOnDemand}, text="${variant.priceOnDemandText}"`);
                });
            }
        });
        
        console.log('\n💡 Frontend Impact:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ All jewelry product cards will now show "Price on Demand"');
        console.log('✅ No pricing will be displayed for jewelry products');
        console.log('✅ Fragrance products will continue to show regular pricing');
        console.log('✅ Users will need to contact for jewelry pricing');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

setJewelryToPriceOnDemand();