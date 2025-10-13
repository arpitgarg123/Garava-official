import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function organizeProductDescriptions() {
    console.log('📋 Organizing Product Descriptions into Structured Sections');
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
                
                // Parse the description and organize into sections
                const sections = parseProductDescription(product.description, product.name, product.type);
                
                if (sections && Object.keys(sections).length > 0) {
                    // Add structured sections to the product
                    updateData.structuredDescription = sections;
                    
                    // Keep the short description as is for product cards
                    // The full description will be used in accordion sections
                    
                    await Product.findByIdAndUpdate(product._id, updateData);
                    updatedCount++;
                    
                    console.log(`✅ Organized: ${product.name}`);
                    console.log(`   📋 Sections: ${Object.keys(sections).join(', ')}`);
                    
                    // Show details for first few products
                    if (updatedCount <= 3) {
                        console.log('   📄 Sections created:');
                        Object.keys(sections).forEach(key => {
                            console.log(`     - ${key}: ${sections[key].length} characters`);
                        });
                        console.log('');
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error processing ${product.name}:`, error.message);
            }
        }
        
        console.log('\n📊 Organization Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Products organized: ${updatedCount}`);
        console.log(`📝 Total products processed: ${products.length}`);
        
        // Verify organization
        console.log('\n🔍 Verification - Checking organized products:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const verifyProducts = await Product.find({
            structuredDescription: { $exists: true }
        }).limit(3).lean();
        
        verifyProducts.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            if (product.structuredDescription) {
                Object.keys(product.structuredDescription).forEach(section => {
                    console.log(`   📋 ${section}: ${product.structuredDescription[section].length} chars`);
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
}

function parseProductDescription(description, productName, productType) {
    if (!description) return null;
    
    const sections = {};
    
    // Split description by common section markers
    const text = description.toLowerCase();
    
    // Extract main product description (everything before "specification")
    const specIndex = text.indexOf('specification');
    if (specIndex > 0) {
        sections.description = description.substring(0, specIndex).trim();
    } else {
        // If no specification section, use first part as description
        const parts = description.split('.').slice(0, 3); // First 3 sentences
        sections.description = parts.join('.') + (parts.length === 3 ? '.' : '');
    }
    
    // Extract specifications
    if (specIndex > 0) {
        const priceIndex = text.indexOf('price breakup');
        const endIndex = priceIndex > specIndex ? priceIndex : text.indexOf('payment');
        
        let specText = '';
        if (endIndex > specIndex) {
            specText = description.substring(specIndex, endIndex);
        } else {
            specText = description.substring(specIndex);
        }
        
        // Clean and format specifications
        sections.specifications = formatSpecifications(specText);
    }
    
    // Extract price information
    const priceIndex = text.indexOf('price breakup');
    if (priceIndex > 0) {
        const paymentIndex = text.indexOf('payment');
        const endIndex = paymentIndex > priceIndex ? paymentIndex : description.length;
        
        sections.pricing = description.substring(priceIndex, endIndex).trim();
    }
    
    // Extract payment and shipping info
    const paymentIndex = text.indexOf('payment');
    if (paymentIndex > 0) {
        const shippingIndex = text.indexOf('shipping policy');
        const garavaIndex = text.indexOf('garava assurance');
        
        let paymentText = '';
        const garavaAssuranceIndex = text.indexOf('garava assurance');
        if (shippingIndex > paymentIndex) {
            paymentText = description.substring(paymentIndex, shippingIndex);
        } else if (garavaAssuranceIndex > paymentIndex) {
            paymentText = description.substring(paymentIndex, garavaAssuranceIndex);
        } else {
            paymentText = description.substring(paymentIndex);
        }
        
        sections.paymentAndShipping = paymentText.trim();
    }
    
    // Extract GARAVA Assurance
    const garavIndex = text.indexOf('garava assurance');
    if (garavIndex > 0) {
        sections.assurance = description.substring(garavIndex).trim();
    }
    
    // Product-specific sections
    if (productType === 'fragrance') {
        // Look for fragrance-specific information
        if (text.includes('top notes') || text.includes('middle notes') || text.includes('base notes')) {
            sections.fragranceNotes = extractFragranceNotes(description);
        }
    }
    
    return sections;
}

function formatSpecifications(specText) {
    if (!specText) return '';
    
    // Clean up the specification text
    let formatted = specText
        .replace(/specification\s*/i, '')
        .replace(/•/g, '\n•')
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim())
        .join('\n');
    
    return formatted;
}

function extractFragranceNotes(description) {
    const notes = {};
    const text = description.toLowerCase();
    
    // This is a placeholder - would need to implement actual fragrance note extraction
    // For now, return a formatted version of fragrance-related content
    
    return description.substring(0, 300) + '...'; // Truncated for now
}

organizeProductDescriptions();