import React from "react";
import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { BiPhone, BiCalendar, BiTime, BiNote, BiEnvelope } from "react-icons/bi";
import { MdEventAvailable, MdEventNote } from "react-icons/md";
import { getAppointmentStatusColor, getServiceTypeInfo, getAppointmentUrgency, formatAppointmentForDisplay } from "../../features/appointment/admin.api";

export default function AppointmentDetailsModal({ isOpen, onClose, appointment }) {
  if (!isOpen || !appointment) return null;

  const formattedAppointment = formatAppointmentForDisplay(appointment);
  const serviceInfo = getServiceTypeInfo(appointment.serviceType);
  const urgency = getAppointmentUrgency(appointment.appointmentAt);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <MdEventAvailable className="h-6 w-6 mr-2" />
              Appointment Details
            </h3>
            <p className="text-md text-gray-500 mt-1">ID: {appointment._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Appointment Status & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MdEventNote className="h-5 w-5 mr-2" />
                Status & Priority
              </h4>
              <div className="space-y-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-md font-medium border ${getAppointmentStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <div className={`text-md font-medium ${urgency.color}`}>
                  {urgency.label} • {urgency.level === 'past' ? 'Past appointment' : 
                   urgency.level === 'urgent' ? 'Requires immediate attention' :
                   urgency.level === 'today' ? 'Scheduled for today' :
                   urgency.level === 'tomorrow' ? 'Scheduled for tomorrow' : 'Future appointment'}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-lg mr-2">{serviceInfo.icon}</span>
                Service Information
              </h4>
              <div className="space-y-2 text-md">
                <div><strong>Service:</strong> {serviceInfo.label}</div>
                <div><strong>Duration:</strong> {serviceInfo.duration}</div>
                <div className="text-gray-600">{serviceInfo.description}</div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AiOutlineUser className="h-5 w-5 mr-2" />
              Customer Information
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AiOutlineUser className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{formattedAppointment.customerName}</div>
                      <div className="text-md text-gray-500">Full Name</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BiEnvelope className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-gray-900">{formattedAppointment.customerEmail}</div>
                      <div className="text-md text-gray-500">Email Address</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {formattedAppointment.customerPhone && (
                    <div className="flex items-center gap-2">
                      <BiPhone className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-900">{formattedAppointment.customerPhone}</div>
                        <div className="text-md text-gray-500">Phone Number</div>
                      </div>
                    </div>
                  )}
                  
                  {appointment.user && (
                    <div className="flex items-center gap-2">
                      <AiOutlineUser className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-900">Registered User</div>
                        <div className="text-md text-gray-500">Account Holder</div>
                      </div>
                    </div>
                  )}
                  
                  {!appointment.user && (
                    <div className="flex items-center gap-2">
                      <AiOutlineUser className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-gray-600">Guest Customer</div>
                        <div className="text-md text-gray-500">No account</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Schedule */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BiCalendar className="h-5 w-5 mr-2" />
              Schedule Details
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <BiCalendar className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">{formattedAppointment.formattedDate}</div>
                    <div className="text-md text-gray-500">Date</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BiTime className="h-6 w-6 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">{formattedAppointment.formattedTime}</div>
                    <div className="text-md text-gray-500">Time</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MdEventNote className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className={`font-medium ${urgency.color}`}>{urgency.label}</div>
                    <div className="text-md text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BiNote className="h-5 w-5 mr-2" />
              Notes & Comments
            </h4>
            
            {appointment.notes && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Customer Notes</h5>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800">{appointment.notes}</p>
                </div>
              </div>
            )}
            
            {appointment.adminNotes && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Admin Notes</h5>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">{appointment.adminNotes}</p>
                </div>
              </div>
            )}
            
            {!appointment.notes && !appointment.adminNotes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-center">No notes available for this appointment</p>
              </div>
            )}
          </div>

          {/* Timeline Information */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-md">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{new Date(appointment.createdAt).toLocaleDateString()} at {new Date(appointment.createdAt).toLocaleTimeString()}</span>
                </div>
                {appointment.updatedAt !== appointment.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">{new Date(appointment.updatedAt).toLocaleDateString()} at {new Date(appointment.updatedAt).toLocaleTimeString()}</span>
                  </div>
                )}
                {formattedAppointment.daysDifference !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Until Appointment:</span>
                    <span className={`font-medium ${
                      formattedAppointment.daysDifference < 0 ? 'text-red-600' : 
                      formattedAppointment.daysDifference === 0 ? 'text-orange-600' :
                      formattedAppointment.daysDifference <= 1 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {formattedAppointment.daysDifference < 0 
                        ? `${Math.abs(formattedAppointment.daysDifference)} days ago` 
                        : formattedAppointment.daysDifference === 0 
                        ? 'Today' 
                        : `${formattedAppointment.daysDifference} days`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}