import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function verifyGaravaStructure() {
    console.log('🔍 Verifying Garava.in-Style Structure');
    console.log('============================================================');
    
    try {
        console.log('🔗 Connecting to database...');
        const connectDb = (await import('./src/shared/db.js')).default;
        await connectDb();
        console.log('✅ Database connected');
        
        const Product = (await import('./src/modules/product/product.model.js')).default;
        
        // Get a sample product to show the structure
        const sampleProduct = await Product.findOne({ 
            name: /Emerald cut Solitaire Ring/i 
        }).lean();
        
        if (sampleProduct && sampleProduct.structuredDescription) {
            console.log('\n📋 Sample Product: ' + sampleProduct.name);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            const sections = sampleProduct.structuredDescription;
            let sectionIndex = 1;
            
            // Show all sections in garava.in order
            if (sections.description) {
                console.log(`\n${sectionIndex}. DESCRIPTION`);
                console.log('─'.repeat(40));
                console.log(sections.description.substring(0, 150) + '...');
                sectionIndex++;
            }
            
            if (sections.productDetails) {
                console.log(`\n${sectionIndex}. PRODUCT DETAILS`);
                console.log('─'.repeat(40));
                console.log(sections.productDetails.substring(0, 150) + '...');
                sectionIndex++;
            }
            
            if (sections.careInstructions) {
                console.log(`\n${sectionIndex}. CARE INSTRUCTIONS`);
                console.log('─'.repeat(40));
                console.log(sections.careInstructions.substring(0, 150) + '...');
                sectionIndex++;
            }
            
            if (sections.sizeGuide) {
                console.log(`\n${sectionIndex}. SIZE GUIDE`);
                console.log('─'.repeat(40));
                console.log(sections.sizeGuide.substring(0, 150) + '...');
                sectionIndex++;
            }
            
            if (sections.materials) {
                console.log(`\n${sectionIndex}. MATERIALS`);
                console.log('─'.repeat(40));
                console.log(sections.materials.substring(0, 150) + '...');
                sectionIndex++;
            }
            
            if (sections.shippingInfo) {
                console.log(`\n${sectionIndex}. SHIPPING INFO`);
                console.log('─'.repeat(40));
                console.log(sections.shippingInfo.substring(0, 150) + '...');
                sectionIndex++;
            }
        }
        
        // Count products with new structured descriptions
        const totalProducts = await Product.countDocuments({});
        const structuredProducts = await Product.countDocuments({ 
            'structuredDescription.productDetails': { $exists: true }
        });
        
        console.log('\n📊 Structure Analysis:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products with garava.in structure: ${structuredProducts}/${totalProducts}`);
        console.log(`📊 Success Rate: ${Math.round((structuredProducts/totalProducts)*100)}%`);
        
        // Check section distribution
        const sectionStats = {};
        const garavaFields = ['description', 'productDetails', 'careInstructions', 'sizeGuide', 'materials', 'shippingInfo'];
        
        for (const field of garavaFields) {
            const count = await Product.countDocuments({ 
                [`structuredDescription.${field}`]: { $exists: true, $ne: '' }
            });
            sectionStats[field] = count;
        }
        
        console.log('\n📋 Section Distribution (Garava.in Style):');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        Object.keys(sectionStats).forEach(section => {
            const count = sectionStats[section];
            const percentage = Math.round((count/totalProducts)*100);
            console.log(`${section}: ${count} products (${percentage}%)`);
        });
        
        console.log('\n🎯 ProductAccordion Mapping:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Description → Main product description (above accordion)');
        console.log('✅ Product Details → "Product Details" accordion tab');
        console.log('✅ Care Instructions → "Care Instructions" accordion tab');
        console.log('✅ Size Guide → "Size Guide" accordion tab (jewelry)');
        console.log('✅ Materials → "Materials" accordion tab');
        console.log('✅ Shipping Info → "Shipping & Returns" accordion tab');
        
        console.log('\n📱 Frontend Structure (matches garava.in):');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔽 Product page will show expandable sections:');
        console.log('• Product Details (specifications & certifications)');
        console.log('• Care Instructions (maintenance & care tips)');
        console.log('• Size Guide (sizing information for jewelry)');
        console.log('• Materials (quality & sourcing information)');
        console.log('• Shipping & Returns (delivery & return policy)');
        console.log('• Plus existing sections: Responsible Sourcing, Payments');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

verifyGaravaStructure();