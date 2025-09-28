import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkPaymentStatus } from '../features/order/api';
import { XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('orderId');
  const txnId = searchParams.get('txn');
  const reason = searchParams.get('reason') || 'Payment was unsuccessful';

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
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [orderId]);

  const handleRetryPayment = () => {
    if (orderDetails) {
      // Navigate back to checkout with the same order details
      navigate('/checkout', { 
        state: { 
          retryOrder: orderDetails,
          retryPayment: true 
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Checking payment status...
          </h2>
        </div>
      </div>
    );
  }

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
            Reason: {reason}
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
          {orderDetails && (
            <button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Retry Payment
            </button>
          )}
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
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

        {/* Common payment failure reasons and solutions */}
        <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">Common issues:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Insufficient balance in your account</li>
            <li>• Card limit exceeded</li>
            <li>• Network connectivity issues</li>
            <li>• Session timeout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;