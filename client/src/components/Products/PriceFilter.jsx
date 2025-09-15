import React from 'react'

const PriceFilter = ({ value = { min: "", max: "" }, onChange = () => {}, onApply = () => {} }) => {
  return (
<div aria-labelledby="price-filter ">
      <h3 id="price-filter" className="text-lg font-medium text-gray-900 mb-3">Filter By Price</h3>

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="min-price">Min price</label>
        <input
          id="min-price"
          type="number"
          inputMode="numeric"
          placeholder="Min"
          value={value.min}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          className="w-1/2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          aria-label="Minimum price"
          min={0}
        />
        <label className="sr-only" htmlFor="max-price">Max price</label>
        <input
          id="max-price"
          type="number"
          inputMode="numeric"
          placeholder="Max"
          value={value.max}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          className="w-1/2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          aria-label="Maximum price"
          min={0}
        />
      </div>

      <div className="mt-3">
        <button
          onClick={onApply}
          className="inline-block px-4 py-2 bg-gray-100 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200 transition"
          aria-label="Apply price filter"
        >
          Filter
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Price shown is in INR. Leave blank to ignore.
      </p>
    </div>

  )
}

export default PriceFilter