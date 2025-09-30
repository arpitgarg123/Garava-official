import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  AiOutlineSearch, 
  AiOutlineEye,
  AiOutlineReload,
  AiOutlineCalendar,
  AiOutlineUser
} from "react-icons/ai";
import { BiPhone, BiCalendar, BiTime, BiNote } from "react-icons/bi";
import { MdEventAvailable, MdEventNote } from "react-icons/md";
import { 
  fetchAppointmentsAdmin, 
  updateAppointmentAdmin,
  setFilters, 
  clearFilters,
  setSelectedAppointment 
} from "../../features/appointment/adminSlice";
import { 
  getAppointmentStatusColor, 
  getServiceTypeInfo,
  getAppointmentUrgency,
  formatAppointmentForDisplay 
} from "../../features/appointment/admin.api";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import AppointmentStatusUpdateModal from "./AppointmentStatusUpdateModal";

export default function Appointment() {
  const dispatch = useDispatch();
  const { 
    appointments, 
    pagination, 
    filters, 
    loading, 
    error, 
    operationLoading 
  } = useSelector(state => state.appointmentAdmin);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAppointment, setSelectedAppointmentLocal] = useState(null);
  
  // Local filter states for immediate UI updates
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    dispatch(fetchAppointmentsAdmin({ ...filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setLocalFilters({ ...localFilters, ...newFilters });
    dispatch(setFilters({ ...newFilters, page: 1 })); // Reset to page 1 when filtering
  };
  
  const handleSearch = (searchTerm) => {
    // Search can be by customer name or email (backend should handle this)
    handleFilterChange({ customerSearch: searchTerm });
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalFilters({ status: '', serviceType: '', fromDate: '', toDate: '', customerSearch: '' });
  };
  
  const handleViewDetails = (appointment) => {
    setSelectedAppointmentLocal(appointment);
    dispatch(setSelectedAppointment(appointment));
    setShowDetailsModal(true);
  };
  
  const handleUpdateStatus = (appointment) => {
    setSelectedAppointmentLocal(appointment);
    dispatch(setSelectedAppointment(appointment));
    setShowStatusModal(true);
  };
  
  const handleRefresh = () => {
    dispatch(fetchAppointmentsAdmin({ ...filters, page: pagination.page }));
  };
  
  const filteredAppointments = useMemo(() => {
    if (!localFilters.customerSearch && !localFilters.status && !localFilters.serviceType) {
      return appointments;
    }
    
    return appointments.filter(appointment => {
      const matchesSearch = !localFilters.customerSearch || 
        appointment.name?.toLowerCase().includes(localFilters.customerSearch.toLowerCase()) ||
        appointment.email?.toLowerCase().includes(localFilters.customerSearch.toLowerCase()) ||
        appointment.phone?.includes(localFilters.customerSearch);
      
      const matchesStatus = !localFilters.status || appointment.status === localFilters.status;
      const matchesService = !localFilters.serviceType || appointment.serviceType === localFilters.serviceType;
      
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, localFilters]);

  const serviceTypeOptions = [
    { value: '', label: 'All Services' },
    { value: 'fragrance_consult', label: 'Fragrance Consultation' },
    { value: 'jewellery_styling', label: 'Jewellery Styling' },
    { value: 'store_visit', label: 'Store Visit' },
    { value: 'custom', label: 'Custom Service' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Appointments Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} total appointments • {filteredAppointments.length} shown
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <AiOutlineReload className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  value={localFilters.customerSearch || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by customer name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select 
                value={localFilters.status} 
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Service Type Filter */}
            <div className="sm:w-48">
              <select 
                value={localFilters.serviceType} 
                onChange={(e) => handleFilterChange({ serviceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {serviceTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex gap-2">
              <input
                type="date"
                value={localFilters.fromDate}
                onChange={(e) => handleFilterChange({ fromDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                placeholder="From date"
              />
              <input
                type="date"
                value={localFilters.toDate}
                onChange={(e) => handleFilterChange({ toDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                placeholder="To date"
              />
            </div>
            
            {/* Clear Filters */}
            {(localFilters.status || localFilters.serviceType || localFilters.customerSearch || localFilters.fromDate || localFilters.toDate) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-hidden">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {loading && appointments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MdEventAvailable className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {localFilters.status || localFilters.serviceType || localFilters.customerSearch 
                  ? "Try adjusting your filters" 
                  : "No appointments have been scheduled yet"
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-auto h-full">
            <div className="bg-white border border-gray-200 rounded-lg mx-6 mb-6 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const formattedAppointment = formatAppointmentForDisplay(appointment);
                    const serviceInfo = getServiceTypeInfo(appointment.serviceType);
                    const urgency = getAppointmentUrgency(appointment.appointmentAt);
                    
                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AiOutlineUser className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formattedAppointment.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formattedAppointment.customerEmail}
                              </div>
                              {formattedAppointment.customerPhone && (
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  <BiPhone className="h-3 w-3 mr-1" />
                                  {formattedAppointment.customerPhone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{serviceInfo.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {serviceInfo.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {serviceInfo.duration}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formattedAppointment.formattedDate}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <BiTime className="h-3 w-3 mr-1" />
                                {formattedAppointment.formattedTime}
                              </div>
                              <div className={`text-xs font-medium ${urgency.color}`}>
                                {urgency.label}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAppointmentStatusColor(appointment.status)}`}>
                            <MdEventNote className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {appointment.notes && (
                              <div className="text-sm text-gray-900 mb-1">
                                <BiNote className="h-3 w-3 inline mr-1" />
                                {appointment.notes.length > 50 
                                  ? `${appointment.notes.substring(0, 50)}...` 
                                  : appointment.notes
                                }
                              </div>
                            )}
                            {appointment.adminNotes && (
                              <div className="text-xs text-blue-600">
                                Admin: {appointment.adminNotes.length > 30 
                                  ? `${appointment.adminNotes.substring(0, 30)}...` 
                                  : appointment.adminNotes
                                }
                              </div>
                            )}
                            {!appointment.notes && !appointment.adminNotes && (
                              <span className="text-sm text-gray-400">No notes</span>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(appointment)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <AiOutlineEye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(appointment)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Update Status"
                            >
                              <AiOutlineCalendar className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointmentLocal(null);
          }}
          appointment={selectedAppointment}
        />
      )}
      
      {showStatusModal && selectedAppointment && (
        <AppointmentStatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedAppointmentLocal(null);
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
}
