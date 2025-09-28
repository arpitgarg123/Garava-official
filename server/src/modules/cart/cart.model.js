import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // variant _id
    variantSku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }, // in paise
    mrp: { type: Number, default: 0 }, // in paise
    name: { type: String }, // product snapshot
    heroImage: { type: String }, // product snapshot
    // optional flags
    outOfStock: { type: Boolean, default: false },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 }, // paise
  },
  { timestamps: true }
);

// Index is already created by unique: true constraint above

export default mongoose.model("Cart", cartSchema);
