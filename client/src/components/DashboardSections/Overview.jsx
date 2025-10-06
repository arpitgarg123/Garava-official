import React from "react";
import { FaRupeeSign, FaStar } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiPackage, FiTrendingUp, FiTrendingDown, FiUsers } from "react-icons/fi";
import { BiCalendar } from "react-icons/bi";

// Clean, simple Overview component
export default function Overview({
  stats = {
    revenueINR: 0,
    orders: 0,
    products: 0,
    avgRating: 0,
  },
  revenueTrend = [],
  topProducts = [],
  recentOrders = [],
  recentReviews = [],
  upcomingAppointments = [],
  onOpenOrder = () => {},
  onOpenProduct = () => {},
  onOpenReview = () => {},
  onOpenAppointment = () => {},
}) {
  const fmtINR = (n) => {
    try { 
      return new Intl.NumberFormat("en-IN", { 
        style: "currency", 
        currency: "INR", 
        maximumFractionDigits: 0 
      }).format(n || 0); 
    } catch { 
      return `₹${n||0}`; 
    }
  };
  
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : "-";
  const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString() : "-";

  const StatCard = ({ icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
    };

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-md font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaRupeeSign className="w-6 h-6" />}
            title="Total Revenue"
            value={fmtINR(stats.revenueINR)}
            subtitle="This month"
            color="green"
          />
          <StatCard
            icon={<HiOutlineShoppingBag className="w-6 h-6" />}
            title="Total Orders"
            value={stats.orders}
            subtitle="Active orders"
            color="blue"
          />
          <StatCard
            icon={<FiPackage className="w-6 h-6" />}
            title="Products"
            value={stats.products}
            subtitle="Listed products"
            color="purple"
          />
          <StatCard
            icon={<FaStar className="w-6 h-6" />}
            title="Avg Rating"
            value={`${(stats.avgRating||0).toFixed(1)}/5`}
            subtitle="Customer satisfaction"
            color="orange"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <HiOutlineShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div 
                      key={order._id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onOpenOrder(order)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-md text-gray-600">{fmtDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{fmtINR(order.totalINR)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-50 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            </div>
            <div className="p-6">
              {topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <div 
                      key={product._id} 
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onOpenProduct(product)}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-md text-gray-600">{product.units} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{fmtINR(product.salesINR)}</p>
                        <p className="text-md text-gray-600">#{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            </div>
            <div className="p-6">
              {recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent reviews</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.slice(0, 5).map((review) => (
                    <div 
                      key={review._id} 
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onOpenReview(review)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-md text-gray-600 line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">{fmtDate(review.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <div className="p-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <BiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div 
                      key={appointment._id} 
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onOpenAppointment(appointment)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.customerName}</p>
                          <p className="text-md text-gray-600">{appointment.serviceType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-md font-medium text-gray-900">{fmtDateTime(appointment.appointmentAt)}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-50 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}