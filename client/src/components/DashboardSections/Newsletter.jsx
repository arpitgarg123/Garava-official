import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineDownload, AiOutlineFilter } from "react-icons/ai";
import { FiMail, FiUsers } from "react-icons/fi";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiX } from "react-icons/bi";
import { formatDate } from "../../utils/FormatDate";

export default function Newsletter({
  subscribers = [],
  pagination = { page: 1, limit: 20, total: 0, totalPages: 1 },
  onFilterChange = () => {},
  onPageChange = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [localSubscribers, setLocalSubscribers] = useState(subscribers);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      subscribed: "bg-green-100 text-green-800",
      unsubscribed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-50 text-gray-800";
  };

  const handleStatusUpdate = (subscriberId, newStatus) => {
    setLocalSubscribers(prev => 
      prev.map(sub => 
        sub._id === subscriberId ? { ...sub, status: newStatus } : sub
      )
    );
  };

  const handleDelete = (subscriberId) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      setLocalSubscribers(prev => prev.filter(sub => sub._id !== subscriberId));
    }
  };

  const handleSearch = () => {
    onFilterChange({
      search: searchTerm,
      status: statusFilter
    });
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setShowMobileFilters(false);
    onFilterChange({});
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = localSubscribers.map(sub => 
      `${sub.email},${sub.status},${formatDate(sub.createdAt)}`
    ).join('\n');
    
    const blob = new Blob([`Email,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const displaySubscribers = localSubscribers.length > 0 ? localSubscribers : subscribers;
  const filteredSubscribers = displaySubscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Mobile Subscriber Card Component
  const MobileSubscriberCard = ({ subscriber }) => (
    <div className="bg-white rounded-lg border w-full border-gray-200 shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FiMail className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
              {subscriber.email}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriber.status)} ml-2 flex-shrink-0`}>
              {subscriber.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            Subscribed: {formatDate(subscriber.createdAt)}
          </p>
          
          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            {subscriber.status === 'unsubscribed' && (
              <button
                onClick={() => handleStatusUpdate(subscriber._id, 'subscribed')}
                className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                title="Reactivate Subscription"
              >
                Reactivate
              </button>
            )}
            {subscriber.status === 'subscribed' && (
              <button
                onClick={() => handleStatusUpdate(subscriber._id, 'unsubscribed')}
                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                title="Unsubscribe"
              >
                Unsubscribe
              </button>
            )}
            <button
              onClick={() => handleDelete(subscriber._id)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Remove Subscriber"
            >
              <RiDeleteBin6Line className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive Header */}
      <div className="flex-shrink-0 w-full p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Newsletter Subscribers
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage newsletter subscriptions • {pagination.total} total subscribers
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExport}
              className="btn-black btn-small"
            >
              <AiOutlineDownload className="w-4 h-4" />
              <span className="sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4 max-sm:mb-0">
          <p className="text-sm text-gray-600">
            {filteredSubscribers.length} subscribers
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <AiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="">All Status</option>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="pending">Pending</option>
            </select>
            
            <button
              onClick={handleSearch}
              className="btn-black btn-small"
            >
              Search
            </button>
            
            {(searchTerm || statusFilter) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
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
            <h3 className="font-semibold text-lg">Filter Subscribers</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Email</label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="">All Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex gap-4">
            <button 
              onClick={handleClearFilters}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={handleSearch}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Content Section */}
      <div className="flex-1 overflow-hidden w-full">
        {filteredSubscribers.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <FiMail className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {searchTerm || statusFilter 
                  ? "Try adjusting your search or filters"
                  : "Newsletter subscribers will appear here"
                }
              </p>
              {(searchTerm || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {/* Mobile Cards */}
            <div className="block lg:hidden p-4">
              {filteredSubscribers.map((subscriber) => (
                <MobileSubscriberCard key={subscriber._id} subscriber={subscriber} />
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block h-full overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiMail className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {subscriber.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(subscriber.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {subscriber.status === 'unsubscribed' && (
                            <button
                              onClick={() => handleStatusUpdate(subscriber._id, 'subscribed')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Reactivate Subscription"
                            >
                              <MdCheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {subscriber.status === 'subscribed' && (
                            <button
                              onClick={() => handleStatusUpdate(subscriber._id, 'unsubscribed')}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Unsubscribe"
                            >
                              <MdCancel className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(subscriber._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Remove Subscriber"
                          >
                            <RiDeleteBin6Line className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Prev
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm min-w-[40px] text-center">
                {pagination.page}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-1 border rounded text-sm transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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