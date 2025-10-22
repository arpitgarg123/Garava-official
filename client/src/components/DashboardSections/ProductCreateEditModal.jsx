import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { BiUpload, BiImage } from 'react-icons/bi';
import { createProductAdmin, updateProductAdmin } from '../../features/product/adminSlice';
import { prepareProductFormData } from '../../features/product/admin.api';

const ProductCreateEditModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const { operationLoading, operationError } = useSelector(state => state.productAdmin);
  
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'fragrance',
    category: '',
    subcategory: '',
    tags: [],
    shortDescription: '',
    description: '',
    structuredDescription: {
      description: '',
      productDetails: '',
      careInstructions: '',
      sizeGuide: '',
      materials: '',
      shippingInfo: ''
    },
    fragranceNotes: {
      top: [],
      middle: [],
      base: []
    },
    ingredients: '',
    caution: '',
    storage: '',
    dimensions: '',
    material: '',
    careInstructions: '',
    variants: [{
      sku: '',
      sizeLabel: '',
      price: '',
      mrp: '',
      stock: 0,
      weight: '',
      isPriceOnDemand: false,
      priceOnDemandText: 'Price on Request',
      purchaseLimit: 0,
      leadTimeDays: 0,
      isDefault: true,
      isActive: true
    }],
    badges: [],
    isFeatured: false,
    status: 'draft',
    isActive: true,
    isPriceOnDemand: false,
    customizationOptions: {
      enabled: false,
      description: '',
      estimatedDays: 0
    },
    consultationRequired: false,
    shippingInfo: {
      complementary: false,
      minDeliveryDays: '',
      maxDeliveryDays: '',
      note: '',
      codAvailable: true,
      pincodeRestrictions: false
    },
    giftWrap: {
      enabled: false,
      price: 0,
      options: []
    },
    expectedDeliveryText: '',
    callToOrder: {
      enabled: false,
      phone: '',
      text: 'Order by Phone'
    },
    askAdvisor: false,
    bookAppointment: false,
    metaTitle: '',
    metaDescription: '',
    collections: [],
    colorVariants: []
  });
  
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
  
  // Enhanced gallery state to track existing, new, and to-delete images
  const [galleryState, setGalleryState] = useState({
    existing: [],   // Array of {url, fileId} from product.gallery
    new: [],        // Array of File objects to upload
    toDelete: []    // Array of fileIds to delete
  });
  
  // Color variant image states
  const [colorVariantImages, setColorVariantImages] = useState({});
  // Structure: { 0: { heroImage: File, heroPreview: string, gallery: [File], galleryPreviews: [string] } }
  
  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        type: product.type || 'fragrance',
        category: product.category || '',
        subcategory: product.subcategory || '',
        tags: product.tags || [],
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        structuredDescription: product.structuredDescription || {
          description: '',
          productDetails: '',
          careInstructions: '',
          sizeGuide: '',
          materials: '',
          shippingInfo: ''
        },
        fragranceNotes: product.fragranceNotes || { top: [], middle: [], base: [] },
        ingredients: product.ingredients || '',
        caution: product.caution || '',
        storage: product.storage || '',
        dimensions: product.dimensions || '',
        material: product.material || '',
        careInstructions: product.careInstructions || '',
        variants: product.variants && product.variants.length > 0 ? product.variants : [{
          sku: '',
          sizeLabel: '',
          price: '',
          mrp: '',
          stock: 0,
          weight: '',
          isPriceOnDemand: false,
          priceOnDemandText: 'Price on Request',
          purchaseLimit: 0,
          leadTimeDays: 0,
          isDefault: true,
          isActive: true
        }],
        badges: product.badges || [],
        isFeatured: product.isFeatured || false,
        status: product.status || 'draft',
        isActive: product.isActive !== undefined ? product.isActive : true,
        isPriceOnDemand: product.isPriceOnDemand || false,
        customizationOptions: product.customizationOptions || {
          enabled: false,
          description: '',
          estimatedDays: 0
        },
        consultationRequired: product.consultationRequired || false,
        shippingInfo: product.shippingInfo || {
          complementary: false,
          minDeliveryDays: '',
          maxDeliveryDays: '',
          note: '',
          codAvailable: true,
          pincodeRestrictions: false
        },
        giftWrap: product.giftWrap || {
          enabled: false,
          price: 0,
          options: []
        },
        expectedDeliveryText: product.expectedDeliveryText || '',
        callToOrder: product.callToOrder || {
          enabled: false,
          phone: '',
          text: 'Order by Phone'
        },
        askAdvisor: product.askAdvisor || false,
        bookAppointment: product.bookAppointment || false,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        collections: product.collections || [],
        colorVariants: product.colorVariants || []
      });
      
      // Set existing image previews
      if (product.heroImage?.url) {
        setHeroImagePreview(product.heroImage.url);
      }
      
      // Initialize gallery state with existing images
      if (product.gallery && product.gallery.length > 0) {
        setGalleryState({
          existing: product.gallery.map(img => ({ url: img.url, fileId: img.fileId })),
          new: [],
          toDelete: []
        });
      }
    }
  }, [isEditing, product]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal is closed
      setFormData({
        name: '',
        slug: '',
        type: 'fragrance',
        category: '',
        subcategory: '',
        tags: [],
        shortDescription: '',
        description: '',
        structuredDescription: {
          description: '',
          productDetails: '',
          careInstructions: '',
          sizeGuide: '',
          materials: '',
          shippingInfo: ''
        },
        fragranceNotes: {
          top: [],
          middle: [],
          base: []
        },
        ingredients: '',
        caution: '',
        storage: '',
        dimensions: '',
        material: '',
        careInstructions: '',
        variants: [{
          sku: '',
          sizeLabel: '',
          price: '',
          mrp: '',
          stock: 0,
          weight: '',
          isPriceOnDemand: false,
          priceOnDemandText: 'Price on Request',
          purchaseLimit: 0,
          leadTimeDays: 0,
          isDefault: true,
          isActive: true
        }],
        badges: [],
        isFeatured: false,
        status: 'draft',
        isActive: true,
        isPriceOnDemand: false,
        customizationOptions: {
          enabled: false,
          description: '',
          estimatedDays: 0
        },
        consultationRequired: false,
        shippingInfo: {
          complementary: false,
          minDeliveryDays: '',
          maxDeliveryDays: '',
          note: '',
          codAvailable: true,
          pincodeRestrictions: false
        },
        giftWrap: {
          enabled: false,
          price: 0,
          options: []
        },
        expectedDeliveryText: '',
        callToOrder: {
          enabled: false,
          phone: '',
          text: 'Order by Phone'
        },
        askAdvisor: false,
        bookAppointment: false,
        metaTitle: '',
        metaDescription: '',
        collections: [],
        colorVariants: []
      });
      setHeroImageFile(null);
      setHeroImagePreview('');
      setGalleryState({
        existing: [],
        new: [],
        toDelete: []
      });
      setColorVariantImages({});
    }
  }, [isOpen]);
  
  // Auto-generate slug from name (only for new products with actual names)
  useEffect(() => {
    if (!isEditing && formData.name && formData.name.trim() !== '') {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    } else if (!isEditing && !formData.name) {
      // Clear slug if name is cleared
      setFormData(prev => ({ ...prev, slug: '' }));
    }
  }, [formData.name, isEditing]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNestedChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newData;
    });
  };
  
  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: array }));
  };
  
  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };
  
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        sku: '',
        sizeLabel: '',
        price: '',
        mrp: '',
        stock: 0,
        weight: '',
        isPriceOnDemand: false,
        priceOnDemandText: 'Price on Request',
        purchaseLimit: 0,
        leadTimeDays: 0,
        isDefault: false,
        isActive: true
      }]
    }));
  };
  
  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setHeroImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  // Updated gallery change handler to append instead of replace
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Append new files to existing new files
    setGalleryState(prev => ({
      ...prev,
      new: [...prev.new, ...files]
    }));
    
    // Reset file input
    e.target.value = '';
  };
  
  // Remove an existing gallery image (mark for deletion)
  const removeExistingGalleryImage = (index) => {
    const imageToRemove = galleryState.existing[index];
    setGalleryState(prev => ({
      ...prev,
      existing: prev.existing.filter((_, i) => i !== index),
      toDelete: imageToRemove.fileId ? [...prev.toDelete, imageToRemove.fileId] : prev.toDelete
    }));
  };
  
  // Remove a newly added gallery image (before upload)
  const removeNewGalleryImage = (index) => {
    setGalleryState(prev => ({
      ...prev,
      new: prev.new.filter((_, i) => i !== index)
    }));
  };
  
  // Color variant management functions
  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      colorVariants: [...prev.colorVariants, {
        name: '',
        code: '',
        hexColor: '#000000',
        isAvailable: true
      }]
    }));
  };

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index)
    }));
    
    // Also remove associated images
    setColorVariantImages(prev => {
      const newImages = { ...prev };
      delete newImages[index];
      
      // Re-index remaining images
      const reindexed = {};
      Object.keys(newImages).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexed[oldIndex - 1] = newImages[key];
        } else {
          reindexed[key] = newImages[key];
        }
      });
      
      return reindexed;
    });
  };

  const handleColorVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };
  
  // Handle color variant hero image upload
  const handleColorHeroImageUpload = (index, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setColorVariantImages(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          heroImage: file,
          heroPreview: reader.result
        }
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Handle color variant gallery images upload
  const handleColorGalleryUpload = (index, files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const existingGallery = colorVariantImages[index]?.gallery || [];
    const existingPreviews = colorVariantImages[index]?.galleryPreviews || [];
    
    let loadedCount = 0;
    const newPreviews = [];
    
    fileArray.forEach((file, fileIdx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        loadedCount++;
        
        if (loadedCount === fileArray.length) {
          setColorVariantImages(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              gallery: [...existingGallery, ...fileArray],
              galleryPreviews: [...existingPreviews, ...newPreviews]
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Remove color variant hero image
  const removeColorHeroImage = (index) => {
    setColorVariantImages(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        heroImage: null,
        heroPreview: null
      }
    }));
  };
  
  // Remove specific gallery image from color variant
  const removeColorGalleryImage = (colorIndex, imageIndex) => {
    setColorVariantImages(prev => {
      const colorImages = prev[colorIndex] || {};
      const gallery = colorImages.gallery || [];
      const galleryPreviews = colorImages.galleryPreviews || [];
      
      return {
        ...prev,
        [colorIndex]: {
          ...colorImages,
          gallery: gallery.filter((_, i) => i !== imageIndex),
          galleryPreviews: galleryPreviews.filter((_, i) => i !== imageIndex)
        }
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the data
      let submitData = { ...formData };
      
      // Convert string numbers to actual numbers
      submitData.variants = submitData.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price) || 0,
        mrp: variant.mrp ? parseFloat(variant.mrp) : undefined,
        stock: parseInt(variant.stock) || 0,
        weight: variant.weight ? parseFloat(variant.weight) : undefined
      }));
      
      // Check if we have any file operations
      const hasColorImages = Object.keys(colorVariantImages).length > 0;
      const hasNewGalleryFiles = galleryState.new.length > 0;
      const hasGalleryToDelete = galleryState.toDelete.length > 0;
      const hasNewHeroImage = heroImageFile !== null;
      
      // Always use FormData when editing (for gallery management) or when files are involved
      const needsFormData = isEditing || hasNewHeroImage || hasNewGalleryFiles || hasColorImages;
      
      if (needsFormData) {
        submitData = prepareProductFormData({
          ...submitData,
          heroImage: heroImageFile || (isEditing && product?.heroImage ? product.heroImage : undefined),
          gallery: galleryState.existing,  // Existing images to keep
          newGalleryFiles: galleryState.new,  // New images to upload
          galleryToDelete: galleryState.toDelete,  // Images to delete
          colorVariantImages: colorVariantImages
        });
      }
      
      if (isEditing) {
        await dispatch(updateProductAdmin({
          productId: product._id,
          productData: submitData
        })).unwrap();
      } else {
        await dispatch(createProductAdmin(submitData)).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {operationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {operationError}
            </div>
          )}
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type || 'fragrance'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fragrance">Fragrance</option>
                  <option value="jewellery">Jewellery</option>
                  <option value="high_jewellery">High Jewellery</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Perfume, Ring, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || 'draft'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => handleArrayChange('tags', e.target.value)}
                placeholder="luxury, premium, limited edition"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Hero Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {heroImagePreview ? (
                    <div className="relative">
                      <img 
                        src={heroImagePreview} 
                        alt="Hero preview" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImageFile(null);
                          setHeroImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <AiOutlineDelete className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <BiUpload className="h-8 w-8 text-gray-400" />
                      <span className="text-[1.0625rem] text-gray-500">Upload hero image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Gallery Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {(galleryState.existing.length > 0 || galleryState.new.length > 0) ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Existing images from database */}
                        {galleryState.existing.map((image, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img 
                              src={image.url} 
                              alt={`Gallery ${index}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <AiOutlineDelete className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        {/* New images to be uploaded */}
                        {galleryState.new.map((file, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`New ${index}`}
                              className="w-full h-20 object-cover rounded border-2 border-blue-400"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <AiOutlineDelete className="h-3 w-3" />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                              New
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add More Images Button */}
                      <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        <AiOutlinePlus className="h-4 w-4" />
                        <span className="text-sm font-medium">Add More Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <BiImage className="h-8 w-8 text-gray-400" />
                      <span className="text-[1.0625rem] text-gray-500">Upload gallery images</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="btn-black btn-small"
              >
                <AiOutlinePlus className="h-4 w-4" />
                Add Variant
              </button>
            </div>
            
            {formData.variants.map((variant, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiOutlineDelete className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Size Label *
                    </label>
                    <input
                      type="text"
                      value={variant.sizeLabel || ''}
                      onChange={(e) => handleVariantChange(index, 'sizeLabel', e.target.value)}
                      required
                      placeholder="e.g., 50ml, Large"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Price (₹) {!variant.isPriceOnDemand && '*'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price || ''}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      required={!variant.isPriceOnDemand}
                      disabled={variant.isPriceOnDemand}
                      placeholder={variant.isPriceOnDemand ? "Price will be on demand" : ""}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${variant.isPriceOnDemand ? 'bg-gray-50 text-gray-500' : ''}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.mrp || ''}
                      onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock ?? ''}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={variant.weight || ''}
                      onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Purchase Limit (0 = No Limit)
                    </label>
                    <input
                      type="number"
                      value={variant.purchaseLimit || ''}
                      onChange={(e) => handleVariantChange(index, 'purchaseLimit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Lead Time (Days)
                    </label>
                    <input
                      type="number"
                      value={variant.leadTimeDays || ''}
                      onChange={(e) => handleVariantChange(index, 'leadTimeDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Price on Request section */}
                <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.isPriceOnDemand || false}
                        onChange={(e) => handleVariantChange(index, 'isPriceOnDemand', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-[1.0625rem] font-medium text-gray-700">Price on Request</span>
                    </label>
                  </div>
                  
                  {variant.isPriceOnDemand && (
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                        Price on Request Text
                      </label>
                      <input
                        type="text"
                        value={variant.priceOnDemandText || 'Price on Request'}
                        onChange={(e) => handleVariantChange(index, 'priceOnDemandText', e.target.value)}
                        placeholder="Price on Request"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variant.isDefault}
                      onChange={(e) => {
                        // Ensure only one variant is default
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            variants: prev.variants.map((v, i) => ({
                              ...v,
                              isDefault: i === index
                            }))
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    Default Variant
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) => handleVariantChange(index, 'isActive', e.target.checked)}
                      className="mr-2"
                    />
                    Active
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={variant.isPriceOnDemand}
                      onChange={(e) => handleVariantChange(index, 'isPriceOnDemand', e.target.checked)}
                      className="mr-2"
                    />
                    Price on Request
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          {/* Color Variants (for jewellery types) */}
          {(formData.type === 'jewellery' || formData.type === 'high_jewellery') && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Color Variants</h3>
                <button
                  type="button"
                  onClick={addColorVariant}
                  className="px-3 py-1 bg-blue-600 text-white text-[1.0625rem] rounded hover:bg-blue-700"
                >
                  Add Color
                </button>
              </div>
              
              {formData.colorVariants.map((color, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Color {index + 1}</h4>
                    {formData.colorVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorVariant(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                        Color Name
                      </label>
                      <input
                        type="text"
                        value={color.name || ''}
                        onChange={(e) => handleColorVariantChange(index, 'name', e.target.value)}
                        placeholder="Rose Gold"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                        Color Code
                      </label>
                      <input
                        type="text"
                        value={color.code || ''}
                        onChange={(e) => handleColorVariantChange(index, 'code', e.target.value)}
                        placeholder="rose"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                        Hex Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color.hexColor || '#000000'}
                          onChange={(e) => handleColorVariantChange(index, 'hexColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color.hexColor || '#000000'}
                          onChange={(e) => handleColorVariantChange(index, 'hexColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={color.isAvailable !== false}
                          onChange={(e) => handleColorVariantChange(index, 'isAvailable', e.target.checked)}
                          className="mr-2"
                        />
                        Available
                      </label>
                    </div>
                  </div>
                  
                  {/* Color-Specific Images Section */}
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <h5 className="text-[1.0625rem] font-medium text-gray-800">Color-Specific Images</h5>
                    
                    {/* Hero Image for this color */}
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-2">
                        Hero Image for {color.name || `Color ${index + 1}`}
                      </label>
                      
                      {colorVariantImages[index]?.heroPreview ? (
                        <div className="relative inline-block">
                          <img 
                            src={colorVariantImages[index].heroPreview} 
                            alt={`${color.name} hero`}
                            className="w-32 h-32 object-cover rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeColorHeroImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <AiOutlineClose className="w-4 h-4" />
                          </button>
                        </div>
                      ) : color.heroImage?.url ? (
                        <div className="relative inline-block">
                          <img 
                            src={color.heroImage.url} 
                            alt={`${color.name} hero`}
                            className="w-32 h-32 object-cover rounded border border-gray-300"
                          />
                          <div className="text-[1.0625rem] text-gray-500 mt-1">Current image</div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleColorHeroImageUpload(index, e.target.files[0])}
                            className="hidden"
                          />
                          <div className="text-center">
                            <BiUpload className="w-8 h-8 text-gray-400 mx-auto" />
                            <span className="text-[1.0625rem] text-gray-500">Upload Hero</span>
                          </div>
                        </label>
                      )}
                    </div>
                    
                    {/* Gallery Images for this color */}
                    <div>
                      <label className="block text-[1.0625rem] font-medium text-gray-700 mb-2">
                        Gallery Images for {color.name || `Color ${index + 1}`}
                      </label>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* Existing gallery previews */}
                        {colorVariantImages[index]?.galleryPreviews?.map((preview, imgIdx) => (
                          <div key={`new-${imgIdx}`} className="relative">
                            <img 
                              src={preview} 
                              alt={`Gallery ${imgIdx + 1}`}
                              className="w-24 h-24 object-cover rounded border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeColorGalleryImage(index, imgIdx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <AiOutlineClose className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Existing saved gallery images */}
                        {color.gallery?.map((img, imgIdx) => (
                          <div key={`existing-${imgIdx}`} className="relative">
                            <img 
                              src={img.url || img} 
                              alt={`Gallery ${imgIdx + 1}`}
                              className="w-24 h-24 object-cover rounded border border-gray-300"
                            />
                            <div className="text-[1.0625rem] text-gray-500 text-center">Saved</div>
                          </div>
                        ))}
                        
                        {/* Upload more button */}
                        <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleColorGalleryUpload(index, e.target.files)}
                            className="hidden"
                          />
                          <div className="text-center">
                            <AiOutlinePlus className="w-6 h-6 text-gray-400 mx-auto" />
                            <span className="text-[1.0625rem] text-gray-500">Add Images</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.colorVariants.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No color variants added. Click "Add Color" to add color options for this jewellery item.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Descriptions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Descriptions</h3>
            
            <div>
              <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Structured Description */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <h4 className="text-md font-medium text-gray-800">Structured Description</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Product Details
                  </label>
                  <textarea
                    value={formData.structuredDescription?.productDetails || ''}
                    onChange={(e) => handleNestedChange('structuredDescription.productDetails', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Care Instructions
                  </label>
                  <textarea
                    value={formData.structuredDescription?.careInstructions || ''}
                    onChange={(e) => handleNestedChange('structuredDescription.careInstructions', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Size Guide
                  </label>
                  <textarea
                    value={formData.structuredDescription?.sizeGuide || ''}
                    onChange={(e) => handleNestedChange('structuredDescription.sizeGuide', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Materials
                  </label>
                  <textarea
                    value={formData.structuredDescription?.materials || ''}
                    onChange={(e) => handleNestedChange('structuredDescription.materials', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Fragrance Notes (for fragrance type) */}
          {formData.type === 'fragrance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Fragrance Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Top Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(formData.fragranceNotes?.top || []).join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.top', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Bergamot, Lemon, Orange"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Middle Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(formData.fragranceNotes?.middle || []).join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.middle', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Rose, Jasmine, Lavender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Base Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(formData.fragranceNotes?.base || []).join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.base', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Sandalwood, Musk, Vanilla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Caution
                  </label>
                  <textarea
                    name="caution"
                    value={formData.caution || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Storage Instructions
                  </label>
                  <textarea
                    name="storage"
                    value={formData.storage || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Jewellery Fields (for jewellery type) */}
          {formData.type === 'jewellery' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Jewellery Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions || ''}
                    onChange={handleInputChange}
                    placeholder="18 x 12 mm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material || ''}
                    onChange={handleInputChange}
                    placeholder="925 Sterling Silver"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Care Instructions
                  </label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Business Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Business Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPriceOnDemand"
                  checked={formData.isPriceOnDemand}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Product Level Price on Request</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="consultationRequired"
                  checked={formData.consultationRequired}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Consultation Required</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="askAdvisor"
                  checked={formData.askAdvisor}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Ask Advisor</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bookAppointment"
                  checked={formData.bookAppointment}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Book Appointment</span>
              </label>
            </div>

            {/* Customization Options */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.customizationOptions.enabled}
                  onChange={(e) => handleNestedChange('customizationOptions.enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Enable Customization</span>
              </div>
              
              {formData.customizationOptions?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Customization Description
                    </label>
                    <textarea
                      value={formData.customizationOptions?.description || ''}
                      onChange={(e) => handleNestedChange('customizationOptions.description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      value={formData.customizationOptions?.estimatedDays ?? ''}
                      onChange={(e) => handleNestedChange('customizationOptions.estimatedDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Call to Order Options */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.callToOrder.enabled}
                  onChange={(e) => handleNestedChange('callToOrder.enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Enable Call to Order</span>
              </div>
              
              {formData.callToOrder?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.callToOrder?.phone || ''}
                      onChange={(e) => handleNestedChange('callToOrder.phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.callToOrder?.text || ''}
                      onChange={(e) => handleNestedChange('callToOrder.text', e.target.value)}
                      placeholder="Order by Phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <h4 className="text-md font-medium text-gray-800">Shipping Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.shippingInfo.complementary}
                    onChange={(e) => handleNestedChange('shippingInfo.complementary', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-[1.0625rem] font-medium text-gray-700">Complimentary Shipping</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.shippingInfo.codAvailable}
                    onChange={(e) => handleNestedChange('shippingInfo.codAvailable', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-[1.0625rem] font-medium text-gray-700">COD Available</span>
                </label>

                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Min Delivery Days
                  </label>
                  <input
                    type="number"
                    value={formData.shippingInfo?.minDeliveryDays ?? ''}
                    onChange={(e) => handleNestedChange('shippingInfo.minDeliveryDays', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Max Delivery Days
                  </label>
                  <input
                    type="number"
                    value={formData.shippingInfo?.maxDeliveryDays ?? ''}
                    onChange={(e) => handleNestedChange('shippingInfo.maxDeliveryDays', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Expected Delivery Text
                </label>
                <input
                  type="text"
                  name="expectedDeliveryText"
                  value={formData.expectedDeliveryText || ''}
                  onChange={handleInputChange}
                  placeholder="Expected delivery T+5 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Shipping Note
                </label>
                <textarea
                  value={formData.shippingInfo?.note || ''}
                  onChange={(e) => handleNestedChange('shippingInfo.note', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Gift Wrap Options */}
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.giftWrap.enabled}
                  onChange={(e) => handleNestedChange('giftWrap.enabled', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-[1.0625rem] font-medium text-gray-700">Enable Gift Wrap</span>
              </div>
              
              {formData.giftWrap?.enabled && (
                <div>
                  <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                    Gift Wrap Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.giftWrap?.price ?? ''}
                    onChange={(e) => handleNestedChange('giftWrap.price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SEO & Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO & Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                  Collections (comma-separated)
                </label>
                <input
                  type="text"
                  value={(formData.collections || []).join(', ')}
                  onChange={(e) => handleArrayChange('collections', e.target.value)}
                  placeholder="Summer Collection, Premium Line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[1.0625rem] font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Featured Product
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Active
              </label>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading}
              className="btn-black btn-small"
            >
              {operationLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreateEditModal;