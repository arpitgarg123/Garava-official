import { useState, useEffect } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectWishlistProducts, 
  selectIsWishlistLoading, 
  selectWishlistError,
  selectWishlistStatus,
  selectWishlistProductIds
} from '../features/wishlist/selectors';
import { 
  fetchWishlist, 
  removeFromWishlist 
} from '../features/wishlist/slice';
import { addToCart, fetchCart } from '../features/cart/slice';
import { selectIsAuthenticated } from '../features/auth/selectors';
import { toast } from 'react-hot-toast';
import { WishlistSkeleton } from '../components/ui/LoadingSkeleton';
import BackButton from '../components/BackButton';
import PageHeader from '../components/header/PageHeader';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const products = useSelector(selectWishlistProducts);
  const productIds = useSelector(selectWishlistProductIds);
  const isLoading = useSelector(selectIsWishlistLoading);
  const error = useSelector(selectWishlistError);
  const status = useSelector(selectWishlistStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch wishlist on component mount if needed
  useEffect(() => {
    if (isAuthenticated && (status === 'idle' || status === 'failed')) {
      dispatch(fetchWishlist({ force: false }));
    }
  }, [dispatch, isAuthenticated, status]);

  // Auto-refresh when wishlist items change from other components  
  useEffect(() => {
    if (isAuthenticated && status === 'succeeded') {
      // If we have productIds but fewer products (items added from other pages without product details)
      const productIdsCount = productIds.length;
      const productsCount = products.length;
      
      if (productIdsCount > productsCount && productIdsCount > 0) {
        console.log(`Wishlist page - Product count mismatch (${productsCount} products vs ${productIdsCount} IDs), fetching fresh data...`);
        dispatch(fetchWishlist({ force: true }));
      }
    }
  }, [dispatch, isAuthenticated, products.length, productIds.length, status]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => {
        toast.success("Removed from wishlist!");
        // No need to manually refresh - Redux state is already updated
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
      quantity: 1
    };

    // Set variant information - prioritize variantId over variantSku
    if (variant?._id) {
      cartItem.variantId = variant._id;
    } else if (variant?.sku) {
      cartItem.variantSku = variant.sku;
    }

    // Ensure we have either variantId or variantSku
    if (!cartItem.variantId && !cartItem.variantSku) {
      console.error("Missing variant information:", { product, variant });
      toast.error("Product variant information is missing. Please try again or contact support.");
      return;
    }

    console.log('Moving to cart:', { cartItem, product: product.name });

    // Add to cart
    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        // Remove from wishlist after successful cart addition
        dispatch(removeFromWishlist(wishlistItem.productId || product._id))
          .unwrap()
          .then(() => {
            // No need to manually refresh - Redux states are updated automatically
            navigate('/cart');
          })
          .catch((error) => {
            console.error("Remove from wishlist error:", error);
          });
      })
      .catch((error) => {
        // Show specific error message from the server
        const errorMessage = error.message || "Failed to add to cart";
        toast.error(errorMessage);
        console.error("Add to cart error:", error);
      });
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className=" min-h-[60vh] py-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
          <WishlistSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className=" min-h-[60vh] py-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
          <p className="text-center text-red-500">Error loading wishlist: {error}</p>
        </div>
      </div>
    );
  }

  return (
  <div className=" min-h-[60vh] mt-28 max-md:mt-0">
 <div className="sticky top-35 z-10 mb-3 max-md:top-7">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 max-md:py-0">
<PageHeader title="My Wishlist" />
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CiHeart size={60} className="text-gray-300" />
            <p className="text-gray-500">Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/products/jewellery')}
              className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item, index) => {
              const product = item.product;
              const productId = item.productId || product?._id;
              const productSlug = product?.slug || productId;
              const productPrice = product?.variants?.[0]?.price || product?.price || 0;
              
              // Check if product is out of stock
              const isOutOfStock = !product?.variants?.some(variant => 
                variant.isActive !== false && 
                (variant.stock || 0) > 0 && 
                variant.stockStatus !== 'out_of_stock'
              );
              
              // Better image URL handling
              const imageUrl = product?.heroImage?.url || 
                              product?.heroImage || 
                              product?.gallery?.[0]?.url || 
                              product?.gallery?.[0] || 
                              'https://via.placeholder.com/300x300?text=No+Image';
              
              // Debug image handling
              if (!product?.heroImage?.url && !product?.heroImage) {
                console.log('Product missing images:', {
                  productName: product?.name,
                  heroImage: product?.heroImage,
                  gallery: product?.gallery,
                  usingFallback: imageUrl
                });
              }
              
              return (
                <div key={productId || `wishlist-item-${index}`} className="p-4 space-y-3">
                  <div 
                    className="relative group cursor-pointer overflow-hidden " 
                    onClick={() => navigate(`/product_details/${productSlug}`)}
                  >
                    <img 
                      src={imageUrl}
                      alt={product?.name || 'Product'}
                      className="w-full aspect-square object-cover hover:scale-105  transition duration-300 bg-gray-200"
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-md font-medium text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" /> */}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">{product?.name || `Product ${productId}` || 'Unnamed Product'}</h3>
                    <p className="text-gray-600">{product?.type || 'Product'}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">₹{productPrice.toLocaleString()}</p>
                      {isOutOfStock && (
                        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={isLoading || isOutOfStock}
                      className={`px-4 py-2 text-sm transition cursor-pointer ${
                        isOutOfStock 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button
                      onClick={() => handleRemove(productId)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
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