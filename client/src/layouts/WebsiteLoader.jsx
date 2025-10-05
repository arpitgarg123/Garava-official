import React, { useState, useEffect } from 'react';
import './WebsiteLoader.css';
import darkLogo from '../assets/images/logo-main.png';

const WebsiteLoader = ({ 
  onLoadingComplete = () => {},
  minLoadTime = 3000,
  loadingProgress = {}
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('fade-in');
  // const [currentLoadingText, setCurrentLoadingText] = useState('Initializing...');

  // Loading messages based on progress
  const loadingMessages = {
    dom: 'Loading page structure...',
    fonts: 'Loading typography...',
    styles: 'Applying luxury styling...',
    images: 'Loading visual assets...',
    scripts: 'Finalizing experience...',
    complete: 'Welcome to Garava'
  };



  useEffect(() => {
    // Phase 1: Fade in and animate
    const phaseTimer1 = setTimeout(() => {
      setAnimationPhase('animate');
    }, 500);

    // Don't auto-complete - wait for parent to call onLoadingComplete
    return () => {
      clearTimeout(phaseTimer1);
    };
  }, []);

  // Handle completion from parent
  useEffect(() => {
    // Check if all resources are loaded
    const allLoaded = Object.values(loadingProgress).every(state => state === true);
    
    if (allLoaded) {
      setAnimationPhase('fade-out');
      
      // Hide loader after fade out
      setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete();
      }, 800);
    }
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  // Calculate overall progress percentage
  const progressEntries = Object.entries(loadingProgress);
  const completedCount = progressEntries.filter(([_, completed]) => completed).length;
  const totalCount = progressEntries.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`luxury-loader-overlay ${animationPhase}`}>
      <div className="luxury-loader-content">
        {/* Brand Logo */}
        <div className="brand-logo-container w-full">
          <img
            className="brand-logo object-contain"
            src={darkLogo}
            alt="Garava Logo"
          />
        </div>
        
        {/* Brand Tagline */}
        <div className="brand-tagline-container">
          <p className="brand-tagline">Worn by the Worthy</p>
        </div>

      

        {/* Resource Loading Indicators */}
        <div className="resource-indicators">
          {Object.entries(loadingProgress).map(([resource, completed]) => (
            <div 
              key={resource} 
              className={`resource-dot ${completed ? 'completed' : 'loading'}`}
              title={`${resource}: ${completed ? 'loaded' : 'loading'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebsiteLoader;