// src/pages/ProductPage.jsx  (replace current ProductPage with this)
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setFilters, fetchProducts } from "../../features/product/slice";
import SideBar from "../../components/Products/SideBar";
import ProductCard from "../../components/Products/ProductCard";
import PageHeader from "../../components/header/PageHeader";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { category: routeCategory } = useParams();
  const { list, filters } = useSelector((s) => s.product);
  const { items, status, error } = list;

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
        // NOTE: prev not available directly; reconstruct from filters
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
      // Build clean params
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
    }, 200); // debounce to avoid 429
    return () => clearTimeout(h);
  }, [pendingFilters, dispatch]);

  const heading = routeCategory
    ? routeCategory.replace(/-/g, " ")
    : (filters.type || "products");

  const handleApplyFilters = useCallback((f) => {
    // Sidebar already dispatched setFilters; no action needed here.
  }, []);

  return (
    <div className="w-full py-6 mt-20 ">
     <PageHeader title={heading} />

      <div className="w-[95%] max-w-7xl  mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="hidden md:block">
          <SideBar mainCategory={filters.type || routeCategory || "jewellery"} onApply={handleApplyFilters} />
        </div>

        <main className="ml-10">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {items.map((p, i) => (
              <ProductCard key={p.id || p._id || `p-${i}`} product={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
