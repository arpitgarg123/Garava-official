import dotenv from 'dotenv';
// We'll import the DB connection dynamically
import bulkImportService from './src/utils/bulkImportService.js';

dotenv.config();

async function runFinalImport() {
  console.log('🚀 Starting FINAL CSV Import - SKIP VALIDATION');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Initialize bulk import service
    const importService = new bulkImportService();  
    
    // Set the CSV file path
    const csvPath = 'c:\\Users\\Samsu\\Downloads\\wc-product-export-9-10-2025-1759992782628.csv';
    
    console.log('📋 Starting import with SKIP VALIDATION...');
    
    // Run the import and SKIP validation
    const result = await importService.importFromCSV(csvPath, {
      processImages: false, // Disable images for now
      skipValidation: true, // SKIP validation
      batchSize: 50
    });
    
    console.log('\\n✅ Final Import Results:');
    console.log(`   Products imported: ${result.imported || 0}`);
    console.log(`   Products failed: ${result.failed || 0}`);
    console.log(`   Products skipped: ${result.skipped || 0}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\\n❌ Import Errors (first 10):');
      result.errors.slice(0, 10).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    console.log('\\n🎉 FINAL import finished!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🔌 Closing database connection...');
    process.exit(0);
  }
}

runFinalImport();