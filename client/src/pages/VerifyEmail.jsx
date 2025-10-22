import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { verifyEmailApi } from "../features/auth/api.js";

export default function VerifyEmail() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = params.get("token")?.trim() || "";

  // No token -> go to resend page
  if (!token) return <Navigate to="/resend-verification" replace />;

  const [status, setStatus] = useState("loading"); // loading | succeeded | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await verifyEmailApi({ token });
        if (!mounted) return;
        setStatus("succeeded");
        setMessage("Your email has been verified.");
      } catch (e) {
        if (!mounted) return;
        setStatus("failed");
        setMessage(e?.response?.data?.message || "Verification failed. Please resend the email.");
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Verify your email</h1>
      <p className="mb-4">
        {status === "loading" ? "Verifying…" : message}
      </p>
      <div className="mt-4 flex gap-3">
        <Link to="/login" className="bg-black text-white px-4 py-2 rounded">Go to Login</Link>
        <Link to="/" className="border border-black px-4 py-2 rounded">Go Home</Link>
        {status === "failed" && (
          <Link to="/resend-verification" className="underline">Resend verification email</Link>
        )}
      </div>
    </div>
  );
}