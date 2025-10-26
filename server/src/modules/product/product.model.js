import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, trim: true }, // removed unique: true at schema level to allow different products with same SKU if needed; enforce uniqueness at app/admin level if required
    sizeLabel: { type: String, required: true }, // e.g., "10ml", "50ml" or "18in"
    price: { type: Number, required: function() { return !this.isPriceOnDemand; } }, // Not required for price on request items
    mrp: { type: Number },
    isPriceOnDemand: { type: Boolean, default: false }, // For high jewellery variants
    priceOnDemandText: { type: String, default: "Price on Request" }, // Custom text for price display
    stock: { type: Number, default: 0 },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "preorder", "backorder", "made_to_order"],
      default: "in_stock",
    },
    weight: { type: Number }, // grams
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false }, // default variant on product page
    purchaseLimit: { type: Number, default: 0 }, // 0 = no limit, >0 = max per order
    leadTimeDays: { type: Number, default: 0 }, // when preorder/backorder
  },
  { timestamps: false}
);

const shippingInfoSchema = new mongoose.Schema(
  {
    complementary: { type: Boolean, default: false },
    minDeliveryDays: { type: Number },
    maxDeliveryDays: { type: Number },
    note: { type: String }, // free text: "Expected delivery T+5 days"
    codAvailable: { type: Boolean, default: true },
    pincodeRestrictions: { type: Boolean, default: false }, // use ShippingZone for details
  },
  { _id: false }
);

const giftWrapSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    price: { type: Number, default: 0 }, // 0 => free wrapping
    options: [
      {
        id: String,
        label: String,
        description: String,
        price: Number,
      },
    ],  
  },
  { _id: false } 
);

const productSchema = new mongoose.Schema(
  {
    // basic
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["fragrance", "jewellery", "high_jewellery", "other"], default: "fragrance" },
    slug: { type: String, required: true, lowercase: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    tags: [{ type: String }],

    // descriptions
    shortDescription: { type: String },
    description: { type: String },
    structuredDescription: {
      description: { type: String },
      productDetails: { type: String },
      careInstructions: { type: String },
      sizeGuide: { type: String },
      materials: { type: String },
      shippingInfo: { type: String }
    },

    // perfume fields
    fragranceNotes: {
      top: [String],
      middle: [String],
      base: [String],
    },
    ingredients: { type: String },
    caution: { type: String },
    storage: { type: String },

    // jewellery fields
    dimensions: { type: String }, // "18 x 12 mm"
    material: { type: String }, // "925 Sterling Silver"
    careInstructions: { type: String },
    
    // color options for jewellery
    colorVariants: [{
      name: { type: String }, // "Rose Gold", "Silver", "Yellow Gold"
      code: { type: String }, // "rose", "silver", "gold"  
      hexColor: { type: String }, // "#e7b9a4", "#d9d9d9", "#c79b3a"
      isAvailable: { type: Boolean, default: true },
      // Images specific to this color variant
      heroImage: {
        url: { type: String },
        fileId: { type: String }
      },
      gallery: [{
        url: { type: String },
        fileId: { type: String }
      }],
      // Additional metadata for this color
      stockStatus: { type: String, enum: ["in_stock", "out_of_stock", "limited"], default: "in_stock" },
      priority: { type: Number, default: 0 }, // Display order
      description: { type: String } // Color-specific description
    }],

    // product structure
    variants: [variantSchema],
    heroImage: {
  url: String,
  fileId: String
  },
  gallery: [
    { url: String, fileId: String }
  ],

    // prices & stock-level defaults
    gstIncluded: { type: Boolean, default: true },

    // promotions & UI
    badges: [{ 
      type: String,
      enum: ["New", "Exclusive", "Limited Edition", "Best Seller", "Trending", "Sale"]
    }], // Predefined badge options
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    isActive: { type: Boolean, default: true },

    // shipping & delivery UI
    shippingInfo: shippingInfoSchema,
    expectedDeliveryText: { type: String }, // quick override for front-end display

    // gifting / special options
    freeGiftWrap: { type: Boolean, default: false }, // quick boolean
    giftWrap: giftWrapSchema, // structured options
    giftMessageAvailable: { type: Boolean, default: false },

    // ordering UX
    purchaseLimitPerOrder: { type: Number, default: 0 }, // 0 = none
    minOrderQty: { type: Number, default: 1 },

    // interactions / CTA
    callToOrder: {
      enabled: { type: Boolean, default: false },
      phone: { type: String },
      text: { type: String }, // "Order by Phone"
    },
    askAdvisor: { type: Boolean, default: false },
    bookAppointment: { type: Boolean, default: false },
    
    // High Jewellery specific fields
    isPriceOnDemand: { type: Boolean, default: false }, // For high jewellery items
    customizationOptions: {
      enabled: { type: Boolean, default: false },
      description: { type: String },
      estimatedDays: { type: Number }, // customization time
    },
    consultationRequired: { type: Boolean, default: false }, // Require consultation before purchase

    // related / merchandising
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    upsellProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    collections: [{ type: String }], // e.g., ["Jewellery Ring", "Jewellery Bracelet"]

    // reviews summary (updated from reviews collection)
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // policy & meta
    returnPolicy: { type: String },
    warranty: { type: String },

    // seo
    metaTitle: { type: String },
    metaDescription: { type: String },

    // admin/audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Product", productSchema);
