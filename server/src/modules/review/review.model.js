import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // integer 1..5
  title: { type: String, trim: true, maxlength: 120 },
  body: { type: String, trim: true, maxlength: 2000 },
  photos: [{ url: String, fileId: String }], // optional images uploaded via imagekit
  verifiedPurchase: { type: Boolean, default: false }, // set by server if user bought
  isApproved: { type: Boolean, default: false }, // moderation: auto-approve or admin reviews required
  isActive: { type: Boolean, default: true }, // soft-delete
  flagged: { type: Boolean, default: false }, // user/report flagging
  helpfulCount: { type: Number, default: 0 },
  unhelpfulCount: { type: Number, default: 0 },
  // audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// ensure one review per user per product by default
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// lightweight text index for searching reviews
reviewSchema.index({ title: "text", body: "text" });

export default mongoose.model("Review", reviewSchema);
