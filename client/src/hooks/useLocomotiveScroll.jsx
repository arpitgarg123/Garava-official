import { useEffect, useRef, useCallback } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export const useLocomotiveScroll = (start = true) => {
  const scrollRef = useRef(null);
  const locomotiveScrollRef = useRef(null);

  useEffect(() => {
    if (!start || !scrollRef.current) return;

    // Initialize Locomotive Scroll
    const initScroll = () => {
      try {
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          multiplier: 1,
          class: 'is-inview',
          scrollFromAnywhere: false,
          gestureDirection: 'vertical',
          reloadOnContextChange: true,
          touchMultiplier: 2,
          smoothMobile: true,
          smartphone: {
            smooth: true
          },
          tablet: {
            smooth: true,
            breakpoint: 1024
          }
        });

        // Force update after initialization with proper check
        setTimeout(() => {
          if (locomotiveScrollRef.current && typeof locomotiveScrollRef.current.update === 'function') {
            locomotiveScrollRef.current.update();
          }
        }, 200);
      } catch (error) {
        console.error('Locomotive Scroll initialization failed:', error);
      }
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initScroll, 100);

    // Update scroll on window resize
    const handleResize = () => {
      if (locomotiveScrollRef.current && typeof locomotiveScrollRef.current.update === 'function') {
        locomotiveScrollRef.current.update();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      if (locomotiveScrollRef.current && typeof locomotiveScrollRef.current.destroy === 'function') {
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }
    };
  }, [start]);

  const updateScroll = useCallback(() => {
    if (locomotiveScrollRef.current && typeof locomotiveScrollRef.current.update === 'function') {
      setTimeout(() => {
        locomotiveScrollRef.current.update();
      }, 50);
    }
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    if (locomotiveScrollRef.current && typeof locomotiveScrollRef.current.scrollTo === 'function') {
      locomotiveScrollRef.current.scrollTo(target, options);
    }
  }, []);

  return {
    scrollRef,
    updateScroll,
    scrollTo,
    locomotive: locomotiveScrollRef.current
  };
};