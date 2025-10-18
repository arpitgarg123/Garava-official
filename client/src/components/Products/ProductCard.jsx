import React, { useState, useEffect } from "react";
import "./product.css";
import { CiHeart, CiSearch } from "react-icons/ci";
import { AiFillHeart } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { FiPhone, FiMail } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToGuestCart } from "../../features/cart/slice";
import { toggleWishlistItem, toggleGuestWishlistItem } from "../../features/wishlist/slice";
import { selectIsAuthenticated } from "../../features/auth/selectors";
import { selectIsProductInWishlist } from "../../features/wishlist/selectors";
import { logout } from "../../features/auth/slice";
import { guestWishlist } from "../../shared/utils/guestStorage.js";
import { toast } from "react-hot-toast";
import { handleEmailContact, handleWhatsAppContact } from "../../hooks/contact";
import ColorSelector from "./ColorSelector";

// Helper function to truncate text to a specific word limit
const truncateText = (text, wordLimit = 15) => {
  if (!text) return '';
  
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  
  return words.slice(0, wordLimit).join(' ') + '...';
};

const ProductCard = ({
  product,
  onAddToCart = () => {},
  onQuickView = () => {},
  onToggleWishlist = () => {},
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  
  const productId = product._id || product.id;
  const isInWishlistBackend = useSelector(state => selectIsProductInWishlist(state, productId));
  const isInWishlistGuest = !isAuthenticated ? guestWishlist.isInWishlist(productId) : false;
  const isInWishlist = isAuthenticated ? isInWishlistBackend : isInWishlistGuest;

  const isHighJewelleryProduct = 
    product.type === "high_jewellery" || 
    product.type === "high-jewellery" ||
    product.category === "high_jewellery" ||
    product.category === "high-jewellery" ||
    product.type?.toLowerCase().includes("high") ||
    product.category?.toLowerCase().includes("high") ||
    (product.variants && product.variants.some(variant => variant.isPriceOnDemand)) ||
    product.isPriceOnDemand;

  const isHighJewellery = isHighJewelleryProduct;

  const isOutOfStock = product.isOutOfStock || 
    (product.totalStock !== undefined && product.totalStock === 0) ||
    (product.defaultVariant && product.defaultVariant.stock === 0) ||
    (product.variants && product.variants.length > 0 && product.variants.every(v => v.stock === 0));

  // Get available color variants, prioritizing new colorVariants structure
  const getColorVariants = () => {
    // Don't show colors for high jewellery products
    if (isHighJewelleryProduct) {
      return [];
    }
    
    // Use new colorVariants structure if available
    if (product.colorVariants && Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
      return product.colorVariants
        .filter(variant => variant.isAvailable !== false)
        .sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
    
    // Fallback: Convert old color structure to new format
    let colors = [];
    
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      colors = product.colors;
    } else if (typeof product.colors === "string" && product.colors.trim()) {
      colors = product.colors.split(",").map(c => c.trim()).filter(Boolean);
    }
    
    if (colors.length === 0 && product.variants && Array.isArray(product.variants)) {
      const variantColors = [];
      product.variants.forEach(variant => {
        if (variant.color) {
          if (Array.isArray(variant.color)) {
            variantColors.push(...variant.color);
          } else if (typeof variant.color === "string") {
            variantColors.push(variant.color);
          }
        }
        if (variant.colors && Array.isArray(variant.colors)) {
          variantColors.push(...variant.colors);
        }
      });
      colors = [...new Set(variantColors)];
    }
    
    if (colors.length === 0 && product.defaultVariant) {
      if (product.defaultVariant.color) {
        if (Array.isArray(product.defaultVariant.color)) {
          colors = product.defaultVariant.color;
        } else if (typeof product.defaultVariant.color === "string") {
          colors = [product.defaultVariant.color];
        }
      }
      if (colors.length === 0 && product.defaultVariant.colors && Array.isArray(product.defaultVariant.colors)) {
        colors = product.defaultVariant.colors;
      }
    }
    
    // Default jewelry colors
    if (colors.length === 0 && (
      product.category?.toLowerCase() === "jewellery" || 
      product.type?.toLowerCase() === "jewellery"
    )) {
      return [
        { name: "Yellow Gold", code: "yellow-gold", hexColor: "#c79b3a", isAvailable: true, priority: 0 },
        { name: "White Gold", code: "white-gold", hexColor: "#d9d9d9", isAvailable: true, priority: 1 },
        { name: "Rose Gold", code: "rose-gold", hexColor: "#e7b9a4", isAvailable: true, priority: 2 }
      ];
    }
    
    // Convert legacy colors to new format
    return colors.filter(Boolean).map((color, index) => ({
      name: color,
      code: color.toLowerCase().replace(/\s+/g, '-'),
      hexColor: color,
      isAvailable: true,
      priority: index
    }));
  };

  const colorVariants = getColorVariants();
  
  const [selectedColorVariant, setSelectedColorVariant] = useState(
    colorVariants.length > 0 ? colorVariants[0] : null
  );
  const [showContactOptions, setShowContactOptions] = useState(false);
  
  useEffect(() => {
    if (colorVariants.length > 0) {
      setSelectedColorVariant(colorVariants[0]);
    }
  }, [product._id || product.id, colorVariants.length]);

  if (!product) return null;

  const hasVariantWithPriceOnDemand = product?.variants?.some(variant => variant.isPriceOnDemand);
  
  const price = product?.defaultVariant?.price ?? 
               product?.variants?.[0]?.price ?? 
               product?.priceRange?.min ?? 
               product?.price ?? 
               "Price on Request";
  
  // Don't show "Price on Request" on listing pages for jewellery
  const shouldHidePrice = (isHighJewelleryProduct || hasVariantWithPriceOnDemand || 
                          (price === 0 && (product.type === "high_jewellery" || product.type === "high-jewellery")) ||
                          product.type === "jewellery");
  
  const displayPrice = shouldHidePrice
    ? null  // Hide price on listing pages
    : (typeof price === 'number' ? `₹${price.toLocaleString()}` : price);

  const slug = product.slug || product.productSlug || product.id || product._id;
  
  // Get dynamic image based on selected color variant
  const getImageForSelectedColor = () => {
    if (selectedColorVariant && selectedColorVariant.heroImage && selectedColorVariant.heroImage.url) {
      return selectedColorVariant.heroImage.url;
    }
    
    // Temporary: Use different images based on color for demonstration
    // Replace these URLs with your actual ImageKit URLs for each color variant
    if (selectedColorVariant && product.gallery && product.gallery.length > 1) {
      const galleryIndex = selectedColorVariant.code === 'white_gold' ? 0 :
                          selectedColorVariant.code === 'yellow_gold' ? 1 :
                          selectedColorVariant.code === 'rose_gold' ? 2 : 0;
      
      const selectedImage = product.gallery[galleryIndex % product.gallery.length];
      if (selectedImage?.url || selectedImage) {
        return selectedImage.url || selectedImage;
      }
    }
    
    // Fallback to default product images
    return product?.heroImage?.url ||
           product?.heroImage ||
           product?.gallery?.[0]?.url ||
           product?.gallery?.[0] ||
           "/placeholder.jpg";
  };
  
  const heroSrc = getImageForSelectedColor();

  const handleProductClick = () => {
    if (!slug) {
      navigate("/products");
    } else {
      navigate(`/product_details/${slug}`);
    }
  };

  return (
    <article
      className="ph-card group relative flex flex-col w-full pb-4 overflow-hidden transition-all duration-300 shadow-sm bg-white rounded-lg "
      tabIndex="0"
      aria-label={`${product.name || "Product"} - ${displayPrice}`}
    >
      {/* High Jewellery Badge */}
      {isHighJewellery && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm font-bold px-3 py-1 rounded-full shadow-md">
            HIGH JEWELLERY
          </span>
        </div>
      )}

      {/* IMAGE */}
      <div 
        onClick={handleProductClick} 
        className="ph-image-wrap relative w-full h-64 overflow-hidden cursor-pointer rounded-t-lg"
      >
        <img
          src={heroSrc}
          alt={product.name || "Product image"}
          className="ph-image w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
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

      {/* FIXED: ACTION RAIL - Only show for non-high jewellery products */}
      {!isHighJewellery && (
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

              const variant = product.variants?.[0] || product.defaultVariant;
              const cartItem = {
                productId: product._id || product.id,
                variantId: variant?._id,
                variantSku: variant?.sku,
                quantity: 1,
                unitPrice: variant?.finalPrice || variant?.price || product.price || 0,
                // Include selected color information
                selectedColor: selectedColorVariant ? {
                  name: selectedColorVariant.name,
                  code: selectedColorVariant.code,
                  hexColor: selectedColorVariant.hexColor
                } : null,
                productDetails: {
                  _id: product._id || product.id,
                  name: product.name,
                  images: product.images,
                  heroImage: product.heroImage,
                  gallery: product.gallery,
                  type: product.type,
                  category: product.category,
                  slug: product.slug,
                  selectedColor: selectedColorVariant
                }
              };

              if (!cartItem.variantId && !cartItem.variantSku) {
                toast.error("Product variant information is missing");
                return;
              }

              const cartAction = isAuthenticated ? addToCart : addToGuestCart;
              const successMessage = isAuthenticated ? "Item added to cart!" : "Item added to bag! Sign in to save across devices.";

              dispatch(cartAction(cartItem))
                .unwrap()
                .then(() => {
                  toast.success(successMessage);
                })
                .catch((error) => {
                  if (error.message?.includes('Insufficient stock')) {
                    toast.error(error.message);
                  } else {
                    toast.error("Failed to add item to cart");
                  }
                  console.error("Add to cart error:", error);
                });

              onAddToCart(product);
            }}
          >
            <IoBagHandleOutline className="text-lg" />
          </button>

          <button
            className="ph-action ph-action-ghost bg-white shadow-lg rounded-full w-11 h-11 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.stopPropagation();
              
              const productDetails = {
                _id: product._id || product.id,
                name: product.name,
                images: product.images,
                heroImage: product.heroImage,
                gallery: product.gallery,
                type: product.type,
                category: product.category,
                price: product.price,
                variants: product.variants,
                slug: product.slug
              };

              const wishlistAction = isAuthenticated ? toggleWishlistItem : toggleGuestWishlistItem;
              const wishlistPayload = isAuthenticated ? productId : { productId, productDetails };
              const addMessage = isAuthenticated ? "Added to wishlist!" : "Added to wishlist! Sign in to save across devices.";
              const removeMessage = "Removed from wishlist!";

              dispatch(wishlistAction(wishlistPayload))
                .unwrap()
                .then((result) => {
                  if (result.action === "added") {
                    toast.success(addMessage);
                  } else if (result.action === "removed") {
                    toast.success(removeMessage);
                  }
                })
                .catch((error) => {
                  if (isAuthenticated && (error.message?.includes('Authentication failed') || error.message?.includes('login again'))) {
                    toast.error("Session expired. Please login again.");
                    dispatch(logout());
                    navigate("/login");
                  } else if (isAuthenticated && (error.message?.includes('login') || error.message?.includes('401'))) {
                    toast.error("Please login to manage wishlist");
                    navigate("/login");
                  } else {
                    toast.error("Failed to update wishlist");
                  }
                });

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
      )}

      {/* CONTENT */}
      <div className="p-2 flex flex-col flex-grow">
        {(product.type === "fragrance" || product.category === "fragrance") ? (
          <>
            <div className="text-sm uppercase tracking-wider text-gray-500 leading-0  max-sm:my-4  font-medium">{product.type || "Fragrance"}</div>
            <h3 className="card-title">{product.name}</h3>

            <div className="card-rupe-tex">{displayPrice}</div>
          </>
        ) : (
          <>
            <div className="text-sm uppercase leading-0 tracking-wider text-gray-500 font-medium">
              {isHighJewellery ? "HIGH JEWELLERY" : (product.type || product.category || "jewellery")}
            </div>
            <h3 className="card-title">{product.name}</h3>            
            {/* Hide price for jewellery with Price on Request - only show in product details */}
            {isHighJewelleryProduct ? (
              <div className="flex flex-col gap-3 mt-auto">
                {/* Price section hidden on listing pages for jewellery */}
                <div className="h-6"></div> {/* Spacer to maintain card height */}
                
                {/* Contact Us Button */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContactOptions(!showContactOptions);
                    }}
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2.5 text-sm font-medium rounded-lg hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    Contact for Details
                  </button>
                  
                  {/* Contact Options Dropdown */}
                  {showContactOptions && (
                    <div className="absolute -top-26 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppContact(product, setShowContactOptions);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-green-50 transition-colors border-b border-gray-100"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <FiPhone className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">WhatsApp</div>
                          <div className="text-sm text-gray-500">Instant messaging</div>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmailContact(product, setShowContactOptions);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FiMail className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Email</div>
                          <div className="text-sm text-gray-500">Detailed inquiry</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Hide price for all jewellery on listing pages
              displayPrice && <div className="card-rupe-tex">{displayPrice}</div>
            )}

            {/* Color Selector - Only for non-high jewellery products */}
            {!isHighJewelleryProduct && colorVariants.length > 0 && (
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <ColorSelector
                  colorVariants={colorVariants}
                  selectedColor={selectedColorVariant}
                  onColorSelect={setSelectedColorVariant}
                  size="small"
                  showLabels={false}
                  className="color-selector-card"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Overlay to close contact options when clicking outside */}
      {showContactOptions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowContactOptions(false)}
        />
      )}
    </article>
  );
};

export default ProductCard;