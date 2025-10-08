import React from 'react'

import './product.css'
import { Link, useNavigate } from 'react-router-dom'

const Card = ({img, title = "Product", price = "", slug, id, isHorizontal = false}) => {
  const navigate = useNavigate();
  
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
                         Feel This Piece
                          </div>
                    
          
        </div>
      </div>

      <div className="mt-3 sm:mt-4 text-center px-2">
        <h3 className="card-title line-clamp-2 mb-2">{title}</h3>
        {price && <div className="card-rupe-text mt-2">{price}</div>}
      </div>
    </article>
  )
}

export default Card
