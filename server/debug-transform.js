import fs from 'fs';
import csv from 'csv-parser';

async function debugTransform() {
  console.log('🚀 Debug Transform Process');
  console.log('============================================================');
  
  try {

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
    
    // First pass: Process parent products (variable type)
    console.log('\\n🔄 Pass 1: Processing variable products...');
    let variableCount = 0;
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'variable') {
        variableCount++;
        const productId = row.sku || row.SKU || `product-${index}`;
        console.log(`  Variable ${variableCount}: ${row.name || row.Name} (ID: ${productId})`);
        
        // Create basic product structure
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: row.description || row.Description || '',
          category: 'jewelry', // Default category
          variants: [],
          colorVariants: [],
          heroImage: { url: null, fileId: null },
          gallery: [],
          isActive: true,
          type: 'variable'
        };
        
        productMap.set(productId, baseProduct);
      }
    }
    
    // Second pass: Process simple products
    console.log('\\n🔄 Pass 2: Processing simple products...');
    let simpleCount = 0;
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'simple') {
        simpleCount++;
        const productId = row.sku || row.SKU || `product-${index}`;
        console.log(`  Simple ${simpleCount}: ${row.name || row.Name} (ID: ${productId})`);
        
        // Create basic product structure with variant
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: row.description || row.Description || '',
          category: 'fragrance', // Default category
          variants: [{
            sku: productId,
            sizeLabel: 'Standard',
            price: row['Regular price'] ? parseInt(parseFloat(row['Regular price']) * 100) : 0,
            stock: parseInt(row.Stock || 0),
            stockStatus: 'in_stock',
            isActive: true,
            isDefault: true
          }],
          colorVariants: [],
          heroImage: { url: null, fileId: null },
          gallery: [],
          isActive: true,
          type: 'simple'
        };
        
        productMap.set(productId, baseProduct);
      }
    }
    
    // Third pass: Process variation products (child variants)
    console.log('\\n🔄 Pass 3: Processing variation products...');
    let variationCount = 0;
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'variation') {
        variationCount++;
        const parentSku = row.parent || row.Parent;
        console.log(`  Variation ${variationCount}: ${row.name || row.Name} (Parent: ${parentSku})`);
        
        if (parentSku && productMap.has(parentSku)) {
          const parentProduct = productMap.get(parentSku);
          
          // Create variant
          const variant = {
            sku: row.sku || row.SKU || `${parentSku}-variant-${variationCount}`,
            sizeLabel: 'Standard',
            price: row['Regular price'] ? parseInt(parseFloat(row['Regular price']) * 100) : 0,
            stock: parseInt(row.Stock || 0),
            stockStatus: 'in_stock',
            isActive: true,
            isDefault: parentProduct.variants.length === 0
          };
          
          parentProduct.variants.push(variant);
          console.log(`    Added variant to ${parentProduct.name}`);
        } else {
          console.log(`    ❌ Parent ${parentSku} not found for variation`);
        }
      }
    }
    
    console.log(`\\n📊 Processing Summary:`);
    console.log(`   Variable products: ${variableCount}`);
    console.log(`   Simple products: ${simpleCount}`);
    console.log(`   Variation products: ${variationCount}`);
    console.log(`   Total products created: ${productMap.size}`);
    
    // Show first few products
    console.log('\\n📋 Sample Products:');
    let shown = 0;
    for (const [id, product] of productMap) {
      if (shown < 3) {
        console.log(`  ${shown + 1}. ${product.name} (${product.type}) - ${product.variants.length} variants`);
        shown++;
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

debugTransform();