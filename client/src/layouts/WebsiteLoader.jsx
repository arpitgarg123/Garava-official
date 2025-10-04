import React, { useState, useEffect } from 'react';
import './WebsiteLoader.css';
import darkLogo from '../assets/images/logo-main.png';

const WebsiteLoader = ({ 
  onLoadingComplete = () => {},
  minLoadTime = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('fade-in');

  useEffect(() => {
    // Phase 1: Fade in and animate (first 2 seconds)
    const phaseTimer1 = setTimeout(() => {
      setAnimationPhase('animate');
    }, 500);

    // Phase 2: Complete loading
    const completeTimer = setTimeout(() => {
      setAnimationPhase('fade-out');
      
      // Hide loader after fade out
      setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete();
      }, 800);
    }, minLoadTime);

    return () => {
      clearTimeout(phaseTimer1);
      clearTimeout(completeTimer);
    };
  }, [minLoadTime, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`luxury-loader-overlay ${animationPhase}`}>
      <div className="luxury-loader-content">
        {/* Brand Logo */}
        <div className="brand-logo-container  w-full">
           <img
                      className="brand-logo  object-contain "
                      src={darkLogo}
                      alt="Garava Logo"
                    />
        </div>
        
        {/* Brand Tagline */}
        <div className="brand-tagline-container">
          <p className="brand-tagline">Worn by the Worthy</p>
        </div>

        {/* Subtle loading indicator
        <div className="loading-indicator">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div> */}
      </div>
    </div>
  );
};

export default WebsiteLoader;