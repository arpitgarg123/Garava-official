// src/modules/order/order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productSnapshot: {
    name: { type: String },
    slug: { type: String },
    heroImage: { type: mongoose.Schema.Types.Mixed }, // can be { url, fileId } or string
    type: { type: String },
  },
  variantId: { type: mongoose.Schema.Types.ObjectId },
  variantSnapshot: {
    sku: { type: String },
    sizeLabel: { type: String },
    images: [{ type: String }],
  },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }, // store minor units (paise) ideally
  mrp: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  lineTotal: { type: Number, required: true },
}, { _id: false });


const shipmentSchema = new mongoose.Schema({
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  shippedAt: Date,
  deliveredAt: Date,
  items: [{ variantId: mongoose.Schema.Types.ObjectId, qty: Number }],
}, { _id: false });

const historySchema = new mongoose.Schema({
  status: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
  at: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true }, // human readable
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userSnapshot: { name: String, email: String, phone: String },

  items: [orderItemSchema],

  subtotal: { type: Number, required: true },
  taxTotal: { type: Number, default: 0 },
  shippingTotal: { type: Number, default: 0 }, // Delivery charges
  codCharge: { type: Number, default: 0 }, // COD handling fee
  discountTotal: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  // Address reference and snapshot
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true, index: true },
  shippingAddressSnapshot: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    label: String,
  },

  payment: {
    method: { type: String }, // 'phonepe' | 'cod' | 'razorpay' (legacy)
    gatewayOrderId: { type: String },
    gatewayTransactionId: { type: String }, // PhonePe transaction ID
    gatewayPaymentId: { type: String },
    gatewayPaymentStatus: { type: String }, // Gateway specific status
    status: { type: String, enum: ["unpaid","paid","failed","refunded","pending"], default: "unpaid" },
    paidAt: Date,
    providerResponse: mongoose.Schema.Types.Mixed,
  },

  shipments: [shipmentSchema],

  status: {
    type: String,
    enum: ["pending_payment","paid","processing","partially_shipped","shipped","delivered","cancelled","refunded","failed"],
    default: "pending_payment",
    index: true,
  },

  idempotencyKey: { type: String, index: true, sparse: true },

  history: [historySchema],

  notes: [{ by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String, at: { type: Date, default: Date.now } }],
  
    tracking: {
      courier: String,
      trackingNumber: String,
      url: String,
    },

    adminNote: { type: String },

}, { timestamps: true });

// indexes for quick queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "payment.gatewayOrderId": 1 });
orderSchema.index({ "shipments.trackingNumber": 1 });

export default mongoose.model("Order", orderSchema);
