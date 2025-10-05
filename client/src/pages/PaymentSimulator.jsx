import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSimulator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  const txnId = searchParams.get('txn');
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Simulate successful payment
          window.location.href = `http://localhost:3000/payment/success?txn=${txnId}&status=success&orderId=${orderId}`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [txnId, orderId]);

  const handlePaymentAction = (status) => {
    if (status === 'success') {
      window.location.href = `http://localhost:3000/payment/success?txn=${txnId}&status=success&orderId=${orderId}`;
    } else {
      window.location.href = `http://localhost:3000/payment/failed?txn=${txnId}&status=failed&orderId=${orderId}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            PhonePe Payment Simulator
          </h1>
          <div className="mb-6">
            <p className="text-sm text-gray-600">Transaction ID: {txnId}</p>
            <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            <p className="text-lg font-semibold text-gray-800">
              Amount: ₹{amount ? parseInt(amount).toFixed(2) : '0.00'}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 mb-2">
              🔧 <strong>Development Mode</strong>
            </p>
            <p className="text-xs text-blue-600">
              This is a payment simulator for testing. Auto-completing in {countdown} seconds...
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePaymentAction('success')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              ✅ Simulate Successful Payment
            </button>
            
            <button
              onClick={() => handlePaymentAction('failed')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              ❌ Simulate Failed Payment
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancel & Return to Cart
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>⚠️ This simulator will be removed once PhonePe credentials are activated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulator;