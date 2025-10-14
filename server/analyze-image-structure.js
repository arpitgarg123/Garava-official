import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  variants: [{
    name: String,
    images: [String]
  }],
  colorVariants: [{
    color: String,
    images: [String]
  }]
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

async function analyzeImageStructure() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({}).limit(3);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('              IMAGE STRUCTURE ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════\n');

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log('─────────────────────────────────────────────────────────');
      
      console.log('\n📸 Main Product Images:');
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, i) => {
          console.log(`   ${i + 1}. ${img}`);
        });
      } else {
        console.log('   ❌ NONE');
      }

      console.log('\n🎨 Variants:');
      if (product.variants && product.variants.length > 0) {
        product.variants.slice(0, 2).forEach((variant, i) => {
          console.log(`\n   Variant ${i + 1}: ${variant.name || 'Unnamed'}`);
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach((img, j) => {
              console.log(`     ${j + 1}. ${img}`);
            });
          } else {
            console.log('     ❌ No images');
          }
        });
      } else {
        console.log('   ❌ No variants');
      }

      console.log('\n🌈 Color Variants:');
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach((cv, i) => {
          console.log(`\n   Color ${i + 1}: ${cv.color}`);
          if (cv.images && cv.images.length > 0) {
            cv.images.forEach((img, j) => {
              console.log(`     ${j + 1}. ${img}`);
            });
          } else {
            console.log('     ❌ No images');
          }
        });
      } else {
        console.log('   ❌ No color variants');
      }
    });

    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('                   KEY FINDINGS');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Check if images are from ImageKit or external
    const allImageUrls = [];
    products.forEach(p => {
      if (p.images) allImageUrls.push(...p.images);
      if (p.variants) {
        p.variants.forEach(v => {
          if (v.images) allImageUrls.push(...v.images);
        });
      }
    });

    const imagekitImages = allImageUrls.filter(url => url.includes('imagekit.io'));
    const externalImages = allImageUrls.filter(url => !url.includes('imagekit.io'));

    console.log(`📊 Image Source Analysis:`);
    console.log(`   ImageKit URLs: ${imagekitImages.length}`);
    console.log(`   External URLs: ${externalImages.length}`);
    
    if (imagekitImages.length > 0) {
      console.log(`\n   Sample ImageKit URL: ${imagekitImages[0]}`);
    }
    if (externalImages.length > 0) {
      console.log(`   Sample External URL: ${externalImages[0]}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n\nDatabase connection closed');
  }
}

analyzeImageStructure();
