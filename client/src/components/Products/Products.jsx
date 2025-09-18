import React, { useState } from "react";
import "./product.css"; 
import { CiHeart, CiSearch } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
const ProductCard = ({
   category = "jewelry", // "jewelry" or "fragrance"
  img,
  title = "Product",
  price = "",
  description = "",
  type = "", // fragrance type
  colors = [], // jewelry colors e.g. ['#e7b9a4','#c0c0c0','#ffd700']
  onAddToCart = () => {},
  onQuickView = () => {},
  onCompare = () => {},
  onToggleWishlist = () => {},
}) => {
  const [activeColor, setActiveColor] = useState(colors[0] || null);

  return (
     <article className="ph-card" tabIndex="0" aria-label={`${title} - ${price}`}>
      {/* IMAGE */}
      <div className="ph-image-wrap">
        <img src={img} alt={title} className="ph-image" loading="lazy" />
      </div>

      {/* ACTION RAIL (shows on hover/focus per CSS) */}
      <div className="ph-actions" aria-hidden="true">
        <button
          className="ph-action ph-action-ghost"
          title="Add to cart"
          aria-label="Add to cart"
          onClick={() => onAddToCart({ img, title, price, category, color: activeColor })}
        >
          <IoBagHandleOutline />
        </button>

        <button
          className="ph-action ph-action-ghost"
          title="Quick view"
          aria-label="Quick view"
          onClick={() => onQuickView({ img, title, price, description })}
        >
          <CiSearch />
        </button>

        

        <button
          className="ph-action ph-action-ghost"
          title="Wishlist"
          aria-label="Add to wishlist"
          onClick={() => onToggleWishlist({ img, title, price })}
        >
          <CiHeart />
        </button>
      </div>

      {/* CONTENT (category-specific) */}
      <div className="ph-content">
        {category === "fragrance" ? (
          <>
            <div className="ph-category">{type || "Fragrance"}</div>
            <h3 className="ph-title">{title}</h3>
            {description && <p className="ph-desc">{description}</p>}
            <div className="ph-price">{price}</div>
          </>
        ) : (
          /* default to jewelry structure */
          <>
            <div className="ph-category">Jewelry</div>
            <h3 className="ph-title">{title}</h3>
            <div className="ph-price">{price}</div>

            {colors && colors.length > 0 && (
              <div className="mt-3 flex items-start justify-start gap-2">
            {colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveColor(c)}
                className={`w-5 h-5 rounded-full   ${
                  activeColor === c ? "scale-125" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Select ${c} color`}
              />
            ))}
            </div>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default ProductCard;



