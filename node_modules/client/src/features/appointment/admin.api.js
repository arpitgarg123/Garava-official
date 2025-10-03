import { authHttp } from "../../shared/api/http";

/**
 * Appointment Admin API Integration
 * All endpoints require admin authentication
 */

// List all appointments with pagination and filters
export const listAppointmentsAdmin = (params = {}) => {
  const { page = 1, limit = 20, status, serviceType, fromDate, toDate } = params;
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (status) queryParams.append('status', status);
  if (serviceType) queryParams.append('serviceType', serviceType);
  if (fromDate) queryParams.append('fromDate', fromDate);
  if (toDate) queryParams.append('toDate', toDate);
  
  return authHttp.get(`/appointment/admin?${queryParams.toString()}`);
};

// Update appointment (status, notes, reschedule)
export const updateAppointment = (appointmentId, updateData) => {
  console.log('Sending appointment update:', { appointmentId, updateData }); // Debug log
  return authHttp.patch(`/appointment/admin/${appointmentId}`, updateData);
};

// Helper function to format appointment data for display
export const formatAppointmentForDisplay = (appointment) => {
  return {
    ...appointment,
    formattedDate: new Date(appointment.appointmentAt).toLocaleDateString(),
    formattedTime: new Date(appointment.appointmentAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    customerName: appointment.name,
    customerEmail: appointment.email,
    customerPhone: appointment.phone,
    isUpcoming: new Date(appointment.appointmentAt) > new Date(),
    isPast: new Date(appointment.appointmentAt) < new Date(),
    daysDifference: Math.ceil((new Date(appointment.appointmentAt) - new Date()) / (1000 * 60 * 60 * 24))
  };
};

// Get appointment status color classes for UI
export const getAppointmentStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200", 
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Get service type display info
export const getServiceTypeInfo = (serviceType) => {
  const serviceTypes = {
    fragrance_consult: {
      label: "Fragrance Consultation",
      description: "Personal fragrance selection and consultation",
      duration: "30-45 minutes",
      icon: "🌸"
    },
    jewellery_styling: {
      label: "Jewellery Styling",
      description: "Personal jewellery styling and selection",
      duration: "45-60 minutes", 
      icon: "💎"
    },
    store_visit: {
      label: "Store Visit",
      description: "General store visit and browsing",
      duration: "As needed",
      icon: "🏪"
    },
    custom: {
      label: "Custom Service",
      description: "Custom appointment service",
      duration: "Variable",
      icon: "⭐"
    }
  };
  
  return serviceTypes[serviceType] || {
    label: serviceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: "Service consultation",
    duration: "Variable",
    icon: "📅"
  };
};

// Get appointment urgency based on time
export const getAppointmentUrgency = (appointmentAt) => {
  const now = new Date();
  const appointmentDate = new Date(appointmentAt);
  const diffHours = (appointmentDate - now) / (1000 * 60 * 60);
  
  if (diffHours < 0) {
    return { level: 'past', label: 'Past', color: 'text-gray-500' };
  } else if (diffHours < 2) {
    return { level: 'urgent', label: 'Urgent', color: 'text-red-600' };
  } else if (diffHours < 24) {
    return { level: 'today', label: 'Today', color: 'text-orange-600' };
  } else if (diffHours < 48) {
    return { level: 'tomorrow', label: 'Tomorrow', color: 'text-blue-600' };
  } else {
    return { level: 'upcoming', label: 'Upcoming', color: 'text-green-600' };
  }
};