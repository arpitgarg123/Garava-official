import Product from "./product.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import mongoose from "mongoose";

/**
 * List products (public API)
 * Supports filters, search, pagination, and sorting
 */
export const listProductsService = async ({
  page = 1,
  limit = 20,
  q,
  type,
  category,
  priceMin,
  priceMax,
  sort,
}) => {
  const skip = (page - 1) * limit;

  // Filters
  const filter = { isActive: true, status: "published" };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  // Price filter: check variants
  if (priceMin || priceMax) {
    filter["variants.price"] = {};
    if (priceMin) filter["variants.price"].$gte = Number(priceMin);
    if (priceMax) filter["variants.price"].$lte = Number(priceMax);
  }

  // Sort mapping
  const sortOptions = {
    price_asc: { "variants.price": 1 },
    price_desc: { "variants.price": -1 },
    newest: { createdAt: -1 },
    rating: { avgRating: -1 },
    popularity: { reviewCount: -1 },
  };

  const sortQuery = sortOptions[sort] || { createdAt: -1 };

  // Query
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Normalize products for list view
  const normalized = products.map((p) => {
    const defaultVariant =
      p.variants.find((v) => v.isDefault) || p.variants[0] || null;

    return {
      id: p._id,
      name: p.name,
      slug: p.slug,
      type: p.type,
      category: p.category,
      shortDescription: p.shortDescription,
      heroImage: p.heroImage,
      priceRange: {
        min: Math.min(...p.variants.map((v) => v.price)),
        max: Math.max(...p.variants.map((v) => v.price)),
      },
      defaultVariant: defaultVariant
        ? {
            id: defaultVariant._id,
            sku: defaultVariant.sku,
            sizeLabel: defaultVariant.sizeLabel,
            price: defaultVariant.price,
            stockStatus: defaultVariant.stockStatus,
          }
        : null,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      isFeatured: p.isFeatured,
    };
  });

  return {
    products: normalized,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single product by slug
 */
export const getProductBySlugService = async (slug) => {
  const product = await Product.findOne({
    slug,
    isActive: true,
    status: "published",
  }).lean();

  if (!product) throw new ApiError(404, "Product not found");

  return product;
};

/**
 * Lookup product by SKU (for cart validation)
 */
export const getProductBySkuService = async (sku) => {
  const product = await Product.findOne({
    "variants.sku": sku,
    isActive: true,
    status: "published",
  }).lean();

  if (!product) throw new ApiError(404, "Product/variant not found");

  const variant = product.variants.find((v) => v.sku === sku);

  return {
    productId: product._id,
    slug: product.slug,
    variant: {
      id: variant._id,
      sku: variant.sku,
      sizeLabel: variant.sizeLabel,
      price: variant.price,
      stock: variant.stock,
      stockStatus: variant.stockStatus,
    },
    heroImage: product.heroImage,
    name: product.name,
  };
};

/**
 * Check product availability for a pincode
 */
export const checkPincodeService = async (productId, variantId, pincode) => {
  const product = await Product.findById(productId).lean(); // lean for performance
  if (!product) throw new ApiError(404, "Product not found");

  const variant = product.variants.find(
    (v) => v._id.toString() === variantId.toString()
  );
  if (!variant) throw new ApiError(404, "Variant not found");

  const shippingInfo = product.shippingInfo || {};

  if (shippingInfo.pincodeRestrictions) {
    return {
      available: false,
      codAvailable: false,
      note: "Delivery not available in this pincode",
    };
  }

  return {
    available: true,
    codAvailable: shippingInfo.codAvailable ?? true,
    minDeliveryDays: shippingInfo.minDeliveryDays || 2,
    maxDeliveryDays: shippingInfo.maxDeliveryDays || 7,
    note: shippingInfo.note || "Estimated delivery in 2–7 days",
  };
};
