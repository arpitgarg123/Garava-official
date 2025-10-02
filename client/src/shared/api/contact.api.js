import  http  from "./http.js";

/**
 * Submit contact form
 */
export const submitContactForm = async (contactData) => {
  const response = await http.post("/contact", contactData);
  return response.data;
};