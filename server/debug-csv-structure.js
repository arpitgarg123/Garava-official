import csv from 'csv-parser';
import fs from 'fs';

const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';

console.log('🔍 Analyzing CSV structure...\n');

let rowCount = 0;
const productTypes = new Map();
const parentRelationships = new Map();

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    rowCount++;
    
    const type = row.Type || row.type;
    const parent = row.Parent || row.parent;
    const name = row.Name || row.name;
    const regularPrice = row['Regular price'] || row.regularPrice;
    const salePrice = row['Sale price'] || row.salePrice;
    
    // Count product types
    productTypes.set(type, (productTypes.get(type) || 0) + 1);
    
    // Track parent relationships
    if (parent) {
      if (!parentRelationships.has(parent)) {
        parentRelationships.set(parent, []);
      }
      parentRelationships.get(parent).push({
        name,
        type,
        regularPrice,
        salePrice
      });
    }
    
    // Log first 5 rows for debugging
    if (rowCount <= 5) {
      console.log(`Row ${rowCount}:`);
      console.log(`  Name: ${name}`);
      console.log(`  Type: ${type}`);
      console.log(`  Parent: ${parent || 'None'}`);
      console.log(`  Regular Price: ${regularPrice || 'None'}`);
      console.log(`  Sale Price: ${salePrice || 'None'}`);
      console.log('');
    }
  })
  .on('end', () => {
    console.log('📊 Analysis Results:');
    console.log(`Total rows: ${rowCount}`);
    console.log('\n📈 Product Types:');
    for (const [type, count] of productTypes) {
      console.log(`  ${type}: ${count}`);
    }
    
    console.log('\n👨‍👩‍👧‍👦 Parent-Child Relationships:');
    console.log(`Parents found: ${parentRelationships.size}`);
    
    // Show first few parent-child relationships
    let shown = 0;
    for (const [parent, children] of parentRelationships) {
      if (shown < 3) {
        console.log(`\n  Parent: ${parent}`);
        console.log(`  Children: ${children.length}`);
        children.forEach((child, index) => {
          if (index < 2) { // Show first 2 children
            console.log(`    - ${child.name} (${child.type}) - Price: ${child.regularPrice || 'None'}`);
          }
        });
        shown++;
      }
    }
    
    console.log('\n✅ Analysis complete');
  });