import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../features/auth/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await forgotPasswordApi({ email });
      setStatus("succeeded");
      setMessage("If that email exists, a reset link has been sent.");
    } catch (e2) {
      setStatus("failed");
      setMessage(e2?.response?.data?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Email"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send reset link"}
        </button>
      </form>
      {message && <p className="mt-3 text-md">{message}</p>}

      <div className="mt-4 text-md flex items-center justify-between">
        <Link to="/login" className="underline">Back to login</Link>
      </div>
    </div>
  );
}