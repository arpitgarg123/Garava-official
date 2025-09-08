import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import {
  listAddressesService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
  getAddressService,
} from "./address.service.js";

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await listAddressesService(req.user.id);
  res.json({ success: true, addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  const address = await createAddressService(req.user.id, req.body);
  res.status(201).json({ success: true, address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await updateAddressService(req.user.id, req.params.id, req.body);
  res.json({ success: true, address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await deleteAddressService(req.user.id, req.params.id);
  res.json({ success: true, message: "Address deleted" });
});

export const getAddress = asyncHandler(async (req, res) => {
  const address = await getAddressService(req.user.id, req.params.id);
  res.json({ success: true, address });
});
