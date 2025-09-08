import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  
  label: { type: String, enum: ["home", "work", "other"], default: "home" },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true, default: "India" },

  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
