import http from "../../shared/api/http.js";

// Adjust endpoint if your server uses a different path
// Common choices in your server: /api/appointment or /api/appointment/book
export const createAppointment = (payload) =>
  http.post("/appointment", payload);