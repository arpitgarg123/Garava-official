import ApiError from "../../shared/utils/ApiError.js";
import Address from "./address.model.js";
import User from "../user/user.model.js";

const MAX_ADDRESSES = 3; 

const normalize = (s) => (typeof s === "string" ? s.trim() : s);

const validatePayload = (p) => {
  const required = ["fullName", "phone", "addressLine1", "city", "state", "postalCode", "country"];
  for (const k of required) {
    if (!p[k] || String(p[k]).trim() === "") throw new ApiError(400, `${k} is required`);
  }
  return {
    label: ["home","work","other"].includes(p.label) ? p.label : "home",
    fullName: normalize(p.fullName),
    phone: normalize(p.phone),
    addressLine1: normalize(p.addressLine1),
    addressLine2: p.addressLine2 ? normalize(p.addressLine2) : "",
    city: normalize(p.city),
    state: normalize(p.state),
    postalCode: normalize(p.postalCode),
    country: normalize(p.country),
    isDefault: Boolean(p.isDefault),
  };
};

export const listAddressesService = async (userId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  return Address.find({ user: userId }).sort({ isDefault: -1, updatedAt: -1 }).lean();
};

export const createAddressService = async (userId, payload) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const count = await Address.countDocuments({ user: userId });
  if (count >= MAX_ADDRESSES) throw new ApiError(400, `Max ${MAX_ADDRESSES} addresses allowed`);

  const data = validatePayload(payload);
  data.user = userId;

  if (data.isDefault) {
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
  } else if (count === 0) {
    data.isDefault = true; 
  }

  const created = await Address.create(data);
  return created.toObject();
};

export const updateAddressService = async (userId, addressId, updates) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const addr = await Address.findOne({ _id: addressId, user: userId });
  if (!addr) throw new ApiError(404, "Address not found");

  const allowed = ["label","fullName","phone","addressLine1","addressLine2","city","state","postalCode","country","isDefault"];
  for (const k of Object.keys(updates)) {
    if (!allowed.includes(k)) continue;
    addr[k] = typeof updates[k] === "string" ? updates[k].trim() : updates[k];
  }

  if (updates.isDefault === true) {
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    addr.isDefault = true;
  }

  await addr.save();
  return addr.toObject();
};

export const deleteAddressService = async (userId, addressId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const addr = await Address.findOne({ _id: addressId, user: userId });
  if (!addr) throw new ApiError(404, "Address not found");

  const wasDefault = Boolean(addr.isDefault);

  // Hard-delete
  await Address.deleteOne({ _id: addressId });

  if (wasDefault) {
    const another = await Address.findOne({ user: userId }).sort({ updatedAt: -1 });
    if (another) {
      another.isDefault = true;
      await another.save();
    }
  }

  return true;
};

export const getAddressService = async (userId, addressId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const addr = await Address.findOne({ _id: addressId, user: userId }).lean();
  if (!addr) throw new ApiError(404, "Address not found");
  return addr;
};
