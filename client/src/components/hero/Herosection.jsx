import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TextSlider from "./TextSlider";


const HeroSection = () => {
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const img4Ref = useRef(null);

  

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
useEffect(() => { const interval = setInterval(() => { if (isFragrance) { handlePrev(); } else { handleNext(); } }, 3000); return () => clearInterval(interval); }, [isFragrance]);
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

  };

  return (
    <div className="flex bg-white flex-col items-end justify-end h-screen w-full">


      <div className="flex flex-col justify-center h-full w-full overflow-hidden">
        <div className="flex items-end  h-[40vw] relative  w-[95%]">
          {/* <div className="flex items-center justify-center cursor-pointer">
            <div className="flex flex-col h-12 px-4 items-center justify-center  rounded-4xl bg-gray-100 ">
              <div className="p-0.5  rounded-full  bg-gray-800"></div>
              <div className="p-0.5 rounded-full  bg-gray-800"></div>
            </div>
            
             <h4 className="font-medium ">Catalog</h4>
          </div> */}
          <div className="w-[30%] h-[45%] flex items-center justify-center gap-8 flex-col">
                <TextSlider isFragrance={isFragrance} />
                <button className="px-4 py-2 border ">Discover more.</button>
</div>

          <div className="relative w-[50%] h-full overflow-hidden ">
            {/* Jewellery */}
            <img
              ref={img1Ref}
              className="w-full h-full object-cover absolute top-28 left-0"
              src="/src/assets/images/j-back.jpg"
              alt=""
            />
            <img
              ref={img2Ref}
              className="absolute bottom-0 left-44 h-[20vw] w-[24vw] object-cover   shadow-md"
              src="/src/assets/images/j.jpg"
              alt=""
            />

            {/* Fragrance */}
            <img
              ref={img3Ref}
              className="w-full h-full object-cover absolute top-28 left-0 translate-y-full opacity-0"
              src="/src/assets/images/f-back.jpg"
              alt=""
            />
            <img
              ref={img4Ref}
              className="absolute bottom-0 left-44 h-[20vw] w-[24vw] object-cover   shadow-md translate-y-full opacity-0"
              src="/src/assets/images/f-front.jpg"
              alt=""
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-4 mb-4 absolute bottom-5 right-5">
            <div
              onClick={handlePrev}
              className={`h-3 w-3 rounded-full cursor-pointer ${
                !isFragrance ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
            <div
              onClick={handleNext}
              className={`h-3 w-3 rounded-full cursor-pointer ${
                isFragrance ? "bg-black" : "bg-gray-300"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

