// import React, { useState } from 'react'

// const ProductAccordion  = () => {
//     const sections = [
//   {
//     title: "Product Details",
//     content: (
//       <ul className="list-disc pl-6 space-y-1 text-gray-700">
//         <li>Beige and dark brown soft GG Monogram coated fabric</li>
//         <li>Dark brown leather trim</li>
//         <li>Light gold-toned hardware</li>
//         <li>Green cotton lining</li>
//         <li>3.9&quot; handle drop</li>
//         <li>
//           Detachable and adjustable leather shoulder strap drop 18.1&quot; – 21.3&quot;;
//           length: 40.9&quot; – 46.5&quot;
//         </li>
//         <li>Zip closure</li>
//         <li>7.9&quot;W x 5.1&quot;H x 5.1&quot;D</li>
//         <li>Weight: 0.4kg approximately</li>
//         <li>Fits iPhone Pro Max/Plus, Airpods, small wallet, and lipstick</li>
//       </ul>
//     ),
//   },
//   {
//     title: "Materials & Care",
//     content: (
//       <p className="text-gray-700 leading-relaxed">
//         Crafted with premium leather and cotton lining. Clean with a soft, dry cloth.
//         Avoid exposure to direct sunlight or water. Store in provided dust bag when not in use.
//       </p>
//     ),
//   },
//   {
//     title: "Our Commitment",
//     content: (
//       <p className="text-gray-700 leading-relaxed">
//         We are committed to ethical sourcing and sustainable craftsmanship. Each piece
//         is carefully created to minimize environmental impact while ensuring
//         exceptional quality.
//       </p>
//     ),
//   },
// ];

//  const [activeIndex, setActiveIndex] = useState();

//   const toggleSection = (idx) => {
//     setActiveIndex(activeIndex === idx ? null : idx);
//   };

//   return (
//      <div className="divide-y  w-1/2 divide-gray-200 ">
//       {sections.map((section, idx) => (
//         <div key={idx} className="py-4">
//           <button
//             className="flex justify-between w-full text-left text-lg font-semibold text-gray-900 focus:outline-none"
//             onClick={() => toggleSection(idx)}
//             aria-expanded={activeIndex === idx}
//           >
//             {section.title}
//             <span
//               className={`transform transition-transform ${
//                 activeIndex === idx ? "rotate-180" : "rotate-0"
//               }`}
//             >
//               ▼
//             </span>
//           </button>
//           {activeIndex === idx && (
//             <div className="mt-4 text-md">{section.content}</div>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// export default ProductAccordion 

import React, { useState } from 'react';

