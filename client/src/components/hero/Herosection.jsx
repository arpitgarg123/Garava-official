import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import MainText from "./MainText";

const HeroSection = () => {
  const img1Ref = useRef(null); 
  const img2Ref = useRef(null); 
  const img3Ref = useRef(null); 
  const img4Ref = useRef(null); 
    const textRef = useRef(null);

  const [isFragrance, setIsFragrance] = useState(false);

  useEffect(() => {
    gsap.from([img1Ref.current, img2Ref.current], {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    });
  }, []);

  const handleNext = () => {
    if (isFragrance) return; 
    setIsFragrance(true);

    gsap.to([img1Ref.current, img2Ref.current], {
      y: 200,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });


    gsap.to([img3Ref.current, img4Ref.current], {
      y: 0,
      opacity: 1,
      duration: 1.3,
      ease: "power2.inOut",
      stagger: 0.2,
    });
  };
   gsap.to(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        textRef.current.innerHTML =
          'A <span class="font-playfair">Fragrance,</span> is a memory you can wear';
        gsap.fromTo(
          textRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      } })
  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (isFragrance) {
  //       handlePrev();
  //     } else {
  //       handleNext();
  //     }
  //   }, 3000); // 5 sec delay

  //   return () => clearInterval(interval);
  // }, [isFragrance]);

  const handlePrev = () => {
    if (!isFragrance) return;
    setIsFragrance(false);

    gsap.to([img3Ref.current, img4Ref.current], {
      y: 200,
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
    });

 
    gsap.to([img1Ref.current, img2Ref.current], {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.inOut",
      stagger: 0.2,
    });
     gsap.to(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        textRef.current.innerHTML =
          'In every <span class="font-playfair">Jewelry,</span> a memory lingers';
        gsap.fromTo(
          textRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      },
    });
  };

  return (<>
  <div className="flex bg-white flex-col items-end justify-end h-screen w-full">
    <div
        ref={textRef}
        className="text-6xl font-montserrat leading-snug text-gray-900 mb-10"
      >
        In every <span className="font-playfair">Jewelry,</span> a  memory lingers
      </div>
    <div className="flex  flex-col justify-end h-[58%] w-full overflow-hidden">
      <div className="flex items-end justify-between h-[20vw] w-[90%]">
      
        <h4 className="mb-4 cursor-pointer font-medium">Catalog</h4>

        <div className="relative w-[28vw] h-[35vw]  overflow-hidden ">
          {/* Jewellery */}
          <img
            ref={img1Ref}
            className="w-full h-full object-cover absolute top-0 left-0"
            src="/src/assets/images/jewellry4.png"
            alt=""
          />
          <img
            ref={img2Ref}
            className="absolute bottom-16 left-16 h-[17vw] w-[20vw] object-cover border shadow-md"
            src="/src/assets/images/jewellry1.jpg"
            alt=""
          />

          {/* Fragrance (start hidden below) */}
          <img
            ref={img3Ref}
            className="w-full h-full object-cover absolute top-0 left-0 translate-y-full opacity-0"
            src="/src/assets/images/fragnance1.jpg"
            alt=""
          />
          <img
            ref={img4Ref}
            className="absolute bottom-0 left-10 h-[17vw] w-[20vw] object-cover border shadow-md translate-y-full opacity-0"
            src="/src/assets/images/fragnance2.jpg"
            alt=""
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div
            onClick={handlePrev}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              !isFragrance ? "bg-gray-400" : "bg-gray-300"
            }`}
          ></div>
          <div
            onClick={handleNext}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              isFragrance ? "bg-gray-400" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default HeroSection;
