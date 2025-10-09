import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { uploadToImageKitWithRetry } from '../shared/imagekit.js';

/**
 * ImageKit Upload Service for Bulk Import
 * Handles uploading downloaded images to ImageKit CDN
 */
class ImageKitUploader {
  constructor() {
    this.uploadStats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Upload single file to ImageKit
   */
  async uploadFile(filePath, options = {}) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error('File is empty');
      }

      // Read file buffer
      const buffer = fs.readFileSync(filePath);
      
      // Determine MIME type
      const mimeType = mime.lookup(filePath) || 'image/jpeg';
      
      // Generate filename
      const originalName = path.basename(filePath);
      const fileName = options.fileName || originalName;
      
      // Set folder path
      const folder = options.folder || '/products/bulk-import';
      
      console.log(`📤 Uploading to ImageKit: ${fileName} (${Math.round(stats.size / 1024)}KB)`);

      // Upload with retry
      const result = await uploadToImageKitWithRetry({
        buffer: buffer,
        fileName: fileName,
        folder: folder,
        mimetype: mimeType
      }, 3, 1000);

      console.log(`✅ Uploaded: ${fileName} -> ${result.url}`);

      return {
        success: true,
        url: result.url,
        fileId: result.fileId,
        originalPath: filePath,
        fileName: fileName,
        size: stats.size,
        mimeType: mimeType
      };

    } catch (error) {
      console.log(`❌ Upload failed for ${filePath}: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        originalPath: filePath,
        fileName: options.fileName || path.basename(filePath)
      };
    }
  }

  /**
   * Upload multiple files with batch processing
   */
  async uploadFiles(filePaths, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 3; // Upload 3 files at a time
    
    console.log(`\n🚀 Starting batch upload of ${filePaths.length} files...`);

    // Process in batches to avoid overwhelming ImageKit
    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(filePaths.length / batchSize)}`);

      // Upload batch in parallel
      const batchPromises = batch.map(filePath => {
        const fileName = options.generateFileName 
          ? options.generateFileName(filePath, i + batch.indexOf(filePath))
          : undefined;
          
        return this.uploadFile(filePath, {
          ...options,
          fileName: fileName
        });
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Update stats
      batchResults.forEach(result => {
        this.uploadStats.total++;
        if (result.success) {
          this.uploadStats.successful++;
        } else {
          this.uploadStats.failed++;
          this.uploadStats.errors.push({
            file: result.originalPath,
            error: result.error
          });
        }
      });

      // Small delay between batches
      if (i + batchSize < filePaths.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Batch upload completed: ${this.uploadStats.successful}/${this.uploadStats.total} successful`);
    return results;
  }

  /**
   * Process downloaded images for a product
   */
  async processProductImages(imageData, productSku) {
    try {
      if (!imageData.downloadedFiles || imageData.downloadedFiles.length === 0) {
        return {
          heroImage: { url: null, fileId: null },
          gallery: [],
          uploadResults: []
        };
      }

      console.log(`\n📸 Uploading ${imageData.downloadedFiles.length} images for product: ${productSku}`);

      // Prepare upload options
      const uploadOptions = {
        folder: `/products/${productSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        batchSize: 2, // Conservative batch size
        generateFileName: (filePath, index) => {
          const ext = path.extname(filePath);
          return index === 0 
            ? `${productSku}-hero${ext}` 
            : `${productSku}-gallery-${index}${ext}`;
        }
      };

      // Upload all images
      const filePaths = imageData.downloadedFiles.map(img => img.filepath);
      const uploadResults = await this.uploadFiles(filePaths, uploadOptions);

      // Process results
      const successfulUploads = uploadResults.filter(result => result.success);
      
      if (successfulUploads.length === 0) {
        return {
          heroImage: { url: null, fileId: null },
          gallery: [],
          uploadResults: uploadResults,
          error: 'No images uploaded successfully'
        };
      }

      // First successful upload becomes hero image
      const heroImage = {
        url: successfulUploads[0].url,
        fileId: successfulUploads[0].fileId
      };

      // Rest become gallery images
      const gallery = successfulUploads.slice(1).map(result => ({
        url: result.url,
        fileId: result.fileId
      }));

      console.log(`✅ Processed images for ${productSku}: 1 hero + ${gallery.length} gallery`);

      return {
        heroImage,
        gallery,
        uploadResults: uploadResults,
        totalUploaded: successfulUploads.length,
        totalAttempted: uploadResults.length
      };

    } catch (error) {
      console.error(`❌ Error processing images for ${productSku}:`, error.message);
      
      return {
        heroImage: { url: null, fileId: null },
        gallery: [],
        uploadResults: [],
        error: error.message
      };
    }
  }

  /**
   * Upload single image and return result
   */
  async uploadSingleImage(filePath, productSku, imageType = 'image') {
    const fileName = `${productSku}-${imageType}-${Date.now()}${path.extname(filePath)}`;
    const folder = `/products/${productSku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const result = await this.uploadFile(filePath, {
      fileName: fileName,
      folder: folder
    });

    return result;
  }

  /**
   * Get upload statistics
   */
  getStats() {
    return {
      ...this.uploadStats,
      successRate: this.uploadStats.total > 0 
        ? Math.round((this.uploadStats.successful / this.uploadStats.total) * 100)
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.uploadStats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Validate ImageKit configuration
   */
  async validateConfiguration() {
    try {
      // Try to upload a small test image
      const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      
      const result = await uploadToImageKitWithRetry({
        buffer: testBuffer,
        fileName: 'test-config.png',
        folder: '/test',
        mimetype: 'image/png'
      });

      // Clean up test file
      if (result.fileId) {
        const { deleteFromImageKit } = await import('../shared/imagekit.js');
        await deleteFromImageKit(result.fileId);
      }

      return {
        valid: true,
        message: 'ImageKit configuration is valid'
      };

    } catch (error) {
      return {
        valid: false,
        message: `ImageKit configuration error: ${error.message}`
      };
    }
  }
}

export default ImageKitUploader;