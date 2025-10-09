import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Real CSV Import with Image Processing
 * Processes your actual WooCommerce CSV file with complete image download and upload
 */
async function processRealCSV() {
  try {
    console.log('🚀 Starting Real CSV Import with Image Processing');
    console.log('=' .repeat(60));
    
    // Connect to database first
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');
    
    // Import services
    const { default: BulkImportService } = await import('./src/utils/bulkImportService.js');
    const { default: ImageKitUploader } = await import('./src/utils/imageKitUploader.js');
    
    // Validate ImageKit configuration
    console.log('🔍 Validating ImageKit configuration...');
    const imageUploader = new ImageKitUploader();
    const configCheck = await imageUploader.validateConfiguration();
    
    if (!configCheck.valid) {
      console.log('❌ ImageKit configuration invalid:', configCheck.message);
      console.log('⚠️  Proceeding without image uploads...');
    } else {
      console.log('✅ ImageKit configuration valid');
    }
    
    // Look for your CSV file
    const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';
    
    if (!fs.existsSync(csvPath)) {
      console.log('❌ CSV file not found at:', csvPath);
      console.log('💡 Please ensure your WooCommerce CSV file is at the correct location');
      return;
    }
    
    console.log('📁 Found CSV file:', csvPath);
    
    // Check file size
    const stats = fs.statSync(csvPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);
    
    // Create import service
    const importService = new BulkImportService();
    
    // Step 1: Validate CSV
    console.log('\n📋 Step 1: Validating CSV structure...');
    const validation = await importService.validateCSV(csvPath);
    
    console.log(`✅ Validation Results:`);
    console.log(`   Products found: ${validation.productCount}`);
    console.log(`   Products with images: ${validation.productsWithImages}`);
    console.log(`   Validation errors: ${validation.errorCount}`);
    console.log(`   Parse errors: ${validation.parseErrors?.length || 0}`);
    
    if (!validation.isValid) {
      console.log('❌ CSV validation failed');
      if (validation.error) {
        console.log('Error:', validation.error);
      }
      if (validation.validationResults) {
        validation.validationResults.forEach((result, index) => {
          if (result.errors.length > 0) {
            console.log(`   Product ${index + 1} (${result.name}): ${result.errors.join(', ')}`);
          }
        });
      }
      return;
    }
    
    console.log('✅ CSV validation passed!');
    
    // Step 2: Ask for confirmation (simulate user input)
    console.log('\n🎯 Import Configuration:');
    console.log(`   • Products to import: ${validation.productCount}`);
    console.log(`   • Products with images: ${validation.productsWithImages}`);
    console.log(`   • Image processing: ${configCheck.valid ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   • Duplicate handling: UPDATE existing products`);
    console.log(`   • Variant merging: ENABLED`);
    
    // Step 3: Start Import
    console.log('\n🚀 Step 2: Starting import process...');
    
    const importOptions = {
      processImages: configCheck.valid, // Only process images if ImageKit is configured
      skipDuplicates: false,
      updateExisting: true,
      mergeVariants: true,
      preserveImages: false // Replace existing images
    };
    
    const startTime = Date.now();
    const result = await importService.importFromCSV(csvPath, importOptions);
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    // Step 4: Display Results
    console.log('\n🎉 Import Completed!');
    console.log('=' .repeat(60));
    console.log(result.summary);
    console.log(`⏱️  Total time: ${duration} seconds`);
    
    // Show detailed results
    if (result.details.created.length > 0) {
      console.log('\n✅ Successfully Created Products:');
      result.details.created.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.sku})`);
      });
    }
    
    if (result.details.updated.length > 0) {
      console.log('\n🔄 Successfully Updated Products:');
      result.details.updated.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.sku})`);
      });
    }
    
    if (result.details.errors.length > 0) {
      console.log('\n❌ Import Errors:');
      result.details.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.product || 'Unknown'} (${error.sku || 'No SKU'})`);
        console.log(`      Error: ${error.error || error.errors?.join(', ') || 'Unknown error'}`);
      });
    }
    
    // Image processing results
    if (result.details.imageStats && result.details.imageStats.totalProducts > 0) {
      console.log('\n📸 Image Processing Results:');
      console.log(`   Products processed: ${result.details.imageStats.totalProducts}`);
      console.log(`   Products with images: ${result.details.imageStats.productsWithImages}`);
      console.log(`   Total image URLs: ${result.details.imageStats.totalImageUrls}`);
      console.log(`   Successful downloads: ${result.details.imageStats.successfulDownloads}`);
      console.log(`   Successful uploads: ${result.details.imageStats.successfulUploads}`);
      
      if (result.details.imageStats.imageErrors && result.details.imageStats.imageErrors.length > 0) {
        console.log(`   Image errors: ${result.details.imageStats.imageErrors.length}`);
        result.details.imageStats.imageErrors.forEach((error, index) => {
          console.log(`      ${index + 1}. ${error.product}: ${error.error}`);
        });
      }
    }
    
    // Step 5: Verify in Database
    console.log('\n🔍 Step 3: Verifying products in database...');
    const { default: Product } = await import('./src/modules/product/product.model.js');
    
    const importedProducts = await Product.find({
      _importSource: 'woocommerce_csv'
    }).select('name sku category variants.sizeLabel variants.price heroImage.url').limit(10);
    
    console.log(`✅ Found ${importedProducts.length} imported products in database:`);
    importedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.sku})`);
      console.log(`      Category: ${product.category}`);
      console.log(`      Variants: ${product.variants.length}`);
      console.log(`      Hero Image: ${product.heroImage?.url ? '✅ Yes' : '❌ No'}`);
      if (product.variants.length > 0) {
        const price = product.variants[0].price / 100; // Convert from paise
        console.log(`      Price: ₹${price.toFixed(2)}`);
      }
    });
    
    // Step 6: Generate Import Summary File
    console.log('\n📄 Step 4: Generating import report...');
    const reportPath = path.join(process.cwd(), `import-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(result.details, null, 2));
    console.log(`✅ Import report saved: ${reportPath}`);
    
    // Success message
    console.log('\n🎉 Import Process Completed Successfully!');
    console.log('=' .repeat(60));
    console.log(`✅ Imported ${result.stats.successful} products`);
    console.log(`📸 Processed ${result.stats.imageStats?.successfulUploads || 0} images`);
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log('\n💡 Your products are now available in your Garava store!');
    
  } catch (error) {
    console.error('\n❌ Import process failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close database connection
    console.log('\n🔌 Closing database connection...');
    process.exit(0);
  }
}

// Check if CSV file exists before starting
const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';
if (!fs.existsSync(csvPath)) {
  console.log('❌ CSV file not found!');
  console.log('📍 Expected location:', csvPath);
  console.log('💡 Please ensure your WooCommerce CSV export is saved at this location');
  console.log('');
  console.log('🔧 Alternative: Update the csvPath variable in this script to point to your CSV file');
  process.exit(1);
}

// Run the import
processRealCSV();