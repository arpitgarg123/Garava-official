import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  AiOutlineSearch, 
  AiOutlineEye,
  AiOutlineReload,
  AiOutlineFilter,
  AiOutlineDollar
} from "react-icons/ai";
import { BiPackage, BiUser, BiCalendar } from "react-icons/bi";
import { MdPayment, MdLocalShipping, MdRefresh } from "react-icons/md";
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

export default function Orders() {
  const dispatch = useDispatch();
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Local filter states for immediate UI updates
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters({ ...localFilters, ...newFilters });
    dispatch(setFilters({ ...newFilters, page: 1 })); // Reset to page 1 when filtering
  };
  
  const handleSearch = (searchTerm) => {
    handleFilterChange({ user: searchTerm });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ status: '', user: '' });
  };
  
  const handleViewDetails = (order) => {
    setSelectedOrderLocal(order);
    dispatch(setSelectedOrder(order));
    setShowDetailsModal(true);
  };
  
  const handleUpdateStatus = (order) => {
    setSelectedOrderLocal(order);
    dispatch(setSelectedOrder(order));
    setShowStatusModal(true);
  };
  
  const handleRefund = (order) => {
    setSelectedOrderLocal(order);
    dispatch(setSelectedOrder(order));
    setShowRefundModal(true);
  };
  
  const handleRefresh = () => {
    dispatch(fetchOrdersAdmin({ ...filters, page: pagination.page }));
  };
  
  const filteredOrders = useMemo(() => {
    if (!localFilters.status && !localFilters.user) {
      return orders;
    }
    
    return orders.filter(order => {
      const matchesStatus = !localFilters.status || order.status === localFilters.status;
      const matchesUser = !localFilters.user || 
        order.userSnapshot?.name?.toLowerCase().includes(localFilters.user.toLowerCase()) ||
        order.userSnapshot?.email?.toLowerCase().includes(localFilters.user.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(localFilters.user.toLowerCase());
      
      return matchesStatus && matchesUser;
    });
  }, [orders, localFilters]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} total orders • {filteredOrders.length} shown
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
                  value={localFilters.user}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by customer name, email, or order number..."
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
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="partially_shipped">Partially Shipped</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            {/* Clear Filters */}
            {(localFilters.status || localFilters.user) && (
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
        
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BiPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {localFilters.status || localFilters.user 
                  ? "Try adjusting your filters" 
                  : "No orders have been placed yet"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const formattedOrder = formatOrderForDisplay(order);
                    
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {order._id.slice(-8)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiUser className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formattedOrder.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formattedOrder.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiPackage className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formattedOrder.itemsCount} item{formattedOrder.itemsCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AiOutlineDollar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(formattedOrder.totalAmount)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment?.status)}`}>
                              <MdPayment className="h-3 w-3 mr-1" />
                              {order.payment?.status || 'unpaid'}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {order.payment?.method || 'N/A'}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.status)}`}>
                            <MdLocalShipping className="h-3 w-3 mr-1" />
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              <div>{formattedOrder.formattedDate}</div>
                              <div className="text-xs text-gray-500">{formattedOrder.formattedTime}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(order)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <AiOutlineEye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Update Status"
                            >
                              <MdRefresh className="h-4 w-4" />
                            </button>
                            {order.payment?.status === 'paid' && order.status !== 'refunded' && (
                              <button 
                                onClick={() => handleRefund(order)}
                                className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded transition-colors"
                                title="Process Refund"
                              >
                                <AiOutlineDollar className="h-4 w-4" />
                              </button>
                            )}
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
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrderLocal(null);
          }}
          order={selectedOrder}
        />
      )}
      
      {showStatusModal && selectedOrder && (
        <OrderStatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrderLocal(null);
          }}
          order={selectedOrder}
        />
      )}
      
      {showRefundModal && selectedOrder && (
        <OrderRefundModal
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedOrderLocal(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
