import React from 'react'

import './product.css'
import { Link, useNavigate } from 'react-router-dom'

const Card = ({img, title = "Product", price = "", slug, id}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (slug) {
      navigate(`/product_details/${slug}`);
    }
  };

  return (
     <article 
       className="card group cursor-pointer" 
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

      <div className="mt-3 text-center ">
        <h3 className="card-title">{title}</h3>
        {price && <div className="card-rupe-text ">{price}</div>}
      </div>
    </article>
  )
}

export default Card
