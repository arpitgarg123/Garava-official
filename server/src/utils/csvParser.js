import fs from 'fs';
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * CSV Parser utility for WooCommerce product imports
 * Handles file reading, validation, and data type conversion
 */
class CSVParser {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.rowCount = 0;
  }

  /**
   * Parse CSV from file path
   * @param {string} filePath - Path to CSV file
   * @returns {Promise<Array>} Parsed CSV data
   */
  async parseFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      this.errors = [];
      this.warnings = [];
      this.rowCount = 0;

      if (!fs.existsSync(filePath)) {
        return reject(new Error(`CSV file not found: ${filePath}`));
      }

      fs.createReadStream(filePath)
        .pipe(csv({
          skipEmptyLines: true,
          skipLinesWithError: true
        }))
        .on('data', (row) => {
          this.rowCount++;
          try {
            const processedRow = this.processRow(row, this.rowCount);
            if (processedRow) {
              results.push(processedRow);
            }
          } catch (error) {
            this.errors.push({
              row: this.rowCount,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', () => {
          resolve({
            data: results,
            errors: this.errors,
            warnings: this.warnings,
            totalRows: this.rowCount,
            successfulRows: results.length
          });
        })
        .on('error', (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        });
    });
  }

  /**
   * Parse CSV from buffer (for uploaded files)
   * @param {Buffer} buffer - CSV file buffer
   * @returns {Promise<Array>} Parsed CSV data
   */
  async parseBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      this.errors = [];
      this.warnings = [];
      this.rowCount = 0;

      const readable = new Readable({
        read() {}
      });
      readable.push(buffer);
      readable.push(null);

      readable
        .pipe(csv({
          skipEmptyLines: true,
          skipLinesWithError: true
        }))
        .on('data', (row) => {
          this.rowCount++;
          try {
            const processedRow = this.processRow(row, this.rowCount);
            if (processedRow) {
              results.push(processedRow);
            }
          } catch (error) {
            this.errors.push({
              row: this.rowCount,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', () => {
          resolve({
            data: results,
            errors: this.errors,
            warnings: this.warnings,
            totalRows: this.rowCount,
            successfulRows: results.length
          });
        })
        .on('error', (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        });
    });
  }

  /**
   * Process individual CSV row
   * @param {Object} row - Raw CSV row data
   * @param {number} rowNumber - Row number for error tracking
   * @returns {Object} Processed row data
   */
  processRow(row, rowNumber) {
    // Skip empty rows
    if (!row.Name || row.Name.trim() === '') {
      this.warnings.push({
        row: rowNumber,
        warning: 'Empty product name, skipping row',
        data: row
      });
      return null;
    }

    // Convert and validate data types
    const processedRow = {
      // Basic product info
      name: this.sanitizeString(row.Name),
      type: this.mapProductType(row.Type || 'simple'), 
      sku: this.sanitizeString(row.SKU),
      gtin: this.sanitizeString(row.GTIN),
      
      // Descriptions
      shortDescription: this.sanitizeString(row['Short description']),
      description: this.sanitizeString(row.Description),
      
      // Categories
      categories: this.parseCategories(row.Categories),
      tags: this.parseTags(row.Tags),
      
      // Pricing
      regularPrice: this.parsePrice(row['Regular price']),
      salePrice: this.parsePrice(row['Sale price']),
      
      // Stock
      stock: this.parseNumber(row['Stock quantity']),
      stockStatus: this.mapStockStatus(row['In stock?']),
      
      // Physical properties
      weight: this.parseNumber(row.Weight),
      length: this.parseNumber(row.Length),
      width: this.parseNumber(row.Width),
      height: this.parseNumber(row.Height),
      
      // Tax
      taxStatus: this.mapTaxStatus(row['Tax status']),
      taxClass: this.sanitizeString(row['Tax class']),
      
      // Visibility
      visibility: this.mapVisibility(row.Visibility),
      featured: this.parseBoolean(row.Featured),
      
      // Images
      images: this.parseImages(row.Images),
      
      // Attributes (for variants/colors)
      attributes: this.parseAttributes(row),
      
      // Meta
      metaTitle: this.sanitizeString(row['Meta title']),
      metaDescription: this.sanitizeString(row['Meta description']),
      
      // Original row for debugging
      _originalRow: row,
      _rowNumber: rowNumber
    };

    return processedRow;
  }

  // Data type conversion helpers
  sanitizeString(value) {
    if (!value || value === '') return null;
    return String(value).trim();
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

  parseCategories(value) {
    if (!value) return [];
    return String(value).split(',').map(cat => cat.trim()).filter(cat => cat);
  }

  parseTags(value) {
    if (!value) return [];
    return String(value).split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  parseImages(value) {
    if (!value) return [];
    return String(value).split(',').map(img => img.trim()).filter(img => img);
  }

  parseAttributes(row) {
    const attributes = {};
    
    // Look for attribute columns (Attribute 1 name, Attribute 1 value(s), etc.)
    Object.keys(row).forEach(key => {
      const attrNameMatch = key.match(/Attribute (\d+) name/);
      const attrValueMatch = key.match(/Attribute (\d+) value\(s\)/);
      
      if (attrNameMatch) {
        const attrNum = attrNameMatch[1];
        const attrName = row[key];
        const attrValue = row[`Attribute ${attrNum} value(s)`];
        
        if (attrName && attrValue) {
          attributes[attrName.toLowerCase()] = {
            name: attrName,
            values: String(attrValue).split(',').map(v => v.trim()).filter(v => v)
          };
        }
      }
    });
    
    return attributes;
  }

  // Mapping helpers
  mapProductType(type) {
    const typeMap = {
      'simple': 'other',
      'variable': 'other', 
      'fragrance': 'fragrance',
      'perfume': 'fragrance',
      'jewellery': 'jewellery',
      'jewelry': 'jewellery',
      'high_jewellery': 'high_jewellery'
    };
    return typeMap[type.toLowerCase()] || 'other';
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

  /**
   * Validate required fields
   * @param {Object} data - Processed row data
   * @returns {Array} Array of validation errors
   */
  validateRequiredFields(data) {
    const errors = [];
    
    if (!data.name) {
      errors.push('Product name is required');
    }
    
    if (!data.regularPrice && !data.salePrice) {
      errors.push('At least one price (regular or sale) is required');
    }
    
    if (!data.categories || data.categories.length === 0) {
      errors.push('At least one category is required');
    }
    
    return errors;
  }

  /**
   * Get parsing statistics
   * @returns {Object} Parsing statistics
   */
  getStats() {
    return {
      totalRows: this.rowCount,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

export default CSVParser;