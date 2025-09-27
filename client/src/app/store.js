import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "../features/auth/slice.js";
import productReducer from "../features/product/slice.js";
import cartReducer from "../features/cart/slice.js";
import wishlistReducer from "../features/wishlist/slice.js";

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
  cart: cartReducer,
  wishlist: wishlistReducer,
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