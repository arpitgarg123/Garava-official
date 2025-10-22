import React, { useState } from "react";
import { resendVerificationApi } from "../features/auth/api.js";
import { Link } from "react-router-dom";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await resendVerificationApi({ email });
      setStatus("succeeded");
      setMessage("Verification email sent. Please check your inbox.");
    } catch (e2) {
      setStatus("failed");
      setMessage(e2?.response?.data?.message || "Failed to resend verification email.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Resend verification email</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send verification email"}
        </button>
      </form>
      {message && <p className="mt-3 text-[1.0625rem]">{message}</p>}
      <div className="mt-4 text-[1.0625rem] flex items-center justify-between">
        <Link to="/login" className="underline">Back to login</Link>
        <Link to="/" className="underline">Home</Link>
      </div>
    </div>
  );
}