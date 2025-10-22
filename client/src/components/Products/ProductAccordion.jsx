import React, { useState } from 'react';

// Import badge images properly for better quality
import ifraBadge from '../../assets/images/badges/Complient-2.webp';
import crueltyFreeBadge from '../../assets/images/badges/Complient-Copy.webp';
import jewelleryBadge from '../../assets/images/badges/Image.png';

// Helper function to render bullet points as proper HTML list
const renderBulletList = (text) => {
  if (!text) return null;
  
  // First, try to split by bullet points in a single line (• pattern)
  let bulletPoints = [];
  
  if (text.includes('•')) {
    // Split by bullet points and clean up
    bulletPoints = text
      .split('•')
      .map(point => point.trim())
      .filter(point => point.length > 0)
      .map(point => {
        // Remove trailing period before next bullet
        return point.replace(/\.\s*$/, '').trim();
      })
      .filter(point => point.length > 0);
  } else {
    // Fallback: split by newlines for traditional format
    bulletPoints = text
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove the bullet point marker if it exists
        return line.replace(/^[•·\-\*]\s*/, '').trim();
      })
      .filter(line => line.length > 0);
  }
  
  if (bulletPoints.length === 0 || bulletPoints.length === 1) {
    return <div className="whitespace-pre-line">{text}</div>;
  }
  
  return (
    <ul className="list-disc pl-6 space-y-2">
      {bulletPoints.map((point, index) => (
        <li key={index} className="text-[1.0625rem] leading-relaxed">
          {point}
        </li>
      ))}
    </ul>
  );
};

