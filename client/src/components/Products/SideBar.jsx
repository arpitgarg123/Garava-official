// import React, { useEffect, useState } from 'react'
// import PriceFilter from './PriceFilter';
// import CategoryFilter from './CategoryFilter';
// import ColorFilter from './ColorFilter';
// import { useDispatch, useSelector } from 'react-redux';
// import { setFilters, fetchCategoryCounts } from '../../features/product/slice';

// const JEWELLERY_SUBCATS = [
//   { id: "all-jewellery", label: "All Jewellery" },
//   { id: "rings", label: "Rings" },
//   { id: "necklaces", label: "Necklaces" },
//   { id: "earrings", label: "Earrings" },
//   { id: "pendants", label: "Pendants" },
// ];

// const FRAGRANCE_SUBCATS = [
//   { id: "all-fragrance", label: "All Fragrance" },
//   { id: "women", label: "For Women" },
//   { id: "men", label: "For Men" },
//   { id: "unisex", label: "Unisex" },
//   { id: "gift-sets", label: "Gift Sets" },
// ];

// const SideBar = ({ mainCategory = "jewellery", onApply }) => {
//   const dispatch = useDispatch();
//     const [price, setPrice] = useState({ min: "", max: "" });
//   const [category, setCategory] = useState("Jewellery"); // default
//   const [colors, setColors] = useState([]); // ['rose','silver','gold']

//   const detectedCategory = (mainCategory || "jewellery").toLowerCase();
//   const subCategories = detectedCategory === "jewellery" ? JEWELLERY_SUBCATS : FRAGRANCE_SUBCATS;

//   useEffect(() => {
//     // set default subCategory when mainCategory changes
//     setCategory(subCategories[0]?.id || null);
//     if (detectedCategory !== "jewellery") setColors([]);
//   }, [detectedCategory]);

//    const handleApply = () => {
//   const nextFilters = {
//     type: detectedCategory,
//     category,
//     priceMin: price.min ? Number(price.min) : null,
//     priceMax: price.max ? Number(price.max) : null,
//     page: 1
//   };
//   // Normalize "all-*" → drop category
//   if (nextFilters.category && nextFilters.category.startsWith("all-")) {
//     nextFilters.category = "";
//   }
//   dispatch(setFilters(nextFilters));
//   if (typeof onApply === "function") onApply(nextFilters);
// };
// // Auto-apply only category change
// useEffect(() => {
//   if (!category) return;
//   handleApply();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [category]);

// // Get counts from store
// const counts = useSelector(s => s.product.categoryCounts[detectedCategory] || {});

// // Smart category counts fetching with debouncing
// useEffect(() => {
//   if (!detectedCategory) return;
  
//   // Check if we already have fresh counts for this category
//   if (counts && Object.keys(counts).length > 0) {
//     console.log('SideBar - Using existing category counts for:', detectedCategory);
//     return;
//   }
  
//   // Debounce to prevent rapid firing during category changes
//   const timer = setTimeout(() => {
//     const plainCats = subCategories.map(c => c.id);
//     console.log('SideBar - Fetching category counts for:', detectedCategory);
//     dispatch(fetchCategoryCounts({ type: detectedCategory, categories: plainCats }));
//   }, 300); // 300ms debounce
  
//   return () => clearTimeout(timer);
// }, [detectedCategory, counts, dispatch]); // Added counts to deps to check for existing data

//   return (
//      <aside className="sticky top-0 w-full max-w-[280px] mb-6 ">
//       <div className="bg-white h-[calc(100vh-120px)] ">
//       <div className="space-y-6 pr-4">
//           <PriceFilter value={price} onChange={setPrice} onApply={handleApply} />
//           <hr className="border-gray-200" />
//           <CategoryFilter
//   selected={category}
//   onChange={setCategory}
//   categories={subCategories}
//   counts={counts}
// />
//           <hr className="border-gray-200" />
//           {detectedCategory === "jewellery" && <ColorFilter selected={colors} onChange={setColors} />}
//         </div>
//         </div>
//     </aside>
//   )
// }


// export default SideBar

// import React, { useEffect, useState } from 'react'
// import PriceFilter from './PriceFilter';
// import CategoryFilter from './CategoryFilter';
// import ColorFilter from './ColorFilter';
// import { useDispatch, useSelector } from 'react-redux';
// import { setFilters, fetchCategoryCounts } from '../../features/product/slice';

// const JEWELLERY_SUBCATS = [
//   { id: "all-jewellery", label: "All Jewellery" },
//   { id: "rings", label: "Rings" },
//   { id: "necklaces", label: "Necklaces" },
//   { id: "earrings", label: "Earrings" },
//   { id: "pendants", label: "Pendants" },
// ];

