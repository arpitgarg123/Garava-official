import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { selectCartItems, selectCartTotalAmount } from '../features/cart/selectors';
import { selectIsAuthenticated, selectUser } from '../features/auth/selectors';
import { 
  selectIsPaymentProcessing, 
  selectPaymentError, 
  selectPaymentUrl,
  selectCurrentOrder,
  selectIsCreatingOrder
} from '../features/order/selectors';
import { selectAddressById } from '../features/address/selectors';
import { initiatePayment, clearPaymentError, clearCurrentOrder } from '../features/order/slice';
import { clearCart } from '../features/cart/slice';
import AddressSelector from '../components/AddressSelector';
import { calculateOrderPricing, formatCurrency } from '../utils/pricing';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redux state
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotalAmount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isProcessing = useSelector(selectIsPaymentProcessing);
  const isCreating = useSelector(selectIsCreatingOrder);
  const paymentError = useSelector(selectPaymentError);
  const paymentUrl = useSelector(selectPaymentUrl);
  const currentOrder = useSelector(selectCurrentOrder);

  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Get selected address from Redux
  const addressFromRedux = useSelector(state => 
    selectedAddressId ? selectAddressById(state, selectedAddressId) : null
  );

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
  }, [cartItems, navigate]);

  // Handle payment URL redirect
  useEffect(() => {
    if (paymentUrl && !isProcessingPayment) {
      setIsProcessingPayment(true);
      console.log('Redirecting to PhonePe payment URL:', paymentUrl);
      
      // Open payment URL in current window
      window.location.href = paymentUrl;
    }
  }, [paymentUrl, isProcessingPayment]);

  // Handle payment callback
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('orderId');
    const status = urlParams.get('status');
    
    if (orderId && status) {
      if (status === 'success') {
        // Clear cart and show success
        dispatch(clearCart());
        toast.success('Payment completed successfully!');
        navigate(`/orders/${orderId}`);
      } else if (status === 'failed') {
        toast.error('Payment failed. Please try again.');
        navigate('/cart');
      }
      
      // Clear current order state
      dispatch(clearCurrentOrder());
    }
  }, [location.search, dispatch, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearPaymentError());
    };
  }, [dispatch]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  const validateForm = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      // Prepare order data with address ID
      const orderData = {
        items: cartItems.map(item => ({
          variantId: item.variantId,
          sku: item.variantSku,
          quantity: item.quantity
        })),
        addressId: selectedAddressId, // Use address ID instead of full address
        paymentMethod
      };

      console.log('Placing order with data:', orderData);

      if (paymentMethod === 'phonepe') {
        // Initiate PhonePe payment
        dispatch(initiatePayment(orderData));
      } else if (paymentMethod === 'cod') {
        // Handle COD
        const result = await dispatch(initiatePayment(orderData)).unwrap();
        if (result.success) {
          dispatch(clearCart());
          toast.success('Order placed successfully!');
          navigate(`/orders/${result.order._id}`);
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order');
    }
  };

  const formatCurrency = (paise) => {
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selector */}
            <AddressSelector
              selectedAddressId={selectedAddressId}
              onAddressSelect={handleAddressSelect}
              onAddressChange={handleAddressChange}
            />

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="phonepe"
                    checked={paymentMethod === 'phonepe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-black focus:ring-black"
                  />
                  <span className="flex items-center space-x-2">
                    <span>PhonePe Payment Gateway</span>
                    <span className="text-xs text-gray-500">(Cards, UPI, Wallets)</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-black focus:ring-black"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={item._id || index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    {item.product?.heroImage ? (
                      <img
                        src={typeof item.product.heroImage === 'string' 
                          ? item.product.heroImage 
                          : item.product.heroImage.url}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.variantSku && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          SKU: {item.variantSku}
                        </span>
                      )}
                      {item.variant?.sizeLabel && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          Size: {item.variant.sizeLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency((item.unitPrice || 0) * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500">
                            {formatCurrency(item.unitPrice || 0)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              {(() => {
                const pricing = calculateOrderPricing(cartTotal, paymentMethod);
                
                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span className={pricing.breakdown.isFreeDelivery ? "text-green-600" : ""}>
                        {pricing.breakdown.isFreeDelivery ? "Free" : formatCurrency(pricing.deliveryCharge)}
                      </span>
                    </div>
                    
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between text-sm">
                        <span>COD Handling</span>
                        <span>{formatCurrency(pricing.codCharge)}</span>
                      </div>
                    )}
                    
                    {!pricing.breakdown.isFreeDelivery && (
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        Add {formatCurrency(pricing.breakdown.amountNeededForFreeDelivery)} more for free delivery
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(pricing.grandTotal)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Error Message */}
            {paymentError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{paymentError}</p>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || isCreating || isProcessingPayment}
              className="w-full mt-6 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing || isCreating || isProcessingPayment ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {paymentMethod === 'phonepe' ? 'Processing Payment...' : 'Placing Order...'}
                </span>
              ) : (
                `${paymentMethod === 'phonepe' ? 'Pay' : 'Place Order'} ${formatCurrency(calculateOrderPricing(cartTotal, paymentMethod).grandTotal)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;