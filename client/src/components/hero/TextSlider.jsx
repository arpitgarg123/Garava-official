import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const TextSlider = ({ isFragrance }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const newHTML = isFragrance
      ? '<h1 className="text-main text-3xl"> <span class="text-main-inner">Fragnance,</span> that  speak your story.</h1>'
      : '<h1 className="text-main text-3xl">In every <span class="text-main-inner">Jewelry,</span> a <br />  memory lingers.</h1>';

    gsap.to(textRef.current, {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        textRef.current.innerHTML = newHTML;
        gsap.fromTo(
          textRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
        );
      },
    });
  }, [isFragrance]);

  return (
    <div
      ref={textRef}
      className="text-main text-gray-900 text-center leading-14 text-5xl "
    >
      In every <span className="text-main-inner">Jewelry,</span> a <br /> memory lingers
    </div>
  );
};

export default TextSlider;
