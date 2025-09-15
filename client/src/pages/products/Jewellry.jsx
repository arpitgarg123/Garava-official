import React from 'react'
import SideBar from '../../components/Products/SideBar'
import Products from '../../components/Products/Products'
import jFront from "../../assets/images/j-front.jpg";
import jBack from "../../assets/images/j-back.jpg";
import j from "../../assets/images/jewellry4.png";
import j2 from "../../assets/images/j.jpg";
import ProductCard from '../../components/Products/Products';

const Jewellry = () => {

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
        {/* grid: 280px sidebar + fluid product area */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Sidebar col (hidden on small screens) */}
          <div className="hidden md:block">
            <SideBar />
          </div>

          {/* Products column */}
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
  {/* <ProductCard
  category="fragrance"
  img={jBack}
  title="Eau de Luxe"
  price="₹12,500"
  description="Long-lasting fragrance with citrus top notes"
  type="Eau de Parfum"
/> */}

<ProductCard
  category="jewelry"
  img={jFront}
  title="Round Solitaire Ring"
  price="₹79,153"
  colors={["#e7b9a4", "#c0c0c0", "#ffd700"]}

/>
<ProductCard
  category="jewelry"
  img={jFront}
  title="Round Solitaire Ring"
  price="₹79,153"
  colors={["#e7b9a4", "#c0c0c0", "#ffd700"]}

/>
<ProductCard
  category="jewelry"
  img={jFront}
  title="Round Solitaire Ring"
  price="₹79,153"
  colors={["#e7b9a4", "#c0c0c0", "#ffd700"]}

/>
<ProductCard
  category="jewelry"
  img={jFront}
  title="Round Solitaire Ring"
  price="₹79,153"
  colors={["#e7b9a4", "#c0c0c0", "#ffd700"]}

/>
<ProductCard
  category="jewelry"
  img={jFront}
  title="Round Solitaire Ring"
  price="₹79,153"
  colors={["#e7b9a4", "#c0c0c0", "#ffd700"]}

/>
</div>
</main>
  </div>
    </div>
  </div>
   </>
  )
}

export default Jewellry