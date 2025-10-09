// Debug component to test color variants
import React, { useState } from 'react';
import ColorSelector from '../src/components/Products/ColorSelector';

const ColorSelectorTest = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Test data
  const testColorVariants = [
    {
      name: "White Gold",
      code: "white-gold", 
      hexColor: "#d9d9d9",
      isAvailable: true,
      priority: 0
    },
    {
      name: "Yellow Gold",
      code: "yellow-gold",
      hexColor: "#c79b3a", 
      isAvailable: true,
      priority: 1
    },
    {
      name: "Rose Gold",
      code: "rose-gold",
      hexColor: "#e7b9a4",
      isAvailable: true,
      priority: 2
    }
  ];
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Color Selector Test</h2>
      
      <ColorSelector
        colorVariants={testColorVariants}
        selectedColor={selectedColor}
        onColorSelect={(color) => {
          console.log('Color selected:', color);
          setSelectedColor(color);
        }}
        size="normal"
        showLabels={true}
      />
      
      {selectedColor && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3>Selected Color:</h3>
          <pre>{JSON.stringify(selectedColor, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ColorSelectorTest;