import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Product Schema (matching your actual schema)
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

async function checkProductImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({}).lean();
    console.log(`Total Products: ${products.length}\n`);

    let productsWithIssues = [];
    let productsOk = [];

    for (const product of products) {
      let issues = [];
      
      // Check main product images
      if (!product.images || product.images.length === 0) {
        issues.push('No main images');
      } else {
        // Check if images are placeholder or empty
        const hasValidImages = product.images.some(img => 
          img && 
          img.trim() !== '' && 
          !img.includes('placeholder') &&
          !img.includes('via.placeholder')
        );
        if (!hasValidImages) {
          issues.push('Only placeholder/invalid main images');
        }
      }

      // Check variant images
      if (product.variants && product.variants.length > 0) {
        const variantsWithoutImages = product.variants.filter(v => 
          !v.images || v.images.length === 0
        );
        if (variantsWithoutImages.length > 0) {
          issues.push(`${variantsWithoutImages.length} variants without images`);
        }

        const variantsWithPlaceholder = product.variants.filter(v => 
          v.images && v.images.length > 0 && 
          v.images.every(img => !img || img.includes('placeholder') || img.includes('via.placeholder'))
        );
        if (variantsWithPlaceholder.length > 0) {
          issues.push(`${variantsWithPlaceholder.length} variants with only placeholder images`);
        }
      }

      // Check color variants
      if (product.colorVariants && product.colorVariants.length > 0) {
        const colorVariantsWithoutImages = product.colorVariants.filter(cv => 
          !cv.images || cv.images.length === 0
        );
        if (colorVariantsWithoutImages.length > 0) {
          issues.push(`${colorVariantsWithoutImages.length} color variants without images`);
        }
      }

      const productInfo = {
        id: product._id,
        name: product.name,
        type: product.type,
        category: product.category,
        mainImages: product.images?.length || 0,
        variants: product.variants?.length || 0,
        colorVariants: product.colorVariants?.length || 0,
        issues: issues
      };

      if (issues.length > 0) {
        productsWithIssues.push(productInfo);
      } else {
        productsOk.push(productInfo);
      }
    }

    // Print summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    IMAGE VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`✅ Products with valid images: ${productsOk.length}`);
    console.log(`⚠️  Products with image issues: ${productsWithIssues.length}\n`);

    if (productsOk.length > 0) {
      console.log('✅ PRODUCTS WITH VALID IMAGES:');
      console.log('─────────────────────────────────────────────────────────');
      productsOk.forEach((p, index) => {
        console.log(`\n${index + 1}. ${p.name}`);
        console.log(`   Type: ${p.type} | Category: ${p.category}`);
        console.log(`   Main Images: ${p.mainImages} | Variants: ${p.variants} | Color Variants: ${p.colorVariants}`);
      });
      console.log('\n');
    }

    if (productsWithIssues.length > 0) {
      console.log('\n⚠️  PRODUCTS WITH IMAGE ISSUES:');
      console.log('─────────────────────────────────────────────────────────');
      productsWithIssues.forEach((p, index) => {
        console.log(`\n${index + 1}. ${p.name}`);
        console.log(`   Type: ${p.type} | Category: ${p.category}`);
        console.log(`   Main Images: ${p.mainImages} | Variants: ${p.variants} | Color Variants: ${p.colorVariants}`);
        console.log(`   ⚠️  Issues: ${p.issues.join(', ')}`);
      });
      console.log('\n');
    }

    // Detailed breakdown by type
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('                  BREAKDOWN BY PRODUCT TYPE');
    console.log('═══════════════════════════════════════════════════════════\n');

    const byType = products.reduce((acc, p) => {
      const type = p.type || 'unknown';
      if (!acc[type]) {
        acc[type] = { total: 0, withIssues: 0, ok: 0 };
      }
      acc[type].total++;
      
      const hasIssues = productsWithIssues.some(pi => pi.id.toString() === p._id.toString());
      if (hasIssues) {
        acc[type].withIssues++;
      } else {
        acc[type].ok++;
      }
      return acc;
    }, {});

    Object.entries(byType).forEach(([type, stats]) => {
      console.log(`${type.toUpperCase()}:`);
      console.log(`  Total: ${stats.total}`);
      console.log(`  ✅ OK: ${stats.ok}`);
      console.log(`  ⚠️  Issues: ${stats.withIssues}\n`);
    });

    // Sample of actual image paths
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('              SAMPLE IMAGE PATHS (First 3 Products)');
    console.log('═══════════════════════════════════════════════════════════\n');

    products.slice(0, 3).forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Main Images (${p.images?.length || 0}):`);
      if (p.images && p.images.length > 0) {
        p.images.slice(0, 2).forEach(img => console.log(`     - ${img}`));
      }
      if (p.variants && p.variants.length > 0) {
        console.log(`   First Variant (${p.variants[0].name}):`);
        if (p.variants[0].images && p.variants[0].images.length > 0) {
          p.variants[0].images.slice(0, 2).forEach(img => console.log(`     - ${img}`));
        }
      }
      if (p.colorVariants && p.colorVariants.length > 0) {
        console.log(`   First Color Variant (${p.colorVariants[0].color}):`);
        if (p.colorVariants[0].images && p.colorVariants[0].images.length > 0) {
          p.colorVariants[0].images.slice(0, 2).forEach(img => console.log(`     - ${img}`));
        }
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error checking product images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

checkProductImages();
