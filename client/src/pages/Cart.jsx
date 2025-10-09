// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoBagHandleOutline } from 'react-icons/io5';
// import { RiDeleteBin6Line } from 'react-icons/ri';

// const Cart = ({ items = [], onUpdateQuantity, onRemoveItem }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white min-h-[60vh]">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

//         {items.length === 0 ? (
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <IoBagHandleOutline size={60} className="text-gray-300" />
//             <p className="text-gray-500">Your cart is empty</p>
//             <button 
//               onClick={() => navigate('/jewellery')}
//               className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               {items.map((item) => (
//                 <div key={item._id} className="flex border-b py-4 space-x-4">
//                   <img 
//                     src={item.heroImage} 
//                     alt={item.name}
//                     className="w-24 h-24 object-cover"
//                   />
//                   <div className="flex-1 space-y-2">
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-500">{item.variantSku}</p>
//                     <div className="flex items-center space-x-4">
//                       <select 
//                         value={item.quantity}
//                         onChange={(e) => onUpdateQuantity(item._id, Number(e.target.value))}
//                         className="border p-1"
//                       >
//                         {[1,2,3,4,5].map(num => (
//                           <option key={num} value={num}>{num}</option>
//                         ))}
//                       </select>
//                       <button
//                         onClick={() => onRemoveItem(item._id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <RiDeleteBin6Line size={20} />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold">₹{item.unitPrice}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="lg:col-span-1">
//               <div className="border p-6 space-y-4">
//                 <h3 className="text-lg font-semibold">Order Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>₹{items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>Free</span>
//                   </div>
//                   <div className="border-t pt-2 font-semibold flex justify-between">
//                     <span>Total</span>
//                     <span>₹{items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)}</span>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => navigate('/checkout')}
//                   className="w-full bg-black text-white py-3 hover:bg-gray-800 transition"
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBagHandleOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, selectIsCartLoading } from '../features/cart/selectors';
import { updateCartItem, removeFromCart, updateGuestCartItem, removeFromGuestCart, loadGuestCart, fetchCart } from '../features/cart/slice';
import { selectIsAuthenticated } from '../features/auth/selectors';
import { toast } from 'react-hot-toast';
import { CartSkeleton } from '../components/ui/LoadingSkeleton';
import formatCurrency from '../utils/pricing';
import BackButton from '../components/BackButton';
import PageHeader from '../components/header/PageHeader';


