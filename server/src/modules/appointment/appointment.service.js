import ApiError from "../../shared/utils/ApiError.js";
import Appointment from "./appointment.model.js";
import { createNotificationService } from "../notification/notification.service.js";

import { sendAppointmentCancelledEmail, sendAppointmentCreatedEmail, sendAppointmentStatusEmail } from "../../shared/emails/email.service.js";

/**
 * Create appointment (user)
 * payload: { name, email, phone, serviceType, appointmentAt (ISO string), notes }
 * userId optional
 */
export const createAppointmentService = async (userId, payload) => {
  const { name, email, phone, serviceType, appointmentAt, notes } = payload;
  if (!name || !email || !phone || !serviceType || !appointmentAt) {
    throw new ApiError(400, "Missing required fields");
  }

  const dt = new Date(appointmentAt);
  if (isNaN(dt.getTime())) throw new ApiError(400, "Invalid appointmentAt");

  // Optional: check double-booking for same slot and serviceType (simple rule)
  const conflict = await Appointment.findOne({
    serviceType,
    appointmentAt: dt,
    status: { $in: ["pending", "confirmed"] }
  });
  if (conflict) throw new ApiError(409, "Selected slot not available");

  const doc = new Appointment({
    user: userId || undefined,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    serviceType,
    notes: notes ? notes.trim() : "",
    appointmentAt: dt,
    status: "pending",
    createdBy: userId || undefined,
    updatedBy: userId || undefined
  });

  await doc.save();

  // Create admin notification for new appointment request
  try {
    await createNotificationService({
      type: 'system',
      title: 'New Appointment Request',
      message: `New appointment request from ${name} for ${serviceType}`,
      severity: 'medium',
      metadata: {
        appointmentId: doc._id,
        customerName: name,
        customerEmail: email,
        serviceType,
        appointmentAt: dt
      }
    });
  } catch (notifError) {
    console.error("❌ Failed to create appointment notification:", notifError.message || notifError);
  }

  // send confirmation email (best-effort)
  try {
  await sendAppointmentCreatedEmail(doc);
} catch (err) {
  console.error("❌ Appointment created email failed:", err.message || err);
}

  return doc.toObject();
};

/**
 * Get appointments for a user (paginated)
 */
export const listUserAppointmentsService = async (userId, { page = 1, limit = 10 }) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Appointment.find({ user: userId }).sort({ appointmentAt: 1 }).skip(skip).limit(limit).lean(),
    Appointment.countDocuments({ user: userId })
  ]);
  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total/limit) } };
};


/* ---------------- Admin services ---------------- */

/**
 * List appointments for admin with filters
 * filters: { status, serviceType, fromDate, toDate, page, limit }
 */
export const listAdminAppointmentsService = async ({ status, serviceType, fromDate, toDate, page = 1, limit = 20 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (serviceType) filter.serviceType = serviceType;
  if (fromDate || toDate) {
    filter.appointmentAt = {};
    if (fromDate) filter.appointmentAt.$gte = new Date(fromDate);
    if (toDate) filter.appointmentAt.$lte = new Date(toDate);
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Appointment.find(filter).sort({ appointmentAt: 1 }).skip(skip).limit(limit).lean(),
    Appointment.countDocuments(filter)
  ]);
  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total/limit) } };
};

/**
 * Update appointment status or admin notes (admin only)
 * payload: { status?: 'confirmed'|'completed'|'cancelled', adminNotes?: string, appointmentAt?: ISO }
 */
export const updateAppointmentService = async (adminId, appointmentId, updates) => {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, "Appointment not found");

  const allowed = ["status", "adminNotes", "appointmentAt"];
  for (const k of Object.keys(updates)) {
    if (!allowed.includes(k)) continue;
    if (k === "appointmentAt") {
      const d = new Date(updates.appointmentAt);
      if (isNaN(d.getTime())) throw new ApiError(400, "Invalid appointmentAt");
      appt.appointmentAt = d;
    } else {
      appt[k] = updates[k];
    }
  }
  appt.updatedBy = adminId;
  await appt.save();

  // Create admin notification for status changes
  if (updates.status) {
    try {
      let notificationMessage = '';
      let severity = 'low';
      
      if (updates.status === 'confirmed') {
        notificationMessage = `Appointment confirmed for ${appt.name}`;
        severity = 'low';
      } else if (updates.status === 'cancelled') {
        notificationMessage = `Appointment cancelled for ${appt.name}`;
        severity = 'medium';
      } else if (updates.status === 'completed') {
        notificationMessage = `Appointment completed for ${appt.name}`;
        severity = 'low';
      }

      if (notificationMessage) {
        await createNotificationService({
          type: 'system',
          title: 'Appointment Status Update',
          message: notificationMessage,
          severity,
          metadata: {
            appointmentId: appt._id,
            customerName: appt.name,
            previousStatus: appt.status,
            newStatus: updates.status,
            serviceType: appt.serviceType
          }
        });
      }
    } catch (notifError) {
      console.error("❌ Failed to create appointment status notification:", notifError.message || notifError);
    }
  }

 if (updates.status) {
  try {
    // Send specific email based on status
    if (updates.status === 'cancelled') {
      await sendAppointmentCancelledEmail(appt);
    } else {
      await sendAppointmentStatusEmail(appt);
    }
  } catch (e) {
    console.error("❌ Appointment status email failed:", e.message);
  }
}

  return appt.toObject();
};