const ProductAccordion = ({ product }) => {
  // Dynamic sections based on product data
  const sections = [];

  // Check if we have structured description data
  const hasStructuredDescription = product?.structuredDescription && 
                                  Object.keys(product.structuredDescription).length > 0;

  // If we have structured description, use it to create sections (Garava.in style)
  if (hasStructuredDescription) {
    const structured = product.structuredDescription;
    
    // Product Details section (like garava.in specifications)
    if (structured.productDetails) {
      sections.push({
        title: "Product Details",
        content: (
          <div className="text-gray-700">
            {renderBulletList(structured.productDetails)}
          </div>
        ),
      });
    }
    
    // Care Instructions section
    if (structured.careInstructions) {
      sections.push({
        title: "Care Instructions", 
        content: (
          <div className="text-gray-700">
            {renderBulletList(structured.careInstructions)}
          </div>
        ),
      });
    }
    
    // Size Guide section (for jewelry)
    if (structured.sizeGuide) {
      sections.push({
        title: "Size Guide",
        content: (
          <div className="text-gray-700">
            {renderBulletList(structured.sizeGuide)}
          </div>
        ),
      });
    }
    
    // Materials section
    if (structured.materials) {
      sections.push({
        title: "Materials",
        content: (
          <div className="text-gray-700">
            {renderBulletList(structured.materials)}
          </div>
        ),
      });
    }
    
    // Shipping Info section
    if (structured.shippingInfo) {
      sections.push({
        title: "Shipping & Returns",
        content: (
          <div className="text-gray-700">
            {renderBulletList(structured.shippingInfo)}
          </div>
        ),
      });
    }
  }

  // Product Details section - always show (in addition to structured content)
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
        <div key="caution" className="p-3 bg-yellow-50 border border-yellow-200 ">
          <h5 className="font-semibold text-yellow-900 mb-1">Important Safety Information</h5>
          <p className="text-yellow-800 text-[1.0625rem]">{product.caution}</p>
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
              <p className="text-[1.0625rem]">{product.ingredients}</p>
            </div>
          )}
          
          {/* Static company information - same for all products */}
          <div className="space-y-2 text-[1.0625rem]">
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Designed and Marketed by</h5>
              <p>Advir & Co., A-14 601 Pearl Mount view, Vijay path, Tilak Nagar, Jaipur -302004, Rajasthan</p>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Manufactured by</h5>
              <p>Next Care Inc., Plot no. 155, DIC Industrial Area Baddi, Distt. Solan, HP -173205</p>
              <p className="text-[1.0625rem] text-gray-600 mt-1">
                Mfg. Lic. No. HIM/COS/18/267, St.Ex.Lic.No. BBN-07/2018-19
              </p>
            </div>
          </div>

          {/* Dynamic caution - may vary per product */}
          {product?.caution ? (
            <div className="p-3 bg-red-50 border border-red-200 ">
              <h5 className="font-semibold text-red-900 mb-1">Caution</h5>
              <p className="text-red-800 text-[1.0625rem]">{product.caution}</p>
            </div>
          ) : (
            /* Fallback static caution for all perfumes */
            <div className="p-3 bg-red-50 border border-red-200 ">
              <h5 className="font-semibold text-red-900 mb-1">Caution</h5>
              <p className="text-red-800 text-[1.0625rem]">
                Inflammable. Store at temperature below 50° C. Keep out of reach of children. 
                Do not spray near eyes. Stop use if irritation develops. Harmful if swallowed. For external use only.
              </p>
            </div>
          )}

          {/* Static Made in India badge */}
          <div className="text-center py-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[1.0625rem] font-medium bg-green-100 text-green-800 border border-green-200">
              🇮🇳 MADE IN INDIA
            </span>
          </div>
        </div>
      ),
    });
  }

  // GARAVA Assurance section
  sections.push({
    title: "GARAVA Assurance", 
    content: (
      <div className="text-gray-700">
        {product?.type === 'fragrance' ? (
          // Fragrance Products - 2 badges side by side (2x1)
          <div className="grid grid-cols-2 gap-24 text-center max-w-2xl mx-auto">
            
              <img 
                src={ifraBadge} 
                alt="IFRA Standards Compliant" 
                className="w-full h-full object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
           
            
              <img 
                src={crueltyFreeBadge} 
                alt="Cruelty Free" 
                className="w-full h-full object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
           
          </div>
        ) : (
          // Jewellery Products - 1 badge image centered
          <div className="flex justify-center">
            <div className="flex bg-red-200 flex-col items-center">
              <img 
                src={jewelleryBadge} 
                alt="Jewellery Assurance" 
                className="w-full h-full object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </div>
        )}
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
          <ul className="space-y-1 text-[1.0625rem] list-disc pl-5">
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
          <ul className="space-y-1 text-[1.0625rem] list-disc pl-5">
            <li>All sales are final; products are non-returnable and non-exchangeable</li>
            <li>For errors like damage during transit, incorrect or missing items, replacements accepted after inspection</li>
            <li>No payment refund is acceptable</li>
            <li>Neglect or improper usage damages are not covered</li>
          </ul>
          
          {/* Dynamic return policy if available */}
          {product?.returnPolicy && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 ">
              <h6 className="font-medium text-blue-900 mb-1">Product Specific Policy</h6>
              <p className="text-blue-800 text-[1.0625rem]">{product.returnPolicy}</p>
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
            <p className="text-[1.0625rem]">PhonePe</p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-1">Accepted Currency</h5>
            <p className="text-[1.0625rem]">Indian Rupee (₹) only</p>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Payment Methods</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[1.0625rem]">
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">💳 Credit Cards</span>
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">💳 Debit Cards</span>
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">🌐 Net Banking</span>
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">📱 Digital Wallets</span>
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">🚚 Cash on Delivery</span>
            <span className="inline-flex items-center px-2 py-1  bg-gray-100 text-gray-700">🌍 International Cards</span>
          </div>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 ">
          <h6 className="font-medium text-yellow-900 mb-1">International Payments</h6>
          <ul className="text-yellow-800 text-[1.0625rem] space-y-1 list-disc pl-4">
            <li>Currency conversion charges may apply based on your credit card policy</li>
            <li>Transaction amount will be converted to INR as per the applicable exchange rate</li>
          </ul>
        </div>
      </div>
    ),
  });

  // Fallback content for products without structured descriptions
  if (!hasStructuredDescription && sections.length < 3) {
    // If we don't have structured description, fall back to original description
    if (product?.description && !hasStructuredDescription) {
      sections.unshift({
        title: "Product Information",
        content: (
          <div className="text-gray-700 leading-relaxed">
            <p>{product.description}</p>
          </div>
        ),
      });
    }
    
    // Add default sections if we don't have enough content
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
  }

  const [activeIndex, setActiveIndex] = useState();
  const toggleSection = (idx) => setActiveIndex(activeIndex === idx ? null : idx);

  return (
    <div className="w-[80%] lg:max-w-none max-md:w-full divide-y divide-gray-200">
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
              <div className="mt-3 text-[1.0625rem] sm:text-base">{section.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAccordion;
