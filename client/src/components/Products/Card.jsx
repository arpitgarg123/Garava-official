import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useToastContext } from '../../layouts/Toast'
import { addToCart } from '../../features/cart/slice'
import { getAllProductImages } from '../../utils/imageValidation'
import './product.css'

const Card = ({img, title = "Product", price = "", slug, id, isHorizontal = false, type = "", variantId = null, variantSku = null, product = null}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToastContext();
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());
  
  // Get all available images - prioritize img prop, then product object
  let allImages = [];
  
  // Strategy: Try to get as many fallback images as possible
  // 1. Start with the img prop (already processed by getProductImage)
  if (img && img !== '/placeholder.webp') {
    allImages.push(img);
  }
  
  // 2. Add all images from product object for fallback
  if (product) {
    const productImages = getAllProductImages(product);
    productImages.forEach(imgUrl => {
      if (imgUrl && imgUrl !== '/placeholder.webp' && !allImages.includes(imgUrl)) {
        allImages.push(imgUrl);
      }
    });
  }
  
  // 3. If still no images, use the img prop even if it's placeholder
  if (allImages.length === 0 && img) {
    allImages = [img];
  }
  
  // Filter out images that are already known to be invalid
  const validImages = allImages.filter(imgUrl => !failedImages.has(imgUrl));
  
  // Hide price for jewellery products on listing pages
  const isJewellery = type === "jewellery" || type === "high_jewellery" || type === "high-jewellery";
  const shouldShowPrice = !isJewellery || (isJewellery && price && price !== "Price on Request");
  
  const handleCardClick = (e) => {
    // Don't navigate if clicking the Add to Bag button
    if (e.target.closest('.add-to-bag-btn-bottom') || e.target.classList.contains('add-to-bag-btn-bottom')) {
      return;
    }
    if (slug) {
      navigate(`/product_details/${slug}`);
    }
  };

  const handleAddToBag = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isAdding || !id) return;
    
    // Check if we have variant information
    if (!variantId && !variantSku) {
      console.error('No variant information available');
      alert('This product requires variant selection. Please visit the product page.');
      navigate(`/product_details/${slug}`);
      return;
    }
    
    try {
      setIsAdding(true);
      
      // Add product to cart with variant information
      const payload = {
        productId: id,
        quantity: 1
      };
      
      // Add variant ID or SKU
      if (variantId) {
        payload.variantId = variantId;
      } else if (variantSku) {
        payload.variantSku = variantSku;
      }
      
      await dispatch(addToCart(payload)).unwrap();
      
      // Success - product added to cart
      toast.success('Added to bag successfully!', 'Success', {
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // On error, show toast
      toast.error('Failed to add product to cart. Please try again.', 'Error', {
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
     <article 
       className={`card group cursor-pointer w-full p-2 ${isHorizontal ? 'horizontal-card flex-shrink-0' : ''}`}
       tabIndex="0" 
       aria-label={`${title} - ${price}`}
       onClick={handleCardClick}
     >
      <div className="card-img-wrapper">
        {validImages.length > 0 && currentImageIndex < validImages.length ? (
          <img
            className="card-img"
            src={validImages[currentImageIndex]}
            alt={title}
            loading="lazy"
            // width="800"
            // height="800"
            onError={(e) => {
              const currentUrl = validImages[currentImageIndex];
              
              // Mark this image as failed to prevent retry loops
              if (!failedImages.has(currentUrl)) {
                setFailedImages(prev => new Set([...prev, currentUrl]));
                
                // Try next image in the array
                if (currentImageIndex < validImages.length - 1) {
                  setCurrentImageIndex(prev => prev + 1);
                } else {
                  // All images failed - hide image but keep card visible
                  e.target.style.display = 'none';
                }
              }
            }}
          />
        ) : (
          // No valid images - show empty box to maintain layout
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        <div className="overlay" aria-hidden="true">
                         <div  className="overlay-text">
                          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-center px-2 min-h-[60px] flex flex-col justify-start">
        <h3 className="card-title leading-5 line-clamp-2 mb-1">{title}</h3>
        {/* Only show price for fragrances on listing pages, hide for jewellery */}
        {
          shouldShowPrice && price && price !== "Price on Request" ? (
            <p className="card-price mt-auto text-gray-700 font-medium">{price}</p>
          ) : null
        }
      </div>

      {/* Add to Bag button at bottom of card - only show for products with price */}
      {shouldShowPrice && price && price !== "Price on Request" && (
        <button 
          className="add-to-bag-btn-bottom"
          onClick={handleAddToBag}
          onMouseDown={(e) => e.stopPropagation()}
          disabled={isAdding}
          aria-label={`Add ${title} to bag`}
          type="button"
        >
          {isAdding ? 'Adding...' : 'Add to Bag'}
        </button>
      )}
    </article>
  )
}

export default Card
