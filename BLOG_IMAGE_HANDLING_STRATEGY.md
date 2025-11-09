# Blog Document Upload - Image Handling Strategy

## The Challenge

When uploading Word/PDF documents for blog auto-fill, images need to be:
1. Extracted from the document
2. Uploaded to ImageKit CDN
3. Referenced in the blog content (HTML)
4. Set as cover image (optional)

---

## Current Image Infrastructure ✅

Your system already has:
- ✅ **ImageKit Integration** - Cloud CDN for images
- ✅ **Upload Service** - `uploadToImageKitWithRetry()`
- ✅ **Image Optimization** - `optimizeImage()` function
- ✅ **Cover Image Field** - `coverImage: { url, fileId, alt }`

---

## Image Extraction Solutions

### Option 1: Extract & Upload Images (RECOMMENDED) 🎯

**How it works**:
```
Document → Extract images → Upload to ImageKit → Insert URLs in content
```

#### For PDF Files:
```javascript
import pdfParse from 'pdf-parse';
import { fromPath } from 'pdf2pic'; // Extract images from PDF

async function extractImagesFromPDF(buffer) {
  // Method 1: Using pdf2pic
  const converter = fromPath(buffer, {
    density: 100,
    format: "png",
    width: 1600,
    height: 2400
  });
  
  // Method 2: Using pdf-lib (better)
  const pdfDoc = await PDFDocument.load(buffer);
  const images = [];
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const pageImages = await page.getImages();
    
    for (const image of pageImages) {
      const imageData = await image.getImage();
      images.push({
        buffer: imageData,
        format: 'png',
        name: `blog_image_${Date.now()}_${i}`
      });
    }
  }
  
  return images;
}
```

#### For DOCX Files (EASIER):
```javascript
import mammoth from 'mammoth';

async function extractImagesFromDOCX(buffer) {
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        // image.read() gives you the image buffer
        const imageBuffer = await image.read();
        
        // Upload to ImageKit
        const uploaded = await uploadToImageKitWithRetry({
          buffer: imageBuffer,
          fileName: `blog_${Date.now()}_${image.contentType.split('/')[1]}`,
          folder: '/blogs/content',
          mimetype: image.contentType
        });
        
        // Return the ImageKit URL
        return {
          src: uploaded.url,
          alt: 'Blog image'
        };
      })
    }
  );
  
  return {
    html: result.value, // HTML with ImageKit URLs
    messages: result.messages
  };
}
```

**Pros**:
- ✅ All images hosted on your CDN
- ✅ Full control over image quality
- ✅ Consistent with existing system
- ✅ Images persist even if original document deleted
- ✅ Can optimize/resize images

**Cons**:
- ⚠️ More complex implementation
- ⚠️ Additional processing time (1-3 seconds per image)
- ⚠️ Storage costs (minimal with ImageKit)

---

### Option 2: Base64 Embed (NOT RECOMMENDED) ❌

**How it works**:
```
Document → Extract images → Embed as base64 in HTML
```

```javascript
const base64Image = imageBuffer.toString('base64');
const htmlImg = `<img src="data:image/png;base64,${base64Image}" />`;
```

**Pros**:
- ✅ Simple implementation
- ✅ No external uploads needed

**Cons**:
- ❌ Huge HTML size (1MB image = 1.3MB base64)
- ❌ Slow page load
- ❌ Poor SEO
- ❌ Can't optimize images
- ❌ Database bloat

---

### Option 3: Manual Image Upload (FALLBACK) 🔄

**How it works**:
```
Document → Extract text only → Admin uploads images manually
```

**Pros**:
- ✅ Simple parsing
- ✅ Admin controls which images to use
- ✅ Better image selection

**Cons**:
- ⚠️ Requires manual work
- ⚠️ Defeats purpose of automation

---

## Recommended Implementation

### **Hybrid Approach: Smart Image Handling** 🏆

