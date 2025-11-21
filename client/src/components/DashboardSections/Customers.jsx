import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineDownload, AiOutlineFilter } from "react-icons/ai";
import { FiUsers, FiMail, FiShoppingBag } from "react-icons/fi";
import { BiX } from "react-icons/bi";
import { formatDate } from "../../utils/FormatDate";
import { formatCustomersForCSV, convertToCSV, downloadCSV } from "../../features/customers/admin.api";

export default function Customers({
  customers = [],
  stats = {},
  pagination = { page: 1, limit: 20, total: 0, totalPages: 1 },
  onFilterChange = () => {},
  onPageChange = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [newsletterFilter, setNewsletterFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = () => {
    const filters = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (orderFilter) {
      const [min, max] = orderFilter.split('-');
      if (min) filters.orderCountMin = min;
      if (max && max !== '+') filters.orderCountMax = max;
    }
    
    if (newsletterFilter) {
      filters.newsletter = newsletterFilter === 'yes';
    }
    
    onFilterChange(filters);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setOrderFilter('');
    setNewsletterFilter('');
    setShowMobileFilters(false);
    onFilterChange({});
  };

  const handleExport = () => {
    // Format customers for CSV export using the utility function
    const formattedData = formatCustomersForCSV(customers);
    const csvContent = convertToCSV(formattedData);
    
    // Download CSV using the utility function
    const filename = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  // Mobile Customer Card Component
  const MobileCustomerCard = ({ customer }) => (
    <div className="bg-white rounded-lg border w-full border-gray-200 shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[1.0625rem] font-medium text-gray-900 truncate flex-1">
              {customer.name || 'N/A'}
            </h3>
          </div>
          
          <p className="text-[1.0625rem] text-gray-600 mb-1 truncate">
            {customer.email}
          </p>
          
          <p className="text-[1.0625rem] text-gray-500 mb-2">
            {customer.phone || 'No phone'}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-[1.0625rem]">
            <div>
              <span className="text-gray-500">Orders:</span>{' '}
              <span className="font-medium text-gray-900">{customer.totalOrders || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Spent:</span>{' '}
              <span className="font-medium text-gray-900">₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-[1.0625rem]">
            {customer.isNewsletterSubscriber && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiMail className="w-3 h-3 mr-1" />
                Newsletter
              </span>
            )}
            <span className="text-gray-500 text-xs">
              Joined {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 w-full p-4 sm:p-6 lg:p-8 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">
              Customers
            </h2>
            <p className="text-[1.0625rem] text-gray-600 mt-1">
              Manage customer data • {pagination.total} total customers
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[1.0625rem] text-blue-600 font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.totalCustomers || 0}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[1.0625rem] text-green-600 font-medium">New This Month</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {stats.newThisMonth || 0}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[1.0625rem] text-purple-600 font-medium">Active (30d)</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {stats.activeCustomers || 0}
                </p>
              </div>
              <FiShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[1.0625rem] text-orange-600 font-medium">Newsletter</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {stats.newsletterSubscribers || 0}
                </p>
              </div>
              <FiMail className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1.0625rem]"
              />
            </div>
          </div>

          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1.0625rem]"
          >
            <option value="">All Orders</option>
            <option value="0-0">No Orders</option>
            <option value="1-5">1-5 Orders</option>
            <option value="6-10">6-10 Orders</option>
            <option value="11-+">11+ Orders</option>
          </select>

          <select
            value={newsletterFilter}
            onChange={(e) => setNewsletterFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1.0625rem]"
          >
            <option value="">All Subscribers</option>
            <option value="yes">Newsletter Subscribers</option>
            <option value="no">Non-Subscribers</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-[1.0625rem]"
          >
            Apply Filters
          </button>

          {(searchTerm || orderFilter || newsletterFilter) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-[1.0625rem]"
            >
              Clear
            </button>
          )}

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 text-[1.0625rem]"
          >
            <AiOutlineDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>



        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="sm:hidden mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-[1.0625rem]"
              />
            </div>
            
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[1.0625rem]"
            >
              <option value="">All Orders</option>
              <option value="0-0">No Orders</option>
              <option value="1-5">1-5 Orders</option>
              <option value="6-10">6-10 Orders</option>
              <option value="11-+">11+ Orders</option>
            </select>

            <select
              value={newsletterFilter}
              onChange={(e) => setNewsletterFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[1.0625rem]"
            >
              <option value="">All Subscribers</option>
              <option value="yes">Newsletter Subscribers</option>
              <option value="no">Non-Subscribers</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-[1.0625rem]"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-[1.0625rem]"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View - Cards */}
      <div className="flex-1 overflow-auto p-4 lg:px-8 sm:hidden">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-[1.0625rem] text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <MobileCustomerCard key={customer._id} customer={customer} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden sm:block flex-1 overflow-auto px-4 sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiUsers className="w-12 h-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                    <p className="text-[1.0625rem] text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-[1.0625rem]">
                            {(customer.name || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-[1.0625rem] font-medium text-gray-900">
                          {customer.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[1.0625rem] text-gray-900">{customer.email}</div>
                    <div className="text-[1.0625rem] text-gray-500">{customer.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[1.0625rem] text-gray-900">
                    {customer.totalOrders || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[1.0625rem] font-medium text-gray-900">
                    ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[1.0625rem] text-gray-500">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[1.0625rem] text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {customer.isNewsletterSubscriber && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Newsletter
                        </span>
                      )}
                      {customer.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-[1.0625rem] text-gray-700">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-[1.0625rem] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-[1.0625rem] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
