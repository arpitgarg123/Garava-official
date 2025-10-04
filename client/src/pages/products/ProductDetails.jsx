import React, { useEffect, useState } from 'react';
import ProductAccordion from '../../components/Products/ProductAccordion';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug } from '../../features/product/slice';
import { addToCart } from '../../features/cart/slice';
import { toggleWishlistItem } from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/auth/selectors';
import { logout } from '../../features/auth/slice';
import { FiPhone, FiMail, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { handleEmailContact, handleWhatsAppContact } from '../../hooks/contact';

import { selectIsProductInWishlist } from '../../features/wishlist/selectors';
import { toast } from 'react-hot-toast';
import Recommendation from '../../components/recommendation/Recommendation';
import BackButton from '../../components/BackButton';
import ProductGallery from '../../components/Products/ProductGallery';
import ProductReviews from '../../components/Products/ProductReviews';

const ProductDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const productSlug = slug || searchParams.get('slug');
  const productData = useSelector(state => state.product.bySlug[productSlug]);
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

  // Check out-of-stock status
  // Find the default variant or use the first variant
  // Handle both product list structure (with defaultVariant) and product details structure (with variants array)
  // Select variant - prefer one with stock if available
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

  // Debug logging (temporary)
  useEffect(() => {
    if (product && selectedVariant) {
      console.log('=== STOCK DEBUG ===');
      console.log('Product:', product.name);
      console.log('Product isOutOfStock:', product.isOutOfStock);
      console.log('Selected variant:', { 
        sku: selectedVariant.sku, 
        hasId: !!(selectedVariant._id || selectedVariant.id),
        stock: selectedVariant.stock,
        stockStatus: selectedVariant.stockStatus
      });
      console.log('isVariantOutOfStock:', isVariantOutOfStock);
      console.log('Final isOutOfStock:', isOutOfStock);
      console.log('=================');
    }
  }, [product, selectedVariant, isVariantOutOfStock, isOutOfStock]);

  useEffect(() => {
    if (productSlug) dispatch(fetchProductBySlug(productSlug));
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
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    // Validate selected variant
    if (!selectedVariant) {
      console.error('No product variant available. Product variants:', product?.variants);
      toast.error("No product variant available");
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
    
    console.log('Variant details:', { 
      variantId, 
      variantSku, 
      hasId: !!variantId, 
      hasSku: !!variantSku 
    });
    
    console.log('Adding to cart:', {
      productId: product?._id,
      variantSku: variantSku,
      quantity: 1
    });
    
    // Send only variantSku, let backend find the variant and use its _id
    const cartItem = {
      productId: product?._id || product?.id,
      variantSku: variantSku,
      quantity: 1,
    };
    
    // Only include variantId if we actually have it
    if (variantId) {
      cartItem.variantId = variantId;
    }
    
    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => toast.success("Item added to cart!"))
      .catch((e) => {
        console.error(e);
        if (e.message?.includes('Insufficient stock')) {
          toast.error(e.message);
        } else {
          toast.error("Failed to add item to cart");
        }
      });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    if (!productId) {
      toast.error("Product information is missing");
      return;
    }
    dispatch(toggleWishlistItem(productId))
      .unwrap()
      .then((result) => {
        if (result.action === "added") toast.success("Added to wishlist!");
        else if (result.action === "removed") toast.success("Removed from wishlist!");
      })
      .catch((err) => {
        console.error("Wishlist error:", err);
        if (err.message?.includes('Authentication failed') || err.message?.includes('login again')) {
          toast.error("Session expired. Please login again.");
          dispatch(logout());
          navigate("/login");
        } else if (err.message?.includes('login') || err.message?.includes('401')) {
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
    <div className="w-full py-10 mt-26 sm:py-12 max-sm:mt-0">
       <div className="sticky top-16 z-10 mb-3">
    <BackButton />
  </div>
      <div className="mx-auto w-[95%] max-w-7xl px-4 sm:px-6 lg:px-8">
  
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
   
          <div className="lg:col-span-5">
            {/* <div className="w-full overflow-hidden bg-gray-100">
              <img
                src={heroSrc}
                alt={product?.name || "Product image"}
                className="w-full h-auto object-cover"
              />
            </div> */}
            <ProductGallery product={product} />
          </div>

          {/* Info */}
          <div className="lg:col-span-7">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {product?.name || 'Untitled Product'}
            </h1>

            {/* Price Display - Different for High Jewellery */}
            {isHighJewellery ? (
              <div className="mt-2">
                <div className="text-2xl font-playfair font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Price on Demand
                </div>
                <p className="text-sm text-gray-600 mt-1">Contact us for pricing details</p>
              </div>
            ) : (
              <div className="mt-2">
                <div className="text-2xl font-playfair font-semibold">
                  ₹{selectedVariant?.price ?? 'Price not available'}
                </div>
                <p className="text-sm text-gray-600 mt-1">(inclusive of GST)</p>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="mt-2 flex items-center gap-3 ">
              {isOutOfStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              )}

            </div>

            <p className="mt-2 text-sm text-gray-700">
              <span className="font-medium">SKU:</span>{" "}
              {selectedVariant?.sku || 'SKU not available'}
            </p>

            <div className=" flex flex-col gap-3 max-sm:mt-3 h-16 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-md sm:text-lg font-regular">
                Customize your jewellery Design
              </h2>
             <Link to='/appointment'>
              <button className="btn-black uppercase text-sm max-sm: my-2 tracking-wider w-full sm:w-auto">
                Book an appointment
              </button>
              </Link>
            </div>

  {/* Description */}
            <div className="mt-5 ">
              <h3 className="text-lg sm:text-xl font-semibold">Product Description</h3>
              <p className="mt-2 text-gray-800 text-xs leading-relaxed">
                {product?.description || 'Description not available'}
              </p>
            </div>
            {/* Action buttons - Different for High Jewellery */}
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {isHighJewellery ? (
                // High Jewellery Contact Options
                <div className="relative w-full sm:w-auto">
                  <button 
                    onClick={() => setShowContactOptions(!showContactOptions)}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-medium rounded-lg hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
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
                      <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                        <button
                          onClick={() => handleWhatsAppContact(product, setShowContactOptions)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-green-50 transition-colors border-b border-gray-100"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <FiPhone className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">WhatsApp</div>
                            <div className="text-xs text-gray-500">Instant messaging for quick response</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handleEmailContact(product, setShowContactOptions)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiMail className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Email</div>
                            <div className="text-xs text-gray-500">Detailed inquiry with specifications</div>
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
                    disabled={isOutOfStock}
                    className={`w-full sm:w-auto px-6 py-3  text-sm font-medium transition-colors ${
                      isOutOfStock 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'btn-black'
                    }`}
                  >
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                  </button>
                  <button 
                    onClick={() => navigate('/checkout')} 
                    disabled={isOutOfStock}
                    className={`w-full sm:w-auto px-6 py-3 text-sm  font-medium transition-colors ${
                      isOutOfStock 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'btn'
                    }`}
                  >
                    BUY NOW
                  </button>
                </>
              )}
              <button
                onClick={handleToggleWishlist}
                className={`btn w-full sm:flex-1 ${
                  isInWishlist
                    ? 'bg-red-700 text-white hover:bg-red-900'
                    : 'hover:bg-black hover:text-white'
                }`}
              >
                {isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

          
          </div>
        </div>

        {/* Bottom: Accordion + Shipping info */}
        <div className="mt-18 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <ProductAccordion />
          </div>
          <div className="lg:col-span-4">
            <h5 className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold">Order now:</span>{" "}
              Complimentary Express Delivery by{" "}
              {product?.shippingInfo?.maxDeliveryDays || 'Delivery time not available'} days
            </h5>
          </div>
        </div>
     
      </div>
         <Recommendation />
             <ProductReviews productId={product?._id || product?.id} />

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
//   console.log(product);
  
  
//   return (
    
//     <>
    
//     <div  className='w-full flex px-20 py-34  flex-col '>
//       <div className='flex justify-start  w-full items-center '>
//          <div className='w-[30vw] h-[35vw] bg-gray-200 self-start'>
//         <img className='h-full w-full object-cover' src={product?.heroImage?.url} alt="" />
//       </div>
//       <div className='w-[50vw] ml-5'>
        
//             <h3 className="text-2xl ">
//               {product?.name || 'Untitled Product'}
//             </h3>
//              <div className="text-2xl font-semibold my-2">₹{product?.variants[0]?.price || 'Price not available'}
// </div>
//             <p>(inclusive of GST)</p>

//             <h3>SKU: {product?.variants[0]?.sku || 'SKU not available'}</h3>
      
//       <div className='flex items-center justify-between '>
//         <h2 className='text-2xl font-medium   self-end '>Customize your jewellery Design</h2>
        
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
//         <h1 className='text-2xl font-semibold'>Product Description</h1>
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