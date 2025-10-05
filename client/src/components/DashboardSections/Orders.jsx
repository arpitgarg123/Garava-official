import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  AiOutlineSearch, 
  AiOutlineEye,
  AiOutlineReload,
  AiOutlineFilter
} from "react-icons/ai";
import { BiPackage, BiUser, BiCalendar, BiX } from "react-icons/bi";
import { MdPayment, MdLocalShipping } from "react-icons/md";
import { 
  fetchOrdersAdmin, 
  updateOrderStatusAdmin,
  setFilters, 
  clearFilters,
  setSelectedOrder 
} from "../../features/order/adminSlice";
import { getOrderStatusColor, getPaymentStatusColor, formatOrderForDisplay } from "../../features/order/admin.api";
import { formatCurrency } from "../../utils/pricing";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderStatusUpdateModal from "./OrderStatusUpdateModal";
import OrderRefundModal from "./OrderRefundModal";
import { formatDateTime } from "../../utils/FormatDate";
import { useToastContext } from "../../layouts/Toast";

function getStatusBgColor(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-50 text-gray-800",
  };
  return colors[status] || "bg-gray-50 text-gray-800";
}

function getPaymentBgColor(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-50 text-gray-800",
  };
  return colors[status] || "bg-gray-50 text-gray-800";
}

