import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  AiOutlinePlus, 
  AiOutlineSearch, 
  AiOutlineEye, 
  AiFillStar,
  AiOutlineFilter,
  AiOutlineReload
} from "react-icons/ai";
import { FiEdit, FiMoreVertical } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiCategory, BiBox } from "react-icons/bi";
import { MdInventory, MdPublish } from "react-icons/md";
import { 
  fetchProductsAdmin, 
  deleteProductAdmin, 
  setFilters, 
  clearFilters,
  setSelectedProduct 
} from "../../features/product/adminSlice";
import ProductCreateEditModal from "./ProductCreateEditModal";
import ProductDetailsModal from "./ProductDetailsModal";
import VariantManageModal from "./VariantManageModal";
import { formatCurrency } from "../../utils/pricing";

function getStatusColor(status) {
  const colors = {
    published: "bg-green-100 text-green-800 border-green-200",
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    archived: "bg-red-100 text-red-800 border-red-200",
    in_stock: "bg-green-100 text-green-800 border-green-200",
    out_of_stock: "bg-red-100 text-red-800 border-red-200",
    low_stock: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

function getStockStatus(variant) {
  if (!variant || variant.stock === undefined) return "unknown";
  if (variant.stock === 0) return "out_of_stock";
  if (variant.stock < 10) return "low_stock";
  return "in_stock";
}

export default function Products() {
  const dispatch = useDispatch();
  const { 
    products, 
    pagination, 
    filters, 
    loading, 
    error, 
    operationLoading 
  } = useSelector(state => state.productAdmin);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProductLocal] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Local filter states for immediate UI updates
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters({ ...localFilters, ...newFilters });
    dispatch(setFilters({ ...newFilters, page: 1 })); // Reset to page 1 when filtering
  };
  
  const handleSearch = (searchTerm) => {
    handleFilterChange({ q: searchTerm });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ q: '', status: '', category: '' });
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to archive this product?')) {
      try {
        await dispatch(deleteProductAdmin(productId)).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowCreateModal(true);
  };
  
  const handleViewDetails = (product) => {
    setSelectedProductLocal(product);
    dispatch(setSelectedProduct(product));
    setShowDetailsModal(true);
  };
  
  const handleManageVariants = (product) => {
    setSelectedProductLocal(product);
    dispatch(setSelectedProduct(product));
    setShowVariantModal(true);
  };
  
  const handleRefresh = () => {
    dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
  };
  
  const getMainVariant = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find(v => v.isDefault) || product.variants[0];
  };
  
  const getTotalStock = (product) => {
    if (!product.variants) return 0;
    return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  };
  
  const filteredProducts = useMemo(() => {
    if (!localFilters.q && !localFilters.status && !localFilters.category) {
      return products;
    }
    
    return products.filter(product => {
      const matchesSearch = !localFilters.q || 
        product.name?.toLowerCase().includes(localFilters.q.toLowerCase()) ||
        product.slug?.toLowerCase().includes(localFilters.q.toLowerCase()) ||
        product.category?.toLowerCase().includes(localFilters.q.toLowerCase());
        
      const matchesStatus = !localFilters.status || product.status === localFilters.status;
      const matchesCategory = !localFilters.category || product.category === localFilters.category;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, localFilters]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} total products • {filteredProducts.length} shown
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <AiOutlineReload className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setShowCreateModal(true);
              }}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <AiOutlinePlus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  value={localFilters.q}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name, slug, or category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select 
                value={localFilters.status} 
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-48">
              <select 
                value={localFilters.category} 
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                <option value="fragrance">Fragrance</option>
                <option value="jewellery">Jewellery</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Clear Filters */}
            {(localFilters.q || localFilters.status || localFilters.category) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-hidden">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BiBox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">
                {localFilters.q || localFilters.status || localFilters.category 
                  ? "Try adjusting your filters" 
                  : "Get started by creating your first product"
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <div className="bg-white border border-gray-200 rounded-lg mx-6 mb-6 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const mainVariant = getMainVariant(product);
                    const totalStock = getTotalStock(product);
                    const stockStatus = getStockStatus({ stock: totalStock });
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {product.heroImage?.url ? (
                                <img 
                                  className="h-12 w-12 rounded-lg object-cover border border-gray-200" 
                                  src={product.heroImage.url} 
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <BiBox className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {product.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiCategory className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">{product.category}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(stockStatus)}`}>
                            <MdInventory className="h-3 w-3 mr-1" />
                            {totalStock}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {mainVariant ? formatCurrency(mainVariant.price) : 'No variants'}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            <MdPublish className="h-3 w-3 mr-1" />
                            {product.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AiFillStar className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {product.avgRating || 0} ({product.reviewCount || 0})
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(product)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <AiOutlineEye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit Product"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleManageVariants(product)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Manage Variants"
                            >
                              <MdInventory className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Archive Product"
                              disabled={operationLoading}
                            >
                              <RiDeleteBin6Line className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <ProductCreateEditModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
        />
      )}
      
      {showDetailsModal && selectedProduct && (
        <ProductDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProductLocal(null);
          }}
          product={selectedProduct}
        />
      )}
      
      {showVariantModal && selectedProduct && (
        <VariantManageModal
          isOpen={showVariantModal}
          onClose={() => {
            setShowVariantModal(false);
            setSelectedProductLocal(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
