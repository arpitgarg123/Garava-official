import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function checkEmeraldProduct() {
    console.log('🔍 Checking Classic Emerald cut Solitaire Ring in Database');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        // Dynamic import for database connection
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Search for the emerald product
        const emeraldProduct = await Product.findOne({
            $or: [
                { name: /emerald/i },
                { name: /Classic Emerald cut Solitaire Ring/i }
            ]
        }).lean();
        
        if (!emeraldProduct) {
            console.log('❌ Emerald product not found in database');
            
            // List all products to see what we have
            const allProducts = await Product.find({}, { name: 1, sku: 1 }).lean();
            console.log('\n📋 Available products in database:');
            allProducts.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name} (SKU: ${product.sku || 'N/A'})`);
            });
            return;
        }
        
        console.log('✅ Found Emerald product in database!');
        console.log('\n📝 Database Product Details:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log(`📛 Name: ${emeraldProduct.name}`);
        console.log(`🔢 SKU: ${emeraldProduct.sku || 'N/A'}`);
        console.log(`💰 Price: ₹${emeraldProduct.price || 'N/A'}`);
        console.log(`📏 Description Length: ${emeraldProduct.description?.length || 0} characters`);
        console.log(`📄 Short Description Length: ${emeraldProduct.shortDescription?.length || 0} characters`);
        
        console.log('\n📖 Current Description:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(emeraldProduct.description || 'No description');
        
        console.log('\n📄 Current Short Description:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(emeraldProduct.shortDescription || 'No short description');
        
        console.log('\n🌐 Website Description (from garava.in):');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`A dazzling Emerald cut lab-grown diamond, set on a shiny polished gold band this ring combines luxury with ethics, offering a stunningly clear and ethical alternative to mined stones. Lab grown diamond are created in a sustainable way, each diamond mirrors the clarity and quality of natural stones without environmental impact. The delicate brilliance of a smaller, ethically crafted diamond elevates the beauty the central stone. Making it a piece you can feel truly proud to wear.`);
        
        console.log('\n🔍 Comparison Analysis:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const websiteDesc = `A dazzling Emerald cut lab-grown diamond, set on a shiny polished gold band this ring combines luxury with ethics, offering a stunningly clear and ethical alternative to mined stones. Lab grown diamond are created in a sustainable way, each diamond mirrors the clarity and quality of natural stones without environmental impact. The delicate brilliance of a smaller, ethically crafted diamond elevates the beauty the central stone. Making it a piece you can feel truly proud to wear.`;
        
        console.log(`📏 Website description length: ${websiteDesc.length} characters`);
        console.log(`📏 Database description length: ${emeraldProduct.description?.length || 0} characters`);
        
        if (emeraldProduct.description && emeraldProduct.description.includes(websiteDesc)) {
            console.log('✅ Database contains website description');
        } else if (websiteDesc.includes(emeraldProduct.description)) {
            console.log('⚠️  Website description is longer than database description');
        } else {
            console.log('❌ Descriptions are completely different');
        }
        
        console.log('\n🎯 Missing Content Analysis:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (!emeraldProduct.shortDescription) {
            console.log('❌ Missing: Short description field is empty');
        }
        
        // Check if website description is different/better
        if (emeraldProduct.description !== websiteDesc) {
            console.log('⚠️  Website has different/updated description content');
            console.log('💡 Website description is more product-specific and detailed');
        }
        
        // Check for other missing fields
        const missingFields = [];
        if (!emeraldProduct.tags || emeraldProduct.tags.length === 0) missingFields.push('tags');
        if (!emeraldProduct.category) missingFields.push('category');
        if (!emeraldProduct.metaDescription) missingFields.push('metaDescription');
        if (!emeraldProduct.seoTitle) missingFields.push('seoTitle');
        
        if (missingFields.length > 0) {
            console.log(`❌ Missing fields: ${missingFields.join(', ')}`);
        }
        
        console.log('\n💡 Recommendations:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. 🔄 Update description with website-specific content');
        console.log('2. 📄 Add the current generic description as shortDescription');
        console.log('3. 🏷️  Add proper tags and SEO fields');
        console.log('4. 📸 Ensure product images match website images');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

checkEmeraldProduct();