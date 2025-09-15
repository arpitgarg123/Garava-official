import React from 'react'
import SideBar from '../../components/Products/SideBar'
import ProductCard from '../../components/Products/Products'
import f1 from "../../assets/images/f-front.png";
import f2 from "../../assets/images/fragnance.png";
import f3 from "../../assets/images/fragnance1.png";
import ProductDetails from '../../components/Products/ProductDetails';

const Fragnance = () => {
  return (
     <>
  <div className='mt-36'>
       <header className="head ">
          <div className="head-inner max-w-6xl mx-auto ">
            <h2 className="head-text text-3xl md:text-4xl">Jewelry</h2>
            <div className="head-line "></div>
          </div>
        </header>
<div className="w-[95%] max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="hidden md:block">
            <SideBar />
          </div>
         <main>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">Showing 20 products</div>
              <div>
                <select className="border px-3 py-1 rounded text-sm">
                  <option>Sort: Popular</option>
                  <option>Sort: Price — Low to High</option>
                </select>
              </div>
            </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
  <ProductCard
  category="fragrance"
  img={f1}
  title="Eau de Luxe"
  price="₹12,500"
  description="Long-lasting fragrance with citrus top notes"
  type="Eau de Parfum"
/>
 <ProductCard
  category="fragrance"
  img={f2}
  title="Eau de Luxe"
  price="₹12,500"
  description="Long-lasting fragrance with citrus top notes"
  type="Eau de Parfum"
/>
 <ProductCard
  category="fragrance"
  img={f3}
  title="Eau de Luxe"
  price="₹12,500"
  description="Long-lasting fragrance with citrus top notes"
  type="Eau de Parfum"
/>
</div>
</main>
  </div>
    </div>
  </div>
{/* <ProductDetails /> */}
   </>
  )
}

export default Fragnance