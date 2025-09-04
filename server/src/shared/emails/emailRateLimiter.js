// src/utils/emailRateLimiter.js
import { redis } from "../../config/redis.js";
import ApiError from "../utils/ApiError.js";

export const checkEmailRateLimit = async (userId) => {
  const key = `email_rate:${userId}`;
  const limit = 5; // max 5 emails
  const ttl = 60 * 60; // 1 hour in seconds

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, ttl); // set expiry
  }

  if (current > limit) {
    throw new ApiError(429, "Too many email requests. Please try again later.");
  }

  return true;
};
