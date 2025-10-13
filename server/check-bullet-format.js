import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function checkDatabaseBulletFormat() {
    console.log('🔍 Checking Database Bullet Point Format');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get a sample product to check the bullet format
        const sampleProduct = await Product.findOne({ 
            name: /Emerald cut Solitaire Ring/i 
        }).lean();
        
        if (sampleProduct && sampleProduct.structuredDescription) {
            console.log('\n📋 Sample Product: ' + sampleProduct.name);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            const structured = sampleProduct.structuredDescription;
            
            if (structured.productDetails) {
                console.log('\n📄 PRODUCT DETAILS RAW DATA:');
                console.log('─'.repeat(50));
                console.log(JSON.stringify(structured.productDetails, null, 2));
                
                console.log('\n📄 PRODUCT DETAILS VISUAL:');
                console.log('─'.repeat(50));
                console.log(structured.productDetails);
                
                // Check for bullet characters
                const hasBullets = structured.productDetails.includes('•');
                const hasDashes = structured.productDetails.includes('-');
                const hasAsterisks = structured.productDetails.includes('*');
                const hasNewlines = structured.productDetails.includes('\n');
                
                console.log('\n🔍 FORMAT ANALYSIS:');
                console.log(`• Contains bullet points (•): ${hasBullets}`);
                console.log(`• Contains dashes (-): ${hasDashes}`);
                console.log(`• Contains asterisks (*): ${hasAsterisks}`);
                console.log(`• Contains newlines (\\n): ${hasNewlines}`);
                
                // Show character codes for first few characters
                console.log('\n📊 FIRST 200 CHARACTERS:');
                const first200 = structured.productDetails.substring(0, 200);
                console.log(first200);
                
                console.log('\n🔢 CHARACTER CODES (first 50 chars):');
                for (let i = 0; i < Math.min(50, structured.productDetails.length); i++) {
                    const char = structured.productDetails.charAt(i);
                    const code = structured.productDetails.charCodeAt(i);
                    if (char === '\n') {
                        console.log(`${i}: \\n (${code})`);
                    } else if (char === ' ') {
                        console.log(`${i}: SPACE (${code})`);
                    } else {
                        console.log(`${i}: ${char} (${code})`);
                    }
                }
            }
            
            // Check other sections too
            if (structured.materials) {
                console.log('\n💎 MATERIALS SECTION:');
                console.log('─'.repeat(50));
                console.log(structured.materials.substring(0, 200) + '...');
            }
            
            if (structured.careInstructions) {
                console.log('\n🛡️ CARE INSTRUCTIONS SECTION:');
                console.log('─'.repeat(50));
                console.log(structured.careInstructions.substring(0, 200) + '...');
            }
        } else {
            console.log('❌ No sample product found with structured description');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

checkDatabaseBulletFormat();