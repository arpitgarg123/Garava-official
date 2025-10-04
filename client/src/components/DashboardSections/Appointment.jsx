import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { BiCalendar, BiUser, BiPhone } from "react-icons/bi";
import { MdEventAvailable, MdCheckCircle, MdCancel } from "react-icons/md";
import { 
  fetchAppointmentsAdmin, 
  updateAppointmentAdmin 
} from "../../features/appointment/adminSlice";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { formatDateTime } from "../../utils/FormatDate";

export default function Appointment() {
  const dispatch = useDispatch();
  const { 
    appointments, 
    loading, 
    error 
  } = useSelector(state => state.appointmentAdmin);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointmentsAdmin({}));
  }, [dispatch]);


  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await dispatch(updateAppointmentAdmin({ 
        appointmentId, 
        updateData: { status: newStatus } 
      })).unwrap();
      // Refresh the appointments list
      dispatch(fetchAppointmentsAdmin({}));
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  const filteredAppointments = (appointments || []).filter(appointment => {
    const matchesSearch = appointment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesService = !serviceFilter || appointment.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading appointments</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchAppointmentsAdmin({}))}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="flex-shrink-0 p-6 border-b w-full border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Appointments Management</h2>
            <p className="text-sm text-gray-600">Manage customer appointments and bookings</p>
          </div>
          
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none "
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Services</option>
            <option value="consultation">Consultation</option>
            <option value="repair">Repair</option>
            <option value="maintenance">Maintenance</option>
            <option value="custom">Custom Order</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading appointments...</p>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">Customer appointments will appear here</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <BiUser className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.customerEmail}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <BiPhone className="w-3 h-3" />
                            {appointment.customerPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(appointment.appointmentAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {appointment.adminNotes || 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewDetails(appointment)}
                          className="text-blue-600 hover:text-blue-900 p-1" 
                          title="View Details"
                        >
                          <AiOutlineEye className="w-4 h-4" />
                        </button>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Confirm Appointment"
                            >
                              <MdCheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Cancel Appointment"
                            >
                              <MdCancel className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Mark as Completed"
                          >
                            <MdEventAvailable className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AppointmentDetailsModal
        isOpen={showDetailsModal}
        appointment={selectedAppointment}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}