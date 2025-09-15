import React from 'react'
import ProductAccordion from './ProductAccordion '


const ProductDetails = () => {
  
  return (
    <div className='w-full flex px-20 flex-col '>
      <div className='flex justify-between items-center '>
         <div className='w-[25vw] h-[28vw] bg-gray-200 self-start'>
        
      </div>
      <div className='w-[50vw] '>
        
            <h3 className="ph-title">
              Eau de Luxe
            </h3>
            <p>Long-lasting fragrance with citrus top notes</p>
           
            <div className="ph-price">12,000</div>
            <h3>SKU: FRG/007</h3>
            <div className='flex justify-between'>
            <button className='bg-black text-white w-1/2 py-2 tracking-widest mt-5'>ADD TO BAG </button>
            <button className='border w-1/2 py-2 tracking-widest mt-5'>BUY NOW </button>
            <button className='border w-1/3 py-2 tracking-widest mt-5'>ADD WISHLIST </button>
      </div>
      <div className='mt-5'>
        <h1 className='text-2xl font-semibold'>Product Description</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint accusantium maiores at, dolores ipsam saepe!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aspernatur porro vel sed quaerat ducimus.
        </p>
      </div>
      </div>
      </div>
     <div className='flex w-full justify-between items-start'>
      <ProductAccordion />
      <div className='self-start'>
        <h5>
Order now. Complimentary Express Delivery by Thu, Sep 18.</h5>

      </div>
      </div>
    </div>
  )
}

export default ProductDetails