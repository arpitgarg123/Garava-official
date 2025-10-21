// src/modules/admin/product/product.admin.service.js
import ApiError from "../../../shared/utils/ApiError.js";
import Product from "../../product/product.model.js";
import { toRupees } from "../../order/order.pricing.js";

/**
 * Convert product prices from paise to rupees for admin display
 */
const convertProductPricesToRupees = (product) => {
  if (!product) return product;
  
  const converted = { ...product };
  
  if (converted.variants && Array.isArray(converted.variants)) {
    converted.variants = converted.variants.map(variant => ({
      ...variant,
      price: variant.price ? toRupees(variant.price) : variant.price,
      mrp: variant.mrp ? toRupees(variant.mrp) : variant.mrp,
      salePrice: variant.salePrice ? toRupees(variant.salePrice) : variant.salePrice
    }));
  }
  
  return converted;
};

export const createProductService = async (data, userId) => {
  if (await Product.findOne({ slug: data.slug })) {
    throw new ApiError(409, "Slug already in use");
  }

  data.createdBy = userId;
  data.updatedBy = userId;

  // ensure variants default
  if (data.variants && data.variants.length) {
    if (!data.variants.some(v => v.isDefault)) {
      data.variants[0].isDefault = true;
    }
  }

  const product = await Product.create(data);
  return product;
};

export const updateProductService = async (productId, updates, userId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  if (updates.slug && updates.slug !== product.slug) {
    const dup = await Product.findOne({ slug: updates.slug });
    if (dup) throw new ApiError(409, "Slug already in use");
  }

  Object.assign(product, updates);
  product.updatedBy = userId;
  await product.save();
  return product;
};

/**
 * Soft-delete product (admin)
 */
export const deleteProductService = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  product.isActive = false;
  product.status = "archived";
  await product.save();
  return true;
};

/**
 * Admin list with pagination + filters (include drafts)
 */
export const listProductsAdminService = async ({ page = 1, limit = 20, q, status, category }) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  // Convert prices from paise to rupees for frontend display
  const productsWithRupees = products.map(convertProductPricesToRupees);

  return { products: productsWithRupees, pagination: { total, page, limit, totalPages: Math.ceil(total/limit) } };
};

/**
 * Quick variant add
 */
export const addVariantService = async (productId, variantPayload) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // optional: enforce SKU uniqueness at product-level
  if (product.variants.some(v => String(v.sku) === String(variantPayload.sku))) {
    throw new ApiError(409, "Variant SKU already exists for this product");
  }

  // if isDefault true, unset previous
  if (variantPayload.isDefault) {
    product.variants.forEach(v => (v.isDefault = false));
  }
  product.variants.push(variantPayload);
  await product.save();
  return product;
};

/**
 * Update variant by index (or search by SKU if you prefer)
 * variantId can be index or SKU; we'll try SKU first then index
 */
export const updateVariantService = async (productId, variantId, updates) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // Use Mongoose subdocument helper
  const variant = product.variants.id(variantId);
  if (!variant) throw new ApiError(404, "Variant not found");

  Object.assign(variant, updates);

  // Handle default variant logic
  if (updates.isDefault === true) {
    product.variants.forEach(v => {
      if (String(v._id) !== String(variantId)) {
        v.isDefault = false;
      }
    });
    variant.isDefault = true;
  }

  await product.save();
  return product;
};

/**
 * Patch stock atomically for a variant (admin)
 * Use $inc for relative changes or set for absolute
 */
export const patchStockService = async (productId, { variantSku, stock, inc }) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const variant = product.variants.find(v => v.sku === variantSku);
  if (!variant) throw new ApiError(404, "Variant not found");

  if (typeof inc === "number") {
    // use atomic pattern to avoid races: we'll use findOneAndUpdate on variant stock via positional operator
    // build a filter and update
    const res = await Product.findOneAndUpdate(
      { _id: productId, "variants.sku": variantSku, "variants.stock": { $gte: Math.max(0, -inc) } },
      { $inc: { "variants.$.stock": inc }, $set: { "variants.$.stockStatus": (variant.stock + inc) > 0 ? "in_stock" : "out_of_stock" } },
      { new: true }
    );
    if (!res) throw new ApiError(400, "Stock update failed (possible insufficient stock)");
    return res;
  } else {
    // set absolute
    variant.stock = stock;
    variant.stockStatus = stock > 0 ? "in_stock" : "out_of_stock";
    await product.save();
    return product;
  }
};
