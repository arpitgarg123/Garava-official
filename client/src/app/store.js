import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice.js";
import productReducer from "../features/product/slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});