import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function restructureProductDescriptions() {
    console.log('🔄 Restructuring Product Descriptions to Match Garava.in Format');
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
        
        for (const product of products) {
            try {
                const updateData = {};
                
                // Parse and restructure based on Garava.in format
                const sections = parseToGaravaFormat(product.description, product.name, product.type);
                
                if (sections && Object.keys(sections).length > 0) {
                    updateData.structuredDescription = sections;
                    
                    await Product.findByIdAndUpdate(product._id, updateData);
                    updatedCount++;
                    
                    console.log(`✅ Restructured: ${product.name}`);
                    console.log(`   📋 Sections: ${Object.keys(sections).join(', ')}`);
                    
                    // Show details for first few products
                    if (updatedCount <= 2) {
                        console.log('   📄 Section previews:');
                        Object.keys(sections).forEach(key => {
                            const content = sections[key];
                            const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;
                            console.log(`     - ${key}: ${preview}`);
                        });
                        console.log('');
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error processing ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Restructuring Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products restructured: ${updatedCount}`);
        console.log(`📝 Total products processed: ${products.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

function parseToGaravaFormat(description, productName, productType) {
    if (!description) return null;
    
    const sections = {};
    const text = description.toLowerCase();
    
    // 1. DESCRIPTION - Clean product overview (like garava.in shows above the tabs)
    const specIndex = text.indexOf('specification');
    if (specIndex > 0) {
        let mainDesc = description.substring(0, specIndex).trim();
        // Clean up description
        mainDesc = mainDesc
            .replace(/^description\s*/i, '')
            .replace(/^\s*choosing a garava/i, 'Choosing a GARAVA')
            .trim();
        sections.description = mainDesc;
    } else {
        // Use first 2-3 sentences for description
        const sentences = description.split('.').slice(0, 3);
        sections.description = sentences.join('.') + '.';
    }
    
    // 2. PRODUCT DETAILS - Specifications formatted as bullet points
    if (specIndex > 0) {
        const priceIndex = text.indexOf('price breakup');
        const endIndex = priceIndex > specIndex ? priceIndex : text.indexOf('payment');
        
        let specText = '';
        if (endIndex > specIndex) {
            specText = description.substring(specIndex, endIndex);
        } else {
            specText = description.substring(specIndex, specIndex + 800); // Limit spec section
        }
        
        // Format as clean bullet points
        sections.productDetails = formatAsProductDetails(specText);
    }
    
    // 3. CARE INSTRUCTIONS - For jewelry/fragrance care
    if (productType === 'jewellery' || text.includes('care') || text.includes('maintenance')) {
        sections.careInstructions = generateCareInstructions(productType);
    }
    
    // 4. SHIPPING INFO - Shipping and delivery details
    const shippingInfo = extractShippingInfo(description);
    if (shippingInfo) {
        sections.shippingInfo = shippingInfo;
    }
    
    // 5. SIZE GUIDE - For jewelry sizing
    if (productType === 'jewellery' || text.includes('size')) {
        sections.sizeGuide = generateSizeGuide(productType);
    }
    
    // 6. MATERIALS - Material and quality information
    const materialsInfo = extractMaterialsInfo(description, productType);
    if (materialsInfo) {
        sections.materials = materialsInfo;
    }
    
    return sections;
}

function formatAsProductDetails(specText) {
    if (!specText) return '';
    
    let formatted = specText
        .replace(/specification\s*/i, '')
        .replace(/•/g, '\n•')
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            line = line.trim();
            if (!line.startsWith('•') && line.length > 3) {
                return '• ' + line;
            }
            return line;
        })
        .join('\n');
    
    return formatted;
}

function generateCareInstructions(productType) {
    if (productType === 'jewellery') {
        return `• Store in a clean, dry place away from direct sunlight
• Clean gently with a soft cloth
• Avoid contact with perfumes, lotions, and chemicals
• Remove before swimming, exercising, or sleeping
• Get your jewelry professionally cleaned periodically`;
    } else if (productType === 'fragrance') {
        return `• Store in a cool, dry place away from direct sunlight
• Keep the bottle upright and tightly closed
• Avoid extreme temperatures
• Do not store in the bathroom or car
• Use within 3 years of opening for best quality`;
    }
    return '';
}

function extractShippingInfo(description) {
    const text = description.toLowerCase();
    
    if (text.includes('shipping') || text.includes('delivery')) {
        return `• Free shipping across India
• 7-21 working days delivery time
• Tracking information provided
• Express delivery available in select cities
• International shipping not available currently`;
    }
    
    return `• Free shipping across India
• 7-21 working days delivery time  
• Tracking information provided
• Safe and secure packaging`;
}

function generateSizeGuide(productType) {
    if (productType === 'jewellery') {
        return `• Ring sizes available: 6 to 22
• Earring dimensions clearly mentioned
• Custom sizing available on request
• Size chart available for reference
• Contact us for size assistance`;
    }
    return '';
}

function extractMaterialsInfo(description, productType) {
    const text = description.toLowerCase();
    
    if (productType === 'jewellery') {
        return `• Lab-grown diamonds (IGI/GIA certified for 1ct+)
• 18K and 14K gold options available
• E/F/G color, VVS/VS clarity for smaller diamonds
• Ethically sourced materials
• Sustainable and conflict-free`;
    } else if (productType === 'fragrance') {
        return `• Premium quality fragrance oils
• Long-lasting formula
• Alcohol-based composition
• Cruelty-free ingredients
• Made in India with international standards`;
    }
    
    return '';
}

restructureProductDescriptions();