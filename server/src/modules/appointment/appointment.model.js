import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional for guests
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },

  serviceType: { type: String, required: true }, // e.g., "fragrance_consult", "jewelry_styling", "store_visit"
  notes: { type: String },

  // For simplicity store a single Date for appointment slot
  appointmentAt: { type: Date, required: true },

  // status: pending (user created) -> confirmed (admin confirms) -> completed -> cancelled
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
    index: true
  },

  // admin notes (reschedule reason, internal comments)
  adminNotes: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who created it (if logged in)
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

appointmentSchema.index({ appointmentAt: 1 });
appointmentSchema.index({ user: 1, status: 1 });

export default mongoose.model("Appointment", appointmentSchema);
