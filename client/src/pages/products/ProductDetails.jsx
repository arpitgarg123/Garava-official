import React, { useEffect, useState } from 'react';
import ProductAccordion from '../../components/Products/ProductAccordion';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, fetchProductById } from '../../features/product/slice';
import { addToCart, addToGuestCart, clearCart, clearGuestCart } from '../../features/cart/slice';
import { toggleWishlistItem, toggleGuestWishlistItem } from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/auth/selectors';
import { logout } from '../../features/auth/slice';
import { FiPhone, FiMail, FiChevronDown, FiChevronUp, FiShare2 } from 'react-icons/fi';
import { CiShare2 } from "react-icons/ci";
import { handleEmailContact, handleWhatsAppContact, handlePhoneContact } from '../../hooks/contact';

import { selectIsProductInWishlist } from '../../features/wishlist/selectors';
import { toast } from 'react-hot-toast';
import YouMayAlsoLike from '../../components/Products/YouMayAlsoLike';
import Explore from '../../components/Products/Explore';
import BackButton from '../../components/BackButton';
import ProductGallery from '../../components/Products/ProductGallery';
import ProductReviews from '../../components/Products/ProductReviews';
import ColorSelector from '../../components/Products/ColorSelector';
import AvailabilityChecker from '../../components/Products/AvailabilityChecker';
import { FaWhatsapp } from 'react-icons/fa';

const ProductDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const productSlug = slug || searchParams.get('slug');
  
  // Smart selector: check if productSlug is ObjectId and use appropriate store location
  const productData = useSelector(state => {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productSlug);
    return isObjectId ? state.product.byId[productSlug] : state.product.bySlug[productSlug];
  });
  
  const { data: product, status, error } = productData || {};
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const productId = product?._id || product?.id;
  const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));
  
  // Check if we're in a high jewellery context
  const isHighJewelleryContext = location.pathname.includes('/high-jewellery') || 
                                product?.type === "high_jewellery" ||
                                (product?.variants && product?.variants.some(variant => variant.isPriceOnDemand));
  
  // Check if it's high jewellery - only show special UI if we're in high jewellery context
  const isHighJewellery = (product?.type === "high_jewellery" || 
                          (product?.variants && product?.variants.some(variant => variant.isPriceOnDemand))) &&
                          isHighJewelleryContext;
  
  // State for contact options dropdown
  const [showContactOptions, setShowContactOptions] = useState(false);
  
  // State for selected color
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Helper function to check if color selection is required
  const isColorSelectionRequired = () => {
    return product?.colorVariants && 
           product.colorVariants.length > 0 && 
           product.colorVariants.some(color => color.isAvailable);
  };
  
  const isColorSelectionMissing = () => {
    return isColorSelectionRequired() && !selectedColor;
  };

  const selectedVariant = product?.variants?.find(v => v.stock > 0 && v.stockStatus !== 'out_of_stock') ||
                          product?.defaultVariant || 
                          product?.variants?.find(v => v.isDefault) || 
                          product?.variants?.[0];
  
  // Check if the specific variant being used is out of stock
  const isVariantOutOfStock = selectedVariant && (
    selectedVariant.stock === 0 || 
    selectedVariant.stockStatus === 'out_of_stock'
  );
  
  // Simple stock check - only check if variant exists and has stock
  const isOutOfStock = !selectedVariant || 
    (selectedVariant.stock === 0) ||
    (selectedVariant.stockStatus === 'out_of_stock');

  useEffect(() => {
    if (productSlug) {
      // Check if productSlug is actually a MongoDB ObjectId (24 hex characters)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(productSlug);
      
      if (isObjectId) {
        dispatch(fetchProductById(productSlug));
      } else {
        dispatch(fetchProductBySlug(productSlug));
      }
    }
  }, [dispatch, productSlug]);

  const handleAddToCart = () => {
    // Check if product is loaded
    if (!product) {
      toast.error("Product information not available");
      return;
    }

    
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }
    
    // Validate selected variant
    if (!selectedVariant) {
      console.error('No product variant available. Product variants:', product?.variants);
      toast.error("No product variant available");
      return;
    }
    
    // Check if color selection is required and validate it
    if (isColorSelectionMissing()) {
      toast.error("Please select a color before adding to cart");
      return;
    }
    
    // Handle both _id and id fields (MongoDB subdocuments use _id, frontend might use id)
    const variantId = selectedVariant._id || selectedVariant.id;
    const variantSku = selectedVariant.sku;
    
    // We MUST have variantSku (it's always available), variantId is optional
    if (!variantSku) {
      console.error('Product variant SKU is missing. Variant object:', selectedVariant);
      toast.error("Product variant information is incomplete");
      return;
    }
    
    // Create cart item with appropriate data for both authenticated and guest users
    const cartItem = {
      productId: product?._id || product?.id,
      variantSku: variantSku,
      quantity: 1,
    };
    
    // Only include variantId if we actually have it
    if (variantId) {
      cartItem.variantId = variantId;
    }
    
    // Include selected color information if color was selected
    if (selectedColor) {
      cartItem.selectedColor = {
        name: selectedColor.name,
        code: selectedColor.code,
        hexColor: selectedColor.hexColor
      };
    }
    
    // For guest users, add additional product details
    if (!isAuthenticated) {
      cartItem.unitPrice = selectedVariant?.finalPrice || selectedVariant?.price || product?.price || 0;
      cartItem.productDetails = {
        _id: product._id || product.id,
        name: product.name,
        images: product.images,
        heroImage: product.heroImage,
        gallery: product.gallery,
        type: product.type,
        category: product.category,
        slug: product.slug
      };
      
      // Include selected color in product details for guest users
      if (selectedColor) {
        cartItem.productDetails.selectedColor = selectedColor;
      }
    }
    
    const cartAction = isAuthenticated ? addToCart : addToGuestCart;
    const successMessage = isAuthenticated ? "Item added to cart!" : "Item added to bag! Sign in to save across devices.";
    
    dispatch(cartAction(cartItem))
      .unwrap()
      .then(() => toast.success(successMessage))
      .catch((e) => {
        if (e.message?.includes('Insufficient stock')) {
          toast.error(e.message);
        } else {
          toast.error("Failed to add item to cart");
        }
      });
  };

  const handleBuyNow = () => {
    // Check if product is loaded
    if (!product) {
      toast.error("Product information not available");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }
    
    // Validate selected variant
    if (!selectedVariant) {
      toast.error("No product variant available");
      return;
    }
    
    // Check if color selection is required and validate it
    if (isColorSelectionMissing()) {
      toast.error("Please select a color before proceeding");
      return;
    }

    // Handle both _id and id fields
    const variantId = selectedVariant._id || selectedVariant.id;
    const variantSku = selectedVariant.sku;
    
    if (!variantSku) {
      toast.error("Product variant information is incomplete");
      return;
    }
    
    // Create cart item
    const cartItem = {
      productId: product?._id || product?.id,
      variantSku: variantSku,
      quantity: 1,
    };
    
    if (variantId) {
      cartItem.variantId = variantId;
    }
    
    if (selectedColor) {
      cartItem.selectedColor = {
        name: selectedColor.name,
        code: selectedColor.code,
        hexColor: selectedColor.hexColor
      };
    }
    
    // For guest users, add additional product details
    if (!isAuthenticated) {
      cartItem.unitPrice = selectedVariant?.finalPrice || selectedVariant?.price || product?.price || 0;
      cartItem.productDetails = {
        _id: product._id || product.id,
        name: product.name,
        images: product.images,
        heroImage: product.heroImage,
        gallery: product.gallery,
        type: product.type,
        category: product.category,
        slug: product.slug
      };
      
      if (selectedColor) {
        cartItem.productDetails.selectedColor = selectedColor;
      }
    }
    
    const cartAction = isAuthenticated ? addToCart : addToGuestCart;
    
    // For Buy Now: Clear cart first to ensure only this item is checked out
    // This prevents other cart items from being included in the purchase
    const clearAction = isAuthenticated ? clearCart : clearGuestCart;
    
    // Clear cart first, then add item, then navigate
    dispatch(clearAction())
      .unwrap()
      .then(() => {
        // After cart is cleared, add the new item
        return dispatch(cartAction(cartItem)).unwrap();
      })
      .then(() => {
        // After item is added, navigate to checkout
        navigate('/checkout?buyNow=true');
      })
      .catch((e) => {
        if (e.message?.includes('Insufficient stock')) {
          toast.error(e.message);
        } else {
          toast.error("Failed to add item to cart");
        }
      });
  };

  const handleToggleWishlist = () => {
    if (!productId) {
      toast.error("Product information is missing");
      return;
    }
    
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
        if (result.action === "added") toast.success(addMessage);
        else if (result.action === "removed") toast.success("Removed from wishlist!");
      })
      .catch((err) => {
        if (isAuthenticated && (err.message?.includes('Authentication failed') || err.message?.includes('login again'))) {
          toast.error("Session expired. Please login again.");
          dispatch(logout());
          navigate("/login");
        } else if (isAuthenticated && (err.message?.includes('login') || err.message?.includes('401'))) {
          toast.error("Please login to manage wishlist");
          navigate("/login");
        } else {
          toast.error("Failed to update wishlist");
        }
      });
  };

  if (status === 'loading') return <p className="p-4">Loading product details...</p>;
  if (status === 'failed') return <p className="p-4 text-red-500">{error}</p>;
  if (!product) return <p className="p-4">Product not found.</p>;

  // const heroSrc =
  //   product?.heroImage?.url ||
  //   product?.heroImage ||
  //   product?.gallery?.[0]?.url ||
  //   "/placeholder.jpg";

  return (
    <div className="headTop mt-38 max-md:mt-20 pb-10 max-2xl:mt-40">
       <div className="sticky top-36  max-md:top-20 z-50  px-4">
    <BackButton />
  </div>
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
  
        <div className="flex flex-col lg:flex-row gap-8 w-full">
   
          <div className="lg:w-[60%]">
            <ProductGallery product={product} selectedColor={selectedColor} />
          </div>

          {/* Info */}
          <div className="lg:w-[40%] pl-6 max-md:pl-0 lg:sticky lg:top-20 lg:self-start">
           {product?.badges && Array.isArray(product.badges) && product.badges.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-3">
    {product.badges
      .map((badge, index) => {
        // Function to extract clean text from various badge formats
        const extractBadgeText = (badgeData) => {
          // Handle null/undefined
          if (!badgeData) return null;
          
          // Handle string
          if (typeof badgeData === 'string') {
            // Check if it's a stringified array like '["exclusive"]'
            if (badgeData.startsWith('[') && badgeData.endsWith(']')) {
              try {
                const parsed = JSON.parse(badgeData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  return extractBadgeText(parsed[0]);
                }
              } catch (e) {
                // If parsing fails, return the original string without brackets
                return badgeData.replace(/^\[|\]$/g, '').replace(/"/g, '');
              }
            }
            return badgeData.trim();
          }
          
          // Handle arrays (nested arrays like [["exclusive"]])
          if (Array.isArray(badgeData)) {
            if (badgeData.length === 0) return null;
            // Get first non-empty element and recursively extract
            const firstItem = badgeData.find(item => item);
            return firstItem ? extractBadgeText(firstItem) : null;
          }
          
          // Handle objects
          if (typeof badgeData === 'object') {
            return badgeData.name || badgeData.label || badgeData.text || badgeData.value || null;
          }
          
          // Handle other types
          return String(badgeData).trim();
        };

        const badgeText = extractBadgeText(badge);
        
        // Skip empty or invalid badges
        if (!badgeText || badgeText === '[]' || badgeText === '""') {
          return null;
        }

        return (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-1 rounded-full text-[1.0625rem] font-medium bg-amber-100 text-amber-800 border border-amber-200"
          >
            {badgeText}
          </span>
        );
      })
      .filter(badge => badge !== null) // Remove null badges
    }
  </div>
)}

            <h1 className="text-xl sm:text-3xl font-semibold">
              {product?.name || 'Untitled Product'}
            </h1>

            {/* Category and Short Description */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-[1.0625rem] text-gray-600">
                <span className="capitalize">{product?.category}</span>
                {product?.subcategory && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{product.subcategory}</span>
                  </>
                )}
              </div>
              {
                product?.shortDescription && (
      <div>
        <p
          className={`text-[1.0625rem] my-1 leading-relaxed  
          ${!isExpanded ? "line-clamp-2" : ""}`}
        >
          {product.shortDescription}
        </p>

        {/* Read More / Less Button */}
        {product.shortDescription.length > 50 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-900 font-semibold text-sm tracking-wide hover:underline"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    )
              }
            </div>

            {/* Price Display - Different for High Jewellery */}
            {isHighJewellery ? (
              <div className="mt-3">
                <div className="text-3xl font-playfair font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  {selectedVariant?.priceOnDemandText || 'Price on Request'}
                </div>
                <p className="text-[1.0625rem] text-gray-600 mt-1">Contact us for pricing details</p>
              </div>
            ) : (
              <div className="mt-3">
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl  font-semibold">
                    ₹{selectedVariant?.price ?? 'Price not available'}
                  </div>
                  {selectedVariant?.mrp && selectedVariant.mrp > selectedVariant.price && (
                    <div className="text-lg text-gray-500 line-through">
                      ₹{selectedVariant.mrp}
                    </div>
                  )}
                </div>
                <p className="text-[1.0625rem] text-gray-600 mt-1">(inclusive of GST)</p>
                {selectedVariant?.sizeLabel && (
                  <p className="text-[1.0625rem] my-1 text-gray-600">Size: {selectedVariant.sizeLabel}</p>
                )}
              </div>
            )}

            {/* Stock status indicator */}
            <div className="my-3 flex items-center gap-3 ">
              {isOutOfStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[1.0625rem] font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[1.0625rem] font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              )}

            </div>

            <p className="mt-1 text-[1.0625rem] text-gray-700">
              <span className="font-medium">SKU:</span>{" "}
              {selectedVariant?.sku || 'SKU not available'}
            </p>

            {/* Ratings and Reviews */}
            {(product?.avgRating > 0 || product?.reviewCount > 0) && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-[1.0625rem] ${i < Math.floor(product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[1.0625rem] text-gray-600">
                  {product.avgRating && `${product.avgRating.toFixed(1)} `}
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

          

            {/* Product Specific Information */}
            {product?.type === 'jewellery' && (
              <div className="mt-4 p-3 bg-gray-50  space-y-2">
                {product?.material && (
                  <p className="text-[1.0625rem] text-gray-700">
                    <span className="font-medium">Material:</span> {product.material}
                  </p>
                )}
                {product?.dimensions && (
                  <p className="text-[1.0625rem] text-gray-700">
                    <span className="font-medium">Dimensions:</span> {product.dimensions}
                  </p>
                )}
              </div>
            )}

            {/* High Jewellery Customization */}
            {isHighJewellery && product?.customizationOptions?.enabled && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 ">
                <h4 className="text-[1.0625rem] font-semibold text-amber-900 mb-1">Customization Available</h4>
                <p className="text-[1.0625rem] text-amber-800">{product.customizationOptions.description}</p>
                {product.customizationOptions.estimatedDays && (
                  <p className="text-[1.0625rem] text-amber-700 mt-1">
                    Estimated time: {product.customizationOptions.estimatedDays} days
                  </p>
                )}
              </div>
            )}

     
            

            {/* Description */}
            <div className="mt-5">
{product?.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.tags
                    .map((tag, index) => {
                      // Function to extract clean text from various tag formats
                      const extractTagText = (tagData) => {
                        // Handle null/undefined
                        if (!tagData) return null;
                        
                        // Handle string
                        if (typeof tagData === 'string') {
                          // Check if it's a stringified array like '["exclusive"]'
                          if (tagData.startsWith('[') && tagData.endsWith(']')) {
                            try {
                              const parsed = JSON.parse(tagData);
                              if (Array.isArray(parsed) && parsed.length > 0) {
                                return extractTagText(parsed[0]);
                              }
                            } catch (e) {
                              // If parsing fails, return the original string without brackets
                              return tagData.replace(/^\[|\]$/g, '').replace(/"/g, '');
                            }
                          }
                          return tagData.trim();
                        }
                        
                        // Handle arrays (nested arrays like [["luxury"]])
                        if (Array.isArray(tagData)) {
                          if (tagData.length === 0) return null;
                          // Get first non-empty element and recursively extract
                          const firstItem = tagData.find(item => item);
                          return firstItem ? extractTagText(firstItem) : null;
                        }
                        
                        // Handle objects
                        if (typeof tagData === 'object') {
                          return tagData.name || tagData.label || tagData.text || tagData.value || null;
                        }
                        
                        // Handle other types
                        return String(tagData).trim();
                      };

                      const tagText = extractTagText(tag);
                      
                      // Skip empty or invalid tags
                      if (!tagText || tagText === '[]' || tagText === '""') {
                        return null;
                      }

                      return (
                        <span 
                          key={`tag-${index}`} 
                          className="inline-flex items-center px-2 py-1 rounded-md text-[1.0625rem] bg-gray-100 text-gray-700"
                        >
                          #{tagText}
                        </span>
                      );
                    })
                    .filter(tag => tag !== null) // Remove null tags
                    .slice(0, 5) // Limit to 5 tags
                  }
                </div>
              )}
              {/* Collections */}
              {product?.collections && product.collections.length > 0 && (
                <div className="mt-3">
                  <p className="text-[1.0625rem] text-gray-600">
                    <span className="font-medium">Collections:</span>
                    <span className="ml-2">{product.collections.join(', ')}</span>
                  </p>
                </div>
              )}

              {/* Gift Options */}
              {(product?.freeGiftWrap || product?.giftWrap?.enabled || product?.giftMessageAvailable) && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 ">
                  <h4 className="text-[1.0625rem] font-semibold text-green-900 mb-2">Gift Options Available</h4>
                  <div className="space-y-1">
                    {product?.freeGiftWrap && (
                      <p className="text-[1.0625rem] text-green-800">✓ Complimentary gift wrapping</p>
                    )}
                    {product?.giftWrap?.enabled && !product?.freeGiftWrap && (
                      <p className="text-[1.0625rem] text-green-800">
                        ✓ Gift wrapping {product.giftWrap.price > 0 ? `(₹${product.giftWrap.price})` : 'available'}
                      </p>
                    )}
                    {product?.giftMessageAvailable && (
                      <p className="text-[1.0625rem] text-green-800">✓ Personal message card</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection and Availability Check - Only for regular products */}
            {!isHighJewellery && (
              <div className="mt-4 space-y-4">
                {/* Color Selector */}
                {product?.colorVariants && product.colorVariants.length > 0 && (
                  <ColorSelector
                    colorVariants={product.colorVariants}
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                  />
                )}
                
                {/* Availability Checker */}
                <AvailabilityChecker
                  product={product}
                  selectedVariant={selectedVariant}
                />
              </div>
            )}

            {/* Action buttons - Different for High Jewellery */}
            <div className="mt-4 flex flex-col sm:flex-row  justify-between  ">
              {isHighJewellery ? (
                // High Jewellery Contact Options
                <div className="relative w-[40%] ">
                  <button 
                    onClick={() => setShowContactOptions(!showContactOptions)}
                    className="btn-black btn-small  uppercase "
                  >
                    Contact for Pricing
                  </button>
                  
                  {/* Contact Options Dropdown */}
                  {showContactOptions && (
                    <>
                      {/* Overlay to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowContactOptions(false)}
                      />
                      <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white border border-gray-200  shadow-xl z-20 overflow-hidden">
                        <button
                          onClick={() => handleWhatsAppContact(product, setShowContactOptions)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[1.0625rem] text-left hover:bg-green-50 transition-colors border-b border-gray-100"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <FiPhone className="text-white text-[1.0625rem]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">WhatsApp</div>
                            <div className="text-[1.0625rem] text-gray-500">Instant messaging for quick response</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handleEmailContact(product, setShowContactOptions)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[1.0625rem] text-left hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiMail className="text-white text-[1.0625rem]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Email</div>
                            <div className="text-[1.0625rem] text-gray-500">Detailed inquiry with specifications</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Regular Product Buttons
                <>
                  <button 
                    onClick={handleAddToCart} 
                    disabled={isOutOfStock || isColorSelectionMissing()}
                    className={`w-auto px-6 py-3 text-[1.0625rem]  ${
                      (isOutOfStock || isColorSelectionMissing())
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'btn-black btn-small'
                    }`}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 
                     isColorSelectionMissing() ? 'SELECT COLOR FIRST' : 
                     'ADD TO BAG'}
                  </button>
                  <button 
                    onClick={handleBuyNow} 
                    disabled={isOutOfStock || isColorSelectionMissing()}
                    className={`w-1/2  px-6 py-3 text-[1.0625rem]  font-medium transition-colors ${
                      (isOutOfStock || isColorSelectionMissing()) 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'btn btn-small'
                    }`}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 
                     isColorSelectionMissing() ? 'SELECT COLOR' : 
                     'BUY NOW'}
                  </button>
                </>
              )}
              <button
                onClick={handleToggleWishlist}
                className={`btn btn-small w-1/2  ${
                  isInWishlist
                    ? 'bg-red-700 text-white hover:bg-red-900'
                    : 'hover:bg-black hover:text-white'
                }`}
              >
                {isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

             <div className="lg:col-span-4 mt-6">
            <div className="space-y-3 w-fit ">
              {/* Contact Options */}
              <div className="space-y-2">
                {/* Order by Phone Button */}
                <button 
                  onClick={() => handlePhoneContact(product)}
                  className="w-full flex items-center gap-3 bg-gray-50 p-4 text-gray-900 hover:bg-gray-100 transition-colors duration-200  cursor-pointer"
                >
                  <FiPhone size={18} />
                  <span className='text-[1.0625rem]'>Order by Phone +91-7738543881</span>
                </button>
                
                {/* WhatsApp Message Button */}
                <button 
                  onClick={() => handleWhatsAppContact(product)}
                  className="w-full flex items-center gap-0 bg-gray-50 p-4 text-gray-900 hover:bg-gray-100 transition-colors duration-200  cursor-pointer"
                >
                  <FaWhatsapp size={18} className="text-green-500" />
                  <span className='font-semibold text-[1.0625rem]'>Message us</span>
                </button>
                
                {/* Contact Advisor and Share Row */}
                <div className='flex gap-2'>
                  <button 
                    onClick={() => handleEmailContact(product)}
                    className="flex-1 text-[1.0625rem] bg-gray-50 p-4 text-gray-900 hover:bg-gray-100 transition-colors duration-200  cursor-pointer"
                  >
                    Contact a Client Advisor
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Product link copied to clipboard!');
                    }}
                    className='flex text-[1.0625rem] items-center gap-2 bg-gray-50 p-4 font-semibold text-gray-900 hover:bg-gray-100 transition-colors duration-200  cursor-pointer'
                  > 
                    <CiShare2 size={18} /> Share
                  </button>
                </div>
              </div>
              {product?.shippingInfo?.complementary && (
                <p className="text-[1.0625rem] text-green-700 font-medium">
                  ✓ Complimentary Express Delivery
                </p>
              )}
              
              <p className="text-[1.0625rem] text-gray-700">
                {product?.expectedDeliveryText || (
                  product?.shippingInfo?.maxDeliveryDays 
                    ? `Delivery in ${product.shippingInfo.minDeliveryDays || 3}-${product.shippingInfo.maxDeliveryDays} days`
                    : 'Free delivery available on orders above 500'
                )}
              </p>

              {product?.shippingInfo?.codAvailable && (
                <p className="text-[1.0625rem] text-gray-600">
                  ✓ Cash on Delivery available
                </p>
              )}

              {product?.shippingInfo?.note && (
                <p className="text-[1.0625rem] text-gray-500 italic">
                  {product.shippingInfo.note}
                </p>
              )}

              {/* Purchase limits */}
              {product?.purchaseLimitPerOrder > 0 && (
                <p className="text-[1.0625rem] text-orange-600">
                  Max {product.purchaseLimitPerOrder} per order
                </p>
              )}

              {product?.minOrderQty > 1 && (
                <p className="text-[1.0625rem] text-gray-600">
                  Minimum order: {product.minOrderQty} pieces
                </p>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Bottom: Accordion + Shipping info */}
        <div className="mt-15 grid grid-cols-1  gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <ProductAccordion product={product} />
          </div>
       
        </div>
     
      </div>
         <YouMayAlsoLike currentProduct={product} />
         <Explore currentProduct={product} />
             {/* <ProductReviews productId={product?._id || product?.id} /> */}
    </div>
  );
};

export default ProductDetails;















































// import React, { useEffect } from 'react'
// import ProductAccordion from '../../components/Products/ProductAccordion'
// import j2 from "../../assets/images/j.jpg";
// import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductBySlug } from '../../features/product/slice';
// import { addToCart } from '../../features/cart/slice';
// import { toggleWishlistItem } from '../../features/wishlist/slice';
// import { selectIsAuthenticated } from '../../features/auth/selectors';
// import { logout } from '../../features/auth/slice';
// import { selectIsProductInWishlist } from '../../features/wishlist/selectors';
// import { toast } from 'react-hot-toast';


// const ProductDetails = () => {
//   const {slug} = useParams()
//   const [searchParams] = useSearchParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
  
//   const productSlug = slug || searchParams.get('slug')
//   const productData = useSelector(state => state.product.bySlug[productSlug]);
//   const { data: product, status, error } = productData || {};
//   const isAuthenticated = useSelector(selectIsAuthenticated);
  
//   // Check if product is in wishlist
//   const productId = product?._id || product?.id;
//   const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));

//    useEffect(() => {
//     if (productSlug) {
//       dispatch(fetchProductBySlug(productSlug));
//     }
//   }, [dispatch, productSlug]);

//   const handleAddToCart = () => {
//     // Check authentication
//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }

//     // Prepare cart item data
//     const variant = product.variants?.[0];
//     const cartItem = {
//       productId: product._id || product.id,
//       variantId: variant?._id,
//       variantSku: variant?.sku,
//       quantity: 1
//     };

//     // Ensure we have either variantId or variantSku
//     if (!cartItem.variantId && !cartItem.variantSku) {
//       toast.error("Product variant information is missing");
//       return;
//     }

//     // Dispatch Redux action
//     dispatch(addToCart(cartItem))
//       .unwrap()
//       .then(() => {
//         toast.success("Item added to cart!");
//       })
//       .catch((error) => {
//         toast.error("Failed to add item to cart");
//         console.error("Add to cart error:", error);
//       });
//   };

//   const handleToggleWishlist = () => {
//     // Check authentication
//     if (!isAuthenticated) {
//       toast.error("Please login to manage wishlist");
//       navigate("/login");
//       return;
//     }

//     if (!productId) {
//       toast.error("Product information is missing");
//       return;
//     }

//     // Dispatch Redux action
//     dispatch(toggleWishlistItem(productId))
//       .unwrap()
//       .then((result) => {
//         if (result.action === "added") {
//           toast.success("Added to wishlist!");
//         } else if (result.action === "removed") {
//           toast.success("Removed from wishlist!");
//         }
//       })
//       .catch((error) => {
//         console.error("Wishlist error:", error);
//         if (error.message?.includes('Authentication failed') || error.message?.includes('login again')) {
//           toast.error("Session expired. Please login again.");
//           // Force logout to clear invalid session
//           dispatch(logout());
//           navigate("/login");
//         } else if (error.message?.includes('login') || error.message?.includes('401')) {
//           toast.error("Please login to manage wishlist");
//           navigate("/login");
//         } else {
//           toast.error("Failed to update wishlist");
//         }
//       });
//   };

//   if (status === 'loading') return <p className="p-4">Loading product details...</p>;
//   if (status === 'failed') return <p className="p-4 text-red-500">{error}</p>;
//   if (!product) return <p className="p-4">Product not found.</p>;

  
  
//   return (
    
//     <>
    
//     <div  className='w-full flex px-20 py-34  flex-col '>
//       <div className='flex justify-start  w-full items-center '>
//          <div className='w-[30vw] h-[35vw] bg-gray-200 self-start'>
//         <img className='h-full w-full object-cover' src={product?.heroImage?.url} alt="" />
//       </div>
//       <div className='w-[50vw] ml-5'>
        
//             <h3 className="text-3xl ">
//               {product?.name || 'Untitled Product'}
//             </h3>
//              <div className="text-3xl font-semibold my-2">₹{product?.variants[0]?.price || 'Price not available'}
// </div>
//             <p>(inclusive of GST)</p>

//             <h3>SKU: {product?.variants[0]?.sku || 'SKU not available'}</h3>
      
//       <div className='flex items-center justify-between '>
//         <h2 className='text-3xl font-medium   self-end '>Customize your jewellery Design</h2>
        
//                     <button className='btn-black uppercase'>Book an appointment</button>
//       </div>
//             <div className='flex justify-between mt-10'>
//             <button onClick={handleAddToCart}  className='btn-black w-fit'>ADD TO BAG </button>
//             <button onClick={() => navigate('/checkout')} className='btn w-fit'>BUY NOW </button>
//             <button 
//               onClick={handleToggleWishlist}
//               className={`btn w-1/2 ${
//                 isInWishlist 
//                   ? 'bg-red-700 text-white hover:bg-red-900' 
//                   : 'hover:bg-black hover:text-white'
//               }`}
//             >
//               {isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
//             </button>
//       </div>
//       <div className='mt-5'>
//         <h1 className='text-3xl font-semibold'>Product Description</h1>
//         <p className=''>
//         {product?.description || 'Description not available'}
//         </p>
//       </div>
//       </div>
//       </div>
//      <div className='flex w-full justify-between mt-10 items-start'>
//       <ProductAccordion />
//       <div className='self-start'>
//         <h5>
// <span className='font-semibold'>Order now:</span> Complimentary Express Delivery by {product?.shippingInfo?.maxDeliveryDays || 'Delivery time not available'} days</h5>

//       </div>
//       </div>
//     </div>
    
//     </>
//   )
// }

// export default ProductDetails