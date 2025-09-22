import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

function formatCurrency(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
function getStatusColor(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default function Orders({ orders = [], onStatusChange = () => {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id}</td>
                  <td className="px-6 py-4">
                    <div><div className="text-sm font-medium text-gray-900">{order.user?.name}</div><div className="text-sm text-gray-500">{order.user?.email}</div></div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.items.map((it, i) => <div key={i}>{it.product?.name} x{it.quantity}</div>)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(order.grandTotalPaise)}</td>
                  <td className="px-6 py-4">
                    <select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value)} className={`text-xs font-semibold rounded-full px-2 py-1 border-none ${getStatusColor(order.status)}`}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="text-blue-600 hover:text-blue-900"><AiOutlineEye className="h-4 w-4" /></button>
                      <button className="text-green-600 hover:text-green-900"><BiRefresh className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
