// import React from "react";

// const CategoryFilter = ({ categories = [], selected = "", onChange = () => {}, counts = {} }) => {
//   const handleCategoryChange = (id) => onChange(id);

//   return (
//     <div aria-labelledby="category-filter">
//       <h3 id="category-filter" className="text-lg font-medium text-gray-900 mb-3">
//         Filter By Product Categories
//       </h3>

//       <ul className="space-y-2">
//         {categories.map((c) => {
//           const isActive = selected === c.id;
//           // Derive key for counts
//           let countKey = c.id;
//           if (c.id.startsWith("all-")) countKey = "__all";
//           const value = counts[countKey];
//           const displayCount = typeof value === "number" ? value : isActive ? 0 : 0;
//           return (
//             <li key={c.id}>
//               <button
//                 onClick={() => handleCategoryChange(c.id)}
//                 className={`w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition ${
//                   isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
//                 }`}
//                 aria-pressed={isActive}
//               >
//                 <span className="text-md">{c.label}</span>
//                 <span
//                   className={`text-sm px-2 py-0.5 rounded-full ${
//                     isActive ? "bg-white text-black" : "bg-gray-50 text-gray-600"
//                   }`}
//                 >
//                   {displayCount}
//                 </span>
//               </button>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default CategoryFilter;


import React from 'react';

const CategoryFilter = ({ selected, onChange, categories, counts = {}, isMobile = false }) => {
  const handleCategoryChange = (id) => {
    onChange(id);
  };

  if (isMobile) {
    return (
      <div className="mb-2">
        <h3 className="text-base font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isActive = selected === cat.id;
            // Derive key for counts
            let countKey = cat.id;
            if (cat.id.startsWith("all-")) countKey = "__all";
            const count = counts[countKey];
            const displayCount = typeof count === "number" ? count : 0;

            return (
              <div key={cat.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`mobile-cat-${cat.id}`}
                    name="mobile-category"
                    className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    checked={isActive}
                    onChange={() => handleCategoryChange(cat.id)}
                  />
                  <label htmlFor={`mobile-cat-${cat.id}`} className="ml-2 text-md font-medium">
                    {cat.label}
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  {displayCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop version
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
          const displayCount = typeof value === "number" ? value : 0;
          
          return (
            <li key={c.id}>
              <button
                onClick={() => handleCategoryChange(c.id)}
                className={`w-full flex items-center justify-between text-left px-2 py-2 rounded-md transition ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={isActive}
              >
                <span className="text-md">{c.label}</span>
                <span
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white text-black" : "bg-gray-50 text-gray-600"
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