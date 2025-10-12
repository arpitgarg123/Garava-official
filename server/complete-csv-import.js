import dotenv from 'dotenv';
import connectDb from './src/shared/db.js';
import BulkImportService from './src/utils/bulkImportService.js';

dotenv.config();

async function runCompleteImport() {
  console.log('🚀 Starting Complete CSV Import');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectDb();
    console.log('✅ Database connected');

    // Initialize bulk import service
    const importService = new BulkImportService();
    
    // Set the CSV file path
    const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992637579.csv';
    
    console.log('📋 Starting complete import...');
    
    // Run the import with proper WooCommerce handling
    const result = await importService.importFromCSV(csvPath, {
      processImages: true,
      skipValidation: false, // Enable validation
      handleWooCommerceStructure: true // New flag for proper WooCommerce handling
    });
    
    console.log('\\n✅ Import Results:');
    console.log(`   Products imported: ${result.imported}`);
    console.log(`   Products failed: ${result.failed}`);
    console.log(`   Image statistics:`);
    console.log(`     Products with images: ${result.imageStats?.productsWithImages || 0}`);
    console.log(`     Images downloaded: ${result.imageStats?.successfulDownloads || 0}`);
    console.log(`     Images uploaded: ${result.imageStats?.successfulUploads || 0}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\\n❌ Import Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    console.log('\\n🎉 Complete import finished!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🔌 Closing database connection...');
    process.exit(0);
  }
}

runCompleteImport();