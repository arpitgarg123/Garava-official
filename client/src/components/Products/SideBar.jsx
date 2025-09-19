import React, { useEffect, useState } from 'react'
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import ColorFilter from './ColorFilter';

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

const SideBar = ({ mainCategory = "jewellery", onApply }) => {
    const [price, setPrice] = useState({ min: "", max: "" });
  const [category, setCategory] = useState("Jewellery"); // default
  const [colors, setColors] = useState([]); // ['rose','silver','gold']

  const detectedCategory = (mainCategory || "jewellery").toLowerCase();
  const subCategories = detectedCategory === "jewellery" ? JEWELLERY_SUBCATS : FRAGRANCE_SUBCATS;

  useEffect(() => {
    // set default subCategory when mainCategory changes
    setCategory(subCategories[0]?.id || null);
    if (detectedCategory !== "jewellery") setColors([]);
  }, [detectedCategory]);

   const handleApply = () => {
    const filters = {
      price: { min: price.min ? Number(price.min) : null, max: price.max ? Number(price.max) : null },
      mainCategory: detectedCategory,
      category,
      colors,
    };
    if (typeof onApply === "function") onApply(filters);
  };

  return (
     <aside className="sticky top-0 w-full max-w-[280px]">
      <div className="bg-white h-[calc(100vh-120px)] ">
      <div className="space-y-6 pr-4">
          <PriceFilter value={price} onChange={setPrice} onApply={handleApply} />
          <hr className="border-gray-200" />
          <CategoryFilter selected={category} onChange={setCategory} categories={subCategories} />
          <hr className="border-gray-200" />
          {detectedCategory === "jewellery" && <ColorFilter selected={colors} onChange={setColors} />}
        </div>
        </div>
    </aside>
  )
}


export default SideBar