```javascript
async function analyzeDocumentWithImages(file, adminId) {
  let content, images = [];
  
  // STEP 1: Parse document and extract images
  if (file.mimetype === 'application/pdf') {
    const pdfData = await parsePDF(file.buffer);
    content = pdfData.text;
    images = await extractImagesFromPDF(file.buffer);
  } else if (file.mimetype.includes('wordprocessingml')) {
    const docxData = await parseDOCXWithImages(file.buffer);
    content = docxData.html; // Already has ImageKit URLs!
    images = docxData.extractedImages;
  }
  
  // STEP 2: Upload images to ImageKit
  const uploadedImages = [];
  for (const img of images) {
    try {
      const optimized = await optimizeImage(img.buffer, { 
        width: 1600, 
        quality: 85 
      });
      
      const uploaded = await uploadToImageKitWithRetry({
        buffer: optimized,
        fileName: `blog_${Date.now()}_${img.name}.jpg`,
        folder: '/blogs/content',
        mimetype: 'image/jpeg'
      });
      
      uploadedImages.push({
        url: uploaded.url,
        fileId: uploaded.fileId,
        originalName: img.name
      });
    } catch (error) {
      console.error('Image upload failed:', img.name, error);
      // Continue with other images
    }
  }
  
  // STEP 3: Select cover image (first image)
  const coverImage = uploadedImages.length > 0 ? {
    url: uploadedImages[0].url,
    fileId: uploadedImages[0].fileId,
    alt: 'Blog cover image'
  } : null;
  
  // STEP 4: Replace image references in content
  let finalContent = content;
  uploadedImages.forEach((img, index) => {
    // Replace placeholders or insert images
    finalContent = finalContent.replace(
      `[image-${index}]`, 
      `<img src="${img.url}" alt="Blog image ${index + 1}" class="blog-image" />`
    );
  });
  
  return {
    content: finalContent,
    coverImage,
    images: uploadedImages, // Return all images for admin review
    imageCount: uploadedImages.length
  };
}
```

---

## Complete Flow Diagram

```
┌─────────────────┐
│  Admin uploads  │
│  PDF/DOCX file  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse document │
│  Extract text   │
│  Extract images │ ← PDF: pdf-lib, DOCX: mammoth
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  For each image:│
│  1. Optimize    │ ← Sharp/optimizeImage()
│  2. Upload to   │ ← uploadToImageKitWithRetry()
│     ImageKit    │
│  3. Get URL     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Insert URLs in │
│  content HTML   │
│  Set first as   │
│  cover image    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return to      │
│  frontend with: │
│  - Content      │
│  - Cover image  │
│  - All images   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Admin reviews  │
│  Can re-arrange │
│  or remove      │
│  images         │
└─────────────────┘
```

---

## Required NPM Packages

```bash
# For PDF image extraction
npm install pdf-lib pdf2pic

# For DOCX image extraction
npm install mammoth

# Already installed:
# - sharp (image optimization)
# - imagekit (CDN upload)
```

---

## Backend Implementation

### 1. Update Document Parser Service

```javascript
// server/src/shared/documentParser.js

import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';
import { uploadToImageKitWithRetry } from './imagekit.js';
import { optimizeImage } from './utils/image.js';

/**
 * Parse DOCX with automatic image upload
 */
export async function parseDOCXWithImages(buffer) {
  const uploadedImages = [];
  
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        try {
          const imageBuffer = await image.read();
          
          // Optimize image
          const optimized = await optimizeImage(imageBuffer, {
            width: 1600,
            quality: 85
          });
          
          // Upload to ImageKit
          const uploaded = await uploadToImageKitWithRetry({
            buffer: optimized,
            fileName: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
            folder: '/blogs/content',
            mimetype: 'image/jpeg'
          });
          
          uploadedImages.push(uploaded);
          
          return {
            src: uploaded.url,
            alt: 'Blog content image'
          };
        } catch (error) {
          console.error('Image upload failed:', error);
          return { src: '', alt: 'Failed to upload image' };
        }
      })
    }
  );
  
  return {
    html: result.value,
    images: uploadedImages,
    imageCount: uploadedImages.length
  };
}

/**
 * Parse PDF with image extraction
 */
export async function parsePDFWithImages(buffer) {
  // Parse text
  const pdfParse = await import('pdf-parse');
  const textData = await pdfParse.default(buffer);
  
  // Extract images
  const pdfDoc = await PDFDocument.load(buffer);
  const uploadedImages = [];
  
  for (let pageNum = 0; pageNum < pdfDoc.getPageCount(); pageNum++) {
    const page = pdfDoc.getPage(pageNum);
    const { width, height } = page.getSize();
    
    // Note: PDF image extraction is complex
    // For production, consider using pdf2pic or external service
    // For now, we'll skip PDF image extraction
  }
  
  return {
    text: textData.text,
    images: uploadedImages,
    imageCount: uploadedImages.length
  };
}
```

### 2. Update Controller

