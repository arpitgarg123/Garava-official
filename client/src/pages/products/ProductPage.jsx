import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../../features/product/slice";
import ProductCard from "../../components/Products/ProductCard";
import SideBar from "../../components/Products/SideBar";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { category } = useParams(); // 👈 dynamic category from URL
  const { items: products, status, error } = useSelector((state) => state.product.list);

  useEffect(() => {
    if (category) {
      dispatch(fetchProducts({ category })); // fetch from backend
    }
  }, [dispatch, category]);
  console.log(products)

  if (status === "loading") return <p className="p-4">Loading products...</p>;
  if (status === "failed") return <p className="p-4 text-red-500">{error}</p>;
  
  return (
    <div className="w-full py-6">
      <header className="head">
        <div className="head-inner max-w-6xl mx-auto">
          <h2 className="head-text text-3xl md:text-4xl capitalize">{category}</h2>
          <div className="head-line"></div>
        </div>
      </header>

      <div className="w-[95%] max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="hidden md:block">
          <SideBar mainCategory={category} />
        </div>

        <main className="ml-10 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">Showing {products.length} products</div>
            <select className="border px-3 py-1 rounded text-sm">
              <option>Sort: Popular</option>
              <option>Sort: Price — Low to High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id || `product-${index}`}
                  category={product.category || category}
                  img={product.heroImage?.url || product.images?.[0]?.url || '/placeholder.jpg'}
                  title={product.name || 'Untitled Product'}
                  price={product?.defaultVariant?.price || 'Price not available'}
                  description={product.shortDescription || product.description}
                  type={product.type}
                  colors={product.colors || []}
                  productSlug={product.slug || product._id}
                  onAddToCart={() => console.log('Add to cart:', product)}
                  onQuickView={() => console.log('Quick view:', product)}
                  onToggleWishlist={() => console.log('Toggle wishlist:', product)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
