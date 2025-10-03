import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './about.css'

gsap.registerPlugin(ScrollTrigger);
const AboutText = ({ paragraph = "", className = "" }) => {
     const containerRef = useRef(null);

  const lines = useMemo(() => {
    return paragraph
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [paragraph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const innerSpans = container.querySelectorAll(".about-line > .about-line-inner");

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      innerSpans.forEach((el) => {
        el.style.transform = "none";
        el.style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(innerSpans, { y: "100%", opacity: 0 });
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => {
          gsap.to(innerSpans, {
            y: "0%",
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.14,
          });
        },
      });
    }, container);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [lines]);
  return (
     <div ref={containerRef} className={className} aria-live="polite">
      {lines.map((line, idx) => (
        <span key={idx} className="about-line block overflow-hidden">
        
          <span className="about-line-inner block translate-y-full">{line}</span>
        </span>
      ))}
    </div>
  )
}

export default AboutText