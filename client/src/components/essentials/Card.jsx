import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const Card = forwardRef(({ title, subtitle, img, hotspotSize = "40%", link }, ref) => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div ref={ref} className="flex flex-col  w-fit">
      <article   
        aria-label={`${title} card`}
        className=" overflow-hidden relative group cursor-pointer"
        onClick={handleShopNow}
      >
  <div className="h-[300px]  sm:h-[400px] xl:w-[450px] lg:h-[500px] xl:h-[500px] relative">
         <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full h-full"
        >
          <img
            src={img}
            alt={`${title} - ${subtitle}`}
            className="absolute h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            draggable="false"
            loading="lazy"
          />
          </motion.div>
          
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