import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./newsletter.service.js";

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const subscriber = await service.subscribeService(email);
  res.status(201).json({ success: true, subscriber });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await service.unsubscribeService(email);
  res.json({ success: true, message: "Unsubscribed successfully" });
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const status = req.query.status;

  const result = await service.listSubscribersService({ page, limit, status });
  res.json({ success: true, ...result });
});
