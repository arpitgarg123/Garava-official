import React, { useState } from 'react'

const ProductAccordion  = () => {
    const sections = [
  {
    title: "Product Details",
    content: (
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Beige and dark brown soft GG Monogram coated fabric</li>
        <li>Dark brown leather trim</li>
        <li>Light gold-toned hardware</li>
        <li>Green cotton lining</li>
        <li>3.9&quot; handle drop</li>
        <li>
          Detachable and adjustable leather shoulder strap drop 18.1&quot; – 21.3&quot;;
          length: 40.9&quot; – 46.5&quot;
        </li>
        <li>Zip closure</li>
        <li>7.9&quot;W x 5.1&quot;H x 5.1&quot;D</li>
        <li>Weight: 0.4kg approximately</li>
        <li>Fits iPhone Pro Max/Plus, Airpods, small wallet, and lipstick</li>
      </ul>
    ),
  },
  {
    title: "Materials & Care",
    content: (
      <p className="text-gray-700 leading-relaxed">
        Crafted with premium leather and cotton lining. Clean with a soft, dry cloth.
        Avoid exposure to direct sunlight or water. Store in provided dust bag when not in use.
      </p>
    ),
  },
  {
    title: "Our Commitment",
    content: (
      <p className="text-gray-700 leading-relaxed">
        We are committed to ethical sourcing and sustainable craftsmanship. Each piece
        is carefully created to minimize environmental impact while ensuring
        exceptional quality.
      </p>
    ),
  },
];

 const [activeIndex, setActiveIndex] = useState(0);

  const toggleSection = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
     <div className="divide-y  w-1/2 divide-gray-200 ">
      {sections.map((section, idx) => (
        <div key={idx} className="py-4">
          <button
            className="flex justify-between w-full text-left text-lg font-semibold text-gray-900 focus:outline-none"
            onClick={() => toggleSection(idx)}
            aria-expanded={activeIndex === idx}
          >
            {section.title}
            <span
              className={`transform transition-transform ${
                activeIndex === idx ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {activeIndex === idx && (
            <div className="mt-4 text-sm">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProductAccordion 