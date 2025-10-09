import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importProductsWithImages() {
  console.log('🚀 Complete Product Import with Image Processing');
  console.log('============================================================');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to database...');
    const { default: connectDb } = await import('./src/shared/db.js');
    await connectDb();
    console.log('✅ Database connected');

    // Import required modules
    const { default: Product } = await import('./src/modules/product/product.model.js');
    const { default: ImageDownloader } = await import('./src/utils/imageDownloader.js');
    const { default: ImageKitUploader } = await import('./src/utils/imageKitUploader.js');
    
    // Initialize image processing
    const imageDownloader = new ImageDownloader();
    const imageUploader = new ImageKitUploader();
    
    console.log('🔍 Validating ImageKit configuration...');
    const isImageKitValid = await imageUploader.validateConfiguration();
    if (!isImageKitValid) {
      console.log('⚠️  ImageKit not configured, proceeding without image upload');
    } else {
      console.log('✅ ImageKit configuration valid');
    }
    
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
    
    // Helper function to extract image URLs from CSV
    const extractImageUrls = (row) => {
      const images = row.Images || row.images || '';
      if (!images) return [];
      
      // Split by comma and clean URLs
      return images.split(',')
        .map(url => url.trim())
        .filter(url => url && url.startsWith('http'))
        .slice(0, 5); // Limit to 5 images max
    };
    
    // Helper function to process product images
    const processProductImages = async (row, productSku) => {
      const imageUrls = extractImageUrls(row);
      let heroImage = { url: null, fileId: null };
      let gallery = [];
      
      if (imageUrls.length > 0) {
        console.log(`📸 Processing ${imageUrls.length} images for ${productSku}`);
        
        try {
          // Download images
          const downloadedFiles = await imageDownloader.downloadImages(imageUrls, productSku);
          const downloadResult = { downloadedFiles };
          
          console.log(`  🔍 Download result structure:`, {
            hasDownloadedFiles: !!downloadResult.downloadedFiles,
            downloadedFilesLength: downloadResult.downloadedFiles?.length || 0,
            downloadedFiles: downloadResult.downloadedFiles?.map(f => ({ 
              filename: f.filename, 
              cached: f.cached,
              hasFilepath: !!f.filepath 
            })) || []
          });
          
          if (downloadResult.downloadedFiles && downloadResult.downloadedFiles.length > 0) {
            console.log(`  📥 Downloaded ${downloadResult.downloadedFiles.length} images`);
            
            if (isImageKitValid) {
              try {
                // Extract file paths from download results
                const filePaths = downloadResult.downloadedFiles.map(file => file.filepath);
                console.log(`  🔄 Preparing to upload ${filePaths.length} files to ImageKit...`);
                console.log(`  📁 Files to upload:`, filePaths.map(fp => path.basename(fp)));
                
                // Upload to ImageKit with proper options
                const uploadResults = await imageUploader.uploadFiles(filePaths, {
                  folder: `/products/${productSku}`,
                  generateFileName: (filePath, index) => {
                    const ext = path.extname(filePath);
                    return `${productSku}_${index}${ext}`;
                  }
                });
                
                console.log(`  📊 Upload results for ${productSku}:`, uploadResults?.length || 0, 'results');
                
                // Process successful uploads
                const successfulUploads = uploadResults.filter(result => result.success);
                
                if (successfulUploads.length > 0) {
                  console.log(`  ☁️  Uploaded ${successfulUploads.length} images to ImageKit`);
                  
                  // Set hero image (first image)
                  heroImage = {
                    url: successfulUploads[0].url,
                    fileId: successfulUploads[0].fileId
                  };
                  
                  // Set gallery (remaining images)
                  gallery = successfulUploads.slice(1).map(img => ({
                    url: img.url,
                    fileId: img.fileId
                  }));
                } else {
                  console.log(`  ⚠️  No images uploaded successfully for ${productSku}`);
                }
              } catch (uploadError) {
                console.error(`  ❌ Upload failed for ${productSku}:`, uploadError.message);
              }
            } else {
              // Use local file URLs if ImageKit is not available
              heroImage = {
                url: downloadResult.downloadedFiles[0].filepath,
                fileId: null
              };
              
              gallery = downloadResult.downloadedFiles.slice(1).map(file => ({
                url: file.filepath,
                fileId: null
              }));
            }
            
            // Clean up local files after upload
            for (const file of downloadResult.downloadedFiles) {
              try {
                if (fs.existsSync(file.localPath)) {
                  fs.unlinkSync(file.localPath);
                }
              } catch (cleanupError) {
                console.log(`⚠️  Could not cleanup ${file.localPath}`);
              }
            }
          }
        } catch (imageError) {
          console.error(`❌ Image processing failed for ${productSku}:`, imageError.message);
        }
      }
      
      return { heroImage, gallery };
    };
    
    // First pass: Process parent products (variable type)
    console.log('\\n🔄 Pass 1: Processing variable products...');
    for (const row of csvData) {
      const productType = row.type || row.Type;
      
      if (productType === 'variable') {
        const productId = row.sku || row.SKU;
        console.log(`  Creating parent: ${row.name || row.Name}`);
        
        // Process images for parent product
        const { heroImage, gallery } = await processProductImages(row, productId);
        
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: (row.description || row.Description || '').replace(/<[^>]*>/g, '').substring(0, 500) || 'No description available',
          category: 'jewelry',
          type: 'jewellery',
          variants: [],
          colorVariants: [],
          heroImage,
          gallery,
          isActive: true,
          status: 'published'
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
        
        // Process images for simple product
        const { heroImage, gallery } = await processProductImages(row, productId);
        
        const baseProduct = {
          name: row.name || row.Name,
          slug: (row.name || row.Name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: (row.description || row.Description || '').replace(/<[^>]*>/g, '').substring(0, 500) || 'No description available',
          category: 'fragrance',
          type: 'fragrance',
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
          heroImage,
          gallery,
          isActive: true,
          status: 'published'
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
          
          // Process images for variant (if any)
          const variantImages = extractImageUrls(row);
          
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
            images: variantImages.slice(0, 3) // Limit variant images
          };
          
          parentProduct.variants.push(variant);
        }
      }
    }
    
    console.log(`\\n📊 Ready to import ${productMap.size} products with images to database`);
    
    // Import to database
    let imported = 0;
    let failed = 0;
    let imagesProcessed = 0;
    
    for (const [id, productData] of productMap) {
      try {
        console.log(`📦 Importing: ${productData.name}`);
        
        // Check if product has images
        const hasHeroImage = productData.heroImage && productData.heroImage.url;
        const galleryCount = productData.gallery ? productData.gallery.length : 0;
        
        if (hasHeroImage || galleryCount > 0) {
          imagesProcessed++;
          console.log(`  📷 Product has ${galleryCount + (hasHeroImage ? 1 : 0)} images`);
          if (hasHeroImage) console.log(`    🖼️  Hero: ${productData.heroImage.url.substring(0, 80)}...`);
          if (galleryCount > 0) console.log(`    🖼️  Gallery: ${galleryCount} images`);
        } else {
          console.log(`  ⚠️  No images for this product`);
        }
        
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
    
    console.log('\\n🎉 Import Complete with Images!');
    console.log(`✅ Successfully imported: ${imported} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`📸 Products with images: ${imagesProcessed}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🔌 Closing database connection...');
    process.exit(0);
  }
}

importProductsWithImages();