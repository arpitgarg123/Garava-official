// src/modules/admin/product/product.admin.validation.js
import { z } from "zod";

// Predefined badge options (must match Product model enum)
const BADGE_OPTIONS = ["New", "Exclusive", "Limited Edition", "Best Seller", "Trending", "Sale"];

export const variantSchema = z.object({
  sku: z.string().min(1),
  sizeLabel: z.string().min(1),
  price: z.number().nonnegative(),
  mrp: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  stockStatus: z.enum(["in_stock","out_of_stock","preorder","backorder"]).optional(),
  weight: z.number().nonnegative().optional(),
  images: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  purchaseLimit: z.number().int().nonnegative().optional(),
  leadTimeDays: z.number().int().nonnegative().optional()
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["fragrance","jewellery","other"]).optional().default("fragrance"),
  slug: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  variants: z.array(variantSchema).min(1),
  heroImage: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  gstIncluded: z.boolean().optional(),
  badges: z.array(z.enum(["New", "Exclusive", "Limited Edition", "Best Seller", "Trending", "Sale"])).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["draft","published","archived"]).optional(),
  isActive: z.boolean().optional(),
  shippingInfo: z.any().optional(),
  expectedDeliveryText: z.string().optional(),
  freeGiftWrap: z.boolean().optional(),
  giftWrap: z.any().optional(),
  giftMessageAvailable: z.boolean().optional(),
  purchaseLimitPerOrder: z.number().int().nonnegative().optional(),
  minOrderQty: z.number().int().positive().optional(),
  relatedProducts: z.array(z.string()).optional(),
  upsellProducts: z.array(z.string()).optional(),
  collections: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

export const updateProductSchema = createProductSchema.partial();
