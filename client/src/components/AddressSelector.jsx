// src/components/AddressSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  selectAddresses, 
  selectDefaultAddress, 
  selectIsAddressLoading, 
  selectIsAddressCreating,
  selectAddressError,
  selectHasAddresses
} from '../features/address/selectors';
import { 
  fetchAddresses, 
  createAddress, 
  updateAddress,
  deleteAddress,
  selectAddress,
  clearError
} from '../features/address/slice';

// Memoized component to prevent unnecessary re-renders
const AddressSelector = React.memo(({ selectedAddressId, onAddressSelect, onAddressChange, showAsManagement = false }) => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const isLoading = useSelector(selectIsAddressLoading);
  const isCreating = useSelector(selectIsAddressCreating);
  const error = useSelector(selectAddressError);
  const hasAddresses = useSelector(selectHasAddresses);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  // Fetch addresses on mount
  const hasMounted = useRef(false);
  
  useEffect(() => {
    // Only prevent if the exact same component instance tries to fetch multiple times
    if (hasMounted.current) {
      return;
    }
    
    hasMounted.current = true;
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto-select default address if none selected
  const hasAutoSelected = useRef(false);
  
  useEffect(() => {
    if (!selectedAddressId && defaultAddress && onAddressSelect && !hasAutoSelected.current) {
      hasAutoSelected.current = true;
      onAddressSelect(defaultAddress._id);
      if (onAddressChange) {
        onAddressChange(defaultAddress);
      }
    }
    
    // Reset flag when selectedAddressId changes externally
    if (selectedAddressId) {
      hasAutoSelected.current = false;
    }
  }, [selectedAddressId, defaultAddress?._id]); // Only depend on IDs, not callback functions

  // Clear errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAddressSelect = (addressId) => {
    const selectedAddr = addresses.find(addr => addr._id === addressId);
    if (selectedAddr) {
      onAddressSelect(addressId);
      if (onAddressChange) {
        onAddressChange(selectedAddr);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateNewAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
    const missing = required.filter(field => !newAddress[field]?.trim());
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    // Phone validation
    if (!/^\d{10}$/.test(newAddress.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Postal code validation
    if (!/^\d{6}$/.test(newAddress.postalCode)) {
      toast.error('Please enter a valid 6-digit postal code');
      return false;
    }
    
    return true;
  };

  const handleCreateAddress = async () => {
    if (!validateNewAddress()) return;

    try {
      if (editingId) {
        // Update existing address
        const result = await dispatch(updateAddress({ addressId: editingId, addressData: newAddress })).unwrap();
        toast.success('Address updated successfully');
        setEditingId(null);
      } else {
        // Create new address
        const result = await dispatch(createAddress(newAddress)).unwrap();
        toast.success('Address added successfully');
        // Auto-select the newly created address if not in management mode
        if (!showAsManagement && onAddressSelect) {
          handleAddressSelect(result._id);
        }
      }
      
      setShowAddForm(false);
      setNewAddress({
        label: 'home',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress({
      label: address.label || 'home',
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false
    });
    setEditingId(address._id);
    setShowAddForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setNewAddress({
      label: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const formatAddress = (address) => {
    return [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode
    ].filter(Boolean).join(', ');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={showAsManagement ? '' : ' p-6'}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {showAsManagement ? 'My Addresses' : 'Shipping Address'}
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className=" text-[1.0625rem] font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add New Address'}
        </button>
      </div>

      {/* Existing Addresses */}
      {hasAddresses && !showAddForm && (
        <div className="space-y-3 mb-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`block p-4 border border-gray-300  transition-colors ${
                showAsManagement 
                  ? 'border-gray-200 hover:border-gray-300'
                  : selectedAddressId === address._id
                    ? 'border-gray-300 bg-gray-50 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
              }`}
              onClick={!showAsManagement ? () => handleAddressSelect(address._id) : undefined}
            >
              {!showAsManagement && (
                <input
                  type="radio"
                  name="selectedAddress"
                  value={address._id}
                  checked={selectedAddressId === address._id}
                  onChange={() => handleAddressSelect(address._id)}
                  className="sr-only"
                />
              )}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{address.fullName}</span>
                    <span className="text-[1.0625rem] text-gray-600">({address.phone})</span>
                    {address.isDefault && (
                      <span className="px-2 py-1 rounded-md bg-green-100 text-green-800 text-[1.0625rem] ">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[1.0625rem] text-gray-600 mb-1">
                    {formatAddress(address)}
                  </p>
                  <span className="inline-block px-2 py-1 bg-gray-50 text-gray-700 text-[1.0625rem]  capitalize">
                    {address.label}
                  </span>
                </div>
                {showAsManagement && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditAddress(address);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-[1.0625rem]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAddress(address._id);
                      }}
                      className="text-red-600 hover:text-red-700 text-[1.0625rem]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={newAddress.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[1.0625rem] font-medium mb-1">Address Line 1 *</label>
              <input
                type="text"
                name="addressLine1"
                value={newAddress.addressLine1}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[1.0625rem] font-medium mb-1">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={newAddress.addressLine2}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-[1.0625rem] font-medium mb-1">Label</label>
              <select
                name="label"
                value={newAddress.label}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <span className="text-[1.0625rem]">Set as default address</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleCreateAddress}
              disabled={isCreating}
              className="btn-black"
            >
              {isCreating ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Address' : 'Add Address')}
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* No addresses message */}
      {!hasAddresses && !showAddForm && (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No saved addresses found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
});

export default AddressSelector;