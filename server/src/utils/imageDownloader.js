import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Image Download and Processing Utility
 * Downloads images from URLs with retry logic and validation
 */
class ImageDownloader {
  constructor() {
    // Create temporary downloads directory
    this.tempDir = path.join(__dirname, '../../temp/images');
    this.ensureTempDir();
    this.downloadStats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Generate safe filename from URL and product info
   */
  generateFilename(imageUrl, productSku, index = 0) {
    try {
      const urlObj = new URL(imageUrl);
      const originalExtension = path.extname(urlObj.pathname) || '.webp';
      const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
      const sanitizedSku = productSku.replace(/[^a-zA-Z0-9]/g, '_');
      
      return `${sanitizedSku}_${index}_${hash}${originalExtension}`;
    } catch (error) {
      // Fallback filename
      const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
      return `image_${hash}.webp`;
    }
  }

  /**
   * Download single image from URL
   */
  async downloadImage(imageUrl, productSku, imageIndex = 0) {
    return new Promise((resolve) => {
      try {
        if (!imageUrl || typeof imageUrl !== 'string') {
          return resolve(null);
        }

        // Clean and validate URL
        const cleanUrl = imageUrl.trim();
        if (!cleanUrl.match(/^https?:\/\//)) {
          console.log(`❌ Invalid URL: ${cleanUrl}`);
          return resolve(null);
        }

        const filename = this.generateFilename(cleanUrl, productSku, imageIndex);
        const filepath = path.join(this.tempDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          if (stats.size > 1000) { // File exists and is valid size
            console.log(`✓ Using cached image: ${filename}`);
            return resolve({
              url: cleanUrl,
              filename: filename,
              filepath: filepath,
              size: stats.size,
              cached: true
            });
          }
        }

        // Choose HTTP client based on protocol
        const client = cleanUrl.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);

        console.log(`📥 Downloading: ${cleanUrl}`);

        const request = client.get(cleanUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/*,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          }
        }, (response) => {
          // Handle redirects
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            file.close();
            fs.unlink(filepath, () => {});
            
            console.log(`🔄 Redirecting to: ${response.headers.location}`);
            return this.downloadImage(response.headers.location, productSku, imageIndex)
              .then(resolve);
          }

          // Check status code
          if (response.statusCode !== 200) {
            file.close();
            fs.unlink(filepath, () => {});
            console.log(`❌ HTTP ${response.statusCode}: ${cleanUrl}`);
            return resolve(null);
          }

          // Validate content type
          const contentType = response.headers['content-type'] || '';
          if (!contentType.startsWith('image/')) {
            file.close();
            fs.unlink(filepath, () => {});
            console.log(`❌ Invalid content type (${contentType}): ${cleanUrl}`);
            return resolve(null);
          }

          // Start downloading
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            
            // Validate downloaded file
            try {
              const stats = fs.statSync(filepath);
              
              // Check minimum file size (1KB)
              if (stats.size < 1000) {
                fs.unlink(filepath, () => {});
                console.log(`❌ File too small (${stats.size} bytes): ${cleanUrl}`);
                return resolve(null);
              }

              console.log(`✅ Downloaded: ${filename} (${Math.round(stats.size / 1024)}KB)`);
              resolve({
                url: cleanUrl,
                filename: filename,
                filepath: filepath,
                size: stats.size,
                contentType: contentType,
                cached: false
              });

            } catch (error) {
              fs.unlink(filepath, () => {});
              console.log(`❌ File validation failed: ${error.message}`);
              resolve(null);
            }
          });

          file.on('error', (error) => {
            fs.unlink(filepath, () => {});
            console.log(`❌ File write error: ${error.message}`);
            resolve(null);
          });
        });

        request.on('error', (error) => {
          file.close();
          fs.unlink(filepath, () => {});
          console.log(`❌ Request error: ${error.message}`);
          resolve(null);
        });

        request.setTimeout(30000, () => {
          request.destroy();
          file.close();
          fs.unlink(filepath, () => {});
          console.log(`❌ Timeout: ${cleanUrl}`);
          resolve(null);
        });

      } catch (error) {
        console.log(`❌ Download failed: ${error.message}`);
        resolve(null);
      }
    });
  }

  /**
   * Download multiple images with retry logic
   */
  async downloadImages(imageUrls, productSku, maxRetries = 2) {
    const results = [];
    
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return results;
    }

    console.log(`\n📸 Processing ${imageUrls.length} images for product: ${productSku}`);
    
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      let downloadResult = null;
      let attempts = 0;

      this.downloadStats.total++;

      while (!downloadResult && attempts < maxRetries) {
        attempts++;
        
        if (attempts > 1) {
          console.log(`🔄 Retry ${attempts}/${maxRetries} for: ${imageUrl}`);
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
        
        downloadResult = await this.downloadImage(imageUrl, productSku, i);
      }

      if (downloadResult) {
        results.push(downloadResult);
        this.downloadStats.successful++;
      } else {
        this.downloadStats.failed++;
        this.downloadStats.errors.push({
          url: imageUrl,
          productSku: productSku,
          error: 'Download failed after retries'
        });
        console.log(`❌ Failed to download after ${maxRetries} attempts: ${imageUrl}`);
      }

      // Small delay between downloads to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Downloaded ${results.length}/${imageUrls.length} images for ${productSku}`);
    return results;
  }

  /**
   * Parse image URLs from CSV data
   */
  parseImageUrls(csvRow) {
    const imageUrls = [];
    
    // Parse main Images field
    if (csvRow.Images && typeof csvRow.Images === 'string') {
      const urls = csvRow.Images.split(',')
        .map(url => url.trim())
        .filter(url => url && url.match(/^https?:\/\//));
      imageUrls.push(...urls);
    }

    // Parse Gallery field if exists
    if (csvRow.Gallery && typeof csvRow.Gallery === 'string') {
      const urls = csvRow.Gallery.split(',')
        .map(url => url.trim())
        .filter(url => url && url.match(/^https?:\/\//));
      imageUrls.push(...urls);
    }

    // Remove duplicates
    return [...new Set(imageUrls)];
  }

  /**
   * Process images for a single product
   */
  async processProductImages(csvProduct) {
    try {
      const imageUrls = this.parseImageUrls(csvProduct);
      
      if (imageUrls.length === 0) {
        console.log(`⚠️  No images found for product: ${csvProduct.SKU || csvProduct.Name}`);
        return {
          heroImage: { url: null, fileId: null },
          gallery: [],
          downloadedFiles: []
        };
      }

      // Download all images
      const downloadedImages = await this.downloadImages(imageUrls, csvProduct.SKU || 'unknown');

      if (downloadedImages.length === 0) {
        return {
          heroImage: { url: null, fileId: null },
          gallery: [],
          downloadedFiles: []
        };
      }

      // First successful download becomes hero image
      const heroImage = {
        url: downloadedImages[0].filepath, // Will be replaced after upload
        fileId: null, // Will be set after upload
        originalUrl: downloadedImages[0].url,
        filename: downloadedImages[0].filename
      };

      // Rest become gallery images
      const gallery = downloadedImages.slice(1).map(img => ({
        url: img.filepath, // Will be replaced after upload
        fileId: null, // Will be set after upload
        originalUrl: img.url,
        filename: img.filename
      }));

      return {
        heroImage,
        gallery,
        downloadedFiles: downloadedImages,
        totalImages: imageUrls.length,
        successfulDownloads: downloadedImages.length
      };

    } catch (error) {
      console.error(`❌ Error processing images for ${csvProduct.SKU}:`, error.message);
      return {
        heroImage: { url: null, fileId: null },
        gallery: [],
        downloadedFiles: [],
        error: error.message
      };
    }
  }

  /**
   * Get download statistics
   */
  getStats() {
    return {
      ...this.downloadStats,
      successRate: this.downloadStats.total > 0 
        ? Math.round((this.downloadStats.successful / this.downloadStats.total) * 100)
        : 0
    };
  }

  /**
   * Clean up temporary files
   */
  async cleanup(keepFiles = false) {
    if (keepFiles) {
      console.log(`📁 Keeping downloaded files in: ${this.tempDir}`);
      return;
    }

    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(this.tempDir, file));
        }
        fs.rmdirSync(this.tempDir);
        console.log('🧹 Cleaned up temporary image files');
      }
    } catch (error) {
      console.log('⚠️  Cleanup warning:', error.message);
    }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.downloadStats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }
}

export default ImageDownloader;