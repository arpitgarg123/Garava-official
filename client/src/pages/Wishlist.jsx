import { useState, useEffect } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectWishlistProducts, 
  selectIsWishlistLoading, 
  selectWishlistError 
} from '../features/wishlist/selectors';
import { 
  fetchWishlist, 
  removeFromWishlist 
} from '../features/wishlist/slice';
import { addToCart } from '../features/cart/slice';
import { selectIsAuthenticated } from '../features/auth/selectors';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const products = useSelector(selectWishlistProducts);
  const isLoading = useSelector(selectIsWishlistLoading);
  const error = useSelector(selectWishlistError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch wishlist on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => {
        toast.success("Removed from wishlist!");
      })
      .catch((error) => {
        toast.error("Failed to remove from wishlist");
        console.error("Remove wishlist error:", error);
      });
  };

  const handleMoveToCart = (wishlistItem) => {
    const product = wishlistItem.product;
    if (!product) {
      toast.error("Product information is missing");
      return;
    }

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

    // Add to cart
    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        // Remove from wishlist after successful cart addition
        handleRemove(wishlistItem.productId || product._id);
        navigate('/cart');
      })
      .catch((error) => {
        toast.error("Failed to add to cart");
        console.error("Add to cart error:", error);
      });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-[60vh] py-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
          <p className="text-center">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white min-h-[60vh] py-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
          <p className="text-center text-red-500">Error loading wishlist: {error}</p>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-white min-h-[60vh] py-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CiHeart size={60} className="text-gray-300" />
            <p className="text-gray-500">Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/jewellery')}
              className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => {
              const product = item.product;
              const productId = item.productId || product?._id;
              const productSlug = product?.slug || productId;
              const productPrice = product?.variants?.[0]?.price || product?.price || 0;
              
              return (
                <div key={productId} className="p-4 space-y-3">
                  <div 
                    className="relative group cursor-pointer" 
                    onClick={() => navigate(`/product_details/${productSlug}`)}
                  >
                    <img 
                      src={product?.heroImage?.url || product?.heroImage || '/placeholder.jpg'} 
                      alt={product?.name || 'Product'}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{product?.name || 'Unnamed Product'}</h3>
                    <p className="text-gray-600">{product?.type || 'Product'}</p>
                    <p className="font-semibold">₹{productPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition"
                      disabled={isLoading}
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(productId)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;