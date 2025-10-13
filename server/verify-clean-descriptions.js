import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function verifyCleanDescriptions() {
    console.log('🔍 Verifying All Descriptions Are Clean');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get all products
        const products = await Product.find({}).lean();
        
        console.log(`📝 Checking ${products.length} products for unwanted text...`);
        
        const unwantedPatterns = [
            '&nbsp;',
            'Lab-Grown',
            '[html_block',
            '\\n',
            '</',
            '<p>',
            '<div>',
            '\n\n'
        ];
        
        let issuesFound = 0;
        let cleanProducts = 0;
        
        products.forEach((product, index) => {
            const issues = [];
            
            // Check description
            if (product.description) {
                unwantedPatterns.forEach(pattern => {
                    if (product.description.includes(pattern)) {
                        issues.push(`Description contains: ${pattern}`);
                    }
                });
            }
            
            // Check short description
            if (product.shortDescription) {
                unwantedPatterns.forEach(pattern => {
                    if (product.shortDescription.includes(pattern)) {
                        issues.push(`Short description contains: ${pattern}`);
                    }
                });
            }
            
            if (issues.length > 0) {
                console.log(`❌ ${product.name}:`);
                issues.forEach(issue => console.log(`   • ${issue}`));
                issuesFound++;
            } else {
                cleanProducts++;
                if (index < 3) {
                    console.log(`✅ ${product.name} - Clean`);
                }
            }
        });
        
        console.log('\n📊 Final Verification Results:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Clean products: ${cleanProducts}`);
        console.log(`❌ Products with issues: ${issuesFound}`);
        console.log(`📝 Total products: ${products.length}`);
        
        if (issuesFound === 0) {
            console.log('\n🎉 SUCCESS: All descriptions are clean!');
            console.log('✅ No HTML tags, &nbsp;, Lab-Grown, [html_block], or \\n found');
            console.log('✅ All products ready for production use');
        } else {
            console.log('\n⚠️  Some issues remain - may need additional cleaning');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

verifyCleanDescriptions();