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

import React, { useEffect, useState } from 'react'
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import ColorFilter from './ColorFilter';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, fetchCategoryCounts } from '../../features/product/slice';

const JEWELLERY_SUBCATS = [
  { id: "all-jewellery", label: "All Jewellery" },
  { id: "rings", label: "Rings" },
  { id: "necklaces", label: "Necklaces" },
  { id: "earrings", label: "Earrings" },
  { id: "pendants", label: "Pendants" },
];

const FRAGRANCE_SUBCATS = [
  { id: "all-fragrance", label: "All Fragrance" },
  { id: "women", label: "For Women" },
  { id: "men", label: "For Men" },
  { id: "unisex", label: "Unisex" },
  { id: "gift-sets", label: "Gift Sets" },
];

const SideBar = ({ 
  mainCategory = "jewellery", 
  onFilterChange = () => {},
  isMobile = false,
  initialValues = {}
}) => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState({ 
    min: initialValues.priceMin || "", 
    max: initialValues.priceMax || "" 
  });
  const [category, setCategory] = useState(initialValues.category || "");
  const [colors, setColors] = useState([]);

  const detectedCategory = (mainCategory || "jewellery").toLowerCase();
  const subCategories = detectedCategory === "jewellery" ? JEWELLERY_SUBCATS : FRAGRANCE_SUBCATS;

  useEffect(() => {
    // Set initial category if empty
    if (!category && subCategories.length > 0) {
      setCategory(subCategories[0]?.id || null);
    }
    if (detectedCategory !== "jewellery") setColors([]);
  }, [detectedCategory]);

  // Handle filter changes
  useEffect(() => {
    if (isMobile) {
      onFilterChange({
        type: detectedCategory,
        category,
        priceMin: price.min ? Number(price.min) : null,
        priceMax: price.max ? Number(price.max) : null,
      });
    } else {
      // In desktop mode, apply filters immediately
      if (category) {
        const nextFilters = {
          type: detectedCategory,
          category,
          priceMin: price.min ? Number(price.min) : null,
          priceMax: price.max ? Number(price.max) : null,
          page: 1
        };
        
        if (nextFilters.category && nextFilters.category.startsWith("all-")) {
          nextFilters.category = "";
        }
        
        dispatch(setFilters(nextFilters));
      }
    }
  }, [category, price, colors, isMobile]);

  const counts = useSelector(s => s.product.categoryCounts[detectedCategory] || {});

  useEffect(() => {
    if (!detectedCategory) return;
    
    if (counts && Object.keys(counts).length > 0) {
      return;
    }
    
    const timer = setTimeout(() => {
      const plainCats = subCategories.map(c => c.id);
      dispatch(fetchCategoryCounts({ type: detectedCategory, categories: plainCats }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [detectedCategory, counts, dispatch]);

  const filterSections = (
    <>
      <div className={isMobile ? "mb-6" : ""}>
        <CategoryFilter
          selected={category}
          onChange={setCategory}
          categories={subCategories}
          counts={counts}
          isMobile={isMobile}
        />
      </div>
      
      {isMobile && <hr className="my-6" />}
      
      <div className={isMobile ? "mb-6" : ""}>
        <PriceFilter 
          value={price} 
          onChange={setPrice}
          isMobile={isMobile}
          heading={isMobile ? "Price Range" : undefined}
        />
      </div>
      
      {detectedCategory === "jewellery" && (
        <>
          {isMobile && <hr className="my-6" />}
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
        <div className="space-y-6 pr-4">
          {filterSections}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;