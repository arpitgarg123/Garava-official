import React from 'react';
import { useLocomotiveScroll } from './useLocomotiveScroll';

const SmoothNavigation = ({ children, to, offset = 0, duration = 1000 }) => {
  const { scrollTo } = useLocomotiveScroll();

  const handleClick = (e) => {
    e.preventDefault();
    
    const target = document.querySelector(to);
    if (target && scrollTo) {
      scrollTo(target, {
        offset: offset,
        duration: duration,
        easing: [0.25, 0.0, 0.35, 1.0]
      });
    }
  };

  return (
    <button onClick={handleClick} className="cursor-pointer">
      {children}
    </button>
  );
};

export default SmoothNavigation;