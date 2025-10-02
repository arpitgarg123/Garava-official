import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendContactFormEmails } from "./contact.service.js";
import ApiError from "../../shared/utils/ApiError.js";

/**
 * Handle contact form submission
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, website } = req.body;

  // Check honeypot field
  if (website) {
    throw new ApiError(400, "Invalid form submission");
  }

  // Validate required fields
  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Please fill all required fields");
  }

  // Basic validation
  if (name.trim().length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters");
  }

  if (subject.trim().length < 2) {
    throw new ApiError(400, "Subject must be at least 2 characters");
  }

  if (message.trim().length < 10) {
    throw new ApiError(400, "Message must be at least 10 characters");
  }

  // Email validation
  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  // Phone validation (if provided)
  if (phone && !/^[0-9()+\-\s]{7,16}$/.test(phone)) {
    throw new ApiError(400, "Please enter a valid phone number");
  }

  // Prepare contact data
  const contactData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
    subject: subject.trim(),
    message: message.trim()
  };

  // Send emails
  const result = await sendContactFormEmails(contactData);

  res.status(200).json({
    success: true,
    message: "Thank you for contacting us! We'll get back to you soon."
  });
});