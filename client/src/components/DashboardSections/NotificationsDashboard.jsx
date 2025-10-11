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
import { BiX, BiRefresh } from 'react-icons/bi';
import { FiFilter } from 'react-icons/fi';

const NotificationsDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
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

  // Mobile Notification Card Component
  const MobileNotificationCard = ({ notification }) => (
    <div
      className={`bg-white  border shadow-sm p-4 mb-3 transition-all ${
        notification.isRead ? 'opacity-75' : 'border-l-4 border-l-blue-500'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-lg mt-0.5">
          {getTypeIcon(notification.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-600 -full flex-shrink-0 ml-2 mt-1"></div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {notification.message}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-sm font-medium border border-gray-300
               ${getSeverityColor(notification.severity)}`}>
              {notification.severity.toUpperCase()}
            </span>
            {notification.actionTaken && (
              <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                ✓ Resolved
              </span>
            )}
          </div>
          
          {/* Meta Info */}
          <div className="text-sm text-gray-500 mb-3">
            <div>{formatDate(notification.createdAt)}</div>
            {notification.productId && (
              <div className="truncate">Product: {notification.productId.name || 'Unknown'}</div>
            )}
            {notification.metadata?.stockLevel !== undefined && (
              <div>Stock: {notification.metadata.stockLevel}</div>
            )}
          </div>
          
          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => viewNotification(notification._id)}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600  text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              View Details
            </button>
            
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification._id)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50  transition-colors"
                title="Mark as read"
              >
                <FaEnvelopeOpen className="w-4 h-4" />
              </button>
            )}
            
            {notification.actionRequired && !notification.actionTaken && (
              <button
                onClick={() => markActionTaken(notification._id)}
                className="px-3 py-2 text-green-600 hover:bg-green-50  transition-colors"
                title="Mark as resolved"
              >
                <FaCheck className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => deleteNotification(notification._id)}
              className="px-3 py-2 text-red-600 hover:bg-red-50  transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Notifications</h2>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 "></div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 "></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-5xl flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaBell className="text-blue-600" />
              Notifications
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor system alerts and important updates
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => fetchNotifications()}
              className="btn-black btn-small"
            >
              <BiRefresh className="w-4 h-4" />
              <span className="sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Responsive Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4  shadow border border-gray-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100  flex-shrink-0">
                <FaBell className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Total</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4  shadow border border-gray-300">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100  flex-shrink-0">
                <FaEye className="text-yellow-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Unread</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.unread || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4  shadow border border-gray-300">
            <div className="flex items-center">
              <div className="p-2 bg-red-100  flex-shrink-0">
                <FaBox className="text-red-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Out of Stock</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.outOfStock || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4  shadow border border-gray-300">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100  flex-shrink-0">
                <FaExclamationTriangle className="text-orange-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Low Stock</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.lowStock || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4 max-sm:mb-0">
          <p className="text-sm text-gray-600">
            {notifications.length} notifications
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-sm border border-gray-300  hover:bg-gray-50 transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <FaFilter className="text-gray-500 text-sm" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            
            {['all', 'out_of_stock', 'low_stock', 'order_placed', 'payment_failed'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
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
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread Only
            </button>
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
            <h3 className="font-semibold text-lg">Filter Notifications</h3>
            <button 
              onClick={() => setShowMobileFilters(false)} 
              className="p-1 rounded-full hover:bg-gray-50"
            >
              <BiX size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Type</label>
              <div className="space-y-2">
                {['all', 'out_of_stock', 'low_stock', 'order_placed', 'payment_failed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`w-full text-left px-3 py-2  text-sm font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {filterType === 'all' ? 'All Notifications' : filterType.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Unread Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <button
                onClick={() => setUnreadOnly(!unreadOnly)}
                className={`w-full text-left px-3 py-2  text-sm font-medium transition-colors ${
                  unreadOnly
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {unreadOnly ? 'Showing Unread Only' : 'Show All Notifications'}
              </button>
            </div>
          </div>
          
          <div className="border-t p-4">
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="btn-black btn-small "
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Content Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-md mx-auto">
                <FaBell className="mx-auto text-4xl sm:text-6xl text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  All caught up! No notifications match your current filters.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Mobile Cards */}
              <div className="block lg:hidden p-4">
                {notifications.map((notification) => (
                  <MobileNotificationCard key={notification._id} notification={notification} />
                ))}
              </div>
              
              {/* Desktop List */}
              <div className="hidden lg:block  p-6 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white   shadow border border-gray-300 p-4 transition-all hover:shadow-md ${
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
                            <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getSeverityColor(notification.severity)}`}>
                              {notification.severity.toUpperCase()}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2 text-sm">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50  transition-colors"
                            title="Mark as read"
                          >
                            <FaEnvelopeOpen />
                          </button>
                        )}
                        
                        <button
                          onClick={() => viewNotification(notification._id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50  transition-colors"
                          title="View details"
                        >
                          <FaSearchPlus />
                        </button>
                        
                        {notification.actionRequired && !notification.actionTaken && (
                          <button
                            onClick={() => markActionTaken(notification._id)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50  transition-colors"
                            title="Mark as resolved"
                          >
                            <FaCheck />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50  transition-colors"
                          title="Delete notification"
                        >
                          <FaTrash />
                        </button>
                        
                        {notification.actionTaken && (
                          <span className="px-2 py-1 text-sm bg-green-100 text-green-800 ">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white  shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notification Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <BiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-180px)] overflow-y-auto">
              <div className="flex items-center space-x-3">
                <div className="text-xl sm:text-2xl">
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg break-words">{selectedNotification.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedNotification.severity)}`}>
                      {selectedNotification.severity.toUpperCase()}
                    </span>
                    {selectedNotification.actionRequired && (
                      <span className="px-2 py-1 text-sm bg-orange-100 text-orange-800 ">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Message</h4>
                <p className="text-gray-700 text-sm sm:text-base break-words">{selectedNotification.message}</p>
              </div>
              
              {selectedNotification.productId && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Product Information</h4>
                  <div className="bg-gray-50 p-3  text-sm">
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
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Notification Details</h4>
                <div className="text-sm sm:text-sm text-gray-600 space-y-1">
                  <p><strong>Created:</strong> {formatDate(selectedNotification.createdAt)}</p>
                  <p><strong>Type:</strong> {selectedNotification.type.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>Status:</strong> {selectedNotification.isRead ? 'Read' : 'Unread'}</p>
                  {selectedNotification.actionTaken && (
                    <div className="mt-2 p-2 bg-green-50 ">
                      <p className="text-green-800"><strong>✓ Action Taken</strong></p>
                      {selectedNotification.actionNotes && (
                        <p className="text-green-700 text-sm mt-1">{selectedNotification.actionNotes}</p>
                      )}
                      {selectedNotification.actionAt && (
                        <p className="text-green-600 text-sm mt-1">Resolved: {formatDate(selectedNotification.actionAt)}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setSelectedNotification(prev => ({ ...prev, isRead: true }));
                    }}
                    className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors text-sm"
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
                    className="px-4 py-2 bg-green-600 text-white  hover:bg-green-700 transition-colors text-sm"
                  >
                    Mark as Resolved
                  </button>
                )}
                
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
                
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700  hover:bg-gray-400 transition-colors text-sm sm:ml-auto"
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