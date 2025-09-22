import { Router } from "express";
import {
  createAppointment,
  listUserAppointments,
  listAdminAppointments,
  updateAppointment
} from "./appointment.controller.js";
import { authenticated } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// user endpoints
router.post("/", createAppointment); 
router.get("/me", authenticated, listUserAppointments);

// admin endpoints
router.get("/admin", authenticated, authorize("admin"), listAdminAppointments);
router.patch("/admin/:id", authenticated, authorize("admin"), updateAppointment);

export default router;
