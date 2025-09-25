// import React from 'react'

// const CATEGORIES = [
//   { id: "jewellery", label: "Jewellery" },
//   { id: "rings", label: "Rings" },
//   { id: "necklaces", label: "Necklaces" },
//   { id: "earrings", label: "Earrings" },
//   { id: "pendants", label: "Pendants" },
// ];

// const CategoryFilter = ({ selected = "jewellery", onChange = () => {} }) => {
//   return (
//     <div aria-labelledby="category-filter">
//       <h3 id="category-filter" className="text-lg font-medium text-gray-900 mb-3">Filter By Product Categories</h3>

//       <ul className="space-y-2">
//         {CATEGORIES.map((c) => {
//           const isActive = selected?.toLowerCase() === c.id;
//           return (
//             <li key={c.id}>
//               <button
//                 onClick={() => onChange(c.label)}
//                 className={`w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition ${
//                   isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
//                 }`}
//                 aria-pressed={isActive}
//               >
//                 <span className="text-sm">{c.label}</span>
//                 <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white text-black" : "bg-gray-100 text-gray-600"}`}>
//                   {/* placeholder counts; replace with real counts from props if available */}
//                   {isActive ? 25 : 9}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   )
// }

// export default CategoryFilter

import React from "react";

const CategoryFilter = ({ categories = [], selected = "", onChange = () => {}, counts = {} }) => {
  const handleCategoryChange = (id) => onChange(id);

  return (
    <div aria-labelledby="category-filter">
      <h3 id="category-filter" className="text-lg font-medium text-gray-900 mb-3">
        Filter By Product Categories
      </h3>

      <ul className="space-y-2">
        {categories.map((c) => {
          const isActive = selected === c.id;
          // Derive key for counts
          let countKey = c.id;
          if (c.id.startsWith("all-")) countKey = "__all";
          const value = counts[countKey];
          const displayCount = typeof value === "number" ? value : isActive ? 0 : 0;
          return (
            <li key={c.id}>
              <button
                onClick={() => handleCategoryChange(c.id)}
                className={`w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={isActive}
              >
                <span className="text-sm">{c.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white text-black" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {displayCount}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryFilter;
