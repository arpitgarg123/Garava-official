import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login } from "./slice";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res?.accessToken) {
        navigate(from, { replace: true });
      }
    } catch {
      // handled via error state
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your Garava account"
    >
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />
          <div className="relative">
            <input
              name="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              className="w-full border p-2 rounded"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <span className="text-gray-600">No account?</span>{" "}
          <Link to="/signup" className="underline">
            Create one
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