export default function Orders() {
  const dispatch = useDispatch();
  const toast = useToastContext();
  const { 
    orders, 
    pagination, 
    filters, 
    loading, 
    error, 
    operationLoading 
  } = useSelector(state => state.orderAdmin);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrderLocal] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState(filters.q || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  useEffect(() => {
    dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));
    toast?.success('Filters applied successfully', 'Orders');
  };
  
  const handleSearch = () => {
    handleFilterChange({ q: searchTerm, page: 1 });
  };
  
  const handleClearFilters = () => {
    const clearedFilters = { q: '', status: '', paymentStatus: '', user: '', page: 1 };
    dispatch(clearFilters());
    setLocalFilters(clearedFilters);
    setSearchTerm('');
    toast?.info('All filters cleared', 'Orders');
  };

  const handleViewOrder = (order) => {
    setSelectedOrderLocal(order);
    dispatch(setSelectedOrder(order));
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrderLocal(order);
    setShowStatusModal(true);
  };

  const handleRefund = (order) => {
    setSelectedOrderLocal(order);
    setShowRefundModal(true);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange({ page: newPage });
    toast?.info(`Viewing page ${newPage} of ${pagination.totalPages}`, 'Pagination');
  };

  // Mobile Order Card Component
  const MobileOrderCard = ({ order }) => {
    const customerName = order.user?.name || order.customer?.name || order.shippingAddress?.name || 'Guest Customer';
    const customerEmail = order.user?.email || order.customer?.email || order.shippingAddress?.email || 'No email provided';
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4">
          {/* Mobile Card Header */}
          <div className="flex justify-between items-start mb-3 ">
            <div className="flex-1 ">
              <h3 className="text-xs font-medium text-gray-900 truncate pl-2">
                #{order.orderNumber}
              </h3>
              <p className="text-xs text-gray-500 mt-1 pl-2">
                {order.items?.length || 0} items • {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 ">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(order.status)}`}>
                {order.status || 'pending'}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentBgColor(order.paymentStatus)}`}>
                {order.paymentStatus || 'pending'}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center mb-3 ml-3">
            <div className="h-10 w-10 flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <BiUser className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{customerName}</p>
              <p className="text-xs text-gray-500 truncate">{customerEmail}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(order.grandTotal || 0)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewOrder(order)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                title="View Details"
              >
                <AiOutlineEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(order)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                title="Update Status"
              >
                <MdLocalShipping className="w-4 h-4" />
              </button>
            </div>
            {(order.paymentStatus === 'success' && order.status !== 'refunded') && (
              <button
                onClick={() => handleRefund(order)}
                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                title="Process Refund"
              >
                <MdPayment className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Desktop Table Component
  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <BiUser className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || order.customer?.name || order.shippingAddress?.name || 'Guest Customer'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email || order.customer?.email || order.shippingAddress?.email || 'No email provided'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDateTime(order.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.grandTotal || 0)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgColor(order.status)}`}>
                  {order.status || 'pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBgColor(order.paymentStatus)}`}>
                  {order.paymentStatus || 'pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="View Details"
                  >
                    <AiOutlineEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order)}
                    className="text-green-600 hover:text-green-900 p-1"
                    title="Update Status"
                  >
                    <MdLocalShipping className="w-4 h-4" />
                  </button>
                  {(order.paymentStatus === 'success' && order.status !== 'refunded') && (
                    <button
                      onClick={() => handleRefund(order)}
                      className="text-orange-600 hover:text-orange-900 p-1"
                      title="Process Refund"
                    >
                      <MdPayment className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading orders</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }))}
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
              Orders Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {pagination.total || 0} total orders
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }))}
            className="btn-black btn-small"
            disabled={loading}
          >
            <AiOutlineReload className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <p className="text-sm text-gray-600">
            {orders.length} orders
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-sm  border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                placeholder="Search orders by ID, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>
          
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <select
            value={localFilters.paymentStatus || ''}
            onChange={(e) => handleFilterChange({ paymentStatus: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md outline-none"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Payment Pending</option>
            <option value="success">Payment Success</option>
            <option value="failed">Payment Failed</option>
            <option value="refunded">Refunded</option>
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
            <h3 className="font-semibold text-lg">Filter Orders</h3>
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
                  placeholder="Search orders by ID, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none"
                />
              </div>
            </div>

            {/* Mobile Order Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Mobile Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={localFilters.paymentStatus || ''}
                onChange={(e) => handleFilterChange({ paymentStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Payment Pending</option>
                <option value="success">Payment Success</option>
                <option value="failed">Payment Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex gap-4 justify-between">
            <button 
              onClick={() => {
                handleClearFilters();
                setShowMobileFilters(false);
              }}
              className="border py-1  btn-small px-4"
            >
              Clear All
            </button>
            <button 
              onClick={() => {
                handleSearch();
                setShowMobileFilters(false);
              }}
              className="btn-black btn-small"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content - Responsive */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="h-full flex items-center justify-center ">
            <div className="text-center max-w-md mx-auto">
              <BiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No orders found</p>
              <p className="text-gray-400 text-sm mb-4">
                {Object.values(localFilters).some(val => val) 
                  ? "Try adjusting your filters or search terms"
                  : "Orders will appear here when customers place them"
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
              {orders.map((order) => (
                <MobileOrderCard key={order._id} order={order} />
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
            <div className="text-xs text-gray-700 text-center sm:text-left">
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
              <span className="px-3 py-2 bg-black text-white rounded-lg font-medium text-xs min-w-[40px] text-center">
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
            {/* <div className="hidden sm:flex items-center gap-2">
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
                        ? 'bg-black text-white border-black'
                        : 'border-white text-black hover:bg-gray-50'
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
            </div> */}
          </div>
        </div>
      )}

      {/* Modals */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        order={selectedOrder}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrderLocal(null);
        }}
        onUpdateStatus={() => {
          setShowDetailsModal(false);
          handleUpdateStatus(selectedOrder);
        }}
        onRefund={() => {
          setShowDetailsModal(false);
          handleRefund(selectedOrder);
        }}
      />

      <OrderStatusUpdateModal
        isOpen={showStatusModal}
        order={selectedOrder}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrderLocal(null);
        }}
        onSuccess={() => {
          setShowStatusModal(false);
          setSelectedOrderLocal(null);
          dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }));
          toast?.success('Order status updated successfully', 'Order Management');
        }}
      />

      <OrderRefundModal
        isOpen={showRefundModal}
        order={selectedOrder}
        onClose={() => {
          setShowRefundModal(false);
          setSelectedOrderLocal(null);
        }}
        onSuccess={() => {
          setShowRefundModal(false);
          setSelectedOrderLocal(null);
          dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }));
          toast?.success('Refund processed successfully', 'Order Management');
        }}
      />
    </div>
  );
}