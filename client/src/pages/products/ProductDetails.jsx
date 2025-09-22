import React from 'react'
import ProductAccordion from '../../components/Products/ProductAccordion'
import j2 from "../../assets/images/j.jpg";
import { Link, useNavigate } from 'react-router-dom';


const ProductDetails = () => {
  const navigate = useNavigate()
  return (
    
    <>
    
    <div  className='w-full flex px-20 py-34  flex-col '>
      <div className='flex justify-start  w-full items-center '>
         <div className='w-[30vw] h-[35vw] bg-gray-200 self-start'>
        <img className='h-full w-full object-cover' src={j2} alt="" />
      </div>
      <div className='w-[50vw] ml-5'>
        
            <h3 className="text-2xl ">
              Spotlight Round Solitaire Diamond Pendant with 4 Prongs
            </h3>
             <div className="text-2xl font-semibold my-2">₹76,385.0

</div>
            <p>(inclusive of GST)</p>
           
            <h3>SKU: FRG/007</h3>
            <div className='flex justify-between'>
            <button onClick={() => navigate('/cart')}  className='bg-black text-white w-1/2 py-2 tracking-widest mt-5 hover:bg-transparent hover:text-black transition duration-300 border'>ADD TO BAG </button>
            <button onClick={() => navigate('/checkout')} className='border w-1/2 py-2 tracking-widest mt-5 hover:bg-black hover:text-white transition duration-300'>BUY NOW </button>
            <button className='border w-1/3 py-2 tracking-widest mt-5 hover:bg-black hover:text-white transition duration-300'>ADD WISHLIST </button>
      </div>
      <div className='flex items-center justify-between  mt-12'>
        <h2 className='text-2xl font-medium   self-end '>Customize your Jewelry Design</h2>
        
                    <button className='bg-black text-white w-1/3 py-2 tracking-widest mt-5 hover:bg-transparent hover:text-black transition duration-300 border uppercase'>Book an appointment</button>
      </div>
      <div className='mt-5'>
        <h1 className='text-2xl font-semibold'>Product Description</h1>
        <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint accusantium maiores at, dolores ipsam saepe!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aspernatur porro vel sed quaerat ducimus.Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint accusantium maiores at, dolores ipsam saepe!
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      </div>
      </div>
     <div className='flex w-full justify-between mt-10 items-start'>
      <ProductAccordion />
      <div className='self-start'>
        <h5>
<span className='font-semibold'>Order now:</span> Complimentary Express Delivery by Thu, Sep 18.</h5>

      </div>
      </div>
    </div>
    
    </>
  )
}

export default ProductDetails