import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkPaymentStatus } from '../features/order/api';
import { clearCart } from '../features/cart/slice';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const orderId = searchParams.get('orderId');
  const txnId = searchParams.get('txn');
  const status = searchParams.get('status'); // for direct success/failure calls

  const MAX_RETRIES = 6; // Reduced max retries to avoid rate limiting
  const RETRY_INTERVALS = [2, 4, 6, 10, 15, 20]; // Progressive delay in seconds

  useEffect(() => {
    if (!orderId) {
      setError('Invalid payment link');
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await checkPaymentStatus(orderId);

        
        // Response is already the data object from the API
        const orderData = response.order;
        
        setOrderDetails(orderData);
        
        // Check if payment is completed - Multiple success conditions
        const isPaymentCompleted = 
          // API indicates completed payment
          response.paymentStatus === 'completed' ||
          // Payment object shows paid status
          orderData?.payment?.status === 'paid' || 
          // Order status shows processing (means payment successful)
          orderData?.status === 'processing' ||
          // Order status is any post-payment status
          ['paid', 'processing', 'partially_shipped', 'shipped', 'delivered'].includes(orderData?.status);
        
        if (isPaymentCompleted) {
          setOrderStatus('success');
          // Clear the cart after successful payment
          dispatch(clearCart());
          setLoading(false);
          return;
        } 
        
        // Check for explicit failure
        if (orderData?.payment?.status === 'failed' || 
            orderData?.status === 'failed' ||
            response.paymentStatus === 'failed') {
          setOrderStatus('failed');
          setLoading(false);
          return;
        }
        
        // Payment still pending - check if we should retry
        if ((orderData?.status === 'pending_payment' || 
             orderData?.payment?.status === 'pending' ||
             response.paymentStatus === 'pending') && 
            retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            checkStatus();
          }, RETRY_INTERVALS[retryCount] * 1000); // Use progressive delays
          return;
        }
        
        // Max retries reached or unknown state
        if (retryCount >= MAX_RETRIES) {
          setError('Payment verification timed out. Please check your order status in your account or contact support.');
        } else {
          setOrderStatus('unknown');
        }
        setLoading(false);
        
      } catch (error) {
        console.error('Payment status check failed:', error);
        
        // Retry on network errors if retries available
        if (retryCount < MAX_RETRIES && 
            (error.code === 'NETWORK_ERROR' || 
             error.message.includes('Network Error') ||
             error.response?.status >= 500)) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            checkStatus();
          }, RETRY_INTERVALS[retryCount] * 1000);
          return;
        }
        
        // Handle permanent errors
        if (error.response?.status === 429) {
          setError('Too many requests. Please wait a moment and refresh the page.');
        } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else if (error.response?.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError('Failed to verify payment status. Please contact support if this persists.');
        }
        setLoading(false);
      }
    };

    checkStatus();
  }, [orderId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Verifying your payment...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mx-auto h-12 w-12 text-red-500">❌</div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Payment Verification Failed
          </h2>
          <p className="mt-2 text-gray-600 mb-6">{error}</p>
          
          {orderId && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-[1.0625rem] text-gray-600">
                Order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>
          )}
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle payment failure
  if (orderStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Payment Failed
          </h1>
          <p className="mt-2 text-gray-600">
            Unfortunately, we couldn't process your payment. Don't worry, no money has been charged.
          </p>
          
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-[1.0625rem] text-red-800 font-medium">
              Your payment was not successful. Please try again.
            </p>
          </div>

          {txnId && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-[1.0625rem] text-gray-600">
                Transaction ID: <span className="font-mono font-semibold">{txnId}</span>
              </p>
            </div>
          )}

          {orderId && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[1.0625rem] text-gray-600">
                Order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-6 text-[1.0625rem] text-gray-500">
            <p>Need help? Contact our support team</p>
            <p>We're here to assist you with your order</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle unknown payment status
  if (orderStatus === 'unknown') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <ClockIcon className="mx-auto h-16 w-16 text-yellow-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Payment Status Unknown
          </h1>
          <p className="mt-2 text-gray-600">
            We're having trouble verifying your payment status. Please check your order details below.
          </p>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-[1.0625rem] text-yellow-800 font-medium">
              Your payment may have been processed. Please check your order status or contact support.
            </p>
          </div>

          {orderId && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-[1.0625rem] text-gray-600">
                Order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Check Order Status
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-6 text-[1.0625rem] text-gray-500">
            <p>Need help? Contact our support team</p>
            <p>We're here to assist you with your order</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Payment Successful! 🎉
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        
        {txnId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-[1.0625rem] text-gray-600">
              Transaction ID: <span className="font-mono font-semibold">{txnId}</span>
            </p>
          </div>
        )}

        {orderId && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-[1.0625rem] text-blue-800">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            View Your Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 text-[1.0625rem] text-gray-500">
          <p>You will receive an email confirmation shortly.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;