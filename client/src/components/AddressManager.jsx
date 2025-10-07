import React, { useState, useEffect } from 'react';
import { getAddressesApi, createAddressApi, updateAddressApi, deleteAddressApi } from '../features/user/api.js';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    label: 'home', // Changed from 'type' to 'label'
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

  const addressTypes = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    // Prevent redundant fetches if already loading or have data
    if (loading || addresses.length > 0) {
      console.log('AddressManager - Skipping fetch: already loading or have data');
      return;
    }
    
    try {
      setLoading(true);
      console.log('AddressManager - Fetching addresses...');
      const { data } = await getAddressesApi();
      setAddresses(Array.isArray(data) ? data : data?.addresses || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setMessage('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      label: 'home', // Changed from 'type' to 'label'
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
    setEditingId(null);
    setShowForm(false);
    setMessage('');
  };

  const handleEdit = (address) => {
    setForm({
      label: address.label || address.type || 'home', // Handle both field names
      fullName: address.fullName || address.name || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || address.pincode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false
    });
    setEditingId(address._id || address.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (editingId) {
        await updateAddressApi(editingId, form);
        setMessage('Address updated successfully');
      } else {
        await createAddressApi(form);
        setMessage('Address created successfully');
      }
      await fetchAddresses();
      resetForm();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await deleteAddressApi(id);
      setMessage('Address deleted successfully');
      await fetchAddresses();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to delete address');
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-50 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
        >
          + Add Address
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('Failed') 
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Address Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="font-medium mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                <select
                  name="label" // Changed from 'type' to 'label'
                  value={form.label}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  required
                >
                  {addressTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter postal code"
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                name="addressLine1"
                type="text"
                value={form.addressLine1}
                onChange={onChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                placeholder="House/Flat No., Building Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
              <input
                name="addressLine2"
                type="text"
                value={form.addressLine2}
                onChange={onChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                placeholder="Street, Area, Landmark"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={onChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                name="isDefault"
                type="checkbox"
                checked={form.isDefault}
                onChange={onChange}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label className="ml-2 text-sm text-gray-700">Set as default address</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm"
              >
                {submitting ? 'Saving...' : (editingId ? 'Update Address' : 'Save Address')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">📍</div>
            <p>No addresses saved yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id || address.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      address.label === 'home' || address.type === 'home' ? 'bg-blue-100 text-blue-800' :
                      address.label === 'work' || address.type === 'work' ? 'bg-green-100 text-green-800' :
                      'bg-gray-50 text-gray-800'
                    }`}>
                      {(address.label || address.type)?.toUpperCase() || 'OTHER'}
                    </span>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-black text-white">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900">{address.fullName || address.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.postalCode || address.pincode}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                  <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id || address.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressManager;