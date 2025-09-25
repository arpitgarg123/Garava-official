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

const SideBar = ({ mainCategory = "jewellery", onApply }) => {
  const dispatch = useDispatch();
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
  const nextFilters = {
    type: detectedCategory,
    category,
    priceMin: price.min ? Number(price.min) : null,
    priceMax: price.max ? Number(price.max) : null,
    page: 1
  };
  // Normalize "all-*" → drop category
  if (nextFilters.category && nextFilters.category.startsWith("all-")) {
    nextFilters.category = "";
  }
  dispatch(setFilters(nextFilters));
  if (typeof onApply === "function") onApply(nextFilters);
};
// Auto-apply only category change
useEffect(() => {
  if (!category) return;
  handleApply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [category]);

useEffect(() => {
  // After we establish detectedCategory & subCategories, load counts
  if (!detectedCategory) return;
  const plainCats = subCategories.map(c => c.id);
  dispatch(fetchCategoryCounts({ type: detectedCategory, categories: plainCats }));
}, [detectedCategory, subCategories, dispatch]);

// Get counts from store
const counts = useSelector(s => s.product.categoryCounts[detectedCategory] || {});

  return (
     <aside className="sticky top-0 w-full max-w-[280px]">
      <div className="bg-white h-[calc(100vh-120px)] ">
      <div className="space-y-6 pr-4">
          <PriceFilter value={price} onChange={setPrice} onApply={handleApply} />
          <hr className="border-gray-200" />
          <CategoryFilter
  selected={category}
  onChange={setCategory}
  categories={subCategories}
  counts={counts}
/>
          <hr className="border-gray-200" />
          {detectedCategory === "jewellery" && <ColorFilter selected={colors} onChange={setColors} />}
        </div>
        </div>
    </aside>
  )
}


export default SideBar