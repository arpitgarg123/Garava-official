import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdLocalShipping } from "react-icons/md";
import { updateOrderStatusAdmin } from "../../features/order/adminSlice";
import { getOrderStatusColor } from "../../features/order/admin.api";

const ORDER_STATUSES = [
  { value: 'pending_payment', label: 'Pending Payment', description: 'Awaiting payment from customer' },
  { value: 'paid', label: 'Payment Completed', description: 'Payment received successfully' },
  { value: 'processing', label: 'Processing', description: 'Order is being prepared' },
  { value: 'partially_shipped', label: 'Partially Shipped', description: 'Some items have been shipped' },
  { value: 'shipped', label: 'Shipped', description: 'All items have been shipped' },
  { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
  { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' },
  { value: 'refunded', label: 'Refunded', description: 'Order has been refunded' },
  { value: 'failed', label: 'Failed', description: 'Order processing failed' }
];

export default function OrderStatusUpdateModal({ isOpen, onClose, order }) {
  const dispatch = useDispatch();
  const { operationLoading } = useSelector(state => state.orderAdmin);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '');
  const [notes, setNotes] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      alert('Please select a status');
      return;
    }

    try {
      const updateData = {
        status: selectedStatus,
        ...(notes.trim() && { notes: notes.trim() })
      };

      await dispatch(updateOrderStatusAdmin({ 
        orderId: order._id, 
        statusData: updateData 
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Error is handled by the slice
    }
  };

  const currentStatus = ORDER_STATUSES.find(s => s.value === order.status);
  const selectedStatusInfo = ORDER_STATUSES.find(s => s.value === selectedStatus);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <MdLocalShipping className="h-6 w-6 mr-2" />
              Update Order Status
            </h3>
            <p className="text-sm text-gray-500 mt-1">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            disabled={operationLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(order.status)}`}>
                {currentStatus?.label || order.status}
              </span>
              <span className="text-sm text-gray-500">
                {currentStatus?.description}
              </span>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option value="">Select new status</option>
              {ORDER_STATUSES.map(status => (
                <option 
                  key={status.value} 
                  value={status.value}
                  disabled={status.value === order.status}
                >
                  {status.label}
                  {status.value === order.status ? ' (Current)' : ''}
                </option>
              ))}
            </select>
            
            {selectedStatusInfo && selectedStatus !== order.status && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(selectedStatus)}`}>
                    {selectedStatusInfo.label}
                  </span>
                </div>
                <p className="text-sm text-blue-700">{selectedStatusInfo.description}</p>
              </div>
            )}
          </div>

          {/* Status Update Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Update Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status update..."
              rows="3"
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be recorded with the status update for tracking purposes.
            </p>
          </div>

          {/* Warning for certain status changes */}
          {selectedStatus === 'cancelled' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-1">⚠️ Order Cancellation</h4>
              <p className="text-sm text-red-700">
                Cancelling this order will mark it as cancelled. Make sure to process any necessary refunds separately.
              </p>
            </div>
          )}

          {selectedStatus === 'refunded' && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">💰 Refund Status</h4>
              <p className="text-sm text-orange-700">
                This status indicates the order has been refunded. Ensure the actual refund has been processed through your payment provider.
              </p>
            </div>
          )}

          {selectedStatus === 'delivered' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">✅ Order Completion</h4>
              <p className="text-sm text-green-700">
                Marking as delivered indicates successful order completion. This status change cannot be easily reversed.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={operationLoading}
              className="px-4 py-2 text-gray-700 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading || !selectedStatus || selectedStatus === order.status}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {operationLoading && (
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
              )}
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}