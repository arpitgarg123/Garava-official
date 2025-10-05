import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./product.service.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, q, type, category, priceMin, priceMax, sort, colors } = req.query;
  
  // Parse colors if it's a string (comma-separated) or array
  let parsedColors = null;
  if (colors) {
    if (typeof colors === 'string') {
      parsedColors = colors.split(',').map(c => c.trim()).filter(Boolean);
    } else if (Array.isArray(colors)) {
      parsedColors = colors;
    }
  }
  
  const result = await service.listProductsService({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    q,
    type,
    category,
    priceMin,
    priceMax,
    sort,
    colors: parsedColors,
  });  
  res.json({ success: true, ...result });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await service.getProductBySlugService(req.params.slug);
  res.json({ success: true, product });
});

export const getProductBySku = asyncHandler(async (req, res) => {
  const result = await service.getProductBySkuService(req.params.sku);
  res.json({ success: true, ...result });
});

export const checkPincode = asyncHandler(async (req, res) => {
  const { productId, variantId, pincode } = req.body;
  const result = await service.checkPincodeService(productId, variantId, pincode);
  res.json({ success: true, ...result });
});
