import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function TextSlider({ texts = [], stepSeconds = 2 }) {
  const boxRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || !texts.length) return;

    const ctx = gsap.context(() => {
      el.textContent = texts[0];
      const tl = gsap.timeline({ repeat: -1 });
      tlRef.current = tl;

      let i = 0;
      tl.to(
        {},
        {
          duration: stepSeconds,
          onComplete: () => {
            if (!boxRef.current || texts.length === 0) return;
            i = (i + 1) % texts.length;
            boxRef.current.textContent = texts[i];
          },
        }
      );
    }, boxRef);

    return () => {
      tlRef.current?.kill?.();
      tlRef.current = null;
      ctx.revert();
    };
  }, [texts, stepSeconds]);

  return <span ref={boxRef} />;
}
