import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './about.css'

gsap.registerPlugin(ScrollTrigger);

const AboutHeading = ({text}) => {
     const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = rootRef.current;
      gsap.set(el, { opacity: 0, y: 8 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      
    };
  }, []);
  return (
   <h1
      ref={rootRef}
      className="text-[1.875rem] font-playfair text-main-inner leading-tight text-center w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto"
      aria-label={text}
    >
      {text}
    </h1>
  )
}

export default AboutHeading