```javascript
// server/src/modules/blogs/admin/blog.admin.controller.js

export const analyzeDocument = asyncHandler(async (req, res) => {
  const file = req.file;
  
  if (!file) {
    throw new ApiError(400, "No document uploaded");
  }
  
  let parsedContent, extractedImages = [], coverImage = null;
  
  // Parse based on file type
  if (file.mimetype === 'application/pdf') {
    const pdfData = await parsePDFWithImages(file.buffer);
    parsedContent = extractStructuredContent(pdfData.text);
    extractedImages = pdfData.images;
  } else if (file.mimetype.includes('wordprocessingml')) {
    const docxData = await parseDOCXWithImages(file.buffer);
    parsedContent = {
      title: extractTitleFromHTML(docxData.html),
      excerpt: extractExcerptFromHTML(docxData.html),
      content: docxData.html, // Already has ImageKit URLs!
      suggestedTags: extractKeywords(docxData.html)
    };
    extractedImages = docxData.images;
  }
  
  // Set first image as cover
  if (extractedImages.length > 0) {
    coverImage = {
      url: extractedImages[0].url,
      fileId: extractedImages[0].fileId,
      alt: parsedContent.title || 'Blog cover'
    };
  }
  
  const result = {
    title: parsedContent.title,
    slug: generateSlug(parsedContent.title),
    excerpt: parsedContent.excerpt,
    content: parsedContent.content,
    tags: parsedContent.suggestedTags,
    coverImage: coverImage,
    images: extractedImages, // All images for reference
    imageCount: extractedImages.length
  };
  
  res.json({ 
    success: true, 
    analyzedContent: result,
    message: `Document analyzed. ${extractedImages.length} images uploaded.`
  });
});
```

---

## Frontend Implementation

### 1. Update Modal to Show Image Upload Progress

```jsx
const [uploadProgress, setUploadProgress] = useState({
  total: 0,
  uploaded: 0,
  current: ''
});

const handleDocumentUpload = async (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  setIsAnalyzing(true);
  setUploadProgress({ total: 0, uploaded: 0, current: 'Analyzing document...' });
  
  try {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await fetch('/api/admin/blogs/analyze-document', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Auto-fill form
      setFormData(prev => ({
        ...prev,
        title: data.analyzedContent.title,
        slug: data.analyzedContent.slug,
        excerpt: data.analyzedContent.excerpt,
        content: data.analyzedContent.content,
        tags: data.analyzedContent.tags.join(', '),
      }));
      
      // Set cover image if available
      if (data.analyzedContent.coverImage) {
        setImagePreview(data.analyzedContent.coverImage.url);
      }
      
      toast.success(
        `Document analyzed! ${data.analyzedContent.imageCount} images uploaded.`
      );
    }
  } catch (error) {
    toast.error('Failed to analyze document');
  } finally {
    setIsAnalyzing(false);
  }
};

// Show upload progress in UI
{isAnalyzing && (
  <div className="mt-2 text-xs text-gray-600">
    <div className="flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
      {uploadProgress.current}
    </div>
    {uploadProgress.total > 0 && (
      <div className="mt-1">
        Uploading images: {uploadProgress.uploaded} / {uploadProgress.total}
      </div>
    )}
  </div>
)}
```

---

## Image Handling Options Summary

| Approach | Processing Time | Storage Cost | Quality | Complexity | Recommendation |
|----------|----------------|--------------|---------|------------|----------------|
| **Extract & Upload (DOCX)** | 2-5 sec | Low | High | Medium | ⭐⭐⭐⭐⭐ **BEST** |
| **Extract & Upload (PDF)** | 5-10 sec | Low | High | High | ⭐⭐⭐ Good |
| **Base64 Embed** | 1 sec | High (DB) | Low | Low | ❌ Not Recommended |
| **Manual Upload** | N/A | Low | High | Low | ⭐⭐ Fallback |

---

## Final Recommendation

### ✅ For DOCX files (Recommended):
**Use Mammoth with automatic ImageKit upload**
- Extracts images automatically
- Uploads to ImageKit during parsing
- Returns HTML with CDN URLs
- Sets first image as cover
- **Processing time**: 2-5 seconds
- **User effort**: Zero

### ⚠️ For PDF files:
**Two options**:

1. **Skip images, extract text only** (Simpler)
   - Admin can add images manually later
   - Faster processing
   - Less complex

2. **Use pdf2pic for image extraction** (Complex)
   - Extracts images but requires external dependencies
   - More processing time
   - May miss some images

---

## Security & Best Practices

1. **Validate image formats**
   ```javascript
   const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
   if (!allowedImageTypes.includes(imageType)) {
     // Skip this image
   }
   ```

2. **Limit image size**
   ```javascript
   if (imageBuffer.length > 5 * 1024 * 1024) { // 5MB
     // Compress or skip
   }
   ```

3. **Optimize before upload**
   ```javascript
   const optimized = await optimizeImage(buffer, {
     width: 1600,
     quality: 85,
     format: 'jpeg'
   });
   ```

4. **Track uploaded images**
   ```javascript
   // Store image fileIds for cleanup if blog creation fails
   const uploadedFileIds = extractedImages.map(img => img.fileId);
   // If blog save fails, delete uploaded images
   if (error) {
     await safeDeleteImages(uploadedFileIds);
   }
   ```

---

## Estimated Timeline

- **DOCX with images**: 1 day additional work
- **PDF text only**: Already included
- **PDF with images**: 2-3 days additional work

**Recommendation**: Start with DOCX image support, add PDF later if needed.

Would you like me to implement the DOCX image extraction with automatic ImageKit upload? 🚀
