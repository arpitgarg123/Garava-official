import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineLoading3Quarters, AiOutlineDollar } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { MdPayment } from "react-icons/md";
import { refundOrderAdmin } from "../../features/order/adminSlice";
import { formatCurrency } from "../../utils/pricing";
import { formatOrderForDisplay } from "../../features/order/admin.api";

const REFUND_REASONS = [
  'Customer requested cancellation',
  'Product defective/damaged',
  'Wrong item shipped',
  'Item not as described',
  'Shipping delay',
  'Duplicate order',
  'Customer not satisfied',
  'Other'
];

export default function OrderRefundModal({ isOpen, onClose, order }) {
  const dispatch = useDispatch();
  const { operationLoading } = useSelector(state => state.orderAdmin);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [refundType, setRefundType] = useState('full'); // 'full' or 'partial'

  if (!isOpen || !order) return null;

  const formattedOrder = formatOrderForDisplay(order);
  const maxRefundAmount = formattedOrder.totalAmount;

  // Set default refund amount when refund type changes
  React.useEffect(() => {
    if (refundType === 'full') {
      setRefundAmount(maxRefundAmount.toString());
    } else {
      setRefundAmount('');
    }
  }, [refundType, maxRefundAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(refundAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid refund amount');
      return;
    }
    
    if (amount > maxRefundAmount) {
      alert(`Refund amount cannot exceed ${formatCurrency(maxRefundAmount)}`);
      return;
    }
    
    if (!refundReason) {
      alert('Please select a refund reason');
      return;
    }
    
    if (refundReason === 'Other' && !customReason.trim()) {
      alert('Please provide a custom reason');
      return;
    }

    try {
      const refundData = {
        amount: amount,
        reason: refundReason === 'Other' ? customReason.trim() : refundReason,
        ...(notes.trim() && { notes: notes.trim() }),
        refundType: refundType
      };

      await dispatch(refundOrderAdmin({ 
        orderId: order._id, 
        refundData 
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to process refund:', error);
      // Error is handled by the slice
    }
  };

  const isPartialRefund = refundType === 'partial';
  const refundPercentage = refundAmount ? ((parseFloat(refundAmount) / maxRefundAmount) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <AiOutlineDollar className="h-6 w-6 mr-2" />
              Process Refund
            </h3>
            <p className="text-md text-gray-500 mt-1">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            disabled={operationLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-md">
            <div className="flex items-center gap-2">
              <BiUser className="h-4 w-4 text-gray-400" />
              <span>{formattedOrder.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MdPayment className="h-4 w-4 text-gray-400" />
              <span>{order.payment?.method || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium">Total Paid:</span> {formatCurrency(formattedOrder.totalAmount)}
            </div>
            <div>
              <span className="font-medium">Payment Status:</span> {order.payment?.status || 'unpaid'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Refund Type */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-700 mb-3">
              Refund Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative">
                <input
                  type="radio"
                  value="full"
                  checked={refundType === 'full'}
                  onChange={(e) => setRefundType(e.target.value)}
                  disabled={operationLoading}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  refundType === 'full' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="font-medium text-gray-900">Full Refund</div>
                  <div className="text-md text-gray-500">Refund entire order amount</div>
                  <div className="text-lg font-semibold text-blue-600 mt-2">
                    {formatCurrency(maxRefundAmount)}
                  </div>
                </div>
              </label>
              
              <label className="relative">
                <input
                  type="radio"
                  value="partial"
                  checked={refundType === 'partial'}
                  onChange={(e) => setRefundType(e.target.value)}
                  disabled={operationLoading}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  refundType === 'partial' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <div className="font-medium text-gray-900">Partial Refund</div>
                  <div className="text-md text-gray-500">Refund specific amount</div>
                  <div className="text-md text-gray-600 mt-2">
                    Custom amount
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Refund Amount */}
          <div className="mb-6">
            <label htmlFor="refundAmount" className="block text-md font-medium text-gray-700 mb-2">
              Refund Amount * 
              {isPartialRefund && refundAmount && (
                <span className="text-gray-500 ml-2">({refundPercentage}% of total)</span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="refundAmount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                step="0.01"
                min="0"
                max={maxRefundAmount}
                required
                disabled={operationLoading || refundType === 'full'}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum refundable amount: {formatCurrency(maxRefundAmount)}
            </p>
          </div>

          {/* Refund Reason */}
          <div className="mb-6">
            <label htmlFor="refundReason" className="block text-md font-medium text-gray-700 mb-2">
              Refund Reason *
            </label>
            <select
              id="refundReason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              required
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
            >
              <option value="">Select a reason</option>
              {REFUND_REASONS.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {/* Custom Reason */}
          {refundReason === 'Other' && (
            <div className="mb-6">
              <label htmlFor="customReason" className="block text-md font-medium text-gray-700 mb-2">
                Custom Reason *
              </label>
              <input
                type="text"
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                required
                disabled={operationLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50"
                placeholder="Please specify the reason for refund"
              />
            </div>
          )}

          {/* Additional Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-md font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about this refund..."
              rows="3"
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 resize-none"
            />
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">⚠️ Refund Processing</h4>
            <p className="text-md text-yellow-700">
              This action will initiate the refund process. The actual refund will be processed through your payment provider and may take 3-7 business days to appear in the customer's account.
            </p>
          </div>

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
              disabled={operationLoading || !refundAmount || !refundReason}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {operationLoading && (
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
              )}
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}