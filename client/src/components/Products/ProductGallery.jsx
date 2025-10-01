import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ProductGallery = ({ product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Collect all available product images
    const heroImage = product?.heroImage?.url || product?.heroImage || null;
    const galleryImages = Array.isArray(product?.gallery) 
      ? product.gallery.map(img => img?.url || img)
      : [];
    
    // Combine hero and gallery images, removing duplicates and nulls
    const allImages = [heroImage, ...galleryImages]
      .filter(Boolean)
      .filter((img, index, self) => self.indexOf(img) === index);
    
    if (allImages.length === 0) {
      // Fallback image if no images available
      allImages.push('/placeholder.jpg');
    }
    
    setImages(allImages);
  }, [product]);

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  const handlePrevious = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) return null;

  return (
    <div className="">
      <div className="relative w-full overflow-hidden bg-gray-50">
        <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] relative">
          <img 
            src={images[activeImageIndex]} 
            alt={`Product view ${activeImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all"
                aria-label="Previous image"
              >
                <IoIosArrowBack size={20} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all"
                aria-label="Next image"
              >
                <IoIosArrowForward size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 relative">
          <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 cursor-pointer border-2 transition-all ${
                  activeImageIndex === index 
                    ? 'border-gray-500' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24">
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;