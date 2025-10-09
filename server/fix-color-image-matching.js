import mongoose from 'mongoose';
import Product from './src/modules/product/product.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

/**
 * Smart color-image matching based on image URLs and file names
 */
async function fixColorImageMismatch() {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully');
    
    // Find jewelry products with colorVariants and multiple images
    const products = await Product.find({
      colorVariants: { $exists: true, $ne: [] },
      $or: [
        { 'heroImage.url': { $exists: true } },
        { 'heroImage': { $type: 'string', $ne: '' } },
        { 'gallery.0': { $exists: true } }
      ]
    });

    console.log(`\n📦 Found ${products.length} products with color variants`);
    
    let updatedCount = 0;

    for (const product of products) {
      console.log(`\n🔧 Processing: ${product.name}`);
      
      // Collect all available images with metadata
      const availableImages = [];
      
      // Add hero image
      if (product.heroImage) {
        let imageUrl = '';
        let fileId = '';
        
        if (typeof product.heroImage === 'string') {
          imageUrl = product.heroImage;
        } else if (product.heroImage.url) {
          imageUrl = product.heroImage.url;
          fileId = product.heroImage.fileId || '';
        }
        
        if (imageUrl) {
          availableImages.push({
            url: imageUrl,
            fileId,
            source: 'hero',
            fileName: extractFileName(imageUrl)
          });
        }
      }
      
      // Add gallery images
      if (product.gallery && Array.isArray(product.gallery)) {
        product.gallery.forEach((img, index) => {
          let imageUrl = '';
          let fileId = '';
          
          if (typeof img === 'string') {
            imageUrl = img;
          } else if (img?.url) {
            imageUrl = img.url;
            fileId = img.fileId || '';
          }
          
          if (imageUrl) {
            availableImages.push({
              url: imageUrl,
              fileId,
              source: `gallery-${index}`,
              fileName: extractFileName(imageUrl)
            });
          }
        });
      }
      
      console.log(`   📸 Available images: ${availableImages.length}`);
      
      if (availableImages.length === 0) {
        console.log('   ⏩ No images to assign');
        continue;
      }
      
      // Show current image assignments
      console.log('   🎨 Current color variants:');
      product.colorVariants.forEach(cv => {
        console.log(`      ${cv.name} (${cv.code}) → ${cv.heroImage?.url ? 'Has image' : 'No image'}`);
      });
      
      let productUpdated = false;
      
      // Smart matching for each color variant
      for (const colorVariant of product.colorVariants) {
        console.log(`\n   🔍 Finding best image for ${colorVariant.name}...`);
        
        const bestMatch = findBestImageMatch(colorVariant, availableImages);
        
        if (bestMatch) {
          // Update the color variant with the best matching image
          colorVariant.heroImage = {
            url: bestMatch.url,
            fileId: bestMatch.fileId || `${colorVariant.code}_${product._id}_${Date.now()}`
          };
          
          console.log(`      ✅ Matched with: ${bestMatch.source} (${bestMatch.fileName})`);
          console.log(`      📝 Reason: ${bestMatch.reason}`);
          productUpdated = true;
        } else {
          console.log(`      ⚠️  No good match found, keeping current assignment`);
        }
      }
      
      if (productUpdated) {
        await product.save();
        updatedCount++;
        console.log(`   ✅ Updated product with better color-image matching`);
      }
    }

    console.log(`\n🎉 Processing complete!`);
    console.log(`📊 Updated ${updatedCount} products with better color-image matching`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from database');
  }
}

/**
 * Extract file name from URL for analysis
 */
function extractFileName(url) {
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  } catch (error) {
    return '';
  }
}

/**
 * Find the best matching image for a color variant
 */
function findBestImageMatch(colorVariant, availableImages) {
  const colorName = colorVariant.name.toLowerCase();
  const colorCode = colorVariant.code.toLowerCase();
  
  // Define color keywords for matching
  const colorKeywords = {
    'white': ['white', 'silver', 'platinum', 'w_g', 'wg', 'white_gold', 'whitegold'],
    'yellow': ['yellow', 'gold', 'y_g', 'yg', 'yellow_gold', 'yellowgold'],
    'rose': ['rose', 'pink', 'r_g', 'rg', 'rose_gold', 'rosegold'],
    'silver': ['silver', 'white', 'platinum', 'sterling'],
    'gold': ['gold', 'yellow', 'golden'],
    'platinum': ['platinum', 'white', 'silver']
  };
  
  // Get keywords for this color
  let relevantKeywords = [];
  for (const [key, keywords] of Object.entries(colorKeywords)) {
    if (colorName.includes(key) || colorCode.includes(key)) {
      relevantKeywords = [...relevantKeywords, ...keywords];
    }
  }
  
  // If no specific keywords found, use the color name itself
  if (relevantKeywords.length === 0) {
    relevantKeywords = [colorName, colorCode];
  }
  
  console.log(`      🔎 Looking for keywords: ${relevantKeywords.join(', ')}`);
  
  // Score each image based on how well it matches
  const scoredImages = availableImages.map(img => {
    const urlLower = img.url.toLowerCase();
    const fileNameLower = img.fileName.toLowerCase();
    
    let score = 0;
    let matchedKeywords = [];
    
    // Check for keyword matches in URL and filename
    relevantKeywords.forEach(keyword => {
      if (urlLower.includes(keyword)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
      if (fileNameLower.includes(keyword)) {
        score += 15; // Filename matches are more reliable
        matchedKeywords.push(keyword + '(filename)');
      }
    });
    
    // Bonus for multiple keyword matches
    if (matchedKeywords.length > 1) {
      score += 5;
    }
    
    return {
      ...img,
      score,
      matchedKeywords,
      reason: matchedKeywords.length > 0 
        ? `Matched keywords: ${matchedKeywords.join(', ')}` 
        : 'No keyword match'
    };
  });
  
  // Sort by score (highest first)
  scoredImages.sort((a, b) => b.score - a.score);
  
  // Return the best match if it has a positive score
  const bestMatch = scoredImages[0];
  
  if (bestMatch && bestMatch.score > 0) {
    return bestMatch;
  }
  
  // If no keyword matches, try pattern matching based on image order and color order
  console.log(`      🔄 No keyword matches, using fallback strategy...`);
  
  // Fallback: assign based on color priority
  const colorPriority = {
    'white_gold': 0,
    'white': 0,
    'silver': 0,
    'yellow_gold': 1, 
    'yellow': 1,
    'gold': 1,
    'rose_gold': 2,
    'rose': 2,
    'pink': 2
  };
  
  const priority = colorPriority[colorCode] ?? colorPriority[colorName] ?? 0;
  
  if (availableImages[priority]) {
    return {
      ...availableImages[priority],
      reason: `Fallback: Position ${priority + 1} for ${colorVariant.name}`
    };
  }
  
  return null;
}

// Run the script
fixColorImageMismatch();