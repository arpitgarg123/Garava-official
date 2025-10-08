import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TextSlider from "./TextSlider";
import './hero.css'

import jBack from "../../assets/images/j-back.jpg";
import jFront from "../../assets/images/j-front.jpg";
// import fFront from "../../assets/images/f-front.png";
import fFront from "../../assets/images/f-front.png";
import fBack from '../../assets/images/f-back.png'
// import fBack from '../../assets/images/fragnance.png'
import model from '../../assets/images/model.png'
import model2 from '../../assets/images/model2.png'
import model3 from '../../assets/images/model3.png'
import model4 from '../../assets/images/model4.png'
import model5 from '../../assets/images/model5.png'
import heroModel from '../../assets/images/heroModel.png'
// import o from '../../assets/images/m.png'
import o from '../../assets/images/o.png'
// import o from '../../assets/images/mode2.png'
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const img4Ref = useRef(null);
  const tlRef = useRef(null);
  const intervalRef = useRef(null); 
  const ctxRef = useRef(null);

  const [isFragrance, setIsFragrance] = useState(false);

   useEffect(() => {
    [jBack, jFront, fBack, fFront].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

//  useEffect(() => {
//     ctxRef.current = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

//       gsap.set([img1Ref.current, img2Ref.current, img3Ref.current, img4Ref.current], {
//         willChange: "transform, opacity",
//       });

//       gsap.set([img3Ref.current, img4Ref.current], { y: 100, opacity: 0 });

//       // Jewellery in
//       tl.from([img1Ref.current, img2Ref.current], {
//         y: 40,
//         opacity: 0,
//         stagger: 0.12,
//         duration: 0.9,
//       });

//       tlRef.current = tl;
//     });

//     return () => {
//       if (ctxRef.current) ctxRef.current.revert();
//       if (tlRef.current) {
//         try {
//           tlRef.current.kill();
//         } catch (e) {}
//       }
     
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
   
//   }, []);

  // const animateToFragrance = () => {
  //   if (tlRef.current) tlRef.current.kill();

  //   const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 1 } });

  //   tl.to([img1Ref.current, img2Ref.current], { y: 100, opacity: 0, stagger: 0.08 }, 0);
  //   tl.to([img3Ref.current, img4Ref.current], { y: 0, opacity: 1, stagger: 0.08 }, 0.15);

  //   tlRef.current = tl;
  // };

  //  const animateToJewellery = () => {
  //   if (tlRef.current) tlRef.current.kill();

  //   const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 1 } });

  //   tl.to([img3Ref.current, img4Ref.current], { y: 100, opacity: 0, stagger: 0.08 }, 0);
  //   tl.to([img1Ref.current, img2Ref.current], { y: 0, opacity: 1, stagger: 0.08 }, 0.15);

  //   tlRef.current = tl;
  // };

//  const handleNext = () => {
//     if (isFragrance) return;
//     setIsFragrance(true);
//     animateToFragrance();
//   };

//   const handlePrev = () => {
//     if (!isFragrance) return;
//     setIsFragrance(false);
//     animateToJewellery();
//   };

  //  useEffect(() => {
  //   // clear existing
  //   if (intervalRef.current) clearInterval(intervalRef.current);

  //   intervalRef.current = setInterval(() => {
  //     // toggle
  //     setIsFragrance((v) => {
  //       const next = !v;
  //       if (next) {
  //         animateToFragrance();
  //       } else {
  //         animateToJewellery();
  //       }
  //       return next;
  //     });
  //   }, 4000);

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, []);

  //   useEffect(() => {
  //   if (isFragrance) {
  //     animateToFragrance();
  //   } else {
  //     animateToJewellery();
  //   }
  // }, [isFragrance]);
 const handleDiscoverMore = () => {
    navigate('/products/all');
  }

  return (
    <section className="hero-root  text-[#f5e6d7] relative w-full h-screen flex items-end justify-end flex-col overflow-hidden">
      <div className="hero-overlay" />

      <div className="hero-inner relative  flex items-start justify-between w-[95%]  max-md:w-ful
        h-[70vh]">
        <div className="hero-left w-[30vw] max-md:w-full h-80   flex flex-col  items-start ">
          {/* <TextSlider isFragrance={isFragrance} /> */}
          <button onClick={handleDiscoverMore} className="btn-luxury rounded-4xl w-62 mt-8 absolute bottom-10 left-1/2 -translate-x-1/2 z-50 max-md:bottom-23  "
          style={
            {
              padding:'0.5rem 2.1rem'
            }
          }>Discover More</button>
        </div>

        {/* image stage */}
        {/* <div className="hero-stage   relative mx-8 h-full w-[45vw]">
          <img ref={img1Ref} src={jBack} alt="Jewellery Background" className="hero-bg" />
          <img ref={img2Ref} src={jFront} alt="Jewellery Front" className="hero-front" />
          <img ref={img3Ref} src={fBack} alt="Fragrance Background" className="hero-bg" />
          <img ref={img4Ref} src={fFront} alt="Fragrance Front" className="hero-front" />
        </div> */}

        {/* pagination */}
        {/* <div className="hero-pager flex flex-col gap-3 ml-28 mb-16 ">
          <button
            // onClick={handlePrev}
            aria-label="Jewellery"
            // className={`hero-dot ${!isFragrance ? "active" : ""}`}
            className={`hero-dot `}
          ></button>
          <button
            // onClick={handleNext}
            aria-label="Fragrance"
            // className={`hero-dot ${isFragrance ? "active" : ""}`}
            className={`hero-dot `}
          ></button>
        </div> */}


        {/* <img className="h-[95vh] scale-120  absolute left-[29%] -bottom-12 object-cover " src={model} alt="" /> */}
        <img className="h-[95vh]  absolute left-[29%] max-sm:left-[0%]  bottom-0  max object-contain max-sm:scale-110 max-sm:-bottom-26" src={o} alt="" />
      </div>
    </section>
  );
};

export default HeroSection;

