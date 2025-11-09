# Quick Test Guide - Blog Document Upload

## Test the Feature Now

### 1. Start Servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 2. Create Test DOCX File

**Option A: Microsoft Word**
1. Open Word
2. Type: "# My Amazing Blog Post" (or use H1 style)
3. Add 2-3 paragraphs
4. Insert → Pictures → Add 2-3 images
5. File → Save As → Choose .docx format
6. Name it `test-blog.docx`

**Option B: Google Docs**
1. Create new document
2. Add title with Heading 1 style
3. Add content paragraphs
4. Insert → Image → Upload images
5. File → Download → Microsoft Word (.docx)

### 3. Test Upload

1. Open browser: `http://localhost:5173`
2. Login as admin
3. Navigate to Dashboard → Blogs
4. Click "Create New Blog Post"
5. You'll see blue section at top: "Quick Fill from Document"
6. Click "Choose Document"
7. Select your `test-blog.docx`
8. Wait 3-10 seconds
9. ✅ Form fields should auto-populate
10. ✅ Cover image preview should appear
11. ✅ Success message shows image count

### 4. Verify Results

**Check Auto-Filled Fields**:
- Title: Should match document title
- Slug: URL-friendly version
- Excerpt: First paragraph (truncated)
- Content: Full document with images
- Tags: Extracted keywords
- Cover Image: First image from document

**Check ImageKit Dashboard**:
1. Login to ImageKit.io
2. Navigate to Media Library
3. Look in `/blogs/content/` folder
4. Verify your images were uploaded

### 5. Complete Blog Creation

1. Review auto-filled fields (edit if needed)
2. Select category
3. Choose status (draft/published)
4. Click "Create Blog Post"
5. Navigate to blog list
6. View published blog to verify images display

## Expected Behavior

✅ **Success Case**:
```
1. Upload .docx file
2. See: "Analyzing document..."
3. Wait 3-10 seconds
4. See: "✓ Document analyzed successfully! 3 images uploaded."
5. Form fields populated
6. Cover image preview shown
7. Can still edit all fields
8. Submit creates blog with images
```

❌ **Error Cases**:

**Wrong File Type** (.txt, .xlsx):
- Message: "✗ Failed to analyze document"
- Form not populated

**File Too Large** (>10MB):
- Upload rejected by browser/server
- Error message shown

**No Authentication**:
- 401 Unauthorized error
- Redirect to login

## API Test with Postman/cURL

```bash
# Get your JWT token first (login API)
TOKEN="your_jwt_token_here"

# Test document upload
curl -X POST http://localhost:5001/api/admin/blogs/analyze-document \
  -H "Authorization: Bearer $TOKEN" \
  -F "document=@/path/to/test-blog.docx"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "title": "My Amazing Blog Post",
    "slug": "my-amazing-blog-post",
    "excerpt": "This is the first paragraph of my blog post...",
    "content": "<p>Full HTML with <img src=\"https://ik.imagekit.io/...\"/></p>",
    "tags": ["blog", "amazing", "post", "content"],
    "coverImage": {
      "url": "https://ik.imagekit.io/iwebc6s3s/blogs/content/blog_1234567890_1.jpg",
      "fileId": "abc123",
      "alt": "My Amazing Blog Post"
    },
    "metaDescription": "This is the first paragraph...",
    "metaKeywords": "blog, amazing, post, content",
    "imagesUploaded": 3
  }
}
```

## Troubleshooting

**Issue: "Failed to analyze document"**
- Check: Is backend running? (`http://localhost:5001`)
- Check: Is JWT token valid? (login again)
- Check: Is file .docx format? (not .doc or .pdf)

**Issue: Images not showing after upload**
- Check: ImageKit credentials in `.env`
- Check: Browser console for image load errors
- Check: ImageKit dashboard for uploaded files

**Issue: Form fields empty after upload**
- Check: Document has actual content (not blank)
- Check: Title exists in document (H1 or H2)
- Check: Network tab - API returned 200 status?

**Issue: Cover image not set**
- Check: Document contains images
- Check: Response includes coverImage object
- Check: ImageKit upload succeeded

## Sample Test Document Content

```
MY TEST BLOG POST
(Make this Heading 1 style)

This is the first paragraph of my test blog post. It should become the excerpt when I upload this document. This text should be around 200 characters to test the excerpt truncation feature properly.

This is the second paragraph with more detailed content. It talks about various topics and includes rich formatting. The system should extract keywords from this content automatically.

[INSERT IMAGE 1 HERE - Will become cover image]

This is paragraph three after the first image. The image above should be uploaded to ImageKit and embedded with a CDN URL.

[INSERT IMAGE 2 HERE]

This is the final paragraph with some more content to ensure we have enough text for keyword extraction to work properly.

[INSERT IMAGE 3 HERE]
```

Save this as .docx and test!

---

**Ready to Test**: ✅ All code implemented
**Backend Status**: ✅ Syntax validated
**Frontend Status**: ✅ UI ready
**Dependencies**: ✅ Packages installed

Just create a test .docx and try it out! 🚀
