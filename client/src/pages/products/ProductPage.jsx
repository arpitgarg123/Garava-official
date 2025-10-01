// // src/pages/ProductPage.jsx  (replace current ProductPage with this)
// import { useEffect, useCallback, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { setFilters, fetchProducts } from "../../features/product/slice";
// import SideBar from "../../components/Products/SideBar";
// import ProductCard from "../../components/Products/ProductCard";
// import PageHeader from "../../components/header/PageHeader";
// import BackButton from "../../components/BackButton";

// const ProductPage = () => {
//   const dispatch = useDispatch();
//   const { category: routeCategory } = useParams();
//   const { list, filters } = useSelector((s) => s.product);
//   const { items, status, error } = list;

//   // Map routeCategory into filters (type / category)
//   useEffect(() => {
//     if (!routeCategory) return;
//     const lower = routeCategory.toLowerCase();
//     if (lower.startsWith("all-")) {
//       dispatch(setFilters({ type: lower.replace("all-", ""), category: "", page: 1 }));
//     } else if (lower === "jewellery" || lower === "fragrance") {
//       dispatch(setFilters({ type: lower, category: "", page: 1 }));
//     } else {
//       // treat as subcategory; keep existing type or default jewellery
//       dispatch(setFilters((prev) => {
//         // NOTE: prev not available directly; reconstruct from filters
//         const currentType = filters.type || "jewellery";
//         return {
//           type: currentType,
//           category: lower,
//           page: 1
//         };
//       }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [routeCategory]);

//   // Debounced fetch on filter changes
//   const [pendingFilters, setPendingFilters] = useState(filters);
//   useEffect(() => {
//     setPendingFilters(filters);
//   }, [filters]);

//   useEffect(() => {
//     const h = setTimeout(() => {
//       // Build clean params
//       const params = {
//         page: pendingFilters.page,
//         limit: pendingFilters.limit,
//         sort: pendingFilters.sort,
//       };
//       if (pendingFilters.type) params.type = pendingFilters.type;
//       if (pendingFilters.category) params.category = pendingFilters.category;
//       if (pendingFilters.priceMin != null) params.priceMin = pendingFilters.priceMin;
//       if (pendingFilters.priceMax != null) params.priceMax = pendingFilters.priceMax;

//       dispatch(fetchProducts(params));
//     }, 200); // debounce to avoid 429
//     return () => clearTimeout(h);
//   }, [pendingFilters, dispatch]);

//   const heading = routeCategory
//     ? routeCategory.replace(/-/g, " ")
//     : (filters.type || "products");

//   const handleApplyFilters = useCallback((f) => {
//     // Sidebar already dispatched setFilters; no action needed here.
//   }, []);

//   return (
//     <div className="w-full py-6 mt-20 ">
//        <div className="sticky top-16 z-10 mt-4">
//           <BackButton />
//         </div>
//      <PageHeader title={heading} />

//       <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-0">
//          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
//         <div className="md:block mb-6 md:mb-0">
//             <SideBar mainCategory={filters.type || routeCategory || "jewellery"} onApply={handleApplyFilters} />
//           </div>

//         <main className="ml-0 md:ml-10 w-full">
//            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
//               <div className="text-sm text-gray-600">
//                 {status === "loading" ? "Loading..." : `Showing ${items.length} products`}
//               </div>
//             <select
//               className="border px-3 py-1 rounded text-sm"
//               value={filters.sort}
//               onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
//             >
//               <option value="newest">Newest</option>
//               <option value="price_asc">Price Low → High</option>
//               <option value="price_desc">Price High → Low</option>
//               <option value="popularity">Popular</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>

//           {status === "failed" && (
//             <div className="text-red-500 text-sm mb-4">{error}</div>
//           )}

//          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//               {items.map((p, i) => (
//                 <ProductCard key={p.id || p._id || `p-${i}`} product={p} />
//               ))}
//             </div>
//         </main>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ProductPage;

