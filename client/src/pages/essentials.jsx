import Card from "../components/essentials/Card";
import jewelleryImg from "../assets/images/j-front.jpg";
import fragranceImg from "../assets/images/essential-f.png";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import PageHeader from "../components/header/PageHeader";

gsap.registerPlugin(ScrollTrigger);
const Essentials = ()=> {
    const cardRefs = useRef([]);

  //   const setCardRef = (el, idx) => {
  //   cardRefs.current[idx] = el;
  // };

  //   useEffect(() => {
  //        const ctx = gsap.context(() => {
  //     ScrollTrigger.matchMedia({
  //       // desktop / large screens
  //       "(min-width: 1024px)": () => {
  //         cardRefs.current.forEach((card) => {
  //           if (!card) return;
  //           gsap.fromTo(
  //             card,
  //             { y: 0 },
  //             {
  //               y: -120, 
  //               ease: "none",
  //               scrollTrigger: {
  //                 trigger: card,
  //                 start: "50% 80%",    
  //                 end: "bottom top",      
  //                 scrub: 0.8,             
  //               },
  //             }
  //           );
  //         });
  //       },

  //       // tablet / medium
  //       "(min-width: 640px) and (max-width: 1023px)": () => {
  //         cardRefs.current.forEach((card) => {
  //           if (!card) return;
  //           gsap.fromTo(
  //             card,
  //             { y: 0 },
  //             {
  //               y: -70,
  //               ease: "none",
  //               scrollTrigger: {
  //                 trigger: card,
  //                 start: "top bottom",
  //                 end: "bottom top",
  //                 scrub: 0.8,
  //               },
  //             }
  //           );
  //         });
  //       },

  //       // mobile - very subtle or no movement
  //       "(max-width: 639px)": () => {
  //         cardRefs.current.forEach((card) => {
  //           if (!card) return;
  //           gsap.fromTo(
  //             card,
  //             { y: 0 },
  //             {
  //               y: -30,
  //               ease: "none",
  //               scrollTrigger: {
  //                 trigger: card,
  //                 start: "top bottom",
  //                 end: "bottom top",
  //                 scrub: 0.8,
  //               },
  //             }
  //           );
  //         });
  //       },
  //     }); 
  //   }, cardRefs); 

  //   ScrollTrigger.refresh();

  //   return () => {
  //     ctx.revert();
  //     ScrollTrigger.refresh();
  //   };
  // }, []);

 
    
  return (
   <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
      <PageHeader title="Essentials" />

        <div className="flex  -mx-4 ">
          <Card
          //  ref={(el) => setCardRef(el, 0)}
            title="Jewellery"
            subtitle="Signature Collection"
            img={jewelleryImg}
            hotspotSize="42%"
          />
          <Card
            // ref={(el) => setCardRef(el, 1)}
            title="Fragrance"
            subtitle="Eau de Luxe"
            img={fragranceImg}
            hotspotSize="42%"
          />
        </div>
      </div>
    </section>
  );
}

export default Essentials