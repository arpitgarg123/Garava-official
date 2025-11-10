// src/shared/documentParser.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

import mammoth from 'mammoth';
import { uploadToImageKitWithRetry } from './imagekit.js';
import { logger } from './logger.js';

/**
 * Extract keywords from text (simple frequency-based)
 */
export function extractKeywords(text) {
  // Handle null/undefined text
  if (!text || typeof text !== 'string') {
    return [];
  }

  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for',
    'of', 'as', 'by', 'from', 'that', 'this', 'these', 'those', 'it', 'its', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
    'can', 'are', 'was', 'were', 'am', 'not', 'no', 'yes', 'if', 'then', 'than', 'so', 'such'
  ]);
  
  const words = text.toLowerCase()
    .replace(/<[^>]+>/g, ' ') // Remove HTML tags
    .match(/\b[a-z]{4,}\b/g) || []; // Extract words 4+ chars
  
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

/**
 * Extract title from HTML content
 */
export function extractTitleFromHTML(html) {
  // Try to find h1 or first heading
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  
  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match) return h2Match[1].replace(/<[^>]+>/g, '').trim();
  
  // Get first paragraph or first line
  const pMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (pMatch) {
    const text = pMatch[1].replace(/<[^>]+>/g, '').trim();
    return text.substring(0, 100);
  }
  
  // Fallback: first 100 chars
  const cleanText = html.replace(/<[^>]+>/g, ' ').trim();
  return cleanText.substring(0, 100);
}

/**
 * Extract excerpt from HTML content
 */
export function extractExcerptFromHTML(html) {
  // Get first paragraph
  const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
  
  for (const p of paragraphs) {
    const text = p.replace(/<[^>]+>/g, '').trim();
    if (text.length > 50) {
      return text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }
  }
  
  // Fallback
  const cleanText = html.replace(/<[^>]+>/g, ' ').trim();
  return cleanText.substring(0, 200) + (cleanText.length > 200 ? '...' : '');
}

/**
 * Parse DOCX with automatic image upload to ImageKit
 */
export async function parseDOCXWithImages(buffer) {
  const uploadedImages = [];
  let imageCounter = 0;
  
  try {
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            imageCounter++;
            const imageBuffer = await image.read();
            
            // Get content type (e.g., 'image/png')
            const contentType = image.contentType || 'image/jpeg';
            const extension = contentType.split('/')[1] || 'jpg';
            
            logger.info(`Uploading blog image ${imageCounter}`, { contentType, size: imageBuffer.length });
            
            // Upload to ImageKit (ImageKit handles optimization)
            const uploaded = await uploadToImageKitWithRetry({
              buffer: imageBuffer,
              fileName: `blog_${Date.now()}_${imageCounter}.${extension}`,
              folder: '/blogs/content',
              mimetype: contentType
            });
            
            uploadedImages.push({
              url: uploaded.url,
              fileId: uploaded.fileId,
              alt: `Blog image ${imageCounter}`
            });
            
            logger.info(`Blog image ${imageCounter} uploaded successfully`, { url: uploaded.url });
            
            // Return image tag with ImageKit URL
            return {
              src: uploaded.url,
              alt: `Blog content image ${imageCounter}`
            };
          } catch (error) {
            logger.error(`Failed to upload blog image ${imageCounter}`, { error: error.message });
            // Return empty src so image is skipped
            return { src: '', alt: 'Failed to upload image' };
          }
        })
      }
    );
    
    logger.info(`DOCX parsed successfully`, { imagesUploaded: uploadedImages.length });
    
    // Extract plain text from HTML for keyword extraction
    const text = result.value.replace(/<[^>]+>/g, ' ').trim();
    
    return {
      html: result.value,
      text: text,
      uploadedImages: uploadedImages,
      imageCount: uploadedImages.length,
      messages: result.messages
    };
  } catch (error) {
    logger.error('DOCX parsing failed', { error: error.message });
    throw error;
  }
}

/**
 * Parse PDF and extract text (no image extraction for PDF)
 */
export async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    
    const lines = data.text.split('\n').filter(line => line.trim());
    
    // Extract title (first non-empty line)
    const title = lines[0]?.trim() || 'Untitled Blog Post';
    
    // Extract excerpt (first paragraph with meaningful content)
    const paragraphs = lines.filter(line => line.length > 50);
    const excerpt = paragraphs[0]?.substring(0, 200) + '...' || '';
    
    // Content (all text with basic formatting)
    const content = data.text
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => `<p>${para.trim()}</p>`)
      .join('\n');
    
    // Extract keywords
    const keywords = extractKeywords(data.text);
    
    logger.info('PDF parsed successfully', { pages: data.numpages, textLength: data.text.length });
    
    return {
      html: content,
      text: data.text,
      uploadedImages: [], // PDF doesn't support image extraction
      imageCount: 0,
      pages: data.numpages
    };
  } catch (error) {
    logger.error('PDF parsing failed', { error: error.message });
    throw error;
  }
}

/**
 * Extract structured content from plain text
 */
export function extractStructuredContent(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract title (first line)
  const title = lines[0]?.trim() || 'Untitled';
  
  // Extract first paragraph as excerpt
  const paragraphs = lines.filter(line => line.length > 50);
  const excerpt = paragraphs[0]?.substring(0, 200) + '...' || '';
  
  // Content with basic HTML formatting
  const content = paragraphs
    .map(para => `<p>${para.trim()}</p>`)
    .join('\n');
  
  // Basic keyword extraction
  const keywords = extractKeywords(text);
  
  return {
    title,
    excerpt,
    content,
    suggestedTags: keywords,
    wordCount: text.split(/\s+/).length
  };
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}
