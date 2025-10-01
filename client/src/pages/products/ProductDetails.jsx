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

import React, { useEffect } from 'react';
import ProductAccordion from '../../components/Products/ProductAccordion';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug } from '../../features/product/slice';
import { addToCart } from '../../features/cart/slice';
import { toggleWishlistItem } from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/auth/selectors';
import { logout } from '../../features/auth/slice';
import { selectIsProductInWishlist } from '../../features/wishlist/selectors';
import { toast } from 'react-hot-toast';
import Recommendation from '../../components/recommendation/Recommendation';
import BackButton from '../../components/BackButton';
import ProductGallery from '../../components/Products/ProductGallery';

const ProductDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productSlug = slug || searchParams.get('slug');
  const productData = useSelector(state => state.product.bySlug[productSlug]);
  const { data: product, status, error } = productData || {};
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const productId = product?._id || product?.id;
  const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));

  useEffect(() => {
    if (productSlug) dispatch(fetchProductBySlug(productSlug));
  }, [dispatch, productSlug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    const variant = product?.variants?.[0] || product?.defaultVariant;
    const cartItem = {
      productId: product?._id || product?.id,
      variantId: variant?._id,
      variantSku: variant?.sku,
      quantity: 1,
    };
    if (!cartItem.variantId && !cartItem.variantSku) {
      toast.error("Product variant information is missing");
      return;
    }
    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => toast.success("Item added to cart!"))
      .catch((e) => {
        console.error(e);
        toast.error("Failed to add item to cart");
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
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {product?.name || 'Untitled Product'}
            </h1>

            <div className="mt-2 text-2xl font-semibold">
              ₹{product?.variants?.[0]?.price ?? product?.defaultVariant?.price ?? 'Price not available'}
            </div>
            <p className="text-sm text-gray-600 mt-1">(inclusive of GST)</p>

            <p className="mt-2 text-sm text-gray-700">
              <span className="font-medium">SKU:</span>{" "}
              {product?.variants?.[0]?.sku || product?.defaultVariant?.sku || 'SKU not available'}
            </p>

            <div className=" flex flex-col gap-3 max-sm:mt-3 h-16 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg sm:text-xl font-regular">
                Customize your jewellery Design
              </h2>
              <button className="btn-black uppercase text-sm max-sm: my-2 tracking-wider w-full sm:w-auto">
                Book an appointment
              </button>
            </div>

  {/* Description */}
            <div className="mt-5 ">
              <h3 className="text-xl sm:text-2xl font-semibold">Product Description</h3>
              <p className="mt-2 text-gray-800 leading-relaxed">
                {product?.description || 'Description not available'}
              </p>
            </div>
            {/* Action buttons */}
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <button onClick={handleAddToCart} className="btn-black w-full  sm:w-auto">
                ADD TO BAG
              </button>
              <button onClick={() => navigate('/checkout')} className="btn w-full sm:w-auto">
                BUY NOW
              </button>
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
    </div>
  );
};

export default ProductDetails;
