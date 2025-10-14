import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

async function listImageKitFiles() {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    console.log('🔍 Connecting to ImageKit...\n');
    console.log(`URL Endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}\n`);

    // List all files in the products folder
    const files = await imagekit.listFiles({
      path: '/products',
      searchQuery: '',
      limit: 1000
    });

    console.log(`📦 Found ${files.length} files in ImageKit /products folder\n`);

    if (files.length === 0) {
      console.log('⚠️  No files found. Checking root folder...\n');
      
      const rootFiles = await imagekit.listFiles({
        path: '/',
        limit: 1000
      });
      
      console.log(`📦 Found ${rootFiles.length} files in root folder\n`);
      
      if (rootFiles.length > 0) {
        console.log('Sample files from root:');
        rootFiles.slice(0, 10).forEach((file, index) => {
          console.log(`${index + 1}. ${file.name}`);
          console.log(`   URL: ${file.url}`);
          console.log(`   Folder: ${file.folderPath || '/'}\n`);
        });
      }
    } else {
      // Group files by pattern
      const filesByProduct = {};
      
      files.forEach(file => {
        // Extract product code from filename (e.g., RB1-004, RB1-008)
        const match = file.name.match(/^([A-Z0-9]+-[0-9]+)/);
        if (match) {
          const productCode = match[1];
          if (!filesByProduct[productCode]) {
            filesByProduct[productCode] = [];
          }
          filesByProduct[productCode].push({
            name: file.name,
            url: file.url,
            size: file.size,
            createdAt: file.createdAt
          });
        }
      });

      console.log('═══════════════════════════════════════════════════════════');
      console.log('           IMAGEKIT FILES BY PRODUCT CODE');
      console.log('═══════════════════════════════════════════════════════════\n');

      const productCodes = Object.keys(filesByProduct).sort();
      console.log(`Found ${productCodes.length} unique product codes:\n`);

      productCodes.slice(0, 10).forEach(code => {
        console.log(`📸 ${code} (${filesByProduct[code].length} images):`);
        filesByProduct[code].forEach(file => {
          console.log(`   - ${file.name}`);
          console.log(`     ${file.url}`);
        });
        console.log('');
      });

      // Show color variant pattern analysis
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('              COLOR VARIANT PATTERN ANALYSIS');
      console.log('═══════════════════════════════════════════════════════════\n');

      const colorPatterns = {
        'Yellow Gold (-YG)': files.filter(f => f.name.includes('-YG')).length,
        'Rose Gold (-RG)': files.filter(f => f.name.includes('-RG')).length,
        'White Gold (-WG)': files.filter(f => f.name.includes('-WG')).length,
      };

      Object.entries(colorPatterns).forEach(([color, count]) => {
        console.log(`${color}: ${count} images`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

listImageKitFiles();
