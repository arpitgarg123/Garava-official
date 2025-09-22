// src/features/product/selectors.js
import { createSelector } from "@reduxjs/toolkit";

export const selectProductList = (state) => state.product.list;
export const selectProductsItems = createSelector(selectProductList, (l) => l.items);
export const selectProductBySlug = (state, slug) => state.product.bySlug[slug] || null;
export const selectAvailability = (state, key) => state.product.availability[key] || null;
