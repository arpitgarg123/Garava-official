import Product from "./product.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import mongoose from "mongoose";
import { toRupees, toPaise } from "../order/order.pricing.js";

/**
 * Convert product prices from paise to rupees for frontend response
 */
const convertProductPricesToRupees = (product) => {
  if (!product) return product;
  
  return {
    ...product,
    variants: product.variants?.map(variant => ({
      ...variant,
      price: variant.price ? toRupees(variant.price) : variant.price,
      mrp: variant.mrp ? toRupees(variant.mrp) : variant.mrp,
      salePrice: variant.salePrice ? toRupees(variant.salePrice) : variant.salePrice
    })) || []
  };
};

/**
 * List products (public API)
 * Supports filters, search, pagination, and sorting
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const listProductsService = async ({
  page = 1,
  limit = 20,
  q,
  type,
  category,
  priceMin,
  priceMax,
  sort,
  colors, // Add colors parameter
}) => {
  const skip = (page - 1) * limit;
  
  // Filters
  const filter = { isActive: true, status: "published" };
  if (type) filter.type = type;
  if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
  if (q) filter.$text = { $search: q };

  // Price filter: check variants (convert rupees to paise for database query)
  if (priceMin || priceMax) {
    filter["variants.price"] = {};
    // Convert frontend rupees to backend paise for filtering
    if (priceMin) filter["variants.price"].$gte = toPaise(Number(priceMin));
    if (priceMax) filter["variants.price"].$lte = toPaise(Number(priceMax));
  }

  // Color filter: check colorVariants
  if (colors && Array.isArray(colors) && colors.length > 0) {
    filter["colorVariants.code"] = { $in: colors };
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
    // Convert prices to rupees for frontend first
    const productWithRupees = convertProductPricesToRupees(p);
    
    const defaultVariant =
      productWithRupees.variants.find((v) => v.isDefault) || productWithRupees.variants[0] || null;
      const prices = (productWithRupees.variants || []).map(v => Number(v.price)).filter(p => !isNaN(p));
      const priceRange = prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : { min: null, max: null };

    // Check if product is out of stock based on variants
    const isOutOfStock = productWithRupees.variants.every(v => v.stockStatus === 'out_of_stock' || v.stock === 0);

    return {
      id: productWithRupees._id,
      name: productWithRupees.name,
      slug: productWithRupees.slug,
      type: productWithRupees.type,
      category: productWithRupees.category,
      shortDescription: productWithRupees.shortDescription,
      heroImage: productWithRupees.heroImage,
      colorVariants: productWithRupees.colorVariants || [], // Add colorVariants to response
      priceRange: {
        min: Math.min(...productWithRupees.variants.map((v) => v.price)),
        max: Math.max(...productWithRupees.variants.map((v) => v.price)),
      },
      defaultVariant: defaultVariant
        ? {
            id: defaultVariant._id,
            sku: defaultVariant.sku,
            sizeLabel: defaultVariant.sizeLabel,
            price: defaultVariant.price,
            stock: defaultVariant.stock,
            stockStatus: defaultVariant.stockStatus,
          }
        : null,
      isOutOfStock,
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

  const processedProduct = processProductDetails(product);
  return convertProductPricesToRupees(processedProduct);
};

export const getProductByIdService = async (id) => {
  const product = await Product.findOne({
    _id: id,
    isActive: true,
    status: "published",
  }).lean();

  if (!product) throw new ApiError(404, "Product not found");

  const processedProduct = processProductDetails(product);
  return convertProductPricesToRupees(processedProduct);
};

// Helper function to process product details
const processProductDetails = (product) => {

  // Calculate total stock and out-of-stock status
  const totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
  const isOutOfStock = totalStock === 0 || product.variants.every(v => v.stockStatus === 'out_of_stock');

  // Ensure variant _id fields are preserved (convert to string if needed)
  const processedVariants = product.variants.map(variant => ({
    ...variant,
    _id: variant._id?.toString() || variant._id,
    id: variant._id?.toString() || variant._id // Add id as alias
  }));

  return {
    ...product,
    variants: processedVariants,
    totalStock,
    isOutOfStock,
  };
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
      price: toRupees(variant.price), // Convert to rupees
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
