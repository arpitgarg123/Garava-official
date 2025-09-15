import React from 'react'
import './insta.css' 
import insta1 from '../../assets/images/insta.jpg'
import insta2 from '../../assets/images/insta1.jpg'
import insta3 from '../../assets/images/insta2.jpg'
import insta4 from '../../assets/images/insta3.jpg'

const Instagram = ({ title = " on Instagram",
  subtitle = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nulla quas, rerum corrupti excepturi eaque deleniti repellendus expedita sed commodi.",
  ctaLabel = "Explore Our Instagram",
  images = [
    insta1,
    insta2,
    insta3,
    insta4,
  ]}) => {
    
    const imgs = [...images].slice(0, 4);
  while (imgs.length < 4) imgs.push("/assets/placeholder-1x1.png");

  return (
    <section className="w-[90%]  mx-auto px-6 py-12">
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-8 items-center justify-center">
        {/* Left text block */}
        <div className="flex flex-col  justify-center ">
          <h3 className="text-2xl md:text-3xl font-semibold">
            <span className='inline-block text-[#032c6a] '>#Latest Post</span>
            {title}
          </h3>

          <p className="text-gray-600 mb-4 max-w-xl" >{subtitle}</p>

          <a
            className="btn "
           
            href="#"
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </a>
        </div>

      
        <div className="w-[95%] h-full flex  items-center justify-center">
         <div className='flex flex-col items-end justify-end h-full w-[50%] '>
          <div className="h-[40%] w-[13vw]  self-end">
            <img src={imgs[0]} alt="Instagram 1" loading="lazy" className="w-full h-full object-cover" />
          </div>

          <div className={`h-[70%] w-[16vw]  self-end`}>
            <img src={imgs[1]} alt="Instagram 2" loading="lazy" className="w-full h-full object-cover" />
          </div>
</div>
<div className='flex flex-col items-end justify-end h-full w-[50%]'>
          <div className=" h-[70%] w-[16vw] self-start">
            <img src={imgs[2]} alt="Instagram 3" loading="lazy" className="w-full h-full object-cover" />
          </div>

  
          <div className="h-[40%] w-[13vw]   self-start">
            <img src={imgs[3]} alt="Instagram 4" loading="lazy" className="w-full h-full object-cover" />
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Instagram