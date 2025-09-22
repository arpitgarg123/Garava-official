import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./appointment.service.js";
import ApiError from "../../shared/utils/ApiError.js";

export const createAppointment = asyncHandler(async (req, res) => {
  const userId = req.user?.id; // optional; allow guest
  const payload = req.body;
  const appt = await service.createAppointmentService(userId, payload);
  res.status(201).json({ success: true, appointment: appt });
});

export const listUserAppointments = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const data = await service.listUserAppointmentsService(userId, { page, limit });
  res.json({ success: true, ...data });
});


/* Admin controllers */
export const listAdminAppointments = asyncHandler(async (req, res) => {
  const { status, serviceType, fromDate, toDate } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const data = await service.listAdminAppointmentsService({ status, serviceType, fromDate, toDate, page, limit });
  res.json({ success: true, ...data });
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const appointmentId = req.params.id;
  const updates = req.body;
  const appt = await service.updateAppointmentService(adminId, appointmentId, updates);
  res.json({ success: true, appointment: appt });
});