import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setFilters, fetchProducts } from "../../features/product/slice";
import SideBar from "../../components/Products/SideBar";
import ProductCard from "../../components/Products/ProductCard";
import PageHeader from "../../components/header/PageHeader";
import BackButton from "../../components/BackButton";
import { BiFilterAlt, BiX } from "react-icons/bi";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { category: routeCategory } = useParams();
  const { list, filters } = useSelector((s) => s.product);
  const { items, status, error } = list;
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pendingMobileFilters, setPendingMobileFilters] = useState(null);

  // Map routeCategory into filters (type / category)
  useEffect(() => {
    if (!routeCategory) return;
    const lower = routeCategory.toLowerCase();
    if (lower.startsWith("all-")) {
      dispatch(setFilters({ type: lower.replace("all-", ""), category: "", page: 1 }));
    } else if (lower === "jewellery" || lower === "fragrance") {
      dispatch(setFilters({ type: lower, category: "", page: 1 }));
    } else {
      // treat as subcategory; keep existing type or default jewellery
      dispatch(setFilters((prev) => {
        const currentType = filters.type || "jewellery";
        return {
          type: currentType,
          category: lower,
          page: 1
        };
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCategory]);

  // Debounced fetch on filter changes
  const [pendingFilters, setPendingFilters] = useState(filters);
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  useEffect(() => {
    const h = setTimeout(() => {
      const params = {
        page: pendingFilters.page,
        limit: pendingFilters.limit,
        sort: pendingFilters.sort,
      };
      if (pendingFilters.type) params.type = pendingFilters.type;
      if (pendingFilters.category) params.category = pendingFilters.category;
      if (pendingFilters.priceMin != null) params.priceMin = pendingFilters.priceMin;
      if (pendingFilters.priceMax != null) params.priceMax = pendingFilters.priceMax;

      dispatch(fetchProducts(params));
    }, 200);
    return () => clearTimeout(h);
  }, [pendingFilters, dispatch]);

  const heading = routeCategory
    ? routeCategory.replace(/-/g, " ")
    : (filters.type || "products");

  const handleApplyFilters = (f) => {
    if (pendingMobileFilters) {
      dispatch(setFilters(pendingMobileFilters));
      setPendingMobileFilters(null);
    }
    setShowMobileFilters(false);
  };

  const handleMobileFilterChange = (newFilters) => {
    setPendingMobileFilters(prev => ({
      ...(prev || filters),
      ...newFilters
    }));
  };

  const handleCancelFilters = () => {
    setPendingMobileFilters(null);
    setShowMobileFilters(false);
  };

  return (
    <div className="w-full py-6 mt-20 max-md:mt-0 relative">
      <div className="sticky top-16 z-10 mt-4">
        <BackButton />
      </div>
      <PageHeader title={heading} />

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-0">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4 flex justify-end items-center">
         
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="max-md:flex items-center gap-2 px-4 py-2 hidden border rounded-md bg-white shadow-sm"
          >
            <BiFilterAlt />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile Filter Bottom Sheet */}
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
            showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleCancelFilters}
        >
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${
              showMobileFilters ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={handleCancelFilters} className="p-1 rounded-full hover:bg-gray-100">
                <BiX size={24} />
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <SideBar 
                mainCategory={filters.type || routeCategory || "jewellery"} 
                onFilterChange={handleMobileFilterChange}
                isMobile={true}
                initialValues={filters}
              />
            </div>
            
            <div className="border-t p-4 flex gap-4">
              <button 
                onClick={handleCancelFilters}
                className="flex-1 py-3 border border-gray-300 rounded-md text-center"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyFilters}
                className="flex-1 py-3 bg-black text-white rounded-md text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SideBar 
              mainCategory={filters.type || routeCategory || "jewellery"}
              initialValues={filters}
            />
          </div>

          <main className="ml-0 md:ml-10 w-full">
            {/* Desktop Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {status === "loading" ? "Loading..." : `Showing ${items.length} products`}
              </div>
              <select
                className="border px-3 py-1 rounded text-sm"
                value={filters.sort}
                onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
                <option value="popularity">Popular</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {status === "failed" && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((p, i) => (
                <ProductCard key={p.id || p._id || `p-${i}`} product={p} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;