const ProductAccordion = ({ product }) => {
  // Dynamic sections based on product data
  const sections = [];

  // Product Details section - always show
  const productDetailsItems = [];
  
  if (product?.material) productDetailsItems.push(`Material: ${product.material}`);
  if (product?.dimensions) productDetailsItems.push(`Dimensions: ${product.dimensions}`);
  if (product?.variants?.[0]?.weight) productDetailsItems.push(`Weight: ${product.variants[0].weight}g approximately`);
  if (product?.type === 'fragrance' && product?.variants?.[0]?.sizeLabel) {
    productDetailsItems.push(`Size: ${product.variants[0].sizeLabel}`);
  }
  
  // Add variant-specific details
  if (product?.variants?.length > 0) {
    const uniqueSizes = [...new Set(product.variants.map(v => v.sizeLabel))];
    if (uniqueSizes.length > 1) {
      productDetailsItems.push(`Available sizes: ${uniqueSizes.join(', ')}`);
    }
  }

  // Add fragrance notes if available
  if (product?.type === 'fragrance' && product?.fragranceNotes) {
    if (product.fragranceNotes.top?.length > 0) {
      productDetailsItems.push(`Top Notes: ${product.fragranceNotes.top.join(', ')}`);
    }
    if (product.fragranceNotes.middle?.length > 0) {
      productDetailsItems.push(`Middle Notes: ${product.fragranceNotes.middle.join(', ')}`);
    }
    if (product.fragranceNotes.base?.length > 0) {
      productDetailsItems.push(`Base Notes: ${product.fragranceNotes.base.join(', ')}`);
    }
  }

  // Add ingredients for fragrances
  if (product?.type === 'fragrance' && product?.ingredients) {
    productDetailsItems.push(`Key Ingredients: ${product.ingredients}`);
  }

  if (productDetailsItems.length > 0) {
    sections.push({
      title: "Product Details",
      content: (
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          {productDetailsItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ),
    });
  }

  // Care & Materials section
  let careContent = [];
  
  if (product?.type === 'jewellery' && product?.careInstructions) {
    careContent.push(
      <div key="care" className="mb-3">
        <h5 className="font-semibold text-gray-900 mb-1">Care Instructions</h5>
        <p className="text-gray-700">{product.careInstructions}</p>
      </div>
    );
  }

  if (product?.type === 'fragrance') {
    if (product?.storage) {
      careContent.push(
        <div key="storage" className="mb-3">
          <h5 className="font-semibold text-gray-900 mb-1">Storage</h5>
          <p className="text-gray-700">{product.storage}</p>
        </div>
      );
    }
    
    if (product?.caution) {
      careContent.push(
        <div key="caution" className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-semibold text-yellow-900 mb-1">Important Safety Information</h5>
          <p className="text-yellow-800 text-sm">{product.caution}</p>
        </div>
      );
    }
  }

  if (careContent.length > 0) {
    sections.push({
      title: "Care & Materials",
      content: <div className="space-y-3">{careContent}</div>,
    });
  }

  // Perfume Details section (specific to fragrances) - Only truly dynamic content
  if (product?.type === 'fragrance') {
    sections.push({
      title: "Perfume Details",
      content: (
        <div className="space-y-4 text-gray-700">
          {/* Dynamic ingredients - different per product */}
          {product?.ingredients && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Ingredients</h5>
              <p className="text-sm">{product.ingredients}</p>
            </div>
          )}
          
          {/* Static company information - same for all products */}
          <div className="space-y-2 text-sm">
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Designed and Marketed by</h5>
              <p>Advir & Co., A-14 601 Pearl Mount view, Vijay path, Tilak Nagar, Jaipur -302004, Rajasthan</p>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Manufactured by</h5>
              <p>Next Care Inc., Plot no. 155, DIC Industrial Area Baddi, Distt. Solan, HP -173205</p>
              <p className="text-xs text-gray-600 mt-1">
                Mfg. Lic. No. HIM/COS/18/267, St.Ex.Lic.No. BBN-07/2018-19
              </p>
            </div>
          </div>

          {/* Dynamic caution - may vary per product */}
          {product?.caution ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-900 mb-1">Caution</h5>
              <p className="text-red-800 text-sm">{product.caution}</p>
            </div>
          ) : (
            /* Fallback static caution for all perfumes */
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-900 mb-1">Caution</h5>
              <p className="text-red-800 text-sm">
                Inflammable. Store at temperature below 50° C. Keep out of reach of children. 
                Do not spray near eyes. Stop use if irritation develops. Harmful if swallowed. For external use only.
              </p>
            </div>
          )}

          {/* Static Made in India badge */}
          <div className="text-center py-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              🇮🇳 MADE IN INDIA
            </span>
          </div>
        </div>
      ),
    });
  }

  // Responsible Sourcing section
  sections.push({
    title: "Responsible Sourcing",
    content: (
      <div className="space-y-3 text-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">🌱</span>
            </div>
            <span className="text-xs font-medium">Sustainable</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">♻️</span>
            </div>
            <span className="text-xs font-medium">Eco-Friendly</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">🚫</span>
            </div>
            <span className="text-xs font-medium">Cruelty Free</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600 text-xl">✨</span>
            </div>
            <span className="text-xs font-medium">Premium</span>
          </div>
        </div>
        <p className="text-sm text-center text-gray-600 mt-3">
          We are committed to ethical sourcing and sustainable practices in all our products.
        </p>
      </div>
    ),
  });

  // Shipping and Returns section
  sections.push({
    title: "Shipping and Returns",
    content: (
      <div className="space-y-4 text-gray-700">
        {/* Shipping */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Shipping</h5>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>All orders shipped are free in India</li>
            <li>Order delivery usually takes 7 working days of placing an order with us</li>
            <li>Tracking number will be shared with the customer</li>
            <li>Timeline may vary depending on location, public holidays and unavoidable circumstances</li>
            <li>GARAVA Fragrances are not shipped internationally for now</li>
            <li>We currently only deliver within India</li>
            <li>For more information please refer to our Shipping Policy</li>
          </ul>
        </div>

        {/* Returns */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Returns</h5>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>All sales are final; products are non-returnable and non-exchangeable</li>
            <li>For errors like damage during transit, incorrect or missing items, replacements accepted after inspection</li>
            <li>No payment refund is acceptable</li>
            <li>Neglect or improper usage damages are not covered</li>
          </ul>
          
          {/* Dynamic return policy if available */}
          {product?.returnPolicy && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h6 className="font-medium text-blue-900 mb-1">Product Specific Policy</h6>
              <p className="text-blue-800 text-sm">{product.returnPolicy}</p>
            </div>
          )}
        </div>
      </div>
    ),
  });

  // Payments section
  sections.push({
    title: "Payments",
    content: (
      <div className="space-y-3 text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-gray-900 mb-1">Payment Gateway</h5>
            <p className="text-sm">PhonePe</p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-1">Accepted Currency</h5>
            <p className="text-sm">Indian Rupee (₹) only</p>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Payment Methods</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">💳 Credit Cards</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">💳 Debit Cards</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">🌐 Net Banking</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">📱 Digital Wallets</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">🚚 Cash on Delivery</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700">🌍 International Cards</span>
          </div>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h6 className="font-medium text-yellow-900 mb-1">International Payments</h6>
          <ul className="text-yellow-800 text-sm space-y-1 list-disc pl-4">
            <li>Currency conversion charges may apply based on your credit card policy</li>
            <li>Transaction amount will be converted to INR as per the applicable exchange rate</li>
          </ul>
        </div>
      </div>
    ),
  });

  // Fallback to default content if no product data
  if (sections.length === 0) {
    sections.push(
      {
        title: "Product Details",
        content: (
          <p className="text-gray-700 leading-relaxed">
            Detailed product information will be displayed here once available.
          </p>
        ),
      },
      {
        title: "Care & Materials", 
        content: (
          <p className="text-gray-700 leading-relaxed">
            Care instructions and material information will be provided with your purchase.
          </p>
        ),
      }
    );
  }

  const [activeIndex, setActiveIndex] = useState();
  const toggleSection = (idx) => setActiveIndex(activeIndex === idx ? null : idx);

  return (
    <div className="w-full max-w-2xl lg:max-w-none divide-y divide-gray-200">
      {sections.map((section, idx) => (
        <div key={idx} className="py-4">
          <button
            className="flex justify-between w-full text-left text-base sm:text-lg font-semibold text-gray-900 focus:outline-none"
            onClick={() => toggleSection(idx)}
            aria-expanded={activeIndex === idx}
          >
            {section.title}
            <span
              className={`transform transition-transform ${
                activeIndex === idx ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {/* Collapsible content with smooth height */}
          <div
            className={`grid transition-all duration-200 ease-out ${
              activeIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-3 text-md sm:text-base">{section.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAccordion;
