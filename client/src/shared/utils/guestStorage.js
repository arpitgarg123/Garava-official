/**
 * Guest Storage Utilities
 * Handles localStorage operations for non-authenticated users
 * Provides cart and wishlist functionality without backend dependency
 */

const GUEST_CART_KEY = 'garava_guest_cart';
const GUEST_WISHLIST_KEY = 'garava_guest_wishlist';
const STORAGE_VERSION = '1.0';
const EXPIRY_DAYS = 30; // Guest data expires after 30 days

// Helper functions
const getCurrentTimestamp = () => Date.now();
const isExpired = (timestamp) => {
  if (!timestamp) return true;
  const expiryTime = timestamp + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  return Date.now() > expiryTime;
};

const createStorageItem = (data) => ({
  version: STORAGE_VERSION,
  timestamp: getCurrentTimestamp(),
  data: data || []
});

const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (!parsed || parsed.version !== STORAGE_VERSION || isExpired(parsed.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

const setStorageItem = (key, data) => {
  try {
    const item = createStorageItem(data);
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
    return false;
  }
};

// Guest Cart Functions
export const guestCart = {
  get: () => {
    const items = getStorageItem(GUEST_CART_KEY) || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalAmount
    };
  },

  add: (cartItem) => {
    const currentCart = guestCart.get();
    const existingItemIndex = currentCart.items.findIndex(item => 
      item.productId === cartItem.productId && 
      (item.variantId === cartItem.variantId || item.variantSku === cartItem.variantSku)
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex].quantity += cartItem.quantity || 1;
    } else {
      // Add new item
      const newItem = {
        _id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        variantSku: cartItem.variantSku,
        quantity: cartItem.quantity || 1,
        unitPrice: cartItem.unitPrice || 0,
        productDetails: cartItem.productDetails || null,
        addedAt: getCurrentTimestamp()
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const success = setStorageItem(GUEST_CART_KEY, updatedItems);
    return success ? guestCart.get() : currentCart;
  },
    
  update: (itemId, quantity) => {
    const currentCart = guestCart.get();
    const updatedItems = currentCart.items.map(item => 
      item._id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0); // Remove items with 0 quantity

    const success = setStorageItem(GUEST_CART_KEY, updatedItems);
    return success ? guestCart.get() : currentCart;
  },

  remove: (itemId) => {
    const currentCart = guestCart.get();
    const updatedItems = currentCart.items.filter(item => item._id !== itemId);
    
    const success = setStorageItem(GUEST_CART_KEY, updatedItems);
    return success ? guestCart.get() : currentCart;
  },

  clear: () => {
    localStorage.removeItem(GUEST_CART_KEY);
    return guestCart.get();
  },

  // Get all items for sync when user logs in
  getAllForSync: () => {
    const currentCart = guestCart.get();
    return currentCart.items.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      variantSku: item.variantSku,
      quantity: item.quantity
    }));
  }
};

// Guest Wishlist Functions
export const guestWishlist = {
  get: () => {
    const items = getStorageItem(GUEST_WISHLIST_KEY) || [];
    return {
      products: items,
      productIds: items.map(item => item.productId).filter(Boolean),
      pagination: {
        total: items.length,
        page: 1,
        limit: 50,
        totalPages: Math.ceil(items.length / 50)
      }
    };
  },

  add: (productId, productDetails = null) => {
    const currentWishlist = guestWishlist.get();
    
    // Check if already exists
    if (currentWishlist.productIds.includes(productId)) {
      return currentWishlist;
    }

    const newItem = {
      _id: `guest-wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      product: productDetails,
      addedAt: getCurrentTimestamp()
    };

    const updatedItems = [...currentWishlist.products, newItem];
    const success = setStorageItem(GUEST_WISHLIST_KEY, updatedItems);
    return success ? guestWishlist.get() : currentWishlist;
  },

  remove: (productId) => {
    const currentWishlist = guestWishlist.get();
    const updatedItems = currentWishlist.products.filter(item => item.productId !== productId);
    
    const success = setStorageItem(GUEST_WISHLIST_KEY, updatedItems);
    return success ? guestWishlist.get() : currentWishlist;
  },

  toggle: (productId, productDetails = null) => {
    const currentWishlist = guestWishlist.get();
    const isInWishlist = currentWishlist.productIds.includes(productId);
    
    if (isInWishlist) {
      const result = guestWishlist.remove(productId);
      return { ...result, action: 'removed' };
    } else {
      const result = guestWishlist.add(productId, productDetails);
      return { ...result, action: 'added' };
    }
  },

  isInWishlist: (productId) => {
    const currentWishlist = guestWishlist.get();
    return currentWishlist.productIds.includes(productId);
  },

  clear: () => {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
    return guestWishlist.get();
  },

  // Get all product IDs for sync when user logs in
  getAllForSync: () => {
    const currentWishlist = guestWishlist.get();
    return currentWishlist.productIds;
  }
};

// Utility functions for checking guest data existence
export const guestStorageUtils = {
  hasGuestCart: () => {
    const cart = guestCart.get();
    return cart.items.length > 0;
  },

  hasGuestWishlist: () => {
    const wishlist = guestWishlist.get();
    return wishlist.products.length > 0;
  },

  clearAllGuestData: () => {
    guestCart.clear();
    guestWishlist.clear();
  },

  getGuestDataSummary: () => {
    const cart = guestCart.get();
    const wishlist = guestWishlist.get();
    
    return {
      cartItems: cart.totalItems,
      wishlistItems: wishlist.products.length,
      hasData: cart.items.length > 0 || wishlist.products.length > 0
    };
  }
};

export default {
  guestCart,
  guestWishlist,
  guestStorageUtils
};