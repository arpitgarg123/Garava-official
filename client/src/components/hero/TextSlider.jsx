import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const TextSlider = ({ isFragrance }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const newHTML = isFragrance
      ? '<h1 className="text-main text-3xl"> <span class="text-main-italic">Fragnance,</span> that  speak your story.</h1>'
      : '<h1 className="text-main text-3xl">In every <span class="text-main-italic">jewellery,</span> a <br />  memory lingers.</h1>';

    const timeline = gsap.timeline();
    
    timeline.to(element, {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Check if element still exists before modifying
        if (textRef.current) {
          textRef.current.innerHTML = newHTML;
        }
      },
    }).fromTo(
      element,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
    );

    // Cleanup function to kill animation if component unmounts
    return () => {
      timeline.kill();
    };
  }, [isFragrance]);

  return (
    <div
      ref={textRef}
      className="text-main text-gray-900 text-center leading-14 text-5xl "
    >
      In every <span className="text-main-italic">jewellery,</span> a <br /> memory lingers
    </div>
  );
};

export default TextSlider;
