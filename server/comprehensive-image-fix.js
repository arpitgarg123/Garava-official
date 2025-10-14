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

async function comprehensiveImageFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`Total Products: ${products.length}\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('           COMPREHENSIVE IMAGE FIX - STARTING');
    console.log('═══════════════════════════════════════════════════════════\n');

    let stats = {
      mainImageFixed: 0,
      colorVariantsFixed: 0,
      alreadyOk: 0,
      failed: 0
    };

    for (const product of products) {
      console.log(`\n📦 Processing: ${product.name}`);
      console.log(`   Type: ${product.type} | Category: ${product.category}`);
      
      let needsUpdate = false;
      const updates = {};

      // STEP 1: Collect ALL images from variants
      let allVariantImages = [];
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          if (variant.images && variant.images.length > 0) {
            allVariantImages = [...allVariantImages, ...variant.images];
          }
        });
        allVariantImages = [...new Set(allVariantImages)]; // Remove duplicates
      }

      console.log(`   Found ${allVariantImages.length} unique images in variants`);

      // STEP 2: Fix main product images
      if (!product.images || product.images.length === 0) {
        if (allVariantImages.length > 0) {
          updates.images = allVariantImages;
          needsUpdate = true;
          stats.mainImageFixed++;
          console.log(`   ✓ Will add ${allVariantImages.length} images to main product`);
        } else {
          console.log(`   ⚠️  No variant images available to copy`);
        }
      } else {
        console.log(`   ✓ Main images OK (${product.images.length} images)`);
      }

      // STEP 3: Fix color variant images (for jewellery)
      if (product.type === 'jewellery' && product.colorVariants && product.colorVariants.length > 0) {
        const fixedColorVariants = [];
        let colorVariantFixed = false;

        for (const cv of product.colorVariants) {
          if (!cv.images || cv.images.length === 0) {
            // Match images by color code in filename
            let matchedImages = [];
            
            if (cv.color === 'Rose Gold') {
              matchedImages = allVariantImages.filter(img => 
                img.includes('-RG') || img.includes('rose') || img.includes('Rose')
              );
            } else if (cv.color === 'Yellow Gold') {
              matchedImages = allVariantImages.filter(img => 
                img.includes('-YG') || img.includes('yellow') || img.includes('Yellow')
              );
            } else if (cv.color === 'White Gold') {
              matchedImages = allVariantImages.filter(img => 
                img.includes('-WG') || img.includes('white') || img.includes('White')
              );
            } else if (cv.color === 'Silver') {
              matchedImages = allVariantImages.filter(img => 
                img.includes('silver') || img.includes('Silver') || img.includes('-WG')
              );
            }

            // If no specific match, use first available image as fallback
            if (matchedImages.length === 0 && allVariantImages.length > 0) {
              matchedImages = [allVariantImages[0]];
              console.log(`   ⚠️  No specific images for ${cv.color}, using fallback`);
            }

            if (matchedImages.length > 0) {
              fixedColorVariants.push({
                color: cv.color,
                images: matchedImages
              });
              colorVariantFixed = true;
              console.log(`   ✓ Color variant '${cv.color}': Added ${matchedImages.length} images`);
            } else {
              fixedColorVariants.push(cv);
              console.log(`   ⚠️  Color variant '${cv.color}': No images found`);
            }
          } else {
            fixedColorVariants.push(cv);
            console.log(`   ✓ Color variant '${cv.color}': Already has ${cv.images.length} images`);
          }
        }

        if (colorVariantFixed) {
          updates.colorVariants = fixedColorVariants;
          needsUpdate = true;
          stats.colorVariantsFixed++;
        }
      }

      // STEP 4: Apply updates
      if (needsUpdate) {
        try {
          await Product.updateOne({ _id: product._id }, { $set: updates });
          console.log(`   ✅ Successfully updated`);
        } catch (error) {
          console.error(`   ❌ Failed to update: ${error.message}`);
          stats.failed++;
        }
      } else {
        console.log(`   ⏭️  No updates needed`);
        stats.alreadyOk++;
      }
    }

    // Final Summary
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                  FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Products Processed: ${products.length}`);
    console.log(`✅ Main Images Fixed: ${stats.mainImageFixed}`);
    console.log(`✅ Color Variants Fixed: ${stats.colorVariantsFixed}`);
    console.log(`⏭️  Already OK: ${stats.alreadyOk}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

comprehensiveImageFix();
