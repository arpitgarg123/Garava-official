import React from "react";
import { AiOutlineClose, AiOutlineDollar } from "react-icons/ai";
import { BiPackage, BiUser, BiCalendar, BiMapPin } from "react-icons/bi";
import { MdPayment, MdLocalShipping } from "react-icons/md";
import { getOrderStatusColor, getPaymentStatusColor, formatOrderForDisplay } from "../../features/order/admin.api";
import { formatCurrency } from "../../utils/pricing";

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const formattedOrder = formatOrderForDisplay(order);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
            <p className="text-md text-gray-500 mt-1">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Order Status & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MdLocalShipping className="h-5 w-5 mr-2" />
                Order Status
              </h4>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-medium border ${getOrderStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </span>
              <div className="mt-3 text-md text-gray-600">
                <div className="flex items-center gap-2">
                  <BiCalendar className="h-4 w-4" />
                  <span>Ordered: {formattedOrder.formattedDate} at {formattedOrder.formattedTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MdPayment className="h-5 w-5 mr-2" />
                Payment Details
              </h4>
              <div className="space-y-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-medium border ${getPaymentStatusColor(order.payment?.status)}`}>
                  {order.payment?.status || 'unpaid'}
                </span>
                <div className="text-md text-gray-600">
                  <div>Method: {order.payment?.method || 'N/A'}</div>
                  {order.payment?.transactionId && (
                    <div>Transaction: {order.payment.transactionId}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BiUser className="h-5 w-5 mr-2" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Contact Details</h5>
                <div className="space-y-1 text-md">
                  <div><strong>Name:</strong> {formattedOrder.customerName}</div>
                  <div><strong>Email:</strong> {formattedOrder.customerEmail}</div>
                  {order.userSnapshot?.phone && (
                    <div><strong>Phone:</strong> {order.userSnapshot.phone}</div>
                  )}
                </div>
              </div>
              
              {order.shippingAddress && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                    <BiMapPin className="h-4 w-4 mr-1" />
                    Shipping Address
                  </h5>
                  <div className="text-md space-y-1">
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </div>
                    <div>{order.shippingAddress.country}</div>
                    {order.shippingAddress.phone && (
                      <div>Phone: {order.shippingAddress.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BiPackage className="h-5 w-5 mr-2" />
              Order Items ({formattedOrder.itemsCount} item{formattedOrder.itemsCount !== 1 ? 's' : ''})
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.productSnapshot?.images?.[0] && (
                            <img 
                              src={item.productSnapshot.images[0]} 
                              alt={item.productSnapshot.name}
                              className="h-10 w-10 rounded-md object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-md font-medium text-gray-900">
                              {item.productSnapshot?.name || 'Unknown Product'}
                            </div>
                            <div className="text-md text-gray-500">
                              SKU: {item.productSnapshot?.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {item.variantSnapshot ? (
                          <div>
                            {item.variantSnapshot.sizeLabel && (
                              <div className="font-medium">{item.variantSnapshot.sizeLabel}</div>
                            )}
                            {item.variantSnapshot.color && (
                              <div className="text-xs text-gray-500">{item.variantSnapshot.color}</div>
                            )}
                            {item.variantSnapshot.sku && (
                              <div className="text-xs text-gray-400">SKU: {item.variantSnapshot.sku}</div>
                            )}
                            {!item.variantSnapshot.sizeLabel && !item.variantSnapshot.color && !item.variantSnapshot.sku && (
                              <span className="text-gray-500">Standard</span>
                            )}
                          </div>
                        ) : item.variantId ? (
                          <span className="text-gray-500">Variant ID: {item.variantId}</span>
                        ) : (
                          <span className="text-gray-500">No variant info</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {formatCurrency(item.unitPrice || item.priceAtTime || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                        {item.quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                        {formatCurrency((item.unitPrice || item.priceAtTime || 0) * (item.quantity || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AiOutlineDollar className="h-5 w-5 mr-2" />
              Price Breakdown
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-md">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                                    <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {(order.shippingTotal || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                                        <span>{formatCurrency(order.shippingTotal || 0)}</span>
                  </div>
                )}
                {(order.taxTotal || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(order.taxTotal || 0)}</span>
                  </div>
                )}
                {(order.codCharge || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>COD Charges:</span>
                    <span>{formatCurrency(order.codCharge || 0)}</span>
                  </div>
                )}
                {(order.discountTotal || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discountTotal || 0)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(order.grandTotal || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-md text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}