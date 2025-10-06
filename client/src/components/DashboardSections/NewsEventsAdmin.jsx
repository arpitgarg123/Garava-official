import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus, AiOutlineEdit, AiOutlineFilter } from "react-icons/ai";
import { FiCalendar, FiGlobe, FiEdit3, FiFileText } from "react-icons/fi";
import { MdPublish, MdDrafts, MdEvent, MdArticle } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiX } from "react-icons/bi";
import { formatDate } from "../../utils/FormatDate";
import { 
  listNewsEventsAdmin,
  getNewsEventStatsAdmin,
  deleteNewsEventAdmin
} from "../../features/newsevents/admin.api";
import NewsEventCreateEditModal from "./NewsEventCreateEditModal";
import NewsEventDetailsModal from "./NewsEventDetailsModal";
import DeleteNewsEventModal from "./DeleteNewsEventModal";
import { useToastContext } from "../../layouts/Toast";

export default function NewsEventsAdmin() {
  const toast = useToastContext();
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    createEdit: { isOpen: false, item: null },
    details: { isOpen: false, item: null },
    delete: { isOpen: false, item: null }
  });

  useEffect(() => {
    fetchNewsEvents();
    fetchStats();
  }, []);

  const fetchNewsEvents = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 50,
        ...filters
      };
      
      const response = await listNewsEventsAdmin(params);
      const data = response.data;
      setNewsEvents(data.items);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error('NewsEvents error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch news & events';
      setError(errorMessage);
      toast?.error(errorMessage, 'News & Events');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getNewsEventStatsAdmin();
      const data = response.data;
      setStats(data.totals);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      toast?.error('Failed to fetch statistics', 'News & Events');
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (searchTerm) filters.q = searchTerm;
    if (typeFilter) filters.type = typeFilter;
    if (statusFilter) filters.status = statusFilter;
    
    fetchNewsEvents(1, filters);
    setShowMobileFilters(false);
    toast?.success('Filters applied successfully', 'News & Events');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setShowMobileFilters(false);
    fetchNewsEvents(1, {});
    toast?.info('All filters cleared', 'News & Events');
  };

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/newsevents/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchNewsEvents();
      fetchStats();
      toast?.success(`Item ${newStatus} successfully`, 'News & Events');
    } catch (err) {
      const errorMessage = err.message || 'Failed to update status';
      setError(errorMessage);
      toast?.error(errorMessage, 'News & Events');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteNewsEventAdmin(itemId);
      fetchNewsEvents();
      fetchStats();
      closeModal('delete');
      toast?.success('Item deleted successfully', 'News & Events');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete';
      setError(errorMessage);
      toast?.error(errorMessage, 'News & Events');
    }
  };

  const openModal = (type, item = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, item }
    }));
  };

  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, item: null }
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-50 text-gray-800";
  };

  const getTypeIcon = (type) => {
    return type === 'event' ? <MdEvent className="w-4 h-4" /> : <MdArticle className="w-4 h-4" />;
  };

 const MobileNewsEventCard = ({ item }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Item Image */}
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
            {item.cover?.url ? (
              <img 
                className="w-full h-full rounded-lg object-cover" 
                src={item.cover.url} 
                alt={item.title}
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                {getTypeIcon(item.type)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-md sm:text-base font-medium text-gray-900 line-clamp-2 flex-1">
                {item.title}
              </h3>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  {getTypeIcon(item.type)}
                  <span className="ml-1">{item.type === 'media-coverage' ? 'Media' : 'Event'}</span>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-md text-gray-600 line-clamp-2 mb-3">
              {item.excerpt || 'No excerpt available'}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>{formatDate(item.date)}</span>
              <div className="flex items-center">
                <AiOutlineEye className="w-3 h-3 mr-1" />
                {item.views || 0}
              </div>
            </div>
          </div>
        </div>
<div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button 
            onClick={() => openModal('details', item)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-md font-medium hover:bg-blue-100 transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={() => openModal('createEdit', item)}
            className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Edit Item"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          <select
            value={item.status}
            onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            title="Update Status"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => openModal('delete', item)}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Item"
          >
            <RiDeleteBin6Line className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
  // Desktop Table Component
  const DesktopTable = () => (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsEvents.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {item.cover?.url && (
                      <img
                        src={item.cover.url}
                        alt=""
                        className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-md font-medium text-gray-900 truncate max-w-xs">
                        {item.title}
                      </div>
                      <div className="text-md text-gray-500 truncate max-w-xs">
                        {item.excerpt}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    <span className="text-md text-gray-900 capitalize">
                      {item.type === 'media-coverage' ? 'Media' : 'Event'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                  <div className="flex items-center">
                    <AiOutlineEye className="w-4 h-4 mr-1 text-gray-400" />
                    {item.views || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal('details', item)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <AiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('createEdit', item)}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Edit"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1 outline-none"
                      title="Update Status"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => openModal('delete', item)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
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
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading news & events</p>
          <p className="text-gray-500 text-md mb-4">{error}</p>
          <button 
            onClick={() => fetchNewsEvents()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="h-full flex flex-col overflow-hidden">
      {/* Enhanced Responsive Header Section */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              News & Events
            </h2>
            <p className="text-md text-gray-600 mt-1">
              Manage events and media coverage • {pagination.total || newsEvents.length} total items
            </p>
          </div>
          <button
            onClick={() => openModal('createEdit')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-md"
          >
            <AiOutlinePlus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

       {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-300">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm sm:text-md text-gray-600 truncate">Total Items</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-300">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm sm:text-md text-gray-600 truncate">Published</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-300">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-yellow-600">{stats.draft}</div>
              <div className="text-sm sm:text-md text-gray-600 truncate">Drafts</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-300">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-red-600">{stats.archived}</div>
              <div className="text-sm sm:text-md text-gray-600 truncate">Archived</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-300">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">{stats.events}</div>
              <div className="text-sm sm:text-md text-gray-600 truncate">Events</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-300">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{stats.mediaCoverage}</div>
              <div className="text-sm sm:text-md text-gray-600">Media Coverage</div>
            </div>
          </div>
          
        )}

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4 max-sm:mb-0">
          <p className="text-md text-gray-600">
            {newsEvents.length} items
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-md border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                  placeholder="Search by title, content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="">All Types</option>
              <option value="event">Events</option>
              <option value="media-coverage">Media Coverage</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={handleSearch}
              className="btn-black btn-small"
            >
              <AiOutlineSearch className="w-4 h-4" />
              Search
            </button>
            {(searchTerm || typeFilter || statusFilter) && (
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
            <h3 className="font-semibold text-lg">Filter News & Events</h3>
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
              <label className="block text-md font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Mobile Type Filter */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="">All Types</option>
                <option value="event">Events</option>
                <option value="media-coverage">Media Coverage</option>
              </select>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
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
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading news & events...</p>
            </div>
          </div>
        ) : newsEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No news & events found</p>
              <p className="text-gray-400 text-md mb-4">
                {searchTerm || typeFilter || statusFilter 
                  ? "Try adjusting your filters or search terms"
                  : "Create your first news item or event to get started"
                }
              </p>
              {(searchTerm || typeFilter || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              {newsEvents.map((item) => (
                <MobileNewsEventCard key={item._id} item={item} />
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block p-6">
              <DesktopTable />
            </div>
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-md text-gray-600 text-center sm:text-left">
              Page {pagination.page} of {pagination.totalPages} — {pagination.total || newsEvents.length} items
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => fetchNewsEvents(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-md"
              >
                ← Prev
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-md min-w-[40px] text-center">
                {pagination.page}
              </span>
              <button
                onClick={() => fetchNewsEvents(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-md"
              >
                Next →
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, pagination.page - 2);
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchNewsEvents(pageNum)}
                    className={`px-3 py-2 text-md border rounded-lg transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {modals.createEdit.isOpen && (
        <NewsEventCreateEditModal
          isOpen={modals.createEdit.isOpen}
          item={modals.createEdit.item}
          onClose={() => closeModal('createEdit')}
          onSuccess={() => {
            fetchNewsEvents();
            fetchStats();
            closeModal('createEdit');
            toast?.success('Item saved successfully', 'News & Events');
          }}
        />
      )}
      
      {modals.details.isOpen && (
        <NewsEventDetailsModal
          isOpen={modals.details.isOpen}
          item={modals.details.item}
          onClose={() => closeModal('details')}
        />
      )}
      
      {modals.delete.isOpen && (
        <DeleteNewsEventModal
          isOpen={modals.delete.isOpen}
          item={modals.delete.item}
          onClose={() => closeModal('delete')}
          onConfirm={() => handleDelete(modals.delete.item._id)}
        />
      )}
    </div>
  );
}