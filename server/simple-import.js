import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

dotenv.config();

async function importProducts() {
  console.log('🚀 Simple Product Import - No Images');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import Product model
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';
    
    console.log('📁 Reading CSV file...');
    
    const csvData = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          csvData.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`📊 Found ${csvData.length} rows in CSV`);
    
    const productMap = new Map();
    
    // Helper function to convert price to paise
    const toPaise = (rupees) => Math.round(rupees * 100);
    
    // First pass: Process parent products (variable type)
    console.log('\\n🔄 Pass 1: Processing variable products...');
    for (const row of csvData) {
      const productType = row.type || row.Type;
      
      if (productType === 'variable') {
        const productId = row.sku || row.SKU;
        console.log(`  Creating parent: ${row.name || row.Name}`);
        
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: (row.description || row.Description || '').replace(/<[^>]*>/g, '').substring(0, 500) || 'No description available',
          category: 'jewelry',
          type: 'jewellery', // Correct enum value
          variants: [],
          colorVariants: [],
          heroImage: { url: null, fileId: null },
          gallery: [],
          isActive: true
        };
        
        productMap.set(productId, baseProduct);
      }
    }
    
    // Second pass: Process simple products
    console.log('\\n🔄 Pass 2: Processing simple products...');
    for (const row of csvData) {
      const productType = row.type || row.Type;
      
      if (productType === 'simple') {
        const productId = row.sku || row.SKU;
        console.log(`  Creating simple: ${row.name || row.Name}`);
        
        const regularPrice = parseFloat(row['Regular price'] || 0);
        
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: (row.description || row.Description || '').replace(/<[^>]*>/g, '').substring(0, 500) || 'No description available',
          category: 'fragrance',
          type: 'fragrance', // Correct enum value
          variants: [{
            sku: productId,
            sizeLabel: 'Standard',
            price: toPaise(regularPrice),
            mrp: toPaise(regularPrice),
            stock: parseInt(row.Stock || 0),
            stockStatus: 'in_stock',
            isActive: true,
            isDefault: true,
            purchaseLimit: 0,
            leadTimeDays: 0,
            images: []
          }],
          colorVariants: [],
          heroImage: { url: null, fileId: null },
          gallery: [],
          isActive: true
        };
        
        productMap.set(productId, baseProduct);
      }
    }
    
    // Third pass: Process variation products (child variants)
    console.log('\\n🔄 Pass 3: Processing variation products...');
    for (const row of csvData) {
      const productType = row.type || row.Type;
      
      if (productType === 'variation') {
        const parentSku = row.parent || row.Parent;
        
        if (parentSku && productMap.has(parentSku)) {
          const parentProduct = productMap.get(parentSku);
          const regularPrice = parseFloat(row['Regular price'] || 0);
          
          console.log(`  Adding variant to: ${parentProduct.name}`);
          
          const variant = {
            sku: row.sku || row.SKU || `${parentSku}-var-${parentProduct.variants.length}`,
            sizeLabel: 'Standard',
            price: toPaise(regularPrice),
            mrp: toPaise(regularPrice), 
            stock: parseInt(row.Stock || 0),
            stockStatus: 'in_stock',
            isActive: true,
            isDefault: parentProduct.variants.length === 0,
            purchaseLimit: 0,
            leadTimeDays: 0,
            images: []
          };
          
          parentProduct.variants.push(variant);
        }
      }
    }
    
    console.log(`\\n📊 Ready to import ${productMap.size} products to database`);
    
    // Import to database
    let imported = 0;
    let failed = 0;
    
    for (const [id, productData] of productMap) {
      try {
        console.log(`📦 Importing: ${productData.name}`);
        
        // Check if product already exists
        const existingProduct = await Product.findOne({ slug: productData.slug });
        
        if (existingProduct) {
          console.log(`  ⚠️  Product exists, updating: ${productData.name}`);
          await Product.findByIdAndUpdate(existingProduct._id, productData);
        } else {
          console.log(`  ✨ Creating new product: ${productData.name}`);
          await Product.create(productData);
        }
        
        imported++;
      } catch (error) {
        console.error(`  ❌ Failed to import ${productData.name}:`, error.message);
        failed++;
      }
    }
    
    console.log('\\n🎉 Import Complete!');
    console.log(`✅ Successfully imported: ${imported} products`);
    console.log(`❌ Failed: ${failed} products`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🔌 Closing database connection...');
    process.exit(0);
  }
}

importProducts();