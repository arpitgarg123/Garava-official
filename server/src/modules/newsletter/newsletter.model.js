import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  status: {
    type: String,
    enum: ["subscribed", "unsubscribed", "pending"],
    default: "subscribed", // use "pending" if you add double opt-in
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date },
}, { timestamps: true });

newsletterSchema.index({ email: 1 });

export default mongoose.model("Newsletter", newsletterSchema);
