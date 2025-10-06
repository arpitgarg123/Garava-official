import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { resetPasswordApi } from "../features/auth/api.js";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token")?.trim() || "";

  // No token in URL → send user Home
  if (!token) return <Navigate to="/" replace />;

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await resetPasswordApi({ token, newPassword });
      setStatus("succeeded");
      setMessage("Password reset. Redirecting to home…");
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (e2) {
      setStatus("failed");
      setMessage(e2?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="New password"
          minLength={8}
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Confirm new password"
          minLength={8}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Resetting..." : "Reset password"}
        </button>
      </form>
      {message && <p className="mt-3 text-md">{message}</p>}
    </div>
  );
}