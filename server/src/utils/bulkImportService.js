import Product from '../modules/product/product.model.js';
import CSVParser from './csvParser.js';
import WooCommerceMapper from './woocommerceMapper.js';

/**
 * Enhanced Bulk Product Import Service with Image Processing
 * Handles the complete import pipeline from CSV to database with automatic image download and upload
 */
class BulkImportService {
  constructor() {
    this.parser = new CSVParser();
    this.mapper = new WooCommerceMapper({ processImages: true });
    this.batchSize = 5; // Process 5 products at a time (reduced for image processing)
    this.results = {
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      duplicates: 0,
      errors: [],
      warnings: [],
      created: [],
      updated: [],
      imageStats: {}
    };
  }

  /**
   * Import products from CSV file with image processing
   * @param {string|Buffer} csvInput - File path or buffer
   * @param {Object} options - Import options
   * @returns {Promise<Object>} Import results
   */
  async importFromCSV(csvInput, options = {}) {
    try {
      // Reset results
      this.resetResults();
      
      // Configure image processing
      const imageProcessing = options.processImages !== false; // Default to true
      console.log(`🎨 Image processing: ${imageProcessing ? 'ENABLED' : 'DISABLED'}`);
      
      // Parse CSV
      console.log('📁 Parsing CSV file...');
      const parseResult = typeof csvInput === 'string' 
        ? await this.parser.parseFile(csvInput)
        : await this.parser.parseBuffer(csvInput);
      
      if (parseResult.errors.length > 0) {
        console.log(`⚠️  CSV parsing warnings: ${parseResult.errors.length}`);
        this.results.warnings = parseResult.errors;
      }
      
      // Transform data with image processing
      console.log('🔄 Transforming WooCommerce data with image processing...');
      const mapResult = await this.mapper.transformProducts(parseResult.data);
      
      if (mapResult.errors.length > 0) {
        console.log(`⚠️  Mapping errors: ${mapResult.errors.length}`);
        this.results.errors.push(...mapResult.errors);
      }
      
      // Log image processing stats
      if (mapResult.imageStats) {
        console.log(`📸 Image processing stats:`);
        console.log(`   Products with images: ${mapResult.imageStats.productsWithImages}/${mapResult.imageStats.totalProducts}`);
        console.log(`   Images downloaded: ${mapResult.imageStats.successfulDownloads}/${mapResult.imageStats.totalImageUrls}`);
        console.log(`   Images uploaded: ${mapResult.imageStats.successfulUploads}`);
        
        if (mapResult.imageStats.imageErrors.length > 0) {
          console.log(`   Image errors: ${mapResult.imageStats.imageErrors.length}`);
        }
        
        this.results.imageStats = mapResult.imageStats;
      }
      
      this.results.total = mapResult.products.length;
      console.log(`📊 Found ${this.results.total} products to import`);
      
      // Import products in batches
      await this.importProductsBatch(mapResult.products, options);
      
      // Cleanup temporary files
      console.log('🧹 Cleaning up temporary files...');
      await this.mapper.cleanup();
      
      // Generate final report
      const report = this.generateReport();
      console.log('✅ Import completed!');
      console.log(report.summary);
      
      return report;
      
    } catch (error) {
      console.error('❌ Import failed:', error.message);
      
      // Cleanup on error
      try {
        await this.mapper.cleanup();
      } catch (cleanupError) {
        console.log('⚠️  Cleanup warning:', cleanupError.message);
      }
      
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  /**
   * Import products in batches with enhanced error handling
   */
  async importProductsBatch(products, options) {
    const batches = this.createBatches(products, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} products)`);
      
      // Process batch with better error handling
      const batchPromises = batch.map(product => 
        this.importSingleProduct(product, options)
          .catch(error => {
            console.error(`❌ Batch item failed: ${product.name}`, error.message);
            return { error: error.message, product: product.name };
          })
      );
      
      const batchResults = await Promise.all(batchPromises);
      
      // Log batch results
      const batchSuccesses = batchResults.filter(result => !result.error).length;
      const batchFailures = batchResults.length - batchSuccesses;
      
      if (batchFailures > 0) {
        console.log(`⚠️  Batch ${i + 1} completed: ${batchSuccesses} successful, ${batchFailures} failed`);
      } else {
        console.log(`✅ Batch ${i + 1} completed: ${batchSuccesses} successful`);
      }
      
      // Small delay between batches for system stability
      if (i + 1 < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Import single product with enhanced validation
   */
  async importSingleProduct(productData, options) {
    try {
      // Enhanced validation
      const validationErrors = this.validateProductData(productData);
      if (validationErrors.length > 0) {
        this.results.failed++;
        this.results.errors.push({
          product: productData.name,
          sku: productData.sku,
          errors: validationErrors
        });
        return;
      }

      // Check for duplicates
      const existing = await this.findExistingProduct(productData);
      
      if (existing && options.skipDuplicates) {
        console.log(`⏭️  Skipping duplicate: ${productData.name} (${productData.sku})`);
        this.results.duplicates++;
        this.results.skipped++;
        return;
      }

      if (existing && options.updateExisting) {
        // Update existing product
        await this.updateProduct(existing, productData, options);
        this.results.successful++;
        this.results.updated.push({
          id: existing._id,
          name: productData.name,
          sku: productData.sku
        });
        console.log(`🔄 Updated: ${productData.name} (${productData.sku})`);
      } else if (!existing) {
        // Create new product
        const newProduct = await this.createProduct(productData, options);
        this.results.successful++;
        this.results.created.push({
          id: newProduct._id,
          name: newProduct.name,
          sku: newProduct.sku
        });
        console.log(`✅ Created: ${productData.name} (${productData.sku})`);
      } else {
        // Duplicate found but no action specified
        console.log(`🔄 Duplicate found: ${productData.name} (${productData.sku})`);
        this.results.duplicates++;
        this.results.skipped++;
      }

    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        product: productData.name,
        sku: productData.sku,
        error: error.message,
        stack: error.stack
      });
      console.error(`❌ Failed to import ${productData.name}:`, error.message);
    }
  }

  /**
   * Enhanced product validation
   */
  validateProductData(productData) {
    const errors = [];
    
    // Basic validation
    if (!productData.name) {
      errors.push('Product name is required');
    }
    
    if (!productData.category) {
      errors.push('Product category is required');
    }
    
    if (!productData.variants || productData.variants.length === 0) {
      errors.push('At least one variant is required');
    }
    
    // Validate variants
    if (productData.variants) {
      productData.variants.forEach((variant, index) => {
        if (!variant.sizeLabel) {
          errors.push(`Variant ${index + 1}: Size label is required`);
        }
        if ((!variant.price || variant.price <= 0) && !variant.isPriceOnDemand) {
          errors.push(`Variant ${index + 1}: Valid price is required`);
        }
        if (!variant.sku) {
          errors.push(`Variant ${index + 1}: SKU is required`);
        }
      });
    }
    
    // Validate images (if processed)
    if (productData.heroImage && productData.heroImage.url && !productData.heroImage.fileId) {
      errors.push('Hero image upload failed - missing fileId');
    }
    
    return errors;
  }

  /**
   * Find existing product by multiple criteria
   */
  async findExistingProduct(productData) {
    // Try to find by SKU first (most reliable)
    if (productData.sku) {
      const bySku = await Product.findOne({ sku: productData.sku });
      if (bySku) return bySku;
    }

    // Try to find by slug
    if (productData.slug) {
      const bySlug = await Product.findOne({ slug: productData.slug });
      if (bySlug) return bySlug;
    }

    // Try to find by exact name match
    const byName = await Product.findOne({ 
      name: { $regex: new RegExp(`^${productData.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });
    return byName;
  }

