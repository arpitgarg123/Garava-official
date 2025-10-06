import React from 'react';
import { AiOutlineClose, AiFillStar } from 'react-icons/ai';
import { BiCategory, BiBox } from 'react-icons/bi';
import { MdInventory, MdPublish } from 'react-icons/md';
import { formatCurrency } from '../../utils/pricing';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800 border-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      archived: "bg-red-100 text-red-800 border-red-200",
      in_stock: "bg-green-100 text-green-800 border-green-200",
      out_of_stock: "bg-red-100 text-red-800 border-red-200",
      low_stock: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-50 text-gray-800 border-gray-200";
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "out_of_stock";
    if (stock < 10) return "low_stock";
    return "in_stock";
  };

  const getTotalStock = () => {
    if (!product.variants) return 0;
    return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Images */}
            <div>
              <h3 className="text-lg font-medium mb-4">Images</h3>
              
              {/* Hero Image */}
              <div className="mb-4">
                <p className="text-md text-gray-600 mb-2">Hero Image</p>
                {product.heroImage?.url ? (
                  <img 
                    src={product.heroImage.url} 
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg border border-gray-300 "
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-center">
                    <BiBox className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div>
                  <p className="text-md text-gray-600 mb-2">Gallery ({product.gallery.length} images)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {product.gallery.map((image, index) => (
                      <img 
                        key={index}
                        src={image.url} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-20 object-cover rounded border border-gray-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Basic Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-md text-gray-600">Product Name</p>
                  <p className="font-medium text-lg">{product.name}</p>
                </div>

                <div>
                  <p className="text-md text-gray-600">Slug</p>
                  <p className="text-gray-900">{product.slug}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-md text-gray-600">Type</p>
                    <div className="flex items-center">
                      <BiCategory className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="capitalize">{product.type}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-md text-gray-600">Category</p>
                    <p className="text-gray-900">{product.category}</p>
                  </div>
                </div>

                {product.subcategory && (
                  <div>
                    <p className="text-md text-gray-600">Subcategory</p>
                    <p className="text-gray-900">{product.subcategory}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-md text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      <MdPublish className="h-3 w-3 mr-1" />
                      {product.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-md text-gray-600">Total Stock</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(getStockStatus(getTotalStock()))}`}>
                      <MdInventory className="h-3 w-3 mr-1" />
                      {getTotalStock()}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-md text-gray-600">Rating</p>
                  <div className="flex items-center">
                    <AiFillStar className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-gray-900">{product.avgRating || 0} ({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-md text-gray-600 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {product.isFeatured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                      Featured
                    </span>
                  )}
                  {product.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Variants ({product.variants.length})</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map((variant, index) => (
                      <tr key={index} className={variant.isDefault ? 'bg-blue-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-md text-gray-900">
                          {variant.sku}
                          {variant.isDefault && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                              Default
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-md text-gray-900">{variant.sizeLabel}</td>
                        <td className="px-4 py-3 text-md text-gray-900">{formatCurrency(variant.price)}</td>
                        <td className="px-4 py-3 text-md text-gray-900">
                          {variant.mrp ? formatCurrency(variant.mrp) : '-'}
                        </td>
                        <td className="px-4 py-3 text-md">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStockStatus(variant.stock))}`}>
                            {variant.stock || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-md text-gray-900">
                          {variant.weight ? `${variant.weight}g` : '-'}
                        </td>
                        <td className="px-4 py-3 text-md">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {variant.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Descriptions */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Descriptions</h3>
            
            <div className="space-y-4">
              {product.shortDescription && (
                <div>
                  <p className="text-md font-medium text-gray-700 mb-2">Short Description</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.shortDescription}</p>
                </div>
              )}

              {product.description && (
                <div>
                  <p className="text-md font-medium text-gray-700 mb-2">Full Description</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fragrance Notes (for fragrance products) */}
          {product.type === 'fragrance' && product.fragranceNotes && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Fragrance Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.fragranceNotes.top && product.fragranceNotes.top.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Top Notes</p>
                    <div className="flex flex-wrap gap-1">
                      {product.fragranceNotes.top.map((note, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.fragranceNotes.middle && product.fragranceNotes.middle.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Middle Notes</p>
                    <div className="flex flex-wrap gap-1">
                      {product.fragranceNotes.middle.map((note, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.fragranceNotes.base && product.fragranceNotes.base.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Base Notes</p>
                    <div className="flex flex-wrap gap-1">
                      {product.fragranceNotes.base.map((note, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {(product.ingredients || product.caution || product.storage) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.ingredients && (
                    <div>
                      <p className="text-md font-medium text-gray-700 mb-2">Ingredients</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded text-md">{product.ingredients}</p>
                    </div>
                  )}

                  {product.caution && (
                    <div>
                      <p className="text-md font-medium text-gray-700 mb-2">Caution</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded text-md">{product.caution}</p>
                    </div>
                  )}

                  {product.storage && (
                    <div>
                      <p className="text-md font-medium text-gray-700 mb-2">Storage</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded text-md">{product.storage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Jewellery Details (for jewellery products) */}
          {product.type === 'jewellery' && (product.dimensions || product.material || product.careInstructions) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Jewellery Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.dimensions && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Dimensions</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.dimensions}</p>
                  </div>
                )}

                {product.material && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Material</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.material}</p>
                  </div>
                )}

                {product.careInstructions && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Care Instructions</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collections and Badges */}
          {((product.collections && product.collections.length > 0) || (product.badges && product.badges.length > 0)) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Collections & Badges</h3>
              
              <div className="space-y-4">
                {product.collections && product.collections.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Collections</p>
                    <div className="flex flex-wrap gap-2">
                      {product.collections.map((collection, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-md rounded-full">
                          {collection}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.badges && product.badges.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {product.badges.map((badge, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-md rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Information */}
          {(product.metaTitle || product.metaDescription) && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">SEO Information</h3>
              
              <div className="space-y-4">
                {product.metaTitle && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Meta Title</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.metaTitle}</p>
                  </div>
                )}

                {product.metaDescription && (
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">Meta Description</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{product.metaDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-medium mb-4">Timestamps</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md text-gray-600">
              <div>
                <p className="font-medium">Created</p>
                <p>{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="font-medium">Last Updated</p>
                <p>{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;