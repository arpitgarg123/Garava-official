import { toPaise } from '../modules/order/order.pricing.js';
import ImageDownloader from './imageDownloader.js';
import ImageKitUploader from './imageKitUploader.js';

/**
 * WooCommerce to Garava Product Schema Mapper with Image Processing
 * Transforms parsed CSV data into MongoDB product documents with automatic image download and upload
 */
class WooCommerceMapper {
  constructor(options = {}) {
    this.processed = 0;
    this.skipped = 0;
    this.errors = [];
    
    // Image processing options
    this.processImages = options.processImages !== false; // Default to true
    this.imageDownloader = new ImageDownloader();
    this.imageUploader = new ImageKitUploader();
    
    // Image processing stats
    this.imageStats = {
      totalProducts: 0,
      productsWithImages: 0,
      totalImageUrls: 0,
      successfulDownloads: 0,
      successfulUploads: 0,
      imageErrors: []
    };
  }

  /**
   * Transform CSV data to product documents with image processing
   * @param {Array} csvData - Parsed CSV data from CSVParser
   * @returns {Object} Mapped products with variants and processed images
   */
  async transformProducts(csvData) {
    const productMap = new Map(); // Group variants by parent product
    const results = {
      products: [],
      variants: [],
      errors: [],
      skipped: 0,
      imageStats: {}
    };

    console.log(`\n🔄 Transforming ${csvData.length} products with image processing...`);

    // First pass: Process parent products (variable type)
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'variable') {
        try {
          this.processed++;
          console.log(`\n📦 Processing parent product ${index + 1}/${csvData.length}: ${row.name || row.Name}`);
          await this.processMainProduct(row, productMap);
        } catch (error) {
          this.errors.push({
            row: index + 1,
            sku: row.sku || row.SKU,
            error: error.message,
            data: row
          });
          console.error(`❌ Error processing parent ${index + 1}:`, error.message);
        }
      }
    }

    // Second pass: Process simple products
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'simple') {
        try {
          this.processed++;
          console.log(`\n📦 Processing simple product ${index + 1}/${csvData.length}: ${row.name || row.Name}`);
          await this.processMainProduct(row, productMap);
        } catch (error) {
          this.errors.push({
            row: index + 1,
            sku: row.sku || row.SKU,
            error: error.message,
            data: row
          });
          console.error(`❌ Error processing simple ${index + 1}:`, error.message);
        }
      }
    }

    // Third pass: Process variation products (child variants)
    for (let index = 0; index < csvData.length; index++) {
      const row = csvData[index];
      const productType = row.type || row.Type;
      
      if (productType === 'variation') {
        try {
          this.processed++;
          console.log(`\n📦 Processing variation ${index + 1}/${csvData.length}: ${row.name || row.Name}`);
          
          const parentSku = this.getParentSku(row);
          if (parentSku) {
            await this.processVariant(row, parentSku, productMap);
          } else {
            throw new Error('Variation product without parent reference');
          }
        } catch (error) {
          this.errors.push({
            row: index + 1,
            sku: row.sku || row.SKU,
            error: error.message,
            data: row
          });
          console.error(`❌ Error processing variation ${index + 1}:`, error.message);
        }
      }
    }

    // Convert productMap to final products array
    results.products = Array.from(productMap.values());
    results.errors = this.errors;
    results.skipped = this.skipped;
    results.processed = this.processed;
    results.imageStats = this.getImageStats();

    console.log(`\n✅ Transformation complete: ${results.products.length} products created`);
    return results;
  }

  /**
   * Process main product entry with image handling
   */
  async processMainProduct(row, productMap) {
    const slug = this.generateSlug(row.name || row.Name);
    const productId = row.sku || row.SKU || slug;

    // Create or update product
    if (!productMap.has(productId)) {
      const baseProduct = await this.createBaseProduct(row);
      productMap.set(productId, baseProduct);
    }

    const product = productMap.get(productId);
    
    // Add main variant - only for simple products or products with pricing
    const productType = row.type || row.Type || 'simple';
    
    // Skip variant creation for variable parent products (they get variants from their children)
    if (productType === 'simple') {
      const variant = this.createVariant(row, true); // isDefault = true
      product.variants.push(variant);
    } else if (productType === 'variable' && (row.regularPrice || row['Regular price'] || row.salePrice || row['Sale price'])) {
      // Variable product with direct pricing (rare case)
      const variant = this.createVariant(row, true);
      product.variants.push(variant);
    }

    // Process attributes for color variants
    this.processColorAttributes(row, product);
  }

  /**
   * Process variant product entry
   */
  async processVariant(row, parentSku, productMap) {
    if (!productMap.has(parentSku)) {
      // Create parent product if doesn't exist
      const baseProduct = await this.createBaseProduct(row, parentSku);
      productMap.set(parentSku, baseProduct);
    }

    const product = productMap.get(parentSku);
    const variant = this.createVariant(row, false);
    product.variants.push(variant);
  }

  /**
   * Create base product structure with image processing
   */
  async createBaseProduct(row, customSku = null) {
    const categories = this.parseCategories(row.categories || row.Categories);
    const productSku = customSku || row.sku || row.SKU;
    
    // Process images if enabled
    let heroImage = { url: null, fileId: null };
    let gallery = [];
    
    if (this.processImages) {
      console.log(`📸 Processing images for: ${productSku}`);
      this.imageStats.totalProducts++;
      
      try {
        // Download images
        const imageData = await this.imageDownloader.processProductImages(row);
        
        if (imageData.downloadedFiles && imageData.downloadedFiles.length > 0) {
          this.imageStats.productsWithImages++;
          this.imageStats.totalImageUrls += imageData.totalImages || 0;
          this.imageStats.successfulDownloads += imageData.successfulDownloads || 0;
          
          // Upload to ImageKit
          const uploadResult = await this.imageUploader.processProductImages(imageData, productSku);
          
          if (uploadResult.heroImage && uploadResult.heroImage.url) {
            heroImage = uploadResult.heroImage;
            gallery = uploadResult.gallery || [];
            this.imageStats.successfulUploads += uploadResult.totalUploaded || 0;
            
            console.log(`✅ Images processed: 1 hero + ${gallery.length} gallery images`);
          } else {
            console.log(`⚠️  No images uploaded for ${productSku}`);
            if (uploadResult.error) {
              this.imageStats.imageErrors.push({
                product: productSku,
                error: uploadResult.error
              });
            }
          }
        } else {
          console.log(`ℹ️  No images found for ${productSku}`);
        }
      } catch (error) {
        console.error(`❌ Image processing failed for ${productSku}:`, error.message);
        this.imageStats.imageErrors.push({
          product: productSku,
          error: error.message
        });
      }
    }
    
    return {
      // Basic info
      name: row.name || row.Name,
      type: this.mapProductType(row, categories),
      slug: this.generateSlug(row.name || row.Name),
      sku: productSku,
      gtin: row.gtin || row.GTIN,
      
      // Categories
      category: categories.primary,
      subcategory: categories.subcategory,
      tags: this.parseTags(row.tags || row.Tags),
      
      // Descriptions
      shortDescription: this.cleanDescription(row.shortDescription || row['Short description']),
      description: this.cleanDescription(row.description || row.Description),
      
      // Physical properties
      physicalDimensions: {
        length: this.parseNumber(row.length || row.Length || row['Length (cm)']),
        width: this.parseNumber(row.width || row.Width || row['Width (cm)']),
        height: this.parseNumber(row.height || row.Height || row['Height (cm)']),
        weight: this.parseNumber(row.weight || row.Weight || row['Weight (kg)'])
      },
      
      // Pricing (product-level)
      salePrice: this.parsePrice(row.salePrice || row['Sale price']),
      taxStatus: this.mapTaxStatus(row.taxStatus || row['Tax status']),
      taxClass: row.taxClass || row['Tax class'] || 'standard',
      
      // Status & visibility
      status: 'published',
      isActive: true,
      visibility: this.mapVisibility(row.visibility || row['Visibility in catalog']),
      isFeatured: this.parseBoolean(row.featured || row['Is featured?']),
      
      // Images (processed above)
      heroImage: heroImage,
      gallery: gallery,
      
      // Color variants (populated from attributes)
      colorVariants: [],
      
      // Default structures
      variants: [],
      fragranceNotes: { top: [], middle: [], base: [] },
      shippingInfo: {
        complementary: false,
        codAvailable: true,
        pincodeRestrictions: false
      },
      
      // SEO
      metaTitle: row.metaTitle || row['Meta title'],
      metaDescription: row.metaDescription || row['Meta description'],
      
      // Audit
      createdBy: null, // Will be set by API
      updatedBy: null,
      
      // Source tracking
      _importSource: 'woocommerce_csv',
      _originalData: row
    };
  }

  /**
   * Create product variant
   */
  createVariant(row, isDefault = false) {
    // Generate size label from attributes or default
    const sizeLabel = this.extractSizeLabel(row) || 'Standard';
    const regularPrice = this.parsePrice(row.regularPrice || row['Regular price']);
    const salePrice = this.parsePrice(row.salePrice || row['Sale price']);
    
    // For products without pricing, check if they should be "Price on Demand" (jewelry category)
    const isPriceOnDemand = !regularPrice && !salePrice && this.isJewelryCategory(row);
    
    return {
      sku: row.sku || row.SKU || `${row.name || row.Name}-${sizeLabel}`.toLowerCase().replace(/\s+/g, '-'),
      sizeLabel: sizeLabel,
      price: regularPrice ? toPaise(regularPrice) : (isPriceOnDemand ? 0 : 0), // 0 for price on demand or no price
      mrp: regularPrice ? toPaise(regularPrice) : null,
      salePrice: salePrice ? toPaise(salePrice) : null,
      isPriceOnDemand: isPriceOnDemand,
      priceOnDemandText: isPriceOnDemand ? "Price on Demand" : undefined,
      stock: this.parseNumber(row.stock || row.Stock || row['Stock quantity']) || 0,
      stockStatus: this.mapStockStatus(row.stockStatus || row['In stock?']),
      weight: this.parseNumber(row.weight || row.Weight || row['Weight (kg)']),
      images: [], // Individual variant images would go here
      isActive: true,
      isDefault: isDefault,
      purchaseLimit: 0,
      leadTimeDays: 0
    };
  }

  /**
   * Clean and format description text
   * @param {string} description - Raw description text
   * @returns {string} Cleaned description
   */
  cleanDescription(description) {
    if (!description) return '';
    
    return description
      // Replace \n with actual line breaks
      .replace(/\\n/g, '\n')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Replace multiple line breaks with double line breaks (paragraph breaks)
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  }

  /**
   * Process color attributes into colorVariants with enhanced color support and smart image matching
   */
  processColorAttributes(row, product) {
    // Look for color attributes in WooCommerce format
    const colorAttr = this.findAttributeByName(row, 'color') || 
                     this.findAttributeByName(row, 'colour') ||
                     this.findAttributeByName(row, 'gold color') ||
                     this.findAttributeByName(row, 'metal color');
    
    if (colorAttr && colorAttr.values) {
      colorAttr.values.forEach((colorName, index) => {
        const colorVariant = {
          name: colorName.trim(),
          code: this.normalizeColorCode(colorName.trim()),
          hexColor: this.getColorHex(colorName.trim()),
          isAvailable: true,
          priority: index, // Order based on CSV position
          stockStatus: "in_stock",
          heroImage: null, // Will be set by image matching
          gallery: [] // Will be populated by image matching
        };
        
        // Add if not already exists
        const exists = product.colorVariants.find(cv => cv.code === colorVariant.code);
        if (!exists) {
          product.colorVariants.push(colorVariant);
        }
      });
    }
    
    // For jewelry products without color attributes, add default gold variants
    if (product.colorVariants.length === 0 && this.isJewelryCategory(row)) {
      const defaultColors = [
        { name: "White Gold", code: "white_gold", hexColor: "#F5F5DC", priority: 0 },
        { name: "Yellow Gold", code: "yellow_gold", hexColor: "#FFD700", priority: 1 },
        { name: "Rose Gold", code: "rose_gold", hexColor: "#E8B4B8", priority: 2 }
      ];
      
      defaultColors.forEach(color => {
        product.colorVariants.push({
          ...color,
          isAvailable: true,
          stockStatus: "in_stock",
          heroImage: null,
          gallery: []
        });
      });
    }

    // Apply smart color-image matching after colors are processed
    if (product.colorVariants.length > 0) {
      this.applyColorImageMatching(product);
    }
  }

  /**
   * Normalize color code to match our database schema
   */
  normalizeColorCode(colorName) {
    const normalized = colorName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    
    // Map common variations to standard codes
    const colorCodeMap = {
      'white_gold': 'white_gold',
      'whitegold': 'white_gold', 
      'white': 'white_gold',
      'silver': 'silver',
      'platinum': 'silver',
      'yellow_gold': 'yellow_gold',
      'yellowgold': 'yellow_gold',
      'gold': 'yellow_gold',
      'yellow': 'yellow_gold',
      'rose_gold': 'rose_gold',
      'rosegold': 'rose_gold',
      'rose': 'rose_gold',
      'pink': 'rose_gold',
      'original': 'original'
    };
    
    return colorCodeMap[normalized] || normalized;
  }

  /**
   * Apply smart color-image matching logic
   */
  applyColorImageMatching(product) {
    if (!product.heroImage && !product.gallery) return;
    
    // Combine all available images
    const allImages = [];
    if (product.heroImage) {
      allImages.push({ ...product.heroImage, type: 'hero' });
    }
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img, index) => {
        allImages.push({ ...img, type: 'gallery', galleryIndex: index });
      });
    }
    
    if (allImages.length === 0) return;
    
    // Color keyword mappings for smart matching
    const colorKeywords = {
      white_gold: ['wg_', '_wg_', '_wg.', 'white', 'silver', 'platinum', 'whitegold', 'white_gold', 'w_g'],
      yellow_gold: ['yg_', '_yg_', '_yg.', 'yellow', 'gold', 'golden', 'yellowgold', 'yellow_gold', 'y_g'],
      rose_gold: ['rg_', '_rg_', '_rg.', 'rose', 'pink', 'rosegold', 'rose_gold', 'r_g'],
      silver: ['wg_', '_wg_', '_wg.', 'white', 'silver', 'platinum', 'sterling'],
      original: ['original', 'main', 'primary']
    };
    
    // Position-based fallback priorities
    const positionPriority = {
      white_gold: 0,
      yellow_gold: 1,
      rose_gold: 2,
      silver: 0,
      original: 0
    };
    
    // Match each color variant with best image
    product.colorVariants.forEach((color, colorIndex) => {
      const keywords = colorKeywords[color.code] || [];
      let bestMatch = null;
      let bestScore = -1;
      let matchMethod = 'none';
      
      // Try keyword matching first
      for (const image of allImages) {
        const imageUrl = image.url?.toLowerCase() || '';
        let score = 0;
        
        for (const keyword of keywords) {
          if (imageUrl.includes(keyword.toLowerCase())) {
            score += keyword.length > 2 ? 10 : 5;
          }
        }
        
        // Bonus for position-based matching in filename patterns
        if (imageUrl.includes('_01_') && positionPriority[color.code] === 0) score += 3;
        if (imageUrl.includes('_02_') && positionPriority[color.code] === 1) score += 3;
        if (imageUrl.includes('_03_') && positionPriority[color.code] === 2) score += 3;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = image;
          matchMethod = 'keyword';
        }
      }
      
      // Fallback to position-based matching
      if (bestScore <= 0) {
        const preferredPosition = positionPriority[color.code] || colorIndex;
        if (allImages[preferredPosition]) {
          bestMatch = allImages[preferredPosition];
          bestScore = 1;
          matchMethod = 'position';
        } else if (allImages[0]) {
          bestMatch = allImages[0];
          bestScore = 0;
          matchMethod = 'fallback';
        }
      }
      
      // Apply the best match
      if (bestMatch) {
        color.heroImage = {
          url: bestMatch.url,
          fileId: bestMatch.fileId
        };
        
        // Log the matching decision
        console.log(`   🎨 ${color.name}: ${bestMatch.url.split('/').pop()} (${matchMethod}, score: ${bestScore})`);
      }
    });
  }

  /**
   * Find attribute by name in WooCommerce CSV format
   */
  findAttributeByName(row, attributeName) {
    const keys = Object.keys(row);
    
    for (let i = 1; i <= 10; i++) { // Check up to 10 attributes
      const nameKey = `Attribute ${i} name`;
      const valueKey = `Attribute ${i} value(s)`;
      
      if (row[nameKey] && row[nameKey].toLowerCase().includes(attributeName.toLowerCase())) {
        const values = row[valueKey] ? String(row[valueKey]).split(',').map(v => v.trim()).filter(v => v) : [];
        return {
          name: row[nameKey],
          values: values
        };
      }
    }
    
    return null;
  }

  // Helper methods (parsing, mapping, etc.)
  isJewelryCategory(row) {
    const categories = row.categories || row.Categories || '';
    const jewelryKeywords = ['ring', 'earring', 'pendant', 'necklace', 'bracelet', 'jewelry', 'jewellery', 'diamond', 'gold'];
    return jewelryKeywords.some(keyword => categories.toLowerCase().includes(keyword.toLowerCase()));
  }

  parsePrice(value) {
    if (!value || value === '') return null;
    const price = parseFloat(String(value).replace(/[^\d.]/g, ''));
    return isNaN(price) ? null : price;
  }

  parseNumber(value) {
    if (!value || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  parseBoolean(value) {
    if (!value) return false;
    const str = String(value).toLowerCase();
    return str === 'true' || str === '1' || str === 'yes' || str === 'on';
  }

  parseTags(value) {
    if (!value) return [];
    return String(value).split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  parseCategories(categories) {
    if (!categories) {
      return { primary: 'other', subcategory: null };
    }
    
    const categoryList = Array.isArray(categories) ? categories : String(categories).split(',').map(c => c.trim());
    
    const categoryMap = {
      'fragrance': 'fragrance',
      'perfume': 'fragrance',
      'cologne': 'fragrance',
      'jewellery': 'jewellery',
      'jewelry': 'jewellery',
      'rings': 'jewellery',
      'necklaces': 'jewellery',
      'bracelets': 'jewellery',
      'earrings': 'jewellery'
    };
    
    const primary = categoryList[0] ? categoryList[0].toLowerCase() : '';
    const mappedCategory = Object.keys(categoryMap).find(key => 
      primary.includes(key)
    );
    
    return {
      primary: mappedCategory ? categoryMap[mappedCategory] : 'other',
      subcategory: categoryList[1] || null
    };
  }

  mapProductType(row, categories) {
    // Use categories to determine type
    if (categories.primary === 'fragrance') return 'fragrance';
    if (categories.primary === 'jewellery') return 'jewellery';
    
    // Check price for high jewellery indicators
    const price = this.parsePrice(row.regularPrice || row['Regular price']);
    if (price && price > 50000) {
      return 'high_jewellery';
    }
    
    return 'other';
  }

  extractSizeLabel(row) {
    // Look for size attributes
    const sizeAttr = this.findAttributeByName(row, 'size') || 
                     this.findAttributeByName(row, 'volume') || 
                     this.findAttributeByName(row, 'weight');
    
    if (sizeAttr && sizeAttr.values && sizeAttr.values.length > 0) {
      return sizeAttr.values[0];
    }
    
    // Fallback: extract from product name
    const name = row.name || row.Name || '';
    const sizeMatches = name.match(/(\d+\s*(ml|gram|g|oz|inch|in|mm|cm))/i);
    if (sizeMatches) {
      return sizeMatches[1];
    }
    
    return null;
  }

  mapStockStatus(status) {
    if (!status) return 'out_of_stock';
    const statusMap = {
      '1': 'in_stock',
      'true': 'in_stock',
      'yes': 'in_stock',
      'instock': 'in_stock',
      '0': 'out_of_stock',
      'false': 'out_of_stock',
      'no': 'out_of_stock',
      'outofstock': 'out_of_stock'
    };
    return statusMap[String(status).toLowerCase()] || 'out_of_stock';
  }

  mapTaxStatus(status) {
    if (!status) return 'taxable';
    return String(status).toLowerCase() === 'none' ? 'none' : 'taxable';
  }

  mapVisibility(visibility) {
    if (!visibility) return 'visible';
    const visibilityMap = {
      'visible': 'visible',
      'catalog': 'catalog',
      'search': 'search',
      'hidden': 'hidden'
    };
    return visibilityMap[String(visibility).toLowerCase()] || 'visible';
  }

  getColorHex(colorName) {
    const colorMap = {
      // Basic colors
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'pink': '#FFC0CB',
      'purple': '#800080',
      'orange': '#FFA500',
      'brown': '#A52A2A',
      'gray': '#808080',
      'grey': '#808080',
      
      // Enhanced metal colors for jewelry (more accurate)
      'gold': '#FFD700',
      'yellow gold': '#FFD700',
      'yellowgold': '#FFD700',
      'silver': '#C0C0C0',
      'white gold': '#F5F5DC', // Beige-white for white gold
      'whitegold': '#F5F5DC',
      'rose gold': '#E8B4B8', // Soft pink-gold
      'rosegold': '#E8B4B8',
      'platinum': '#E5E4E2',
      'copper': '#B87333',
      'bronze': '#CD7F32',
      
      // Metal quality variations
      '18k gold': '#FFD700',
      '14k gold': '#E6C200',
      '10k gold': '#D4AF37',
      '18k yellow gold': '#FFD700',
      '14k yellow gold': '#E6C200',
      '18k white gold': '#F5F5DC',
      '14k white gold': '#F0F0E6',
      '18k rose gold': '#E8B4B8',
      '14k rose gold': '#E0A9AE',
      'sterling silver': '#C0C0C0',
      '925 silver': '#C0C0C0',
      
      // Diamond/gemstone colors
      'diamond': '#B9F2FF',
      'white diamond': '#F8F8FF',
      'yellow diamond': '#FFFFE0',
      'emerald': '#50C878',
      'ruby': '#E0115F',
      'sapphire': '#0F52BA',
      'blue sapphire': '#0F52BA',
      'pink sapphire': '#FF69B4',
      'topaz': '#FFC87C',
      'amethyst': '#9966CC',
      'garnet': '#722F37',
      'opal': '#A8C3BC',
      'pearl': '#F8F6F0',
      
      // Special finishes
      'titanium': '#878681',
      'stainless steel': '#71797E',
      'blackened silver': '#2C2C2C',
      'oxidized silver': '#4A4A4A',
      'matte gold': '#E6C35C',
      'polished gold': '#FFD700',
      
      // Alternative names and spellings
      'original': '#FFD700', // Default to gold for jewelry
      'classic': '#FFD700',
      'traditional': '#FFD700'
    };
    
    const normalized = colorName.toLowerCase().trim();
    
    // Try exact match first
    if (colorMap[normalized]) {
      return colorMap[normalized];
    }
    
    // Try partial matching for compound names
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }
    
    // Default fallback based on common jewelry materials
    if (normalized.includes('gold')) return '#FFD700';
    if (normalized.includes('silver')) return '#C0C0C0';
    if (normalized.includes('rose') || normalized.includes('pink')) return '#E8B4B8';
    if (normalized.includes('white')) return '#F5F5DC';
    
    return '#C0C0C0'; // Default to light gray
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  isVariantProduct(row) {
    // Check if this is a variation product in WooCommerce
    const type = row.type || row.Type;
    return type === 'variation';
  }

  getParentSku(row) {
    // Extract parent SKU from WooCommerce Parent column
    const parent = row.parent || row.Parent;
    if (parent) {
      return parent;
    }
    
    // Fallback: Extract parent SKU if this is a variant based on SKU pattern
    const sku = row.sku || row.SKU;
    if (sku && sku.includes('-')) {
      return sku.split('-')[0];
    }
    return null;
  }

  /**
   * Validate mapped product
   */
  validateProduct(product) {
    const errors = [];
    
    if (!product.name) errors.push('Product name is required');
    if (!product.category) errors.push('Product category is required');
    if (!product.variants || product.variants.length === 0) {
      errors.push('At least one variant is required');
    }
    
    // Validate variants
    product.variants.forEach((variant, index) => {
      if (!variant.sizeLabel) {
        errors.push(`Variant ${index + 1}: Size label is required`);
      }
      if (!variant.price && !variant.isPriceOnDemand) {
        errors.push(`Variant ${index + 1}: Price is required`);
      }
    });
    
    return errors;
  }

  /**
   * Get image processing statistics
   */
  getImageStats() {
    const downloaderStats = this.imageDownloader.getStats();
    const uploaderStats = this.imageUploader.getStats();
    
    return {
      ...this.imageStats,
      downloaderStats,
      uploaderStats
    };
  }

  /**
   * Get processing statistics
   */
  getStats() {
    return {
      processed: this.processed,
      skipped: this.skipped,
      errorCount: this.errors.length,
      errors: this.errors,
      imageStats: this.getImageStats()
    };
  }

  /**
   * Clean up temporary files
   */
  async cleanup() {
    if (this.imageDownloader) {
      await this.imageDownloader.cleanup();
    }
  }
}

export default WooCommerceMapper;