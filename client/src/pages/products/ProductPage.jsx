import React, { useEffect } from 'react'
import banner from "../../assets/images/fragnance-banner.png";
import ProductCard from '../../components/Products/Products';
import Card from '../../components/recommendation/Recommendation';
import SideBar from '../../components/Products/SideBar';

import f1 from "../../assets/images/f-front.png";
import f2 from "../../assets/images/fragnance.png";
import f3 from "../../assets/images/fragnance1.png";
import f4 from "../../assets/images/essential-f.png";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/product/slice';

const ProductPage = () => {
      const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.product.list);
console.log(products);
  useEffect(() => {
    dispatch(fetchProducts({ category: 'fragrance' }));
  }, [dispatch]);


  
    
  return (
   <>
   <div className='w-[85%] mx-auto h-[30vw] mt-20'>
              <img className='h-full w-full object-cover' src={banner} alt="" />
             </div>\
              <div className='w-full py-6'>
       <header className="head ">
          <div className="head-inner max-w-6xl mx-auto ">
            <h2 className="head-text text-3xl md:text-4xl">Fragnance</h2>
            <div className="head-line"></div>
          </div>
        </header>
<div className="w-[95%] max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="hidden md:block">
            <SideBar mainCategory="fragnance" />
          </div>
         <main className='ml-10 mt-10'>
            <div className="flex items-center justify-between mb-6 ">
              <div className="text-sm text-gray-600">Showing {products.length} products</div>
              <div>
                <select className="border px-3 py-1 rounded text-sm">
                  <option>Sort: Popular</option>
                  <option>Sort: Price — Low to High</option>
                </select>
              </div>
            </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ">
 
{products.map((product) => (
                  <ProductCard
                    key={product._id}
                    category="fragrance"
                    img={product.heroImage?.url}
                    title={product.name}
                    price={`₹${product.price.toLocaleString()}`}
                    description={product.description}
                    type={product.type}
                    onAddToCart={() => {/* implement cart logic */}}
                    onQuickView={() => {/* implement quick view logic */}}
                    onToggleWishlist={() => {/* implement wishlist logic */}}
                  />
                ))}
</div>

</main>
  </div>
    </div>
  </div>
   <Card />
   </>
  )
}

export default ProductPage