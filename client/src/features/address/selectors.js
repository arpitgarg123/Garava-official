// src/features/address/selectors.js
import { createSelector } from '@reduxjs/toolkit';

const selectAddressState = (state) => state.address;

export const selectAddresses = createSelector(
  [selectAddressState],
  (addressState) => addressState.addresses
);

export const selectSelectedAddress = createSelector(
  [selectAddressState],
  (addressState) => addressState.selectedAddress
);

export const selectDefaultAddress = createSelector(
  [selectAddresses],
  (addresses) => addresses.find(addr => addr.isDefault) || addresses[0] || null
);

export const selectAddressById = createSelector(
  [selectAddresses, (state, addressId) => addressId],
  (addresses, addressId) => addresses.find(addr => addr._id === addressId)
);

export const selectIsAddressLoading = createSelector(
  [selectAddressState],
  (addressState) => addressState.isLoading
);

export const selectIsAddressCreating = createSelector(
  [selectAddressState],
  (addressState) => addressState.isCreating
);

export const selectIsAddressUpdating = createSelector(
  [selectAddressState],
  (addressState) => addressState.isUpdating
);

export const selectIsAddressDeleting = createSelector(
  [selectAddressState],
  (addressState) => addressState.isDeleting
);

export const selectAddressError = createSelector(
  [selectAddressState],
  (addressState) => addressState.error
);

export const selectHasAddresses = createSelector(
  [selectAddresses],
  (addresses) => addresses.length > 0
);

export const selectAddressCount = createSelector(
  [selectAddresses],
  (addresses) => addresses.length
);