const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux selectors
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isLoading = useSelector(selectIsCartLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isGuest = useSelector(state => state.cart.isGuest);
  const cartStatus = useSelector(state => state.cart.status);
  
  // Load cart data on component mount
  useEffect(() => {
    if (isAuthenticated && (cartStatus === 'idle' || cartStatus === 'failed')) {
      dispatch(fetchCart({ force: false }));
    } else if (!isAuthenticated && cartStatus === 'idle') {
      // Load guest cart if not authenticated
      dispatch(loadGuestCart());
    }
  }, [dispatch, isAuthenticated, cartStatus]);
  
  // Cart calculations handled by backend pricing service

  const handleUpdateQuantity = (itemId, newQuantity) => {
    // Find the cart item to get productId and variantId
    const cartItem = cartItems.find(item => item._id === itemId);
    if (!cartItem) {
      toast.error("Cart item not found");
      return;
    }
    
    const updateAction = isAuthenticated ? updateCartItem : updateGuestCartItem;
    const payload = isAuthenticated ? {
      productId: cartItem.product,
      variantId: cartItem.variantId,
      variantSku: cartItem.variantSku,
      quantity: newQuantity 
    } : {
      itemId,
      quantity: newQuantity
    };
    
    dispatch(updateAction(payload))
    .unwrap()
    .then(() => {
      toast.success("Cart updated");
    })
    .catch((error) => {
      toast.error("Failed to update cart");
      console.error("Update cart error:", error);
    });
  };

  const handleRemoveItem = (itemId) => {
    // Find the cart item to get productId and variantId
    const cartItem = cartItems.find(item => item._id === itemId);
    if (!cartItem) {
      toast.error("Cart item not found");
      return;
    }
    
    const removeAction = isAuthenticated ? removeFromCart : removeFromGuestCart;
    const payload = isAuthenticated ? {
      productId: cartItem.product,
      variantId: cartItem.variantId,
      variantSku: cartItem.variantSku
    } : itemId;
    
    dispatch(removeAction(payload))
    .unwrap()
    .then(() => {
      toast.success("Item removed from cart");
    })
    .catch((error) => {
      toast.error("Failed to remove item");
      console.error("Remove from cart error:", error);
    });
  };

  const calculateTotal = () => {
    // Use backend calculated total (in rupees) or calculate manually as fallback
    return cartTotal || cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className=" min-h-[60vh] p-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageHeader title="Shopping Cart" />
          <CartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] mt-30 max-md:mt-0">
       <div className="sticky top-30 z-50 max-md:top-7">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto px-4">
          <PageHeader title="Shopping Cart" />

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 mt-20">
            <IoBagHandleOutline size={60} className="text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <button 
              onClick={() => navigate('/jewellery')}
              className="btn-black"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item, index) => {
                // Handle image URL for both authenticated and guest users
                // Backend structure: heroImage: {url, fileId}, gallery: [{url, fileId}]
                let imageUrl = '/placeholder.jpg';
                
                // For authenticated users (backend structure)
                if (item.heroImage?.url) {
                  imageUrl = item.heroImage.url;
                } else if (typeof item.heroImage === 'string') {
                  imageUrl = item.heroImage;
                } 
                // For guest users (productDetails structure)
                else if (item.productDetails?.heroImage?.url) {
                  imageUrl = item.productDetails.heroImage.url;
                } else if (typeof item.productDetails?.heroImage === 'string') {
                  imageUrl = item.productDetails.heroImage;
                } else if (item.productDetails?.gallery?.[0]?.url) {
                  imageUrl = item.productDetails.gallery[0].url;
                } else if (typeof item.productDetails?.gallery?.[0] === 'string') {
                  imageUrl = item.productDetails.gallery[0];
                } else if (item.productDetails?.images?.[0]?.url) {
                  imageUrl = item.productDetails.images[0].url;
                } else if (typeof item.productDetails?.images?.[0] === 'string') {
                  imageUrl = item.productDetails.images[0];
                } else if (item.image) {
                  imageUrl = item.image;
                }
                
                // Handle product name for both authenticated and guest users  
                const productName = item.name || item.productDetails?.name || 'Product';
                
                return (
                <div key={item._id || `cart-item-${index}`} className="flex border-b py-4 space-x-4">
                  <img 
                    src={imageUrl} 
                    alt={productName}
                    className="w-24 h-24 object-cover relative z-0 bg-gray-200"
                    style={{ display: 'block', minWidth: '96px', minHeight: '96px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium">{productName}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.variantSku || 'N/A'}</p>
                    {/* Display selected color information */}
                    {(item.selectedColor || item.productDetails?.selectedColor || item.color) && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Color:</span>
                        {(item.selectedColor || item.productDetails?.selectedColor) ? (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300" 
                              style={{ backgroundColor: (item.selectedColor || item.productDetails?.selectedColor)?.hexColor }}
                              title={(item.selectedColor || item.productDetails?.selectedColor)?.name}
                            />
                            <span className="text-sm text-gray-700">
                              {(item.selectedColor || item.productDetails?.selectedColor)?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-700">{item.color}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <select 
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item._id, Number(e.target.value))}
                        className="border p-1"
                        disabled={isLoading}
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={`${item._id}-qty-${num}`} value={num}>{num}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.unitPrice || 0).toLocaleString()}</p>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="border p-6 space-y-4 sticky top-24">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-2">
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COD Charge</span>
                      <span>—</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>—</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>—</span>
                    </div>
                    <div className="border-t pt-2 font-semibold flex justify-between">
                      <span>Total</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                  </>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;