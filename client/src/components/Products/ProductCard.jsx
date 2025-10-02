// import React, { useState, useEffect } from "react";
// import "./product.css";
// import { CiHeart, CiSearch } from "react-icons/ci";
// import { AiFillHeart } from "react-icons/ai";
// import { IoBagHandleOutline } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../../features/cart/slice";
// import { toggleWishlistItem } from "../../features/wishlist/slice";
// import { selectIsAuthenticated } from "../../features/auth/selectors";
// import { selectIsProductInWishlist } from "../../features/wishlist/selectors";
// import { logout } from "../../features/auth/slice";
// import { toast } from "react-hot-toast";

// const ProductCard = ({
//   product,
//   onAddToCart = () => {},
//   onQuickView = () => {},
//   onToggleWishlist = () => {},
// }) => {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const navigate = useNavigate();
  
//   // Check if product is in wishlist
//   const productId = product._id || product.id;
//   const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));

//   if (!product) return null;

//   // Robust price resolution
//   const price =
//     product?.defaultVariant?.price ??
//     product?.variants?.[0]?.price ??
//     product?.priceRange?.min ??
//     "—";
//   const displayPrice = price;

//   // Normalize colors
//   const colors = Array.isArray(product.colors) ? product.colors : [];

//   // Active color state (defensive)
//   const [activeColor, setActiveColor] = useState(
//     colors.length ? colors[0] : null
//   );
//   useEffect(() => {
//     setActiveColor(colors.length ? colors[0] : null);
//   }, [colors.join("|")]); // re-init if colors change

//   const slug = product.slug || product.productSlug || product.id || product._id;
//   const heroSrc =
//     product?.heroImage?.url ||
//     product?.heroImage ||
//     product?.gallery?.[0]?.url ||
//     "/placeholder.jpg";

//   const handleProductClick = () => {
//     if (!slug) {
//       navigate("/products");
//     } else {
//       navigate(`/product_details/${slug}`);
//     }
//   };

//   return (
//     <article
//       className="ph-card"
//       tabIndex="0"
//       aria-label={`${product.name || "Product"} - ${displayPrice}`}
//     >
//       {/* IMAGE */}
//       <div onClick={handleProductClick} className="ph-image-wrap cursor-pointer">
//         <img
//           src={heroSrc}
//           alt={product.name || "Product image"}
//           className="ph-image"
//           loading="lazy"
//         />
//       </div>

//       {/* ACTION RAIL */}
//       <div className="ph-actions" aria-hidden="true">
//         <button
//           className="ph-action ph-action-ghost"
//           title="Add to cart"
//           aria-label="Add to cart"
//           onClick={(e) => {
//             e.stopPropagation();
            
//             // Check authentication
//             if (!isAuthenticated) {
//               toast.error("Please login to add items to cart");
//               navigate("/login");
//               return;
//             }

//             // Prepare cart item data
//             const variant = product.variants?.[0] || product.defaultVariant;
//             const cartItem = {
//               productId: product._id || product.id,
//               variantId: variant?._id,
//               variantSku: variant?.sku,
//               quantity: 1
//             };

//             // Ensure we have either variantId or variantSku
//             if (!cartItem.variantId && !cartItem.variantSku) {
//               toast.error("Product variant information is missing");
//               return;
//             }

//             // Dispatch Redux action
//             dispatch(addToCart(cartItem))
//               .unwrap()
//               .then(() => {
//                 toast.success("Item added to cart!");
//               })
//               .catch((error) => {
//                 toast.error("Failed to add item to cart");
//                 console.error("Add to cart error:", error);
//               });

//             // Also call the existing callback
//             onAddToCart(product);
//           }}
//         >
//           <IoBagHandleOutline />
//         </button>

//         <button
//           className="ph-action ph-action-ghost"
//             title="Quick view"
//           aria-label="Quick view"
//           onClick={() =>
//             onQuickView({
//               img: heroSrc,
//               title: product.name,
//               price: displayPrice,
//               description: product.shortDescription || product.description,
//             })
//           }
//         >
//           <CiSearch />
//         </button>

//         <button
//           className="ph-action ph-action-ghost"
//           title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//           onClick={(e) => {
//             e.stopPropagation();
            
//             // Check authentication
//             if (!isAuthenticated) {
//               toast.error("Please login to manage wishlist");
//               navigate("/login");
//               return;
//             }

//             // Dispatch Redux action
//             dispatch(toggleWishlistItem(productId))
//               .unwrap()
//               .then((result) => {
//                 if (result.action === "added") {
//                   toast.success("Added to wishlist!");
//                 } else if (result.action === "removed") {
//                   toast.success("Removed from wishlist!");
//                 }
//               })
//               .catch((error) => {
//                 console.error("Wishlist error:", error);
//                 if (error.message?.includes('Authentication failed') || error.message?.includes('login again')) {
//                   toast.error("Session expired. Please login again.");
//                   // Force logout to clear invalid session
//                   dispatch(logout());
//                   navigate("/login");
//                 } else if (error.message?.includes('login') || error.message?.includes('401')) {
//                   toast.error("Please login to manage wishlist");
//                   navigate("/login");
//                 } else {
//                   toast.error("Failed to update wishlist");
//                 }
//               });

//             // Also call the existing callback
//             onToggleWishlist({
//               img: heroSrc,
//               title: product.name,
//               price: displayPrice,
//               id: slug,
//             });
//           }}
//         >
//           {isInWishlist ? <AiFillHeart className="text-red-500" /> : <CiHeart />}
//         </button>
//       </div>

//       {/* CONTENT */}
//       <div className="ph-content">
//         {(product.type === "fragrance" || product.category === "fragrance") ? (
//           <>
//             <div className="ph-category">{product.type || "Fragrance"}</div>
//             <h3 className="ph-title">{product.name}</h3>
//             {product.shortDescription && (
//               <p className="ph-desc">{product.shortDescription}</p>
//             )}
//             <div className="ph-price">{displayPrice}</div>
//           </>
//         ) : (
//           <>
//             <div className="ph-category">
//               {product.type || product.category || "jewellery"}
//             </div>
//             <h3 className="ph-title">{product.name}</h3>
//             <div className="ph-price">{displayPrice}</div>

//             {colors.length > 0 && (
//               <div className="mt-3 flex items-start justify-start gap-2">
//                 {colors.map((c, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveColor(c)}
//                     className={`w-5 h-5 rounded-full ${
//                       activeColor === c ? "scale-125" : ""
//                     }`}
//                     style={{ backgroundColor: c }}
//                     aria-label={`Select ${c} color`}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </article>
//   );
// };

// export default ProductCard;

import React, { useState, useEffect } from "react";
import "./product.css";
import { CiHeart, CiSearch } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/slice";
import { toggleWishlistItem } from "../../features/wishlist/slice";
import { selectIsAuthenticated } from "../../features/auth/selectors";
import { selectIsProductInWishlist } from "../../features/wishlist/selectors";
import { logout } from "../../features/auth/slice";
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
  
  // Check if product is in wishlist
  const productId = product._id || product.id;
  const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));

  // Check out-of-stock status
  // Use the backend-calculated isOutOfStock first, then fallback to manual calculation
  const isOutOfStock = product.isOutOfStock || 
    (product.totalStock !== undefined && product.totalStock === 0) ||
    (product.defaultVariant && product.defaultVariant.stock === 0) ||
    (product.variants && product.variants.length > 0 && product.variants.every(v => v.stock === 0));

  // Active color state handling
let colors = [];

