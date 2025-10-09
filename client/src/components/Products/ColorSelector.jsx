import React from 'react';

const ColorSelector = ({ 
  colorVariants = [], 
  selectedColor, 
  onColorSelect, 
  className = "",
  size = "normal", // "small" | "normal" | "large"
  showLabels = true,
  layout = "horizontal" // "horizontal" | "vertical"
}) => {
  // Filter only available colors and sort by priority
  const availableColors = colorVariants
    .filter(color => color.isAvailable !== false)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  
  // Don't render if no colors available
  if (!availableColors || availableColors.length === 0) {
    return null;
  }

  // Size configurations
  const sizeConfig = {
    small: {
      swatch: "w-4 h-4",
      text: "text-xs",
      gap: "gap-1.5",
      padding: "px-2 py-1"
    },
    normal: {
      swatch: "w-5 h-5", 
      text: "text-sm",
      gap: "gap-2",
      padding: "px-2.5 py-1.5"
    },
    large: {
      swatch: "w-6 h-6",
      text: "text-sm",
      gap: "gap-2.5",
      padding: "px-3 py-2"
    }
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  return (
    <div className={`color-selector ${className}`}>
      {showLabels && (
        <h4 className="text-sm font-normal text-gray-600 mb-2">Choose Color:</h4>
      )}
      
      <div className={`flex flex-wrap ${config.gap} ${layout === 'vertical' ? 'flex-col' : ''}`}>
        {availableColors.map((color, index) => {
          const isSelected = selectedColor?.code === color.code;
          
          return (
            <button
              key={`${color.code}-${index}`}
              onClick={() => onColorSelect(color)}
              className={`flex items-center ${config.gap} ${config.padding} rounded-md border transition-all duration-200 ${
                isSelected 
                  ? 'border-gray-400 bg-gray-50/60 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
              }`}
              title={`Select ${color.name}`}
            >
              {/* Color Swatch */}
              <div 
                className={`${config.swatch} rounded-full border transition-all duration-200 ${
                  isSelected ? 'border-gray-400 ring-2 ring-gray-200' : 'border-gray-300'
                }`}
                style={{ 
                  backgroundColor: color.hexColor,
                  boxShadow: (color.hexColor === '#ffffff' || color.hexColor === '#FFFFFF') 
                    ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' 
                    : 'none'
                }}
              />
              
              {/* Color Name */}
              {showLabels && (
                <span className={`${config.text} font-normal transition-colors ${
                  isSelected ? 'text-gray-800' : 'text-gray-600'
                }`}>
                  {color.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected Color Display - Minimal */}
      {selectedColor && showLabels && (
        <div className="mt-2 text-xs text-gray-500">
          Selected: <span className="font-medium text-gray-700">{selectedColor.name}</span>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;