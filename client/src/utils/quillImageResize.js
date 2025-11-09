/**
 * Custom Quill Module for Image Resizing
 * Production-ready implementation with drag-to-resize functionality
 * Maintains aspect ratio and provides visual feedback
 */

import Quill from 'react-quill';

// Get the Quill Image format
const ImageBlot = Quill.Quill.import('formats/image');

// Extend Image format to add data-width and data-height attributes
class ResizableImageBlot extends ImageBlot {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'object') {
      if (value.url) {
        node.setAttribute('src', value.url);
      }
      if (value.width) {
        node.setAttribute('width', value.width);
        node.style.width = value.width + 'px';
      }
      if (value.height) {
        node.setAttribute('height', value.height);
        node.style.height = value.height + 'px';
      }
    }
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}

// Register the custom image blot
ResizableImageBlot.blotName = 'image';
ResizableImageBlot.tagName = 'IMG';
Quill.Quill.register(ResizableImageBlot, true);

class ImageResize {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.img = null;
    this.resizeBox = null;
    this.isResizing = false;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.aspectRatio = 1;
    
    // Configuration
    this.config = {
      minWidth: options.minWidth || 50,
      maxWidth: options.maxWidth || 800,
      showSize: options.showSize !== false, // Show size on resize
      maintainAspectRatio: options.maintainAspectRatio !== false,
      handleSize: options.handleSize || 12,
      ...options
    };

    // Bind methods
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.hideResizeBox = this.hideResizeBox.bind(this);