if (product.category?.toLowerCase() === "jewellery") {
  colors = ["#c79b3a", "#d9d9d9", "#e7b9a4"]; // Golden, Silver, Rosegold
} else if (Array.isArray(product.colors)) {
  colors = product.colors;
} else if (typeof product.colors === "string") {
  colors = product.colors.split(",").map(c => c.trim());
}  const [activeColor, setActiveColor] = useState(colors.length ? colors[0] : null);
  console.log(colors);
  
  useEffect(() => {
    setActiveColor(colors.length ? colors[0] : null);
  }, [colors.join("|")]); // re-init if colors change

  if (!product) return null;

  // Robust price resolution
  const price =
    product?.defaultVariant?.price ??
    product?.variants?.[0]?.price ??
    product?.priceRange?.min ??
    "—";
  const displayPrice = typeof price === 'number' ? `₹${price.toLocaleString()}` : price;

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
      className="ph-card group  relative flex flex-col w-full pb-4 overflow-hidden transition-all duration-300 shadow-md bg-white"
      tabIndex="0"
      aria-label={`${product.name || "Product"} - ${displayPrice}`}
    >
      {/* IMAGE */}
      <div 
        onClick={handleProductClick} 
        className="ph-image-wrap relative w-full overflow-hidden cursor-pointer"
      >
        <img
          src={heroSrc}
          alt={product.name || "Product image"}
          className="ph-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-medium text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ACTION RAIL - Positioned absolute for desktop, fixed position for mobile */}
      <div className="ph-actions absolute right-0 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:transform md:translate-x-12 md:group-hover:translate-x-0 duration-300" aria-hidden="true">
        <button
          className={`ph-action ph-action-ghost bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
            isOutOfStock 
              ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' 
              : 'hover:bg-black hover:text-white'
          }`}
          title={isOutOfStock ? "Out of stock" : "Add to cart"}
          aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            
            if (isOutOfStock) {
              toast.error("This product is currently out of stock");
              return;
            }
            
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
                if (error.message?.includes('Insufficient stock')) {
                  toast.error(error.message);
                } else {
                  toast.error("Failed to add item to cart");
                }
                console.error("Add to cart error:", error);
              });

            // Also call the existing callback
            onAddToCart(product);
          }}
        >
          <IoBagHandleOutline className="text-lg" />
        </button>

       

        <button
          className="ph-action ph-action-ghost bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            
            // Check authentication
            if (!isAuthenticated) {
              toast.error("Please login to manage wishlist");
              navigate("/login");
              return;
            }

            // Dispatch Redux action
            dispatch(toggleWishlistItem(productId))
              .unwrap()
              .then((result) => {
                if (result.action === "added") {
                  toast.success("Added to wishlist!");
                } else if (result.action === "removed") {
                  toast.success("Removed from wishlist!");
                }
              })
              .catch((error) => {
                console.error("Wishlist error:", error);
                if (error.message?.includes('Authentication failed') || error.message?.includes('login again')) {
                  toast.error("Session expired. Please login again.");
                  // Force logout to clear invalid session
                  dispatch(logout());
                  navigate("/login");
                } else if (error.message?.includes('login') || error.message?.includes('401')) {
                  toast.error("Please login to manage wishlist");
                  navigate("/login");
                } else {
                  toast.error("Failed to update wishlist");
                }
              });

            // Also call the existing callback
            onToggleWishlist({
              img: heroSrc,
              title: product.name,
              price: displayPrice,
              id: slug,
            });
          }}
        >
          {isInWishlist ? <AiFillHeart className="text-lg text-red-500" /> : <CiHeart className="text-lg" />}
        </button>
      </div>

      {/* Mobile action bar
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 flex justify-around py-2 px-1">
        <button 
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            // Cart logic
          }}
        >
          <IoBagHandleOutline className="text-xl" />
        </button>
        
        <button 
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
          aria-label="Quick view"
          onClick={(e) => {
            e.stopPropagation();
            // Quick view logic
          }}
        >
          <CiSearch className="text-xl" />
        </button>
        
        <button 
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            // Wishlist logic
          }}
        >
          {isInWishlist ? <AiFillHeart className="text-xl text-red-500" /> : <CiHeart className="text-xl" />}
        </button>
      </div> */}

<div className="pb-2 flex flex-col ">
  {(product.type === "fragrance" || product.category === "fragrance") ? (
    <>
      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium ">{product.type || "Fragrance"}</div>
      <h3 className="text-base sm:text-lg font-playfair tracking-wide  line-clamp-1 text-gray-900">{product.name}</h3>
      {product.shortDescription && (
        <p className="text-xs text-gray-600  line-clamp-2 font-light">{product.shortDescription}</p>
      )}
      <div className="text-base sm:text-lg font-medium mt-auto tracking-wide">{displayPrice}</div>
    </>
  ) : (
    <>
      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium ">
        {product.type || product.category || "jewellery"}
      </div>
      <h3 className="text-base sm:text-lg font-playfair tracking-wide line-clamp-2 text-gray-900">{product.name}</h3>
      <div className="text-base sm:text-lg font-medium tracking-wide ">{displayPrice}</div>

      {colors.length > 0 && (
        <div className="flex flex-wrap items-start gap-1.5">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setActiveColor(c);
              }}
              className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer rounded-full ${
                activeColor === c ? "scale-110" : "scale-100"
              } transition-all`}
              style={{ backgroundColor: c || '#FFFFFF' }}
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