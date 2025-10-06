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
      isDefault: true,
      isActive: true
    }],
    badges: [],
    isFeatured: false,
    status: 'draft',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    collections: [],
    colorVariants: [] // Add colorVariants field
  });
  
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
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
          isDefault: true,
          isActive: true
        }],
        badges: product.badges || [],
        isFeatured: product.isFeatured || false,
        status: product.status || 'draft',
        isActive: product.isActive !== undefined ? product.isActive : true,
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        collections: product.collections || [],
        colorVariants: product.colorVariants || [] // Initialize colorVariants from product data
      });
      
      // Set existing image previews
      if (product.heroImage?.url) {
        setHeroImagePreview(product.heroImage.url);
      }
      if (product.gallery && product.gallery.length > 0) {
        setGalleryPreviews(product.gallery.map(img => img.url));
      }
    }
  }, [isEditing, product]);
  
  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
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
  
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
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
  };

  const handleColorVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
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
      
      // Prepare FormData if files are involved
      const hasFiles = heroImageFile || galleryFiles.length > 0;
      if (hasFiles) {
        submitData = prepareProductFormData({
          ...submitData,
          heroImage: heroImageFile || (isEditing ? product.heroImage : undefined),
          gallery: galleryFiles.length > 0 ? galleryFiles : (isEditing ? product.gallery : [])
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
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
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
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Perfume, Ring, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
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
              <label className="block text-md font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
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
                <label className="block text-md font-medium text-gray-700 mb-1">
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
                      <span className="text-md text-gray-500">Upload hero image</span>
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
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Gallery Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {galleryPreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {galleryPreviews.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Gallery ${index}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <BiImage className="h-8 w-8 text-gray-400" />
                      <span className="text-md text-gray-500">Upload gallery images</span>
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
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      Size Label *
                    </label>
                    <input
                      type="text"
                      value={variant.sizeLabel}
                      onChange={(e) => handleVariantChange(index, 'sizeLabel', e.target.value)}
                      required
                      placeholder="e.g., 50ml, Large"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      Price (₹) {!variant.isPriceOnDemand && '*'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      required={!variant.isPriceOnDemand}
                      disabled={variant.isPriceOnDemand}
                      placeholder={variant.isPriceOnDemand ? "Price will be on demand" : ""}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${variant.isPriceOnDemand ? 'bg-gray-50 text-gray-500' : ''}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.mrp}
                      onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
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
                    Price on Demand
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
                  className="px-3 py-1 bg-blue-600 text-white text-md rounded hover:bg-blue-700"
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
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Color Name
                      </label>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorVariantChange(index, 'name', e.target.value)}
                        placeholder="Rose Gold"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Color Code
                      </label>
                      <input
                        type="text"
                        value={color.code}
                        onChange={(e) => handleColorVariantChange(index, 'code', e.target.value)}
                        placeholder="rose"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">
                        Hex Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color.hexColor}
                          onChange={(e) => handleColorVariantChange(index, 'hexColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color.hexColor}
                          onChange={(e) => handleColorVariantChange(index, 'hexColor', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={color.isAvailable}
                          onChange={(e) => handleColorVariantChange(index, 'isAvailable', e.target.checked)}
                          className="mr-2"
                        />
                        Available
                      </label>
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
              <label className="block text-md font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Fragrance Notes (for fragrance type) */}
          {formData.type === 'fragrance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Fragrance Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Top Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.fragranceNotes.top.join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.top', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Bergamot, Lemon, Orange"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Middle Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.fragranceNotes.middle.join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.middle', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Rose, Jasmine, Lavender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Base Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.fragranceNotes.base.join(', ')}
                    onChange={(e) => handleNestedChange('fragranceNotes.base', e.target.value.split(',').map(n => n.trim()).filter(Boolean))}
                    placeholder="Sandalwood, Musk, Vanilla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Caution
                  </label>
                  <textarea
                    name="caution"
                    value={formData.caution}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Storage Instructions
                  </label>
                  <textarea
                    name="storage"
                    value={formData.storage}
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
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="18 x 12 mm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="925 Sterling Silver"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Care Instructions
                  </label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* SEO & Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO & Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Collections (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.collections.join(', ')}
                  onChange={(e) => handleArrayChange('collections', e.target.value)}
                  placeholder="Summer Collection, Premium Line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
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