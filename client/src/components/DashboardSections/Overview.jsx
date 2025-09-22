import React from "react";
import { BiPackage } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import StatsCard from "../admin/StatsCard";

function formatCurrency(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function getStatusColor(status) {
  const colors = {
    delivered: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default function Overview({ products = [], orders = [], reviews = [] }) {
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + (o.grandTotalPaise || 0), 0),
    pendingReviews: reviews.filter((r) => !r.isApproved).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Products" value={stats.totalProducts} Icon={BiPackage} />
        <StatsCard title="Total Orders" value={stats.totalOrders} Icon={BsCart3} />
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} Icon={FaRupeeSign} />
        <StatsCard title="Pending Reviews" value={stats.pendingReviews} Icon={MdWarning} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b"><h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.user?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(order.grandTotalPaise)}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
