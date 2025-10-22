import React from 'react';
import './LuxuryLoader.css'; // Import the CSS for styling

const LuxuryLoader = ({ 
  size = 'large', 
  message = 'Loading...', 
  variant = 'default',
  showMessage = true 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  };

  const variants = {
    default: {
      primary: 'from-amber-400 via-yellow-500 to-amber-600',
      secondary: 'from-amber-300 to-yellow-400',
      accent: 'border-amber-400',
      bg: 'bg-white/95'
    },
    jewellery: {
      primary: 'from-amber-400 via-yellow-500 to-amber-600',
      secondary: 'from-amber-300 to-yellow-400', 
      accent: 'border-amber-400',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50'
    },
    fragrance: {
      primary: 'from-rose-400 via-pink-500 to-rose-600',
      secondary: 'from-rose-300 to-pink-400',
      accent: 'border-rose-400', 
      bg: 'bg-gradient-to-br from-rose-50 to-pink-50'
    },
    'high-jewellery': {
      primary: 'from-purple-400 via-indigo-500 to-purple-600',
      secondary: 'from-purple-300 to-indigo-400',
      accent: 'border-purple-400',
      bg: 'bg-gradient-to-br from-purple-50 to-indigo-50'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`luxury-loader-container ${currentVariant.bg} backdrop-blur-sm`}>
      <div className="luxury-loader-content">
        {/* Main Diamond Spinner */}
        <div className={`luxury-diamond ${sizeClasses[size]} relative`}>
          {/* Rotating Diamond */}
          <div className="diamond-outer absolute inset-0 animate-spin-slow">
            <div className="diamond-shape relative w-full h-full">
              <div className={`diamond-facet diamond-top bg-gradient-to-br ${currentVariant.primary}`}></div>
              <div className={`diamond-facet diamond-right bg-gradient-to-bl ${currentVariant.secondary}`}></div>
              <div className={`diamond-facet diamond-bottom bg-gradient-to-tr ${currentVariant.primary}`}></div>
              <div className={`diamond-facet diamond-left bg-gradient-to-br ${currentVariant.secondary}`}></div>
            </div>
          </div>

          {/* Inner Sparkle */}
          <div className="diamond-inner absolute inset-2 animate-pulse">
            <div className="w-full h-full bg-gradient-radial from-white/80 via-transparent to-transparent rounded-full"></div>
          </div>

          {/* Orbiting Dots */}
          <div className="orbit-container absolute inset-0 animate-spin-reverse">
            <div className={`orbit-dot orbit-dot-1 w-2 h-2 bg-gradient-to-r ${currentVariant.primary} rounded-full`}></div>
            <div className={`orbit-dot orbit-dot-2 w-1.5 h-1.5 bg-gradient-to-r ${currentVariant.secondary} rounded-full`}></div>
            <div className={`orbit-dot orbit-dot-3 w-1 h-1 bg-gradient-to-r ${currentVariant.primary} rounded-full`}></div>
          </div>
        </div>

        {/* Luxury Brand Elements */}
        <div className="luxury-branding mt-8 text-center">
          {/* Brand Logo/Text */}
          <div className="brand-text mb-4">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 tracking-wider">
              GARAVA
            </h2>
            <div className="brand-underline h-px w-16 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1"></div>
          </div>

          {/* Loading Progress */}
          <div className="loading-progress mb-4">
            <div className="progress-bar w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className={`progress-fill h-full bg-gradient-to-r ${currentVariant.primary} animate-progress`}></div>
            </div>
          </div>

          {/* Loading Message */}
          {showMessage && (
            <p className="loading-message text-gray-700 font-light text-[1.0625rem] tracking-wide animate-fade-in-out">
              {message}
            </p>
          )}

          {/* Decorative Elements */}
          <div className="decorative-elements flex justify-center items-center mt-4 gap-2">
            <div className="h-px w-4 bg-gradient-to-r from-transparent to-amber-300"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="h-px w-8 bg-gradient-to-r from-amber-300 to-amber-300"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
            <div className="h-px w-4 bg-gradient-to-r from-amber-300 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Loader Component (Full Screen)
export const PageLoader = ({ message = "Loading luxury collection..." }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
    <LuxuryLoader size="xlarge" message={message} showMessage={true} />
  </div>
);

// Component Loader (Inline)
export const ComponentLoader = ({ 
  size = 'medium', 
  message = "Loading...", 
  variant = 'default' 
}) => (
  <div className="flex items-center justify-center p-8">
    <LuxuryLoader 
      size={size} 
      message={message} 
      variant={variant} 
      showMessage={true} 
    />
  </div>
);

// Button Loader (Small)
export const ButtonLoader = () => (
  <div className="inline-flex items-center">
    <LuxuryLoader size="small" showMessage={false} />
  </div>
);

export default LuxuryLoader;