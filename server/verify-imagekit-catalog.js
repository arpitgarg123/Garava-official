import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

async function checkImageKitProductsFolder() {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    console.log('🔍 Checking ImageKit for existing product images...\n');
    console.log(`Endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}\n`);

    // Try different folder paths
    const foldersToCheck = [
      '/products',
      '/products/',
      'products',
      '/',
      ''
    ];

    let allFiles = [];

    for (const folder of foldersToCheck) {
      try {
        console.log(`Checking folder: "${folder}"`);
        const files = await imagekit.listFiles({
          path: folder,
          limit: 1000,
          skip: 0
        });
        
        if (files.length > 0) {
          console.log(`  ✓ Found ${files.length} files\n`);
          allFiles = [...allFiles, ...files];
        } else {
          console.log(`  - Empty\n`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }

    // Remove duplicates
    const uniqueFiles = Array.from(new Map(allFiles.map(f => [f.fileId, f])).values());
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`TOTAL UNIQUE FILES FOUND: ${uniqueFiles.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (uniqueFiles.length === 0) {
      console.log('⚠️  No product images found in ImageKit!');
      console.log('   This means images need to be uploaded from temp folder.\n');
      return;
    }

    // Analyze file patterns
    console.log('FILE PATTERN ANALYSIS:\n');
    
    const patternGroups = {};
    uniqueFiles.forEach(file => {
      // Try to extract pattern (RG_SR_1, Er_Sr_2, etc.)
      const patterns = [
        file.name.match(/^([A-Za-z_]+_\d+)/),
        file.name.match(/^([A-Z]{2,3}_[A-Z]{2,3}_\d+)/),
        file.name.match(/^([A-Z]{3}_\d{3})/),
      ];
      
      const match = patterns.find(p => p);
      if (match) {
        const pattern = match[1];
        if (!patternGroups[pattern]) {
          patternGroups[pattern] = [];
        }
        patternGroups[pattern].push(file);
      }
    });

    console.log(`Found ${Object.keys(patternGroups).length} product patterns:\n`);

    // Sort and display
    const sortedPatterns = Object.keys(patternGroups).sort();
    sortedPatterns.forEach(pattern => {
      const files = patternGroups[pattern];
      console.log(`📸 ${pattern} (${files.length} images):`);
      files.slice(0, 3).forEach(f => {
        console.log(`   - ${f.name}`);
        console.log(`     Folder: ${f.folderPath || '/'}`);
        console.log(`     URL: ${f.url.substring(0, 80)}...`);
      });
      if (files.length > 3) {
        console.log(`   ... and ${files.length - 3} more`);
      }
      console.log('');
    });

    // Check specific patterns from temp folder
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('CHECKING SPECIFIC PATTERNS FROM TEMP FOLDER:');
    console.log('═══════════════════════════════════════════════════════════\n');

    const tempPatterns = [
      'RG_SR_1', 'RG_SR_2', 'Er_Sr_1', 'Er_Sr_2', 
      'Pen_Sr_1', 'FRG_001', 'FRG_002'
    ];

    tempPatterns.forEach(pattern => {
      const found = patternGroups[pattern];
      if (found) {
        console.log(`✅ ${pattern}: Found ${found.length} images in ImageKit`);
      } else {
        console.log(`❌ ${pattern}: NOT found in ImageKit`);
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('RECOMMENDATION:');
    console.log('═══════════════════════════════════════════════════════════\n');

    const matchCount = tempPatterns.filter(p => patternGroups[p]).length;
    
    if (matchCount === 0) {
      console.log('❌ No matching patterns found!');
      console.log('   → Proceed with smart-image-migration.js to upload images\n');
    } else if (matchCount === tempPatterns.length) {
      console.log('✅ All patterns already exist in ImageKit!');
      console.log('   → Use existing ImageKit URLs instead of uploading again\n');
    } else {
      console.log(`⚠️  Partial match: ${matchCount}/${tempPatterns.length} patterns found`);
      console.log('   → Some images need to be uploaded\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

checkImageKitProductsFolder();
