import React, { useState } from 'react';

const ColorSelector = ({ colorVariants = [], selectedColor, onColorSelect, className = "" }) => {
  // Filter only available colors
  const availableColors = colorVariants.filter(color => color.isAvailable);
  
  // Don't render if no colors available
  if (!availableColors || availableColors.length === 0) {
    return null;
  }

  return (
    <div className={`color-selector ${className}`}>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Choose Color:</h4>
        
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color, index) => {
            const isSelected = selectedColor?.code === color.code;
            
            return (
              <button
                key={`${color.code}-${index}`}
                onClick={() => onColorSelect(color)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-gray-900 bg-gray-50 shadow-md ring-2 ring-gray-900 ring-opacity-20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={`Select ${color.name}`}
              >
                {/* Color Swatch */}
                <div 
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    isSelected ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hexColor }}
                />
                
                {/* Color Name */}
                <span className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {color.name}
                </span>
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="w-2 h-2 bg-gray-900 rounded-full ml-1"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Selected Color Display */}
        {selectedColor && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium text-gray-900">{selectedColor.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSelector;