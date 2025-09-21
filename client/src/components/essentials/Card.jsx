import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger)

const Card =forwardRef(({ title, subtitle, img, hotspotSize = "40%" }, ref) => {

  return (
    <div ref={ref} className="flex flex-col w-full lg:w-1/2">
     <article   
     aria-label={`${title} card`}
      className="w-full max-w-[800px] mx-auto overflow-hidden bg-gray-100 relative">
     <div className="aspect-[16/10] relative">
          <img
            src={img}
            alt={`${title} - ${subtitle}`}
            className="absolute h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            draggable="false"
          />
        </div>
 </article>
        

      <div className="text-start w-full  ">
         <h2 className="text-xl uppercase m-0  sm:text-2xl  text-gray-900 leading-normal tracking-wide">
            {title}
          </h2>
          <p className="text-base ">
            {subtitle}
          </p>
          <button
            className="inline-block px-10 py-2 mt-6  border border-black text-[0.8rem] font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
            aria-label={`Shop ${title}`}
          >
            Shop Now
          </button>
        </div>
    
 
    </div>
  );
});

export default Card