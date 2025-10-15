import React from 'react'

import './product.css'
import { Link, useNavigate } from 'react-router-dom'

const Card = ({img, title = "Product", price = "", slug, id, isHorizontal = false, type = ""}) => {
  const navigate = useNavigate();
  
  // Hide price for jewellery products on listing pages
  const isJewellery = type === "jewellery" || type === "high_jewellery" || type === "high-jewellery";
  const shouldShowPrice = !isJewellery || (isJewellery && price && price !== "Price on Request");
  
  const handleCardClick = () => {
    if (slug) {
      navigate(`/product_details/${slug}`);
    }
  };

  return (
     <article 
       className={`card group cursor-pointer   w-full h-full ${isHorizontal ? 'horizontal-card flex-shrink-0' : ''}`}
       tabIndex="0" 
       aria-label={`${title} - ${price}`}
       onClick={handleCardClick}
     >
      <div className="card-img-wrapper">
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

      <div className="mt-3 sm:mt-4 text-center px-2">
        <h3 className="card-title leading-6">{title}</h3>
        {/* Only show price for fragrances on listing pages, hide for jewellery */}
        {
          shouldShowPrice && price && price !== "Price on Request" ? (
            <p className="card-price mt-1 text-gray-700 font-medium">{price}</p>
          ) : null
        }
      </div>
    </article>
  )
}

export default Card