  /**
   * Create new product with better error handling
   */
  async createProduct(productData, options) {
    try {
      // Set audit fields
      productData.createdBy = options.userId || null;
      productData.updatedBy = options.userId || null;
      
      // Ensure slug uniqueness
      productData.slug = await this.ensureUniqueSlug(productData.slug);
      
      // Create product
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      return savedProduct;
      
    } catch (error) {
      // Handle specific MongoDB errors
      if (error.code === 11000) { // Duplicate key error
        if (error.keyPattern && error.keyPattern.slug) {
          throw new Error(`Slug '${productData.slug}' already exists`);
        }
        throw new Error('Duplicate key error: ' + JSON.stringify(error.keyPattern));
      }
      
      throw error;
    }
  }

  /**
   * Update existing product with merge options
   */
  async updateProduct(existing, newData, options) {
    try {
      // Preserve certain fields
      const preservedFields = ['_id', 'createdAt', 'createdBy', 'avgRating', 'reviewCount'];
      preservedFields.forEach(field => {
        if (existing[field] !== undefined) {
          newData[field] = existing[field];
        }
      });

      // Update audit fields
      newData.updatedBy = options.userId || null;
      
      // Handle variants merging
      if (options.mergeVariants && existing.variants && existing.variants.length > 0) {
        newData.variants = this.mergeVariants(existing.variants, newData.variants);
      }
      
      // Handle images - only update if new images were processed
      if (options.preserveImages && existing.heroImage && existing.heroImage.url && 
          (!newData.heroImage || !newData.heroImage.url)) {
        newData.heroImage = existing.heroImage;
        newData.gallery = existing.gallery || [];
      }
      
      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        existing._id, 
        newData, 
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      );
      
      return updatedProduct;
      
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  /**
   * Ensure slug uniqueness
   */
  async ensureUniqueSlug(originalSlug, attempt = 1) {
    const slug = attempt === 1 ? originalSlug : `${originalSlug}-${attempt}`;
    
    const existing = await Product.findOne({ slug });
    if (!existing) {
      return slug;
    }
    
    return this.ensureUniqueSlug(originalSlug, attempt + 1);
  }

  /**
   * Merge variants - add new ones, update existing ones
   */
  mergeVariants(existingVariants, newVariants) {
    const merged = [...existingVariants];
    
    newVariants.forEach(newVariant => {
      const existingIndex = merged.findIndex(v => v.sku === newVariant.sku);
      
      if (existingIndex >= 0) {
        // Update existing variant, preserving some fields
        const existingVariant = merged[existingIndex];
        merged[existingIndex] = {
          ...existingVariant,
          ...newVariant,
          // Preserve certain fields if they exist
          _id: existingVariant._id,
          createdAt: existingVariant.createdAt
        };
      } else {
        // Add new variant
        merged.push(newVariant);
      }
    });
    
    return merged;
  }

  /**
   * Create batches for processing
   */
  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Generate comprehensive import report
   */
  generateReport() {
    const summary = `
📊 BULK IMPORT SUMMARY
=====================
Total Products: ${this.results.total}
✅ Successful: ${this.results.successful}
❌ Failed: ${this.results.failed}
⏭️  Skipped: ${this.results.skipped}
🔄 Duplicates: ${this.results.duplicates}
📝 Created: ${this.results.created.length}
🔄 Updated: ${this.results.updated.length}
⚠️  Errors: ${this.results.errors.length}
⚠️  Warnings: ${this.results.warnings.length}

📸 IMAGE PROCESSING
==================
Products with Images: ${this.results.imageStats.productsWithImages || 0}/${this.results.imageStats.totalProducts || 0}
Images Downloaded: ${this.results.imageStats.successfulDownloads || 0}/${this.results.imageStats.totalImageUrls || 0}
Images Uploaded: ${this.results.imageStats.successfulUploads || 0}
Image Errors: ${this.results.imageStats.imageErrors?.length || 0}
    `;

    return {
      summary,
      details: this.results,
      success: this.results.failed === 0,
      stats: {
        total: this.results.total,
        successful: this.results.successful,
        failed: this.results.failed,
        skipped: this.results.skipped,
        duplicates: this.results.duplicates,
        created: this.results.created.length,
        updated: this.results.updated.length,
        imageStats: this.results.imageStats
      }
    };
  }

  /**
   * Reset results for new import
   */
  resetResults() {
    this.results = {
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      duplicates: 0,
      errors: [],
      warnings: [],
      created: [],
      updated: [],
      imageStats: {}
    };
  }

  /**
   * Validate CSV before import with image check
   */
  async validateCSV(csvInput) {
    try {
      const parseResult = typeof csvInput === 'string' 
        ? await this.parser.parseFile(csvInput)
        : await this.parser.parseBuffer(csvInput);
      
      // Quick transform without image processing for validation
      const quickMapper = new WooCommerceMapper({ processImages: false });
      const mapResult = await quickMapper.transformProducts(parseResult.data);
      
      // Run validation on all products
      const validationResults = mapResult.products.map(product => ({
        name: product.name,
        sku: product.sku,
        errors: this.validateProductData(product),
        warnings: [],
        hasImages: this.hasImageUrls(product._originalData)
      }));
      
      const totalErrors = validationResults.reduce((sum, result) => 
        sum + result.errors.length, 0
      );
      
      const productsWithImages = validationResults.filter(p => p.hasImages).length;
      
      return {
        isValid: totalErrors === 0,
        productCount: mapResult.products.length,
        errorCount: totalErrors,
        productsWithImages: productsWithImages,
        validationResults,
        parseErrors: parseResult.errors,
        mapErrors: mapResult.errors
      };
      
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  /**
   * Check if product has image URLs
   */
  hasImageUrls(originalData) {
    if (!originalData) return false;
    
    const images = originalData.Images || originalData.images || '';
    return typeof images === 'string' && images.trim().length > 0;
  }

  /**
   * Get import progress (for real-time updates)
   */
  getProgress() {
    return {
      total: this.results.total,
      processed: this.results.successful + this.results.failed + this.results.skipped,
      successful: this.results.successful,
      failed: this.results.failed,
      percentage: this.results.total > 0 
        ? Math.round(((this.results.successful + this.results.failed + this.results.skipped) / this.results.total) * 100)
        : 0,
      currentPhase: this.results.total > 0 ? 'importing' : 'preparing',
      imageStats: this.results.imageStats
    };
  }
}

export default BulkImportService;