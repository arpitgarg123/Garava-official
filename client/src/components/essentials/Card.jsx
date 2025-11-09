import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger)

const Card = forwardRef(({ title, subtitle, img, hotspotSize = "40%", link }, ref) => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div ref={ref} className="flex flex-col w-full max-w-[450px] mx-auto">
      <article   
        aria-label={`${title} card`}
        className="overflow-hidden relative group cursor-pointer w-full"
        onClick={handleShopNow}
      >
  <div className="w-full h-[300px] sm:h-[400px] sm:w-full lg:w-[450px] lg:h-[500px] xl:w-[450px] xl:h-[500px] relative">
         <div className="relative w-full h-full">
          <img
            src={img}
            alt={`${title} - ${subtitle}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            draggable="false"
            loading="lazy"
          />
          </div>
          
        </div>
      </article>

      <div className="text-start w-full flex flex-col items-center">
        <h2 className="text-[1.0625rem] sm:text-lg lg:text-xl xl:text-3xl  uppercase m-0 text-gray-900 leading-tight ">
          {title}
        </h2>
        <button
          onClick={handleShopNow}
          className="btn sm:mt-0 w-full sm:w-auto text-[1.0625rem] sm:text-base"
          aria-label={`Shop ${title}`}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;