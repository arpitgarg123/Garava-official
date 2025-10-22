// src/modules/admin/product/product.admin.service.js
import ApiError from "../../../shared/utils/ApiError.js";
import Product from "../../product/product.model.js";
import { toRupees, toPaise } from "../../order/order.pricing.js";

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

/**
 * Convert product prices from rupees to paise for storage
 * Admin enters prices in rupees, but backend stores in paise
 */
const convertProductPricesToPaise = (data) => {
  if (!data) return data;
  
  const converted = { ...data };
  
  if (converted.variants && Array.isArray(converted.variants)) {
    converted.variants = converted.variants.map(variant => ({
      ...variant,
      price: variant.price ? toPaise(variant.price) : variant.price,
      mrp: variant.mrp ? toPaise(variant.mrp) : variant.mrp,
      salePrice: variant.salePrice ? toPaise(variant.salePrice) : variant.salePrice
    }));
  }
  
  return converted;
};

export const createProductService = async (data, userId) => {
  if (await Product.findOne({ slug: data.slug })) {
    throw new ApiError(409, "Slug already in use");
  }

  // Convert prices from rupees (admin input) to paise (storage)
  const dataWithPaise = convertProductPricesToPaise(data);

  dataWithPaise.createdBy = userId;
  dataWithPaise.updatedBy = userId;

  // ensure variants default
  if (dataWithPaise.variants && dataWithPaise.variants.length) {
    if (!dataWithPaise.variants.some(v => v.isDefault)) {
      dataWithPaise.variants[0].isDefault = true;
    }
  }

  const product = await Product.create(dataWithPaise);
  
  // Convert prices back to rupees for admin display
  return convertProductPricesToRupees(product.toObject());
};

export const updateProductService = async (productId, updates, userId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  if (updates.slug && updates.slug !== product.slug) {
    const dup = await Product.findOne({ slug: updates.slug });
    if (dup) throw new ApiError(409, "Slug already in use");
  }

  // Convert prices from rupees (admin input) to paise (storage)
  const updatesWithPaise = convertProductPricesToPaise(updates);

  Object.assign(product, updatesWithPaise);
  product.updatedBy = userId;
  await product.save();
  
  // Convert prices back to rupees for admin display
  return convertProductPricesToRupees(product.toObject());
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

  // Convert prices from rupees (admin input) to paise (storage)
  const variantWithPaise = {
    ...variantPayload,
    price: variantPayload.price ? toPaise(variantPayload.price) : variantPayload.price,
    mrp: variantPayload.mrp ? toPaise(variantPayload.mrp) : variantPayload.mrp,
    salePrice: variantPayload.salePrice ? toPaise(variantPayload.salePrice) : variantPayload.salePrice
  };

  // if isDefault true, unset previous
  if (variantWithPaise.isDefault) {
    product.variants.forEach(v => (v.isDefault = false));
  }
  product.variants.push(variantWithPaise);
  await product.save();
  
  // Convert prices back to rupees for admin display
  return convertProductPricesToRupees(product.toObject());
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

  // Convert prices from rupees (admin input) to paise (storage)
  const updatesWithPaise = { ...updates };
  if (updatesWithPaise.price !== undefined) {
    updatesWithPaise.price = updatesWithPaise.price ? toPaise(updatesWithPaise.price) : updatesWithPaise.price;
  }
  if (updatesWithPaise.mrp !== undefined) {
    updatesWithPaise.mrp = updatesWithPaise.mrp ? toPaise(updatesWithPaise.mrp) : updatesWithPaise.mrp;
  }
  if (updatesWithPaise.salePrice !== undefined) {
    updatesWithPaise.salePrice = updatesWithPaise.salePrice ? toPaise(updatesWithPaise.salePrice) : updatesWithPaise.salePrice;
  }

  Object.assign(variant, updatesWithPaise);

  // Handle default variant logic
  if (updatesWithPaise.isDefault === true) {
    product.variants.forEach(v => {
      if (String(v._id) !== String(variantId)) {
        v.isDefault = false;
      }
    });
    variant.isDefault = true;
  }

  await product.save();
  
  // Convert prices back to rupees for admin display
  return convertProductPricesToRupees(product.toObject());
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
