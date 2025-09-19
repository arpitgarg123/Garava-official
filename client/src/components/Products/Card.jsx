import React from 'react'

import './product.css'
import { Link } from 'react-router-dom'

const Card = ({img,title = "Product", price = ""}) => {
  return (
     <article className="card group" tabIndex="0" aria-label={`${title} - ${price}`}>
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
         
                         <Link to='/product_details' className="overlay-text">
                         Feel This Piece
                          </Link>
                    
          
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
