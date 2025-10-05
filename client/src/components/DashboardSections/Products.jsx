import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  AiOutlinePlus, 
  AiOutlineSearch, 
  AiOutlineEye,
  AiOutlineFilter
} from "react-icons/ai";
import { FiEdit, FiMoreVertical } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiCategory, BiX } from "react-icons/bi";
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
import { useToastContext } from "../../layouts/Toast";

function getStatusColor(status) {
  const colors = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-red-100 text-red-800",
    in_stock: "bg-green-100 text-green-800",
    out_of_stock: "bg-red-100 text-red-800",
    low_stock: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-50 text-gray-800";
}

function getStockStatus(variant) {
  if (!variant || variant.stock === undefined) return "unknown";
  if (variant.stock === 0) return "out_of_stock";
  if (variant.stock < 10) return "low_stock";
  return "in_stock";
}

export default function Products() {
  const dispatch = useDispatch();
  const toast = useToastContext();
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
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState(filters.q || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters({ ...localFilters, ...newFilters });
    dispatch(setFilters({ ...newFilters, page: 1 }));
    toast?.success('Filters applied successfully', 'Products');
  };
  
  const handleSearch = () => {
    handleFilterChange({ q: searchTerm });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ q: '', status: '', category: '' });
    setSearchTerm('');
    toast?.info('All filters cleared', 'Products');
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to archive this product?')) {
      try {
        await dispatch(deleteProductAdmin(productId)).unwrap();
        toast?.success('Product archived successfully', 'Product Management');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast?.error('Failed to archive product. Please try again.', 'Error');
      }
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowCreateModal(true);
  };
  
  const handleViewProduct = (product) => {
    setSelectedProductLocal(product);
    dispatch(setSelectedProduct(product));
    setShowDetailsModal(true);
  };
  
  const handleManageVariants = (product) => {
    setSelectedProductLocal(product);
    setShowVariantModal(true);
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ ...filters, page: newPage }));
    toast?.info(`Viewing page ${newPage} of ${pagination.totalPages}`, 'Pagination');
  };

  // Mobile Card Component
  const MobileProductCard = ({ product }) => {
    const firstVariant = product.variants?.[0] || {};
    const stockStatus = getStockStatus(firstVariant);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4">
          {/* Product Header */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="h-16 w-16 flex-shrink-0">
              <img 
                className="h-16 w-16 rounded-lg object-cover" 
                src={product.heroImage?.url || '/placeholder.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                SKU: {firstVariant.sku || product.sku || 'No SKU'}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.category || 'Uncategorized'}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(firstVariant.price || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Stock</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stockStatus)}`}>
                {firstVariant.stock || 0} units
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewProduct(product)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                title="View Details"
              >
                <AiOutlineEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEditProduct(product)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                title="Edit Product"
              >
                <FiEdit className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Archive Product"
            >
              <RiDeleteBin6Line className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Desktop Table Component
  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const firstVariant = product.variants?.[0] || {};
            const stockStatus = getStockStatus(firstVariant);
            
            return (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={product.heroImage?.url || '/placeholder.jpg'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        SKU: {firstVariant.sku || product.sku || 'No SKU'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-800">
                    {product.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(firstVariant.price || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stockStatus)}`}>
                    {firstVariant.stock || 0} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <AiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Edit Product"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Archive Product"
                    >
                      <RiDeleteBin6Line className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading products</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Actions - Responsive */}
      <div className="flex-shrink-0 w-full p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Products Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.total || 0} total products
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowCreateModal(true);
            }}
            className="btn-black btn-small"
          >
            <AiOutlinePlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <p className="text-sm text-gray-600">
            {products.length} products
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <AiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="fragrance">Fragrance</option>
            <option value="jewelry">Jewelry</option>
            <option value="essentials">Essentials</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
          
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 lg:hidden ${
          showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileFilters(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${
            showMobileFilters ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button 
              onClick={() => setShowMobileFilters(false)} 
              className="p-1 rounded-full hover:bg-gray-50"
            >
              <BiX size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Mobile Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="fragrance">Fragrance</option>
                <option value="jewelry">Jewelry</option>
                <option value="essentials">Essentials</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex gap-4">
            <button 
              onClick={() => {
                handleClearFilters();
                setShowMobileFilters(false);
              }}
              className="flex-1 py-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => {
                handleSearch();
                setShowMobileFilters(false);
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Content - Responsive */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <BiCategory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No products found</p>
              <p className="text-gray-400 text-sm mb-4">
                {Object.values(localFilters).some(val => val) 
                  ? "Try adjusting your filters or search terms"
                  : "Add your first product to get started"
                }
              </p>
              {Object.values(localFilters).some(val => val) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {/* Mobile Cards */}
            <div className="block lg:hidden p-4 space-y-4">
              {products.map((product) => (
                <MobileProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block h-full">
              <DesktopTable />
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Responsive */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Prev
              </button>
              <span className="px-3 py-2 bg-black text-white rounded-lg font-medium text-sm min-w-[40px] text-center">
                {pagination.page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border rounded text-sm ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductCreateEditModal
        isOpen={showCreateModal}
        product={editingProduct}
        onClose={() => {
          setShowCreateModal(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          setShowCreateModal(false);
          setEditingProduct(null);
          dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
          toast?.success('Product saved successfully', 'Product Management');
        }}
      />

      <ProductDetailsModal
        isOpen={showDetailsModal}
        product={selectedProduct}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProductLocal(null);
        }}
        onEdit={() => {
          setShowDetailsModal(false);
          handleEditProduct(selectedProduct);
        }}
        onManageVariants={() => {
          setShowDetailsModal(false);
          handleManageVariants(selectedProduct);
        }}
      />

      <VariantManageModal
        isOpen={showVariantModal}
        product={selectedProduct}
        onClose={() => {
          setShowVariantModal(false);
          setSelectedProductLocal(null);
        }}
        onSuccess={() => {
          setShowVariantModal(false);
          setSelectedProductLocal(null);
          dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
          toast?.success('Variants updated successfully', 'Product Management');
        }}
      />
    </div>
  );
}