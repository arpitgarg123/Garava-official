import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdEventAvailable } from "react-icons/md";
import { BiCalendar, BiNote } from "react-icons/bi";
import { updateAppointmentAdmin } from "../../features/appointment/adminSlice";
import { getAppointmentStatusColor, getServiceTypeInfo } from "../../features/appointment/admin.api";

const APPOINTMENT_STATUSES = [
  { value: 'pending', label: 'Pending', description: 'Awaiting confirmation' },
  { value: 'confirmed', label: 'Confirmed', description: 'Appointment confirmed and scheduled' },
  { value: 'completed', label: 'Completed', description: 'Service has been completed' },
  { value: 'cancelled', label: 'Cancelled', description: 'Appointment has been cancelled' }
];

export default function AppointmentStatusUpdateModal({ isOpen, onClose, appointment }) {
  const dispatch = useDispatch();
  const { operationLoading } = useSelector(state => state.appointmentAdmin);
  const [selectedStatus, setSelectedStatus] = useState(appointment?.status || '');
  const [adminNotes, setAdminNotes] = useState(appointment?.adminNotes || '');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      alert('Please select a status');
      return;
    }

    try {
      const updateData = {
        status: selectedStatus,
        ...(adminNotes.trim() && { adminNotes: adminNotes.trim() })
      };

      // Handle rescheduling if date/time provided
      if (isRescheduling && rescheduleDate && rescheduleTime) {
        const appointmentDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
        if (appointmentDateTime > new Date()) {
          updateData.appointmentAt = appointmentDateTime.toISOString();
        } else {
          alert('Please select a future date and time for rescheduling');
          return;
        }
      }

      await dispatch(updateAppointmentAdmin({ 
        appointmentId: appointment._id, 
        updateData 
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      // Error is handled by the slice
    }
  };

  const currentStatus = APPOINTMENT_STATUSES.find(s => s.value === appointment.status);
  const selectedStatusInfo = APPOINTMENT_STATUSES.find(s => s.value === selectedStatus);
  const serviceInfo = getServiceTypeInfo(appointment.serviceType);

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    // If changing to confirmed, offer rescheduling option
    if (newStatus === 'confirmed' && appointment.status === 'pending') {
      setIsRescheduling(false); // Default to not rescheduling
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <MdEventAvailable className="h-6 w-6 mr-2" />
              Update Appointment
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {appointment.name} • {serviceInfo.label}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={operationLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getAppointmentStatusColor(appointment.status)}`}>
                {currentStatus?.label || appointment.status}
              </span>
              <span className="text-sm text-gray-500">
                {currentStatus?.description}
              </span>
            </div>
          </div>

          {/* Appointment Details Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Service:</span>
                <span className="ml-2 font-medium">{serviceInfo.label}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2">{serviceInfo.duration}</span>
              </div>
              <div>
                <span className="text-gray-600">Scheduled:</span>
                <span className="ml-2">
                  {new Date(appointment.appointmentAt).toLocaleDateString()} at{' '}
                  {new Date(appointment.appointmentAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2">{appointment.name}</span>
              </div>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              required
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
            >
              <option value="">Select new status</option>
              {APPOINTMENT_STATUSES.map(status => (
                <option 
                  key={status.value} 
                  value={status.value}
                  disabled={status.value === appointment.status}
                >
                  {status.label}
                  {status.value === appointment.status ? ' (Current)' : ''}
                </option>
              ))}
            </select>
            
            {selectedStatusInfo && selectedStatus !== appointment.status && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getAppointmentStatusColor(selectedStatus)}`}>
                    {selectedStatusInfo.label}
                  </span>
                </div>
                <p className="text-sm text-blue-700">{selectedStatusInfo.description}</p>
              </div>
            )}
          </div>

          {/* Rescheduling Option (for confirmed status) */}
          {selectedStatus === 'confirmed' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="reschedule"
                  checked={isRescheduling}
                  onChange={(e) => setIsRescheduling(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="reschedule" className="text-sm font-medium text-gray-700">
                  Reschedule appointment time
                </label>
              </div>

              {isRescheduling && (
                <div className="pl-6 border-l-2 border-blue-200 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="rescheduleDate" className="block text-sm font-medium text-gray-700 mb-1">
                        New Date
                      </label>
                      <input
                        type="date"
                        id="rescheduleDate"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={operationLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="rescheduleTime" className="block text-sm font-medium text-gray-700 mb-1">
                        New Time
                      </label>
                      <input
                        type="time"
                        id="rescheduleTime"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        disabled={operationLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {rescheduleDate && rescheduleTime && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <BiCalendar className="inline h-4 w-4 mr-1" />
                      New appointment time: {new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleDateString()} at{' '}
                      {new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin Notes */}
          <div className="mb-6">
            <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes
            </label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this status update..."
              rows="3"
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes are internal and will not be visible to the customer.
            </p>
          </div>

          {/* Customer's Original Notes */}
          {appointment.notes && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer's Original Notes
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Status Change Warnings */}
          {selectedStatus === 'cancelled' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-1">⚠️ Appointment Cancellation</h4>
              <p className="text-sm text-red-700">
                This will cancel the appointment. The customer will be notified via email if email notifications are configured.
              </p>
            </div>
          )}

          {selectedStatus === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">✅ Mark as Completed</h4>
              <p className="text-sm text-green-700">
                This will mark the service as completed. This action indicates the appointment was successfully fulfilled.
              </p>
            </div>
          )}

          {selectedStatus === 'confirmed' && !isRescheduling && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">📅 Confirm Appointment</h4>
              <p className="text-sm text-blue-700">
                This will confirm the appointment at the currently scheduled time. The customer will be notified of the confirmation.
              </p>
            </div>
          )}

          {selectedStatus === 'confirmed' && isRescheduling && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">🔄 Confirm & Reschedule</h4>
              <p className="text-sm text-orange-700">
                This will confirm the appointment and update it to the new date/time. The customer will be notified of both the confirmation and schedule change.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={operationLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading || !selectedStatus || (selectedStatus === appointment.status && !isRescheduling)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {operationLoading && (
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
              )}
              {isRescheduling ? 'Confirm & Reschedule' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}