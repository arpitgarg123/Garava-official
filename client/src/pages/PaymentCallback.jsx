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

  const orderId = searchParams.get('orderId');
  const txnId = searchParams.get('txn');
  const status = searchParams.get('status'); // for direct success/failure calls

  useEffect(() => {
    if (!orderId) {
      setError('Invalid payment link');
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await checkPaymentStatus(orderId);
        setOrderDetails(response.order);
        
        if (response.success && response.paymentStatus === 'completed') {
          setOrderStatus('success');
          // Clear the cart after successful payment
          dispatch(clearCart());
        } else if (response.order?.payment?.status === 'failed') {
          setOrderStatus('failed');
        } else {
          // Payment might still be processing, check again in a moment
          setTimeout(() => {
            checkStatus();
          }, 2000);
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
        
        // Handle network/server errors gracefully
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else if (error.response?.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError('Failed to verify payment status. Please contact support if this persists.');
        }
      } finally {
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
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
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
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Failed
          </h1>
          <p className="mt-2 text-gray-600">
            Unfortunately, we couldn't process your payment. Don't worry, no money has been charged.
          </p>
          
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-medium">
              Your payment was not successful. Please try again.
            </p>
          </div>

          {txnId && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Transaction ID: <span className="font-mono font-semibold">{txnId}</span>
              </p>
            </div>
          )}

          {orderId && (
            <div className="mt-2 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
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

          <div className="mt-6 text-sm text-gray-500">
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
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful! 🎉
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        
        {txnId && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Transaction ID: <span className="font-mono font-semibold">{txnId}</span>
            </p>
          </div>
        )}

        {orderId && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
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

        <div className="mt-6 text-sm text-gray-500">
          <p>You will receive an email confirmation shortly.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;