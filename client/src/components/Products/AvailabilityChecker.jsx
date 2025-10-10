import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPincode } from '../../features/product/slice';
import { selectAvailability } from '../../features/product/selector';

const AvailabilityChecker = ({ product, selectedVariant, className = "" }) => {
  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const dispatch = useDispatch();
  
  // Create cache key for the availability check
  const cacheKey = JSON.stringify({
    productId: product?._id,
    variantId: selectedVariant?._id,
    pincode: pincode
  });
  
  const availabilityData = useSelector(state => selectAvailability(state, cacheKey));
  const availabilityResult = availabilityData?.data;

  const handleCheckAvailability = async () => {
    if (!pincode || pincode.length < 5) {
      alert('Please enter a valid pincode (minimum 5 digits)');
      return;
    }

    if (!product?._id || !selectedVariant?._id) {
      alert('Product information is not available');
      return;
    }

    setIsChecking(true);
    
    try {
      await dispatch(checkPincode({
        productId: product._id,
        variantId: selectedVariant._id,
        pincode: pincode.trim()
      })).unwrap();
    } catch (error) {
      console.error('Availability check failed:', error);
      // Error is handled by Redux, so we don't need to show alert here
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) { // Limit to 6 digits for Indian pincodes
      setPincode(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheckAvailability();
    }
  };

  const resetCheck = () => {
    setPincode('');
  };

  return (
    <div className={`availability-checker ${className}`}>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Check Availability:</h4>
        
        <div className="flex gap-2 max-w-sm">
          <div className="flex-1">
            <input
              type="text"
              value={pincode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter pincode (e.g. 400001)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
              maxLength={6}
            />
          </div>
          <button
            onClick={handleCheckAvailability}
            disabled={isChecking || !pincode || pincode.length < 5}
            className={`px-4 py-2 text-sm font-medium  transition-colors ${
              isChecking || !pincode || pincode.length < 5
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isChecking ? 'Checking...' : 'Check'}
          </button>
        </div>

        {/* Availability Results */}
        {availabilityResult && pincode && (
          <div className="mt-3 p-3 rounded-lg border">
            {availabilityResult.available ? (
              <div className="text-green-800 bg-green-50 border-green-200 border rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">✓ Available for delivery to {pincode}</p>
                    <p className="text-sm mt-1">
                      {availabilityResult.note || `Estimated delivery in ${availabilityResult.minDeliveryDays || 2}-${availabilityResult.maxDeliveryDays || 7} days`}
                    </p>
                    {availabilityResult.codAvailable && (
                      <p className="text-sm mt-1">💳 Cash on Delivery available</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-800 bg-red-50 border-red-200 border rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">✗ Not available for delivery to {pincode}</p>
                    <p className="text-sm mt-1">
                      {availabilityResult.note || 'This product cannot be delivered to your location'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={resetCheck}
              className="text-sm text-gray-600 hover:text-gray-800 mt-2 underline"
            >
              Check different pincode
            </button>
          </div>
        )}

        {/* Helper text */}
        {!availabilityResult && (
          <p className="text-xs text-gray-500 mt-1">
            Enter your pincode to check delivery availability and estimated delivery time
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityChecker;