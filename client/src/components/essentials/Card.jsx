import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger)

const Card =forwardRef(({ title, subtitle, img, hotspotSize = "40%" }, ref) => {

  return (
     <article 
     ref={ref}
     aria-label={`${title} card`}
      className="group relative w-full md:w-[48%] max-sm:h-[60vh] h-[78vh] overflow-hidden ">
      <img
        src={img}
        alt={`${title} - ${subtitle}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.6,.2,1)] group-hover:scale-110"
        draggable="false"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Hotspot overlay */}
      <div
        className="peer absolute inset-0 grid place-items-center z-10"
        aria-hidden="true"
      >
        <div
          className="pointer-events-auto rounded-full"
          style={{ width: hotspotSize, height: hotspotSize }}
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-20">
        <div className="scale-95   peer-hover:scale-100 transition-all duration-500 ease-out">
          <p className="text-xs tracking-[0.25em] uppercase text-white/80">
            {subtitle}
          </p>
          <h3 className="mt-2 text-4xl md:text-5xl font-playfair text-white drop-shadow">
            {title}
          </h3>
          <button
            className="mt-6 px-8 py-2 border border-white/60 text-white/90 text-md backdrop-blur-sm hover:bg-white hover:text-black transition"
            aria-label={`Explore ${title}`}
          >
            Explore
          </button>
        </div>
      </div>
    </article>
  );
});

export default Card