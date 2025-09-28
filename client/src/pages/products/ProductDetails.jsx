import React, { useEffect } from 'react'
import ProductAccordion from '../../components/Products/ProductAccordion'
import j2 from "../../assets/images/j.jpg";
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug } from '../../features/product/slice';
import { addToCart } from '../../features/cart/slice';
import { toggleWishlistItem } from '../../features/wishlist/slice';
import { selectIsAuthenticated } from '../../features/auth/selectors';
import { logout } from '../../features/auth/slice';
import { selectIsProductInWishlist } from '../../features/wishlist/selectors';
import { toast } from 'react-hot-toast';


const ProductDetails = () => {
  const {slug} = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const productSlug = slug || searchParams.get('slug')
  const productData = useSelector(state => state.product.bySlug[productSlug]);
  const { data: product, status, error } = productData || {};
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Check if product is in wishlist
  const productId = product?._id || product?.id;
  const isInWishlist = useSelector(state => selectIsProductInWishlist(state, productId));

   useEffect(() => {
    if (productSlug) {
      dispatch(fetchProductBySlug(productSlug));
    }
  }, [dispatch, productSlug]);

  const handleAddToCart = () => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    // Prepare cart item data
    const variant = product.variants?.[0];
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
  };

  const handleToggleWishlist = () => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (!productId) {
      toast.error("Product information is missing");
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
  };

  if (status === 'loading') return <p className="p-4">Loading product details...</p>;
  if (status === 'failed') return <p className="p-4 text-red-500">{error}</p>;
  if (!product) return <p className="p-4">Product not found.</p>;
  console.log(product);
  
  
  return (
    
    <>
    
    <div  className='w-full flex px-20 py-34  flex-col '>
      <div className='flex justify-start  w-full items-center '>
         <div className='w-[30vw] h-[35vw] bg-gray-200 self-start'>
        <img className='h-full w-full object-cover' src={product?.heroImage?.url} alt="" />
      </div>
      <div className='w-[50vw] ml-5'>
        
            <h3 className="text-2xl ">
              {product?.name || 'Untitled Product'}
            </h3>
             <div className="text-2xl font-semibold my-2">₹{product?.variants[0]?.price || 'Price not available'}
</div>
            <p>(inclusive of GST)</p>

            <h3>SKU: {product?.variants[0]?.sku || 'SKU not available'}</h3>
            <div className='flex justify-between'>
            <button onClick={handleAddToCart}  className='bg-black text-white w-1/2 py-2 tracking-widest mt-5 hover:bg-transparent hover:text-black transition duration-300 border'>ADD TO BAG </button>
            <button onClick={() => navigate('/checkout')} className='border w-1/2 py-2 tracking-widest mt-5 hover:bg-black hover:text-white transition duration-300'>BUY NOW </button>
            <button 
              onClick={handleToggleWishlist}
              className={`border w-1/3 py-2 tracking-widest mt-5 transition duration-300 ${
                isInWishlist 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'hover:bg-black hover:text-white'
              }`}
            >
              {isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
            </button>
      </div>
      <div className='flex items-center justify-between  mt-12'>
        <h2 className='text-2xl font-medium   self-end '>Customize your jewellery Design</h2>
        
                    <button className='bg-black text-white w-1/3 py-2 tracking-widest mt-5 hover:bg-transparent hover:text-black transition duration-300 border uppercase'>Book an appointment</button>
      </div>
      <div className='mt-5'>
        <h1 className='text-2xl font-semibold'>Product Description</h1>
        <p className=''>
        {product?.description || 'Description not available'}
        </p>
      </div>
      </div>
      </div>
     <div className='flex w-full justify-between mt-10 items-start'>
      <ProductAccordion />
      <div className='self-start'>
        <h5>
<span className='font-semibold'>Order now:</span> Complimentary Express Delivery by {product?.shippingInfo?.maxDeliveryDays || 'Delivery time not available'} days</h5>

      </div>
      </div>
    </div>
    
    </>
  )
}

export default ProductDetails