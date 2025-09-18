import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const location = useLocation();


    // heading mask effect
    // const heading = headingRef.current;
    // const hText = heading.innerText;
   useEffect(() => { gsap.set(headingRef.current,{ opacity:0 })
    const trigger = ScrollTrigger.create({ trigger: headingRef.current, start: "top 80%", onEnter:()=>{ gsap.to(headingRef.current, { duration:0.8, opacity:1, ease: "power2.out" }) } }) 
   ScrollTrigger.refresh() 
   return () =>
     { trigger.kill() } }, 
   [[location.pathname]]
  )


  useEffect(() => {
    // paragraph mask effect line by line
    const element = paraRef.current;
    const lines = element.innerText.split(". "); // split by sentence/line
    element.innerHTML = lines
      .map(
        (line) =>
          `<span class="block overflow-hidden"><span class="block translate-y-full">${line}.</span></span>`
      )
      .join(" ");

    const innerSpans = element.querySelectorAll("span span");

    ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        gsap.to(innerSpans, {
          y: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.2,
        });
      },
    });
  }, []);

  return (
    <div className="w-full py-20 flex items-center justify-center flex-col">
      {/* Heading with mask */}
      <div>
        <h1
          ref={headingRef}
          className="text-5xl text-main-inner font-playfair"
        >
          worn by the worthy
        </h1>
        <div className="h-[0.4px] mt-2 w-full bg-[#191919]"></div>
      </div>

      {/* Paragraph with mask */}
      <div className="w-[60%] text-xl text-center mt-5 tracking-tight text-head-italic leading-7">
        <p ref={paraRef}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
          quibusdam labore sed vero. Quidem dolor, delectus iste eos illo culpa
          aliquam esse minima cupiditate ab praesentium accusantium eum nobis
          temporibus? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quidem, quibusdam? Neque magni consectetur ipsum molestiae? Itaque
          nisi distinctio quo incidunt unde sapiente atque eos tempora? Nostrum
          sit eligendi excepturi eaque.
        </p>
      </div>
    </div>
  );
};

export default About;