// const FRAGRANCE_SUBCATS = [
//   { id: "all-fragrance", label: "All Fragrance" },
//   { id: "women", label: "For Women" },
//   { id: "men", label: "For Men" },
//   { id: "unisex", label: "Unisex" },
//   { id: "gift-sets", label: "Gift Sets" },
// ];

// const SideBar = ({ 
//   mainCategory = "jewellery", 
//   onFilterChange = () => {},
//   isMobile = false,
//   initialValues = {}
// }) => {
//   const dispatch = useDispatch();
//   const [price, setPrice] = useState({ 
//     min: initialValues.priceMin || "", 
//     max: initialValues.priceMax || "" 
//   });
//   const [category, setCategory] = useState(initialValues.category || "");
//   const [colors, setColors] = useState([]);

//   const detectedCategory = (mainCategory || "jewellery").toLowerCase();
//   const subCategories = detectedCategory === "jewellery" ? JEWELLERY_SUBCATS : FRAGRANCE_SUBCATS;

//   useEffect(() => {
//     // Set initial category if empty
//     if (!category && subCategories.length > 0) {
//       setCategory(subCategories[0]?.id || null);
//     }
//     if (detectedCategory !== "jewellery") setColors([]);
//   }, [detectedCategory]);

//   // Handle filter changes
//   useEffect(() => {
//     if (isMobile) {
//       onFilterChange({
//         type: detectedCategory,
//         category,
//         priceMin: price.min ? Number(price.min) : null,
//         priceMax: price.max ? Number(price.max) : null,
//       });
//     } else {
//       // In desktop mode, apply filters immediately
//       if (category) {
//         const nextFilters = {
//           type: detectedCategory,
//           category,
//           priceMin: price.min ? Number(price.min) : null,
//           priceMax: price.max ? Number(price.max) : null,
//           page: 1
//         };
        
//         if (nextFilters.category && nextFilters.category.startsWith("all-")) {
//           nextFilters.category = "";
//         }
        
//         dispatch(setFilters(nextFilters));
//       }
//     }
//   }, [category, price, colors, isMobile]);

//   const counts = useSelector(s => s.product.categoryCounts[detectedCategory] || {});

//   useEffect(() => {
//     if (!detectedCategory) return;
    
//     if (counts && Object.keys(counts).length > 0) {
//       return;
//     }
    
//     const timer = setTimeout(() => {
//       const plainCats = subCategories.map(c => c.id);
//       dispatch(fetchCategoryCounts({ type: detectedCategory, categories: plainCats }));
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [detectedCategory, counts, dispatch]);

//   const filterSections = (
//     <>
//       <div className={isMobile ? "mb-6" : ""}>
//         <CategoryFilter
//           selected={category}
//           onChange={setCategory}
//           categories={subCategories}
//           counts={counts}
//           isMobile={isMobile}
//         />
//       </div>
      
//       {isMobile && <hr className="my-6" />}
      
//       <div className={isMobile ? "mb-6" : ""}>
//         <PriceFilter 
//           value={price} 
//           onChange={setPrice}
//           isMobile={isMobile}
//           heading={isMobile ? "Price Range" : undefined}
//         />
//       </div>
      
//       {detectedCategory === "jewellery" && (
//         <>
//           {isMobile && <hr className="my-6" />}
//           <div className={isMobile ? "mb-6" : ""}>
//             <ColorFilter 
//               selected={colors} 
//               onChange={setColors}
//               isMobile={isMobile}
//               heading={isMobile ? "Metal Color" : undefined}
//             />
//           </div>
//         </>
//       )}
//     </>
//   );

//   // Mobile layout for bottom sheet
//   if (isMobile) {
//     return filterSections;
//   }

//   // Desktop layout
//   return (
//     <aside className="sticky top-20 w-full max-w-[280px] mb-6">
//       <div className="bg-white">
//         <div className="space-y-6 pr-4">
//           {filterSections}
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default SideBar;


import React, { useEffect, useState } from 'react'
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import ColorFilter from './ColorFilter';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, fetchCategoryCounts } from '../../features/product/slice';
import { CATEGORY_MAPPINGS } from '../../shared/utils/categoryMappings';

const JEWELLERY_SUBCATS = [
  { id: "all-jewellery", label: "All Jewellery" },
  { id: CATEGORY_MAPPINGS.JEWELLERY_CATEGORIES.RINGS, label: "Rings" },
  { id: CATEGORY_MAPPINGS.JEWELLERY_CATEGORIES.NECKLACES, label: "Necklaces" },
  { id: CATEGORY_MAPPINGS.JEWELLERY_CATEGORIES.EARRINGS, label: "Earrings" },
  { id: CATEGORY_MAPPINGS.JEWELLERY_CATEGORIES.PENDANTS, label: "Pendants" },
];

