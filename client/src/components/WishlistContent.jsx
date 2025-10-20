import { useState, useEffect } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { selectWishlistProducts, selectWishlistLoading } from '../features/wishlist/selectors';
import { removeFromWishlist } from '../features/wishlist/slice';
import { addToCart } from '../features/cart/slice';
import { selectIsAuthenticated } from '../features/auth/selectors';

const WishlistContent = ({ compact = false, maxItems = null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectWishlistProducts);
  const loading = useSelector(selectWishlistLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleRemoveItem = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleMoveToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage cart");
      navigate("/login");
      return;
    }

    // Find the product in wishlist
    const wishlistItem = products.find(item => item.productId === productId);
    if (!wishlistItem || !wishlistItem.product) {
      toast.error("Product information not found");
      return;
    }

    const product = wishlistItem.product;
    
    // Check if product is out of stock
    const isOutOfStock = product.isOutOfStock || 
      (product.totalStock !== undefined && product.totalStock === 0) ||
      (product.defaultVariant && product.defaultVariant.stock === 0) ||
      (product.variants && product.variants.length > 0 && product.variants.every(v => v.stock === 0));

    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    try {
      // Prepare cart item data
      const variant = product.variants?.[0] || product.defaultVariant;
      const cartItem = {
        productId: product._id || product.id || productId,
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
      await dispatch(addToCart(cartItem)).unwrap();
      
      // Remove from wishlist after successful cart addition
      await dispatch(removeFromWishlist(productId)).unwrap();
      
      toast.success("Item moved to cart!");
    } catch (error) {
      console.error("Move to cart error:", error);
      if (error.message?.includes('Insufficient stock')) {
        toast.error(error.message);
      } else {
        toast.error("Failed to move item to cart");
      }
    }
  };

  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  if (loading) {
    return (
      <div className={`grid grid-cols-2 ${compact ? 'gap-2' : 'lg:grid-cols-4 gap-3'}`}>
        {Array.from({ length: compact ? 2 : 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-50 rounded" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CiHeart size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Your wishlist is empty</p>
        {!compact && (
          <button 
            onClick={() => navigate('/jewellery')}
            className="mt-3 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"
          >
            Start Shopping
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={`grid grid-cols-2 ${compact ? 'gap-3' : 'lg:grid-cols-4 gap-4'}`}>
        {displayProducts.map((item) => {
          const product = item.product;
          const productId = item.productId || item._id;
          
          // Check out-of-stock status
          const isOutOfStock = product?.isOutOfStock || 
            (product?.totalStock !== undefined && product.totalStock === 0) ||
            (product?.defaultVariant && product.defaultVariant.stock === 0) ||
            (product?.variants && product.variants.length > 0 && product.variants.every(v => v.stock === 0));

          // Price calculation following project conventions (prices are already in rupees from backend)
          const price = product?.defaultVariant?.price ?? 
                       product?.variants?.[0]?.price ?? 
                       product?.priceRange?.min ?? 
                       product?.price ?? 
                       0;

          return (
            <div key={productId} className="group  overflow-hidden px-8 hover:shadow-sm transition">
              <div 
                className="relative cursor-pointer" 
                onClick={() => navigate(`/product_details/${product?.slug || productId}`)}
              >
                <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} bg-gray-50 overflow-hidden`}>
                  <img 
                    src={product?.heroImage?.url || product?.heroImage || '/placeholder.jpg'} 
                    alt={product?.name || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = '/vite.svg';
                    }}
                  />
                  
                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(productId);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                  title="Remove from wishlist"
                >
                  <CiHeart className="w-4 h-4 text-red-500 fill-current" />
                </button>
              </div>
              
              <div className={`${compact ? 'p-2' : 'p-3'} space-y-1`}>
                <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-1`}>
                  {product?.name || 'Product Name'}
                </h3>
                <p className={`text-gray-500 my-2 uppercase tracking-wide ${compact ? 'text-sm' : 'text-sm'}`}>
                  {product?.type || product?.category || 'Product'}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                    ₹{price.toLocaleString()}
                  </p>
                  {isOutOfStock && (
                    <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                  )}
                </div>
                
                {!compact && (
                  <div className="flex gap-1 pt-1">
                    <button 
                      onClick={() => handleMoveToCart(productId)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-1.5 px-2 text-sm rounded transition ${
                        isOutOfStock 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(productId)}
                      className="px-2 py-1.5 border text-sm rounded hover:bg-gray-50"
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {compact && maxItems && products.length > maxItems && (
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/wishlist")} 
            className="text-sm text-black hover:underline"
          >
            View all {products.length} items →
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistContent;