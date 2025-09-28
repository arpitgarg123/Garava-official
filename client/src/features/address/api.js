// src/features/address/api.js
import api from '../../shared/api/http';

export const addressApi = {
  // Get all addresses for the user
  getAddresses: async () => {
    const response = await api.get('/api/address');
    return response.data;
  },

  // Get a specific address by ID
  getAddress: async (addressId) => {
    const response = await api.get(`/api/address/${addressId}`);
    return response.data;
  },

  // Create a new address
  createAddress: async (addressData) => {
    const response = await api.post('/api/address/create', addressData);
    return response.data;
  },

  // Update an existing address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/api/address/update/${addressId}`, addressData);
    return response.data;
  },

  // Delete an address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/address/delete/${addressId}`);
    return response.data;
  }
};