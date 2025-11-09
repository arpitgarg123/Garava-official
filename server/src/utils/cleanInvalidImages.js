/**
 * Utility to clean invalid image URLs from products
 * This script validates image URLs and removes 404s from gallery arrays
 */

const mongoose = require('mongoose');
const https = require('https');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/garava';

// Function to check if an image URL is valid (returns 200)
async function validateImageUrl(url) {
  return new Promise((resolve) => {
    try {
      const urlString = typeof url === 'object' ? url.url : url;
      if (!urlString || !urlString.startsWith('http')) {
        resolve(false);
        return;
      }

      https.get(urlString, { timeout: 5000 }, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => {
        resolve(false);
      }).on('timeout', () => {
        resolve(false);
      });
    } catch (error) {
      resolve(false);
    }
  });
}

async function cleanProductImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    // Get all products with galleries
    const products = await Product.find({ gallery: { $exists: true, $ne: [] } }).lean();
    console.log(`\nFound ${products.length} products with galleries\n`);

    let totalCleaned = 0;
    let totalImagesRemoved = 0;

    for (const product of products) {
      const originalGallery = product.gallery || [];
      if (originalGallery.length === 0) continue;

      console.log(`\nChecking: ${product.name} (${originalGallery.length} images)`);
      
      const validImages = [];
      const invalidImages = [];

      // Validate each image
      for (let i = 0; i < originalGallery.length; i++) {
        const imageUrl = typeof originalGallery[i] === 'object' ? originalGallery[i].url : originalGallery[i];
        process.stdout.write(`  Image ${i + 1}/${originalGallery.length}: Checking... `);
        
        const isValid = await validateImageUrl(imageUrl);
        
        if (isValid) {
          validImages.push(originalGallery[i]);
          process.stdout.write('✓ Valid\n');
        } else {
          invalidImages.push(imageUrl);
          process.stdout.write('✗ Invalid (404)\n');
        }
      }

      // Update product if invalid images were found
      if (invalidImages.length > 0) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { gallery: validImages } }
        );
        
        totalCleaned++;
        totalImagesRemoved += invalidImages.length;
        
        console.log(`  → Removed ${invalidImages.length} invalid images`);
        console.log(`  → Kept ${validImages.length} valid images`);
      } else {
        console.log(`  → All images valid ✓`);
      }
    }

    console.log(`\n========================================`);
    console.log(`Cleanup Summary:`);
    console.log(`  Products cleaned: ${totalCleaned}`);
    console.log(`  Invalid images removed: ${totalImagesRemoved}`);
    console.log(`========================================\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  cleanProductImages();
}

module.exports = { validateImageUrl, cleanProductImages };
