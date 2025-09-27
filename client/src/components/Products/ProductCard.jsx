import React, { useState, useEffect } from "react";
import "./product.css";
import { CiHeart, CiSearch } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/slice";
import { selectIsAuthenticated } from "../../features/auth/selectors";
import { toast } from "react-hot-toast";

const ProductCard = ({
  product,
  onAddToCart = () => {},
  onQuickView = () => {},
  onToggleWishlist = () => {},
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  if (!product) return null;

  // Robust price resolution
  const price =
    product?.defaultVariant?.price ??
    product?.variants?.[0]?.price ??
    product?.priceRange?.min ??
    "—";
  const displayPrice = price;

  // Normalize colors
  const colors = Array.isArray(product.colors) ? product.colors : [];

  // Active color state (defensive)
  const [activeColor, setActiveColor] = useState(
    colors.length ? colors[0] : null
  );
  useEffect(() => {
    setActiveColor(colors.length ? colors[0] : null);
  }, [colors.join("|")]); // re-init if colors change

  const slug = product.slug || product.productSlug || product.id || product._id;
  const heroSrc =
    product?.heroImage?.url ||
    product?.heroImage ||
    product?.gallery?.[0]?.url ||
    "/placeholder.jpg";

  const handleProductClick = () => {
    if (!slug) {
      navigate("/products");
    } else {
      navigate(`/product_details/${slug}`);
    }
  };

  return (
    <article
      className="ph-card"
      tabIndex="0"
      aria-label={`${product.name || "Product"} - ${displayPrice}`}
    >
      {/* IMAGE */}
      <div onClick={handleProductClick} className="ph-image-wrap cursor-pointer">
        <img
          src={heroSrc}
          alt={product.name || "Product image"}
          className="ph-image"
          loading="lazy"
        />
      </div>

      {/* ACTION RAIL */}
      <div className="ph-actions" aria-hidden="true">
        <button
          className="ph-action ph-action-ghost"
          title="Add to cart"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            
            // Check authentication
            if (!isAuthenticated) {
              toast.error("Please login to add items to cart");
              navigate("/login");
              return;
            }

            // Prepare cart item data
            const variant = product.variants?.[0] || product.defaultVariant;
            const cartItem = {
              productId: product._id || product.id,
              variantId: variant?._id,
              variantSku: variant?.sku,
              quantity: 1
            };

            // Ensure we have either variantId or variantSku
            if (!cartItem.variantId && !cartItem.variantSku) {
              toast.error("Product variant information is missing");
              return;
            }

            // Dispatch Redux action
            dispatch(addToCart(cartItem))
              .unwrap()
              .then(() => {
                toast.success("Item added to cart!");
              })
              .catch((error) => {
                toast.error("Failed to add item to cart");
                console.error("Add to cart error:", error);
              });

            // Also call the existing callback
            onAddToCart(product);
          }}
        >
          <IoBagHandleOutline />
        </button>

        <button
          className="ph-action ph-action-ghost"
            title="Quick view"
          aria-label="Quick view"
          onClick={() =>
            onQuickView({
              img: heroSrc,
              title: product.name,
              price: displayPrice,
              description: product.shortDescription || product.description,
            })
          }
        >
          <CiSearch />
        </button>

        <button
          className="ph-action ph-action-ghost"
          title="Wishlist"
          aria-label="Add to wishlist"
          onClick={() =>
            onToggleWishlist({
              img: heroSrc,
              title: product.name,
              price: displayPrice,
              id: slug,
            })
          }
        >
          <CiHeart />
        </button>
      </div>

      {/* CONTENT */}
      <div className="ph-content">
        {(product.type === "fragrance" || product.category === "fragrance") ? (
          <>
            <div className="ph-category">{product.type || "Fragrance"}</div>
            <h3 className="ph-title">{product.name}</h3>
            {product.shortDescription && (
              <p className="ph-desc">{product.shortDescription}</p>
            )}
            <div className="ph-price">{displayPrice}</div>
          </>
        ) : (
          <>
            <div className="ph-category">
              {product.type || product.category || "jewellery"}
            </div>
            <h3 className="ph-title">{product.name}</h3>
            <div className="ph-price">{displayPrice}</div>

            {colors.length > 0 && (
              <div className="mt-3 flex items-start justify-start gap-2">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(c)}
                    className={`w-5 h-5 rounded-full ${
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



