// Central category configuration for consistent naming across the application
export const CATEGORY_MAPPINGS = {
  // Main product types
  PRODUCT_TYPES: {
    JEWELLERY: 'jewellery',
    HIGH_JEWELLERY: 'high-jewellery', 
    FRAGRANCE: 'fragrance',
    ALL: 'all'
  },

  // Jewellery categories (standardized)
  JEWELLERY_CATEGORIES: {
    EARRINGS: 'earrings',
    RINGS: 'rings', 
    NECKLACES: 'necklaces', // Standardized to plural
    PENDANTS: 'pendants',
    BRACELETS: 'bracelets'
  },

  // High jewellery categories
  HIGH_JEWELLERY_CATEGORIES: {
    DAILY_EARRINGS: 'daily-earrings',
    SOLITAIRE_RINGS: 'solitaire-rings',
    SOLITAIRE_STUDS: 'solitaire-studs'
  },

  // Fragrance categories  
  FRAGRANCE_CATEGORIES: {
    SILA: 'sila',
    EVARA: 'evara',
    WAYFARER: 'wayfarer',
    SAYONEE: 'sayonee',
    MANGATA: 'mangata'
  },

  // Color codes for filtering
  COLOR_CODES: {
    ROSE: 'rose',
    SILVER: 'silver', 
    GOLD: 'gold'
  },

  // Display labels for UI
  DISPLAY_LABELS: {
    // Product types
    'jewellery': 'Jewellery',
    'high-jewellery': 'High Jewellery',
    'fragrance': 'Fragrance',
    'all': 'All Products',

    // Jewellery categories
    'earrings': 'Earrings',
    'rings': 'Rings',
    'necklaces': 'Necklaces',
    'pendants': 'Pendants',
    'bracelets': 'Bracelets',

    // High jewellery
    'daily-earrings': 'Daily Earrings',
    'solitaire-rings': 'Solitaire Rings', 
    'solitaire-studs': 'Solitaire Studs',

    // Fragrance
    'sila': 'Sila',
    'evara': 'Evara',
    'wayfarer': 'Wayfarer',
    'sayonee': 'Sayonee',
    'mangata': 'Mangata',

    // Colors
    'rose': 'Rose Gold',
    'silver': 'Silver',
    'gold': 'Yellow Gold'
  }
};

// Utility functions
export const getCategoryDisplayName = (category) => {
  return CATEGORY_MAPPINGS.DISPLAY_LABELS[category] || category?.charAt(0).toUpperCase() + category?.slice(1);
};

export const normalizeCategory = (category) => {
  // Handle legacy singular forms
  const singularToPlural = {
    'necklace': 'necklaces',
    'earring': 'earrings', 
    'ring': 'rings',
    'pendant': 'pendants'
  };
  
  return singularToPlural[category] || category;
};

export const isValidCategory = (type, category) => {
  const validCategories = {
    'jewellery': Object.values(CATEGORY_MAPPINGS.JEWELLERY_CATEGORIES),
    'high-jewellery': Object.values(CATEGORY_MAPPINGS.HIGH_JEWELLERY_CATEGORIES),
    'fragrance': Object.values(CATEGORY_MAPPINGS.FRAGRANCE_CATEGORIES)
  };
  
  return validCategories[type]?.includes(category) || false;
};

export default CATEGORY_MAPPINGS;