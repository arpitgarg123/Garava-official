/**
 * Custom Quill Image Upload Handler
 * Uploads images to ImageKit instead of embedding as base64
 */

import { blogAdminAPI } from '../features/blogs/api';

/**
 * Handles image uploads in Quill editor
 * @param {File} file - The image file to upload
 * @param {Object} quill - The Quill editor instance
 * @returns {Promise<void>}
 */
export async function quillImageUploadHandler(file, quill) {
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    alert('Image size must be less than 5MB');
    return;
  }

  try {
    // Get current cursor position
    const range = quill.getSelection(true);
    
    // Insert placeholder
    quill.insertEmbed(range.index, 'text', '📤 Uploading image...');
    quill.setSelection(range.index + 1);

    // Upload image to ImageKit via backend
    const formData = new FormData();
    formData.append('image', file);

    const response = await blogAdminAPI.uploadImage(formData);
    
    if (!response.data || !response.data.url) {
      throw new Error('No image URL returned from server');
    }

    const imageUrl = response.data.url;

    // Remove placeholder
    quill.deleteText(range.index, '📤 Uploading image...'.length);

    // Insert the uploaded image
    quill.insertEmbed(range.index, 'image', imageUrl);
    quill.setSelection(range.index + 1);

  } catch (error) {
    console.error('Image upload failed:', error);
    
    // Remove placeholder on error
    const range = quill.getSelection(true);
    if (range) {
      quill.deleteText(range.index - '📤 Uploading image...'.length, '📤 Uploading image...'.length);
    }

    alert('Failed to upload image. Please try again.');
  }
}

/**
 * Creates the image handler function for Quill toolbar
 * @param {Object} quillRef - React ref to the ReactQuill component
 * @returns {Function} Image handler function
 */
export function createImageHandler(quillRef) {
  return function() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.onchange = async () => {
      const file = input.files[0];
      if (file && quillRef.current) {
        const quill = quillRef.current.getEditor();
        await quillImageUploadHandler(file, quill);
      }
    };
    
    input.click();
  };
}
