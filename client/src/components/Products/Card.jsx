import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useToastContext } from '../../layouts/Toast'
import { addToCart } from '../../features/cart/slice'
import './product.css'

const Card = ({img, title = "Product", price = "", slug, id, isHorizontal = false, type = "", variantId = null, variantSku = null}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToastContext();
  const [isAdding, setIsAdding] = useState(false);
  
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
      <div className="card-img-wrapper aspect-square">
        <img
          className="card-img"
          src={img}
          alt={title}
          loading="lazy"
          width="800"
          height="800"
        />
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
