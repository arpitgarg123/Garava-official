import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  type: String,
  category: String,
  images: [String],
  variants: [{
    name: String,
    images: [String],
    price: Number,
    isPriceOnDemand: Boolean
  }],
  colorVariants: [{
    color: String,
    images: [String]
  }]
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

async function fixProductImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`Total Products: ${products.length}\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errors = [];

    for (const product of products) {
      try {
        let updateNeeded = false;
        const updates = {};

        // 1. Fix main product images - copy from first variant
        if ((!product.images || product.images.length === 0) && 
            product.variants && 
            product.variants.length > 0 && 
            product.variants[0].images && 
            product.variants[0].images.length > 0) {
          
          updates.images = product.variants[0].images;
          updateNeeded = true;
          console.log(`✓ ${product.name}: Adding ${product.variants[0].images.length} main images from variant`);
        }

        // 2. Fix color variant images for jewellery products
        if (product.type === 'jewellery' && 
            product.colorVariants && 
            product.colorVariants.length > 0 && 
            product.variants && 
            product.variants.length > 0) {
          
          const colorVariantsNeedingImages = product.colorVariants.filter(cv => 
            !cv.images || cv.images.length === 0
          );

          if (colorVariantsNeedingImages.length > 0) {
            // Create a map of color to variant images
            const colorImageMap = {
              'Rose Gold': [],
              'Yellow Gold': [],
              'White Gold': [],
              'Silver': []
            };

            // Collect images from variants based on naming pattern
            product.variants.forEach(variant => {
              if (variant.images && variant.images.length > 0) {
                variant.images.forEach(img => {
                  if (img.includes('-RG') || img.includes('Rose')) {
                    colorImageMap['Rose Gold'].push(img);
                  } else if (img.includes('-YG') || img.includes('Yellow')) {
                    colorImageMap['Yellow Gold'].push(img);
                  } else if (img.includes('-WG') || img.includes('White')) {
                    colorImageMap['White Gold'].push(img);
                  } else {
                    // Default to all colors if pattern not found
                    colorImageMap['Rose Gold'].push(img);
                    colorImageMap['Yellow Gold'].push(img);
                    colorImageMap['White Gold'].push(img);
                  }
                });
              }
            });

            // Update color variants with matched images
            updates.colorVariants = product.colorVariants.map(cv => {
              if (!cv.images || cv.images.length === 0) {
                const matchedImages = colorImageMap[cv.color] || [];
                if (matchedImages.length > 0) {
                  console.log(`  ✓ Color variant ${cv.color}: Adding ${matchedImages.length} images`);
                  return { ...cv.toObject(), images: [...new Set(matchedImages)] }; // Remove duplicates
                }
              }
              return cv;
            });
            updateNeeded = true;
          }
        }

        // Apply updates if needed
        if (updateNeeded) {
          await Product.updateOne(
            { _id: product._id },
            { $set: updates }
          );
          updatedCount++;
          console.log(`✅ Updated: ${product.name}\n`);
        } else {
          skippedCount++;
        }

      } catch (error) {
        errors.push({ product: product.name, error: error.message });
        console.error(`❌ Error updating ${product.name}:`, error.message);
      }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('                    FIX SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Products: ${products.length}`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⏭️  Skipped (already OK): ${skippedCount}`);
    console.log(`❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(err => {
        console.log(`  - ${err.product}: ${err.error}`);
      });
    }

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixProductImages();