const HIGH_JEWELLERY_SUBCATS = [
  { id: "all-high-jewellery", label: "All High Jewellery" },
  { id: CATEGORY_MAPPINGS.HIGH_JEWELLERY_CATEGORIES.DAILY_EARRINGS, label: "Daily Earrings" },
  { id: CATEGORY_MAPPINGS.HIGH_JEWELLERY_CATEGORIES.SOLITAIRE_RINGS, label: "Solitaire Rings" },
  { id: CATEGORY_MAPPINGS.HIGH_JEWELLERY_CATEGORIES.SOLITAIRE_STUDS, label: "Solitaire Studs" },
];

const FRAGRANCE_SUBCATS = [
  { id: "all-fragrance", label: "All Fragrance" },
  { id: CATEGORY_MAPPINGS.FRAGRANCE_CATEGORIES.SILA, label: "Sila" },
  { id: CATEGORY_MAPPINGS.FRAGRANCE_CATEGORIES.EVARA, label: "Evara" },
  { id: CATEGORY_MAPPINGS.FRAGRANCE_CATEGORIES.WAYFARER, label: "Wayfarer" },
];

// For "all products" view - main categories
const ALL_PRODUCTS_CATS = [
  { id: "", label: "All Products" },
  { id: CATEGORY_MAPPINGS.PRODUCT_TYPES.JEWELLERY, label: "Jewellery" },
  { id: CATEGORY_MAPPINGS.PRODUCT_TYPES.FRAGRANCE, label: "Fragrance" },
  { id: CATEGORY_MAPPINGS.PRODUCT_TYPES.HIGH_JEWELLERY, label: "High Jewellery" },
];

