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
import { BiCategory } from "react-icons/bi";
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
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-red-100 text-red-800",
    in_stock: "bg-green-100 text-green-800",
    out_of_stock: "bg-red-100 text-red-800",
    low_stock: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
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
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState(filters.q || '');
  
  useEffect(() => {
    dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters({ ...localFilters, ...newFilters });
    dispatch(setFilters({ ...newFilters, page: 1 }));
  };
  
  const handleSearch = () => {
    handleFilterChange({ q: searchTerm });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ q: '', status: '', category: '' });
    setSearchTerm('');
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
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading products</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchProductsAdmin({ ...filters, page: pagination.page }))}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Products Management</h2>
            <p className="text-sm text-gray-600">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <AiOutlinePlus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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

      {/* Products Table */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BiCategory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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
        }}
      />
    </div>
  );
}