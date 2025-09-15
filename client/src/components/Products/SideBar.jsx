import React, { useState } from 'react'
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import ColorFilter from './ColorFilter';

const SideBar = () => {
    const [price, setPrice] = useState({ min: "", max: "" });
  const [category, setCategory] = useState("Jewellery"); // default
  const [colors, setColors] = useState([]); // ['rose','silver','gold']

   const handleApply = () => {
    const filters = {
      price: { min: price.min ? Number(price.min) : null, max: price.max ? Number(price.max) : null },
      category,
      colors,
    };
    if (typeof onApply === "function") onApply(filters);
  };

  return (
     <aside className="w-full max-w-[280px]">
      <div className=" sticky top-24">
        <PriceFilter value={price} onChange={setPrice} onApply={handleApply} />
        <hr className="my-6 border-gray-200" />
        <CategoryFilter selected={category} onChange={setCategory} />
        <hr className="my-6 border-gray-200" />
        <ColorFilter selected={colors} onChange={setColors} />
      </div>
    </aside>
  )
}

export default SideBar