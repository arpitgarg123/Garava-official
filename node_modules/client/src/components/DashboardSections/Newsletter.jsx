import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineDownload } from "react-icons/ai";
import { FiMail, FiUsers } from "react-icons/fi";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
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


  const getStatusColor = (status) => {
    const colors = {
      subscribed: "bg-green-100 text-green-800",
      unsubscribed: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
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

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Newsletter Subscribers</h2>
            <p className="text-sm text-gray-600">Manage newsletter subscriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {pagination.total} total subscribers
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <AiOutlineDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="pending">Pending</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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

      {/* Subscribers Table */}
      <div className="flex-1 overflow-hidden">
        {filteredSubscribers.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FiMail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No subscribers found</p>
              <p className="text-gray-400 text-sm mt-1">Newsletter subscribers will appear here</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
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
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
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
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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