const SideBar = ({ 
  mainCategory = "jewellery", 
  onFilterChange = () => {},
  isMobile = false,
  initialValues = {}
}) => {
  const dispatch = useDispatch();
  
  // Get current filters from Redux store
  const currentFilters = useSelector(s => s.product.filters || {});
  
  const [price, setPrice] = useState({ 
    min: initialValues.priceMin || "", 
    max: initialValues.priceMax || "" 
  });
  const [category, setCategory] = useState(initialValues.category || "");
  const [colors, setColors] = useState(initialValues.colors || []);
  const [selectedType, setSelectedType] = useState(initialValues.type || "");

  const detectedCategory = (mainCategory || "jewellery").toLowerCase();
  
  // Sync local state with Redux filters when they change (e.g., from navbar navigation)
  useEffect(() => {
    if (currentFilters.category !== undefined) {
      // If Redux has empty category, it means "show all" for the current type
      if (currentFilters.category === "" && category !== "") {
        // Set to the appropriate "all-*" category for the current type
        const allCategory = detectedCategory === "all" ? "" : 
                           detectedCategory === "jewellery" ? "all-jewellery" :
                           detectedCategory === "high-jewellery" || detectedCategory === "high_jewellery" ? "all-high-jewellery" :
                           "all-fragrance";
        setCategory(allCategory);
      } else if (currentFilters.category !== "" && currentFilters.category !== category) {
        // Set to specific category
        setCategory(currentFilters.category);
      }
    }
    if (currentFilters.type !== undefined && currentFilters.type !== selectedType) {
      setSelectedType(currentFilters.type || "");
    }
    if (currentFilters.priceMin !== undefined || currentFilters.priceMax !== undefined) {
      setPrice(prev => ({
        min: currentFilters.priceMin !== undefined ? currentFilters.priceMin : prev.min,
        max: currentFilters.priceMax !== undefined ? currentFilters.priceMax : prev.max
      }));
    }
    if (currentFilters.colors !== undefined && JSON.stringify(currentFilters.colors) !== JSON.stringify(colors)) {
      setColors(currentFilters.colors || []);
    }
  }, [currentFilters.category, currentFilters.type, currentFilters.priceMin, currentFilters.priceMax, currentFilters.colors, detectedCategory]);
  
  // Determine which categories to show
  const getCategories = () => {
    if (detectedCategory === "all") {
      return ALL_PRODUCTS_CATS;
    } else if (detectedCategory === "high-jewellery" || detectedCategory === "high_jewellery") {
      return HIGH_JEWELLERY_SUBCATS;
    } else if (detectedCategory === "jewellery") {
      return JEWELLERY_SUBCATS;
    } else {
      return FRAGRANCE_SUBCATS;
    }
  };

  const subCategories = getCategories();

  useEffect(() => {
    // Set default category when mainCategory changes, but only if we don't have current filters
    if (detectedCategory === "all") {
      // For "all products" view, don't override existing selections
      if (!currentFilters.type && !selectedType) setSelectedType("");
      if (!currentFilters.category && !category) setCategory("");
    } else {
      // Only set default if we don't have a current category from filters
      if (!currentFilters.category && !category) {
        setCategory(subCategories[0]?.id || "");
      }
    }
    
    if (detectedCategory !== "jewellery" && detectedCategory !== "high-jewellery" && detectedCategory !== "high_jewellery") {
      setColors([]);
    }
  }, [detectedCategory, subCategories]);

  // Handle filter changes
  useEffect(() => {
    const nextFilters = {
      page: 1
    };

    if (detectedCategory === "all") {
      // For "all products" view, use selectedType as the main type
      if (selectedType) nextFilters.type = selectedType;
      if (category && !category.startsWith("all-")) nextFilters.category = category;
    } else {
      // For specific category views
      nextFilters.type = detectedCategory === "high-jewellery" ? "high_jewellery" : detectedCategory;
      
      // Handle category filter - if "all-*" is selected, clear category filter
      if (category) {
        if (category.startsWith("all-")) {
          // "All Jewellery", "All Fragrance", etc. - show all items of this type
          nextFilters.category = "";
        } else {
          // Specific category selected - filter by that category
          nextFilters.category = category;
        }
      }
    }

    // Add price filters
    if (price.min) nextFilters.priceMin = Number(price.min);
    if (price.max) nextFilters.priceMax = Number(price.max);
    
    // Add color filters for jewellery and high jewellery products
    if (colors && colors.length > 0 && (detectedCategory === "jewellery" || detectedCategory === "high-jewellery" || detectedCategory === "high_jewellery")) {
      nextFilters.colors = colors;
    }

    if (isMobile) {
      onFilterChange(nextFilters);
    } else {
      // In desktop mode, apply filters immediately
      dispatch(setFilters(nextFilters));
    }
  }, [category, price, selectedType, detectedCategory, colors, isMobile]);

  const counts = useSelector(s => s.product.categoryCounts[detectedCategory] || {});

  useEffect(() => {
    if (!detectedCategory || detectedCategory === "all") return;
    
    if (counts && Object.keys(counts).length > 0) {
      return;
    }
    
    const timer = setTimeout(() => {
      const plainCats = subCategories.map(c => c.id);
      dispatch(fetchCategoryCounts({ type: detectedCategory, categories: plainCats }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [detectedCategory, counts, dispatch]);

  // Custom category filter for "all products" view
  const AllProductsCategoryFilter = () => (
    <div className="mb-6">
      <h3 className="text-md font-medium text-gray-900 mb-3">Product Categories</h3>
      <div className="space-y-2">
        {ALL_PRODUCTS_CATS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedType(cat.id);
              setCategory(""); // Reset subcategory when changing main type
            }}
            className={`w-full text-left px-3 py-2 rounded text-md transition-colors ${
              selectedType === cat.id
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Show subcategories if a specific type is selected in "all products" view
  const showSubcategories = detectedCategory === "all" && selectedType && selectedType !== "";
  const subcategoriesForSelectedType = selectedType === "jewellery" ? JEWELLERY_SUBCATS : 
                                     selectedType === "fragrance" ? FRAGRANCE_SUBCATS : [];

  const filterSections = (
    <>
      {detectedCategory === "all" ? (
        <>
          <AllProductsCategoryFilter />
          
          {showSubcategories && (
            <>
              <hr className="my-4" />
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  {selectedType === "jewellery" ? "Jewellery Types" : "Fragrance Types"}
                </h3>
                <div className="space-y-2">
                  {subcategoriesForSelectedType.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded text-md transition-colors ${
                        category === cat.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className={isMobile ? "mb-6" : ""}>
          <CategoryFilter
            selected={category}
            onChange={setCategory}
            categories={subCategories}
            counts={counts}
            isMobile={isMobile}
          />
        </div>
      )}
      
      <hr className="my-4" />
      
      <div className={isMobile ? "mb-6" : ""}>
        <PriceFilter 
          value={price} 
          onChange={setPrice}
          isMobile={isMobile}
          heading={isMobile ? "Price Range" : undefined}
        />
      </div>
      
      {(detectedCategory === "jewellery" || detectedCategory === "high-jewellery" || detectedCategory === "high_jewellery" || (detectedCategory === "all" && (selectedType === "jewellery" || selectedType === "high-jewellery"))) && (
        <>
          <hr className="my-4" />
          <div className={isMobile ? "mb-6" : ""}>
            <ColorFilter 
              selected={colors} 
              onChange={setColors}
              isMobile={isMobile}
              heading={isMobile ? "Metal Color" : undefined}
            />
          </div>
        </>
      )}
    </>
  );

  // Mobile layout for bottom sheet
  if (isMobile) {
    return filterSections;
  }

  // Desktop layout
  return (
    <aside className="sticky top-20 w-full max-w-[280px] mb-6">
      <div className="bg-white">
        <div className="space-y-4 pr-4">
          {filterSections}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;