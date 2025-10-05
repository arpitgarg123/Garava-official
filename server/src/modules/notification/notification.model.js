import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["out_of_stock", "low_stock", "order_placed", "payment_failed", "system"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    // Related entities
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },   
    variantId: {
      type: mongoose.Schema.Types.ObjectId
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    // Additional data for context
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Actions taken
    actionRequired: {
      type: Boolean,
      default: false
    },
    actionTaken: {
      type: Boolean,
      default: false
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    actionAt: {
      type: Date
    },
    actionNotes: {
      type: String,
      trim: true
    },
    // Auto-expiry for temporary notifications
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for efficient queries
notificationSchema.index({ type: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ severity: 1, actionRequired: 1, createdAt: -1 });
notificationSchema.index({ productId: 1, type: 1, createdAt: -1 });

// Virtual for formatted creation date
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt?.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static methods for creating specific notification types
notificationSchema.statics.createOutOfStockNotification = function(productData, variantData) {
  return this.create({
    type: "out_of_stock",
    title: `Product Out of Stock`,
    message: `${productData.name} (${variantData.sizeLabel}) is now out of stock`,
    severity: "high",
    actionRequired: true,
    productId: productData._id,
    variantId: variantData._id,
    metadata: {
      productName: productData.name,
      variantSku: variantData.sku,
      variantSizeLabel: variantData.sizeLabel,
      stockLevel: variantData.stock || 0
    }
  });
};

notificationSchema.statics.createLowStockNotification = function(productData, variantData, threshold = 5) {
  return this.create({
    type: "low_stock",
    title: `Low Stock Alert`,
    message: `${productData.name} (${variantData.sizeLabel}) has only ${variantData.stock} items left`,
    severity: "medium",
    actionRequired: true,
    productId: productData._id,
    variantId: variantData._id,
    metadata: {
      productName: productData.name,
      variantSku: variantData.sku,
      variantSizeLabel: variantData.sizeLabel,
      stockLevel: variantData.stock,
      threshold
    }
  });
};

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

notificationSchema.methods.markActionTaken = function(actionBy, notes = '') {
  this.actionTaken = true;
  this.actionBy = actionBy;
  this.actionAt = new Date();
  this.actionNotes = notes;
  return this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;