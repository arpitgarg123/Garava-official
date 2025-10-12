import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

dotenv.config();

async function checkCSVAndModel() {
  console.log('🔍 Checking CSV Structure and Product Model');
  console.log('============================================================');
  
  try {
    // First, check the product model schema
    console.log('📋 Checking Product Model Schema...');
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    const schema = Product.schema.paths;
    const hasShortDescription = 'shortDescription' in schema;
    
    console.log('\n📊 Product Model Analysis:');
    console.log(`   shortDescription field exists: ${hasShortDescription ? '✅' : '❌'}`);
    
    if (hasShortDescription) {
      const field = schema.shortDescription;
      console.log(`   Type: ${field.instance}`);
      console.log(`   Required: ${field.isRequired ? '✅' : '❌'}`);
      console.log(`   Default: ${field.defaultValue || 'none'}`);
    }
    
    // List all description-related fields
    console.log('\n📋 Description-related fields in model:');
    Object.keys(schema).forEach(fieldName => {
      if (fieldName.toLowerCase().includes('description') || 
          fieldName.toLowerCase().includes('desc')) {
        console.log(`   - ${fieldName}: ${schema[fieldName].instance}`);
      }
    });
    
    // Now check the CSV file
    console.log('\n📁 Analyzing CSV File Structure...');
    const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992637579.csv';
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ CSV file not found at specified path');
      return;
    }
    
    // Read CSV headers and first few rows
    const csvData = [];
    let headers = [];
    
    await new Promise((resolve, reject) => {
      let isFirstRow = true;
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          if (isFirstRow) {
            headers = Object.keys(row);
            isFirstRow = false;
          }
          csvData.push(row);
          if (csvData.length >= 5) {
            // Stop after 5 rows for analysis
            resolve();
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`\n📊 CSV File Analysis (${csvData.length} sample rows):`);
    console.log(`   Total columns: ${headers.length}`);
    
    // Look for description-related columns
    const descriptionColumns = headers.filter(header => 
      header.toLowerCase().includes('description') || 
      header.toLowerCase().includes('desc')
    );
    
    console.log('\n📋 Description-related columns found:');
    if (descriptionColumns.length > 0) {
      descriptionColumns.forEach(col => {
        console.log(`   - ${col}`);
        
        // Check sample data for this column
        const sampleData = csvData.slice(0, 3).map(row => row[col]);
        console.log('     Sample values:');
        sampleData.forEach((value, index) => {
          if (value && value.trim()) {
            console.log(`       ${index + 1}. "${value.substring(0, 60)}..."`);
          } else {
            console.log(`       ${index + 1}. [empty]`);
          }
        });
        console.log('');
      });
    } else {
      console.log('   ❌ No description columns found');
    }
    
    // Check all column headers
    console.log('\n📋 All CSV Column Headers:');
    headers.forEach((header, index) => {
      console.log(`   ${index + 1}. ${header}`);
    });
    
    // Check if shortDescription specifically exists
    const hasShortDescInCSV = headers.some(h => 
      h.toLowerCase().includes('short') && h.toLowerCase().includes('description')
    );
    
    console.log('\n🔍 Short Description Analysis:');
    console.log(`   CSV has "Short description" column: ${hasShortDescInCSV ? '✅' : '❌'}`);
    console.log(`   Model supports shortDescription: ${hasShortDescription ? '✅' : '❌'}`);
    
    if (hasShortDescInCSV) {
      const shortDescColumn = headers.find(h => 
        h.toLowerCase().includes('short') && h.toLowerCase().includes('description')
      );
      console.log(`   Column name: "${shortDescColumn}"`);
      
      // Check how many products have short descriptions in CSV
      let withShortDesc = 0;
      let withoutShortDesc = 0;
      
      csvData.forEach(row => {
        if (row[shortDescColumn] && row[shortDescColumn].trim()) {
          withShortDesc++;
        } else {
          withoutShortDesc++;
        }
      });
      
      console.log(`   Sample products with short description: ${withShortDesc}/${csvData.length}`);
      console.log(`   Sample products without short description: ${withoutShortDesc}/${csvData.length}`);
    }
    
    // Summary and recommendations
    console.log('\n📈 Summary & Recommendations:');
    
    if (hasShortDescription && hasShortDescInCSV) {
      console.log('   ✅ Both CSV and model support short descriptions');
      console.log('   💡 You can import short descriptions from CSV');
    } else if (hasShortDescription && !hasShortDescInCSV) {
      console.log('   ⚠️  Model supports short descriptions but CSV doesn\'t have them');
      console.log('   💡 Consider generating short descriptions from full descriptions');
    } else if (!hasShortDescription && hasShortDescInCSV) {
      console.log('   ⚠️  CSV has short descriptions but model doesn\'t support them');
      console.log('   💡 Model schema might need to be updated');
    } else {
      console.log('   ❌ Neither CSV nor model have short description support');
      console.log('   💡 Consider adding short description support to both');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the analysis
checkCSVAndModel().catch(console.error);