    // Initialize
    this.init();
  }

  init() {
    // Add click handler to editor
    this.quill.root.addEventListener('click', this.handleClick);
    
    // Create resize box (hidden by default)
    this.createResizeBox();
    
    // Hide resize box when clicking outside
    document.addEventListener('click', this.hideResizeBox);
    
    // Clean up on editor text change
    this.quill.on('text-change', () => {
      if (this.resizeBox && !this.isResizing) {
        this.hideResizeBox();
      }
    });
  }

  createResizeBox() {
    // Create container for resize overlay
    this.resizeBox = document.createElement('div');
    this.resizeBox.className = 'quill-image-resize-box';
    this.resizeBox.style.cssText = `
      position: absolute;
      border: 2px solid #4f46e5;
      box-sizing: border-box;
      display: none;
      pointer-events: none;
      z-index: 10;
    `;

    // Create resize handles
    const positions = ['nw', 'ne', 'sw', 'se'];
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `quill-resize-handle quill-resize-handle-${pos}`;
      handle.dataset.position = pos;
      handle.style.cssText = `
        position: absolute;
        width: ${this.config.handleSize}px;
        height: ${this.config.handleSize}px;
        background: white;
        border: 2px solid #4f46e5;
        border-radius: 50%;
        pointer-events: auto;
        cursor: ${pos === 'nw' || pos === 'se' ? 'nwse-resize' : 'nesw-resize'};
        z-index: 11;
      `;
      
      // Position the handle
      if (pos.includes('n')) handle.style.top = `-${this.config.handleSize / 2}px`;
      if (pos.includes('s')) handle.style.bottom = `-${this.config.handleSize / 2}px`;
      if (pos.includes('w')) handle.style.left = `-${this.config.handleSize / 2}px`;
      if (pos.includes('e')) handle.style.right = `-${this.config.handleSize / 2}px`;
      
      handle.addEventListener('mousedown', this.handleMouseDown);
      this.resizeBox.appendChild(handle);
    });

    // Create size display
    if (this.config.showSize) {
      this.sizeDisplay = document.createElement('div');
      this.sizeDisplay.className = 'quill-image-size-display';
      this.sizeDisplay.style.cssText = `
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
        background: #4f46e5;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: sans-serif;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      `;
      this.resizeBox.appendChild(this.sizeDisplay);
    }

    // Append to editor container
    const editorContainer = this.quill.root.parentNode;
    if (editorContainer.style.position === '' || editorContainer.style.position === 'static') {
      editorContainer.style.position = 'relative';
    }
    editorContainer.appendChild(this.resizeBox);
  }

  handleClick(e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.preventDefault();
      e.stopPropagation();
      this.showResizeBox(e.target);
    }
  }

  showResizeBox(img) {
    this.img = img;
    
    // Get image dimensions and position
    const rect = img.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();
    
    // Calculate position relative to container
    const top = rect.top - containerRect.top + this.quill.root.parentNode.scrollTop;
    const left = rect.left - containerRect.left + this.quill.root.parentNode.scrollLeft;
    
    // Store aspect ratio
    this.aspectRatio = rect.width / rect.height;
    
    // Position resize box
    this.resizeBox.style.display = 'block';
    this.resizeBox.style.top = `${top}px`;
    this.resizeBox.style.left = `${left}px`;
    this.resizeBox.style.width = `${rect.width}px`;
    this.resizeBox.style.height = `${rect.height}px`;
  }

  hideResizeBox(e) {
    if (this.isResizing) return;
    
    if (e && this.resizeBox && this.img) {
      // Check if click is on the image or resize box
      if (e.target === this.img || this.resizeBox.contains(e.target)) {
        return;
      }
    }
    
    if (this.resizeBox) {
      this.resizeBox.style.display = 'none';
    }
    this.img = null;
  }

  handleMouseDown(e) {
    if (!this.img) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    this.isResizing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startWidth = parseInt(this.img.width || this.img.offsetWidth);
    this.startHeight = parseInt(this.img.height || this.img.offsetHeight);
    
    // Store the resize direction
    this.resizeDirection = e.target.dataset.position;
    
    // Show size display
    if (this.sizeDisplay) {
      this.sizeDisplay.style.opacity = '1';
    }
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    this.quill.root.style.pointerEvents = 'none';
  }

  handleMouseMove(e) {
    if (!this.isResizing || !this.img) return;
    
    e.preventDefault();
    
    // Calculate delta
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    
    let newWidth = this.startWidth;
    let newHeight = this.startHeight;
    
    // Calculate new dimensions based on resize direction
    if (this.resizeDirection.includes('e')) {
      newWidth = this.startWidth + deltaX;
    } else if (this.resizeDirection.includes('w')) {
      newWidth = this.startWidth - deltaX;
    }
    
    if (this.resizeDirection.includes('s')) {
      newHeight = this.startHeight + deltaY;
    } else if (this.resizeDirection.includes('n')) {
      newHeight = this.startHeight - deltaY;
    }
    
    // Maintain aspect ratio
    if (this.config.maintainAspectRatio) {
      if (this.resizeDirection.includes('e') || this.resizeDirection.includes('w')) {
        newHeight = newWidth / this.aspectRatio;
      } else {
        newWidth = newHeight * this.aspectRatio;
      }
    }
    
    // Apply constraints
    newWidth = Math.max(this.config.minWidth, Math.min(this.config.maxWidth, newWidth));
    newHeight = newWidth / this.aspectRatio;
    
    // Update image size
    this.img.style.width = `${newWidth}px`;
    this.img.style.height = `${newHeight}px`;
    this.img.setAttribute('width', Math.round(newWidth));
    this.img.setAttribute('height', Math.round(newHeight));
    
    // Update resize box
    this.resizeBox.style.width = `${newWidth}px`;
    this.resizeBox.style.height = `${newHeight}px`;
    
    // Update size display
    if (this.sizeDisplay) {
      this.sizeDisplay.textContent = `${Math.round(newWidth)} × ${Math.round(newHeight)}`;
    }
  }

  handleMouseUp(e) {
    if (!this.isResizing) return;
    
    e.preventDefault();
    
    this.isResizing = false;
    
    // Hide size display
    if (this.sizeDisplay) {
      setTimeout(() => {
        this.sizeDisplay.style.opacity = '0';
      }, 1000);
    }
    
    // Remove global mouse event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    // Restore text selection
    document.body.style.userSelect = '';
    this.quill.root.style.pointerEvents = '';
    
    // Trigger change event to save
    this.quill.root.dispatchEvent(new Event('input', { bubbles: true }));
  }

  destroy() {
    // Remove event listeners
    this.quill.root.removeEventListener('click', this.handleClick);
    document.removeEventListener('click', this.hideResizeBox);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    // Remove resize box
    if (this.resizeBox && this.resizeBox.parentNode) {
      this.resizeBox.parentNode.removeChild(this.resizeBox);
    }
    
    this.img = null;
    this.resizeBox = null;
  }
}

// Register the module
Quill.Quill.register('modules/imageResize', ImageResize);

export default ImageResize;
