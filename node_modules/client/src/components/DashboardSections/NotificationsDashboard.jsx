import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import http from '../../shared/api/http.js';
import { 
  FaBell, 
  FaCheck, 
  FaEye, 
  FaTrash, 
  FaFilter,
  FaExclamationTriangle,
  FaBox,
  FaShoppingCart,
  FaCreditCard,
  FaEnvelopeOpen,
  FaSearchPlus
} from 'react-icons/fa';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filter, unreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (unreadOnly) params.append('isRead', 'false');
      
      const response = await http.get(`/admin/notifications?${params.toString()}`);
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to access admin dashboard');
      } else if (error.response?.status === 403) {
        toast.error('Admin access required');
      } else {
        toast.error('Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await http.get('/admin/notifications/stats');
      
      if (response.data.success) {
        setStats(response.data.data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await http.patch(`/admin/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        toast.success('Notification marked as read');
        fetchStats(); // Refresh stats
      } else {
        toast.error(response.data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const viewNotification = async (notificationId) => {
    try {
      const response = await http.get(`/admin/notifications/${notificationId}`);
      
      if (response.data.success) {
        setSelectedNotification(response.data.data.notification);
        setShowDetailModal(true);
        
        // Mark as read when viewed
        if (!response.data.data.notification.isRead) {
          markAsRead(notificationId);
        }
      } else {
        toast.error('Failed to load notification details');
      }
    } catch (error) {
      console.error('Error loading notification details:', error);
      toast.error('Failed to load notification details');
    }
  };

  const markActionTaken = async (notificationId, actionNotes = 'Issue resolved') => {
    try {
      const response = await http.patch(`/admin/notifications/${notificationId}/action`, {
        actionNotes
      });
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, actionTaken: true, isRead: true }
              : notif
          )
        );
        toast.success('Action marked as taken');
        fetchStats(); // Refresh stats
      } else {
        toast.error(response.data.message || 'Failed to mark action as taken');
      }
    } catch (error) {
      console.error('Error marking action as taken:', error);
      toast.error('Failed to mark action as taken');
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await http.delete(`/admin/notifications/${notificationId}`);
      
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Notification deleted');
        fetchStats(); // Refresh stats
      } else {
        toast.error(response.data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'out_of_stock': return <FaBox className="text-red-500" />;
      case 'low_stock': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'order_placed': return <FaShoppingCart className="text-green-500" />;
      case 'payment_failed': return <FaCreditCard className="text-red-500" />;
      default: return <FaBell className="text-blue-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <FaBell className="inline mr-2" />
          Notifications
        </h2>
        <button
          onClick={() => fetchNotifications()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaEye className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.unread || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaBox className="text-red-600 text-xl" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.outOfStock || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaExclamationTriangle className="text-orange-600 text-xl" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.lowStock || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        
        {['all', 'out_of_stock', 'low_stock', 'order_placed', 'payment_failed'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterType === 'all' ? 'All' : filterType.replace('_', ' ').toUpperCase()}
          </button>
        ))}
        
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            unreadOnly
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">All caught up! No notifications match your current filters.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow border p-4 transition-all hover:shadow-md ${
                notification.isRead ? 'opacity-75' : 'border-l-4 border-l-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-xl mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(notification.severity)}`}>
                        {notification.severity.toUpperCase()}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2 text-sm">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatDate(notification.createdAt)}</span>
                      {notification.productId && (
                        <span>Product: {notification.productId.name || 'Unknown'}</span>
                      )}
                      {notification.metadata?.variantSizeLabel && (
                        <span>Size: {notification.metadata.variantSizeLabel}</span>
                      )}
                      {notification.metadata?.stockLevel !== undefined && (
                        <span>Stock: {notification.metadata.stockLevel}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Mark as read"
                    >
                      <FaEnvelopeOpen />
                    </button>
                  )}
                  
                  <button
                    onClick={() => viewNotification(notification._id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="View details"
                  >
                    <FaSearchPlus />
                  </button>
                  
                  {notification.actionRequired && !notification.actionTaken && (
                    <button
                      onClick={() => markActionTaken(notification._id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Mark as resolved"
                    >
                      <FaCheck />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                  
                  {notification.actionTaken && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      ✓ Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedNotification.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedNotification.severity)}`}>
                        {selectedNotification.severity.toUpperCase()}
                      </span>
                      {selectedNotification.actionRequired && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>
                
                {selectedNotification.productId && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Product Information</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p><strong>Product:</strong> {selectedNotification.productId.name || 'Unknown'}</p>
                      {selectedNotification.metadata?.variantSizeLabel && (
                        <p><strong>Variant:</strong> {selectedNotification.metadata.variantSizeLabel}</p>
                      )}
                      {selectedNotification.metadata?.variantSku && (
                        <p><strong>SKU:</strong> {selectedNotification.metadata.variantSku}</p>
                      )}
                      {selectedNotification.metadata?.stockLevel !== undefined && (
                        <p><strong>Stock Level:</strong> {selectedNotification.metadata.stockLevel}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Notification Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Created:</strong> {formatDate(selectedNotification.createdAt)}</p>
                    <p><strong>Type:</strong> {selectedNotification.type.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Status:</strong> {selectedNotification.isRead ? 'Read' : 'Unread'}</p>
                    {selectedNotification.actionTaken && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-green-800"><strong>✓ Action Taken</strong></p>
                        {selectedNotification.actionNotes && (
                          <p className="text-green-700 text-sm mt-1">{selectedNotification.actionNotes}</p>
                        )}
                        {selectedNotification.actionAt && (
                          <p className="text-green-600 text-xs mt-1">Resolved: {formatDate(selectedNotification.actionAt)}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setSelectedNotification(prev => ({ ...prev, isRead: true }));
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
                
                {selectedNotification.actionRequired && !selectedNotification.actionTaken && (
                  <button
                    onClick={() => {
                      markActionTaken(selectedNotification._id);
                      setSelectedNotification(prev => ({ ...prev, actionTaken: true, isRead: true }));
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
                
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDashboard;