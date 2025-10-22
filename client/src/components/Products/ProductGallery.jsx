import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoIosArrowBack, IoIosArrowForward, IoIosExpand } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

const ProductGallery = ({ product, selectedColor }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    // Get images for selected color variant, or fallback to default product images
    let heroImage = null;
    let galleryImages = [];
    
    if (selectedColor) {
      // Use color-specific images if available
      if (selectedColor.heroImage && selectedColor.heroImage.url) {
        heroImage = selectedColor.heroImage.url;
      }
      
      if (selectedColor.gallery && Array.isArray(selectedColor.gallery)) {
        galleryImages = selectedColor.gallery.map(img => img?.url || img).filter(Boolean);
      }
    }
    
    // Fallback to default product images if no color-specific images
    if (!heroImage) {
      heroImage = product?.heroImage?.url || product?.heroImage || null;
    }
    
    if (galleryImages.length === 0) {
      galleryImages = Array.isArray(product?.gallery) 
        ? product.gallery.map(img => img?.url || img)
        : [];
    }
    
    // Combine hero and gallery images, removing duplicates and nulls
    const allImages = [heroImage, ...galleryImages]
      .filter(Boolean)
      .filter((img, index, self) => self.indexOf(img) === index);
    
    if (allImages.length === 0) {
      // Fallback image if no images available
      allImages.push('/placeholder.jpg');
    }
    
    setImages(allImages);
    // Keep current active image index if it's valid, otherwise reset to 0
    setActiveImageIndex(prev => prev < allImages.length ? prev : 0);
  }, [product, selectedColor]);

  const handleThumbnailClick = (index) => {
    // Disabled: Don't change main image when thumbnail is clicked
    // setActiveImageIndex(index);
  };

  const handlePrevious = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Modal functions
  const openModal = (index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // Prevent layout shift
    
    // Add history state to handle browser back button
    window.history.pushState({ modalOpen: true }, '');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore scrolling immediately
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Remove history state if it exists
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const handleModalPrevious = () => {
    setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleModalNext = () => {
    setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        handleModalPrevious();
      } else if (e.key === 'ArrowRight') {
        handleModalNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, images.length]);

  // Handle browser back button when modal is open
  useEffect(() => {
    const handlePopState = (e) => {
      if (isModalOpen) {
        e.preventDefault();
        setIsModalOpen(false);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isModalOpen]);

  // Cleanup: Always restore scroll on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  if (!images.length) return null;

  return (
    <div className="sticky top-20 z-20">
      <div className="w-full bg-gray-50 group cursor-pointer">
        <div 
          className="aspect-auto sm:aspect-[4/3] lg:aspect-[2/2] relative"
          onClick={() => openModal(activeImageIndex)}
        >
          <img 
            src={images[activeImageIndex]} 
            alt={`Product view ${activeImageIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300"
          />
          
          {/* Expand icon in top-right corner */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors duration-200">
              <IoIosExpand size={20} className="text-gray-800" />
            </div>
          </div>
          
{/*          
          
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all z-10"
                aria-label="Previous image"
              >
                <IoIosArrowBack size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition-all z-10"
                aria-label="Next image"
              >
                <IoIosArrowForward size={20} />
              </button>
            </>
          )} */}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 relative">
          {/* Fashion Gallery Layout - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2 h-auto">
            {images.slice(1, 5).map((image, index) => {
              const actualIndex = index + 1; // Since we're starting from index 1
              return (
                <button
                  key={actualIndex}
                  onClick={() => openModal(actualIndex)}
                  className={`relative cursor-pointer transition-all duration-200 overflow-hidden group aspect-square hover:shadow-md`}
                >
                  <div className="w-full h-full relative bg-gray-100">
                    <img 
                      src={image} 
                      alt={`Product view ${actualIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-200 opacity-90 hover:opacity-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </button>
              );
            })}
            
            {/* Add more images if available */}
            {images.length > 5 && (
              <>
                {images.slice(5, 7).map((image, index) => {
                  const actualIndex = index + 5;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => openModal(actualIndex)}
                      className="relative cursor-pointer transition-all duration-200 overflow-hidden group aspect-square hover:shadow-md"
                    >
                      <div className="w-full h-full relative bg-gray-100">
                        <img 
                          src={image} 
                          alt={`Product view ${actualIndex + 1}`}
                          className="w-full h-full object-cover transition-opacity duration-200 opacity-90 hover:opacity-100"
                          onError={(e) => {
                            e.target.display = 'none';
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}

      {/* Full Screen Modal - Using Portal to render outside root */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center"
          style={{ zIndex: 99999 }}
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
              aria-label="Close modal"
            >
              <IoClose size={24} className="text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 text-white text-[1.0625rem] rounded-full z-10">
              {modalImageIndex + 1} / {images.length}
            </div>

            {/* Main Modal Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={images[modalImageIndex]}
                alt={`Product view ${modalImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handleModalPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                  aria-label="Previous image"
                >
                  <IoIosArrowBack size={28} className="text-white" />
                </button>
                <button
                  onClick={handleModalNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                  aria-label="Next image"
                >
                  <IoIosArrowForward size={28} className="text-white" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-lg max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    modalImageIndex === index
                      ? 'border-white shadow-lg'
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductGallery;