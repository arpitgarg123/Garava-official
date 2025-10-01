import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "../features/auth/slice.js";
import productReducer from "../features/product/slice.js";
import productAdminReducer from "../features/product/adminSlice.js";
import cartReducer from "../features/cart/slice.js";
import wishlistReducer from "../features/wishlist/slice.js";
import orderReducer from "../features/order/slice.js";
import orderAdminReducer from "../features/order/adminSlice.js";
import appointmentAdminReducer from "../features/appointment/adminSlice.js";
import addressReducer from "../features/address/slice.js";
import blogReducer from "../features/blogs/slice.js";
import blogAdminReducer from "../features/blogs/blogAdminSlice.js";
import reviewReducer from "../features/reviews/reviewSlice.js";
import reviewAdminReducer from "../features/reviews/reviewAdminSlice.js";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist"], // Persist auth, cart, and wishlist data
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  productAdmin: productAdminReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  orderAdmin: orderAdminReducer,
  appointmentAdmin: appointmentAdminReducer,
  address: addressReducer,
  blog: blogReducer,
  blogAdmin: blogAdminReducer,
  review: reviewReducer,
  reviewAdmin: reviewAdminReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);