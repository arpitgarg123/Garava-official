import { sendNewsletterWelcomeEmail } from "../../shared/emails/email.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import Newsletter from "./newsletter.model.js";

export const subscribeService = async (email) => {
  const normalized = email.trim().toLowerCase();
  let subscriber = await Newsletter.findOne({ email: normalized });

  if (subscriber) {
    if (subscriber.status === "subscribed") {
      throw new ApiError(400, "Email already subscribed");
    }
    subscriber.status = "subscribed";
    subscriber.unsubscribedAt = null;
  } else {
    subscriber = new Newsletter({ email: normalized });
  }

  await subscriber.save();

  // Send confirmation / welcome email
  try {
    await sendNewsletterWelcomeEmail(normalized);
  } catch (e) {
    console.error("Failed to send welcome email", e.message);
  }

  return subscriber;
};

export const unsubscribeService = async (email) => {
  const normalized = email.trim().toLowerCase();
  const subscriber = await Newsletter.findOne({ email: normalized });
  if (!subscriber) throw new ApiError(404, "Email not found");

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return true;
};

export const listSubscribersService = async ({ page = 1, limit = 20, status }) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Newsletter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Newsletter.countDocuments(filter),
  ]);

  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};
