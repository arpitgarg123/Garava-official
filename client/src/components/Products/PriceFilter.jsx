// import React from 'react'

// const PriceFilter = ({ value = { min: "", max: "" }, onChange = () => {}, onApply = () => {} }) => {
//   return (
// <div aria-labelledby="price-filter ">
//       <h3 id="price-filter" className="text-lg font-medium text-gray-900 mb-3">Filter By Price</h3>

//       <div className="flex items-center gap-3">
//         <label className="sr-only" htmlFor="min-price">Min price</label>
//         <input
//           id="min-price"
//           type="number"
//           inputMode="numeric"
//           placeholder="Min"
//           value={value.min}
//           onChange={(e) => onChange({ ...value, min: e.target.value })}
//           className="w-1/2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
//           aria-label="Minimum price"
//           min={0}
//         />
//         <label className="sr-only" htmlFor="max-price">Max price</label>
//         <input
//           id="max-price"
//           type="number"
//           inputMode="numeric"
//           placeholder="Max"
//           value={value.max}
//           onChange={(e) => onChange({ ...value, max: e.target.value })}
//           className="w-1/2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
//           aria-label="Maximum price"
//           min={0}
//         />
//       </div>

//       <div className="mt-3">
//         <button
//           onClick={onApply}
//           className="inline-block px-4 py-2 bg-gray-50 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200 transition"
//           aria-label="Apply price filter"
//         >
//           Filter
//         </button>
//       </div>

//       <p className="mt-3 text-sm text-gray-500">
//         Price shown is in INR. Leave blank to ignore.
//       </p>
//     </div>

//   )
// }

// export default PriceFilter

import React from 'react';

const PriceFilter = ({ 
  value = { min: '', max: '' }, 
  onChange = () => {}, 
  isMobile = false,
  heading
}) => {
  // Ensure value is never null or undefined
  const safeValue = {
    min: value?.min ?? '',
    max: value?.max ?? ''
  };

  const handleInputChange = (field, e) => {
    const val = e.target.value;
    if (val === '' || /^\d*$/.test(val)) {
      onChange({ ...safeValue, [field]: val });
    }
  };

  if (isMobile) {
    return (
      <div>
        <h3 className="text-base font-medium mb-3">{heading || "Price Range"}</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="mobile-min-price" className="block text-sm text-gray-600 mb-1">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="text"
                id="mobile-min-price"
                inputMode="numeric"
                pattern="[0-9]*"
                value={safeValue.min}
                onChange={(e) => handleInputChange('min', e)}
                className="w-full pl-8 pr-3 py-2 border "
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="mobile-max-price" className="block text-sm text-gray-600 mb-1">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="text"
                id="mobile-max-price"
                inputMode="numeric"
                pattern="[0-9]*"
                value={safeValue.max}
                onChange={(e) => handleInputChange('max', e)}
                className="w-full pl-8 pr-3 py-2 border "
                placeholder="10000"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="text"
              id="min-price"
              inputMode="numeric"
              pattern="[0-9]*"
              value={safeValue.min}
              onChange={(e) => handleInputChange('min', e)}
              className="w-full pl-8 pr-3 py-2 border "
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="text"
              id="max-price"
              inputMode="numeric"
              pattern="[0-9]*"
              value={safeValue.max}
              onChange={(e) => handleInputChange('max', e)}
              className="w-full pl-8 pr-3 py-2 border "
              placeholder="100000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;