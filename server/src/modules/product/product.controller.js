import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./product.service.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, q, type, category, priceMin, priceMax, sort } = req.query;
  const result = await service.listProductsService({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    q,
    type,
    category,
    priceMin,
    priceMax,
    sort,
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
