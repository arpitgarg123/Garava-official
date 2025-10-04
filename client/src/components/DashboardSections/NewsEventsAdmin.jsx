import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { FiCalendar, FiGlobe, FiEdit3 } from "react-icons/fi";
import { MdPublish, MdDrafts, MdEvent, MdArticle } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { formatDate } from "../../utils/FormatDate";
import { 
  listNewsEventsAdmin,
  getNewsEventStatsAdmin,
  deleteNewsEventAdmin
} from "../../features/newsevents/admin.api";
import NewsEventCreateEditModal from "./NewsEventCreateEditModal";
import NewsEventDetailsModal from "./NewsEventDetailsModal";
import DeleteNewsEventModal from "./DeleteNewsEventModal";

export default function NewsEventsAdmin() {
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);

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
    } catch (err) {
      console.error('NewsEvents error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch news & events');
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
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (searchTerm) filters.q = searchTerm;
    if (typeFilter) filters.type = typeFilter;
    if (statusFilter) filters.status = statusFilter;
    
    fetchNewsEvents(1, filters);
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteNewsEventAdmin(itemId);
      fetchNewsEvents();
      fetchStats();
      closeModal('delete');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete');
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

  if (loading && newsEvents.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Events</h2>
          <p className="text-gray-600">Manage events and media coverage</p>
        </div>
        <button
          onClick={() => openModal('createEdit')}
          className="btn-black flex"
        >
          <AiOutlinePlus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-red-600">{stats.archived}</div>
            <div className="text-sm text-gray-600">Archived</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-blue-600">{stats.events}</div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <div className="text-2xl font-bold text-purple-600">{stats.mediaCoverage}</div>
            <div className="text-sm text-gray-600">Media Coverage</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="py-4">
        <div className="flex flex-col  sm:flex-row gap-4">
          <div className="flex-1 ">
            <input
              type="text"
              placeholder="Search by title, content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 outline-none rounded-lg "
            />
          </div>
          <div >
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg "
            >
              <option value="">All Types</option>
              <option value="event">Events</option>
              <option value="media-coverage">Media Coverage</option>
            </select>
          </div>
          <div >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg "
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="btn-black flex "
          >
            <AiOutlineSearch className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className=" rounded-lg border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsEvents.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.cover && (
                        <img
                          src={item.cover.url}
                          alt=""
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {item.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-900 capitalize">
                        {item.type === 'media-coverage' ? 'Media' : item.kind}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.views}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal('details', item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <AiOutlineEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('createEdit', item)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                        title="Update Status"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => openModal('delete', item)}
                        className="text-red-600 hover:text-red-800"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchNewsEvents(page)}
                className={`px-3 py-2 text-sm ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border rounded`}
              >
                {page}
              </button>
            ))}
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

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}