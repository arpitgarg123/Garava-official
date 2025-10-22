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
import formatCurrency, { CHARGES } from '../utils/pricing';
import BackButton from '../components/BackButton';
import PageHeader from '../components/header/PageHeader';

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

  // Clear current order when payment method changes to update pricing display
  useEffect(() => {
    if (currentOrder) {
      dispatch(clearCurrentOrder());
    }
  }, [paymentMethod]);

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
          variantSku: item.variantSku, // Use variantSku to match cart model
          quantity: item.quantity
        })),
        addressId: selectedAddressId, // Use address ID instead of full address
        paymentMethod
      };

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

  // Use formatCurrency from utils (assume rupees from backend)

  if (!isAuthenticated || cartItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen  py-8 max-sm:py-0">
      <div className="max-w-7xl mx-auto mt-1  px-4 ">
 <div className="sticky top-20 z-10 mb-3 max-md:top-5 max-sm:top-26">
    <BackButton />
  </div>
  <PageHeader title="Checkout" />        
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
            <div className=" p-6 ">
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
                    <span className="text-[1.0625rem] text-gray-500">(Cards, UPI, Wallets)</span>
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
          <div className=" p-6  h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={item._id || index} className="flex items-start space-x-3 p-3 ">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-50  overflow-hidden">
                    {item.product?.heroImage ? (
                      <img
                        src={typeof item.product.heroImage === 'string' 
                          ? item.product.heroImage 
                          : item.product.heroImage.url}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-[1.0625rem]">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[1.0625rem] font-medium text-gray-900 truncate">
                      {item.product?.name || 'Product'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.variantSku && (
                        <span className="text-[1.0625rem] text-gray-500 px-2 py-1 ">
                          SKU: {item.variantSku}
                        </span>
                      )}
                      {item.variant?.sizeLabel && (
                        <span className="text-[1.0625rem] text-gray-500 px-2 py-1 ">
                          Size: {item.variant.sizeLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[1.0625rem] text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <div className="text-right">
                        <div className="text-[1.0625rem] font-medium text-gray-900">
                          {formatCurrency((item.unitPrice || 0) * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[1.0625rem] text-gray-500">
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
              {currentOrder ? (
                <>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(currentOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Delivery</span>
                    <span>{currentOrder.shippingTotal === 0 ? "Free" : formatCurrency(currentOrder.shippingTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>COD Charge</span>
                    <span>{currentOrder.codCharge > 0 ? formatCurrency(currentOrder.codCharge) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Discount</span>
                    <span>{currentOrder.discountTotal > 0 ? `- ${formatCurrency(currentOrder.discountTotal)}` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Tax</span>
                    <span>{currentOrder.taxTotal > 0 ? formatCurrency(currentOrder.taxTotal) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(currentOrder.grandTotal)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Delivery</span>
                    <span>{cartTotal >= CHARGES.FREE_DELIVERY_THRESHOLD ? "Free" : formatCurrency(CHARGES.DELIVERY_CHARGE)}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-[1.0625rem]">
                      <span>COD Charge</span>
                      <span>{formatCurrency(CHARGES.COD_HANDLING_FEE)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Discount</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between text-[1.0625rem]">
                    <span>Tax</span>
                    <span>—</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal + (cartTotal >= CHARGES.FREE_DELIVERY_THRESHOLD ? 0 : CHARGES.DELIVERY_CHARGE) + (paymentMethod === 'cod' ? CHARGES.COD_HANDLING_FEE : 0))}</span>
                  </div>
                </>
              )}
            </div>

            {/* Error Message */}
            {paymentError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 ">
                <p className="text-red-800 text-[1.0625rem]">{paymentError}</p>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || isCreating || isProcessingPayment}
              className="btn-black mt-3 w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                `${paymentMethod === 'phonepe' ? 'Pay' : 'Place Order'} ${formatCurrency(
                  currentOrder?.grandTotal ?? 
                  (cartTotal + (cartTotal >= CHARGES.FREE_DELIVERY_THRESHOLD ? 0 : CHARGES.DELIVERY_CHARGE) + (paymentMethod === 'cod' ? CHARGES.COD_HANDLING_FEE : 0))
                )}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;