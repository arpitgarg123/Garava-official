import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login, googleLogin } from "./slice";
import AuthLayout from "../../layouts/AuthLayout";
import { FcGoogle } from 'react-icons/fc';
import { CiMail, CiLock } from 'react-icons/ci';

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

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your Garava account"
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-6 cursor-pointer flex items-center justify-center gap-3 border border-gray-300 p-2.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FcGoogle size={20} />
          <span className="text-gray-600">Continue with Google</span>
        </button>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-md">
            <span className="px-2 bg-white text-gray-500">or continue with email</span>
          </div>
        </div>
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
              className="absolute right-2 top-2 text-md text-gray-600"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
  <div className="flex items-center justify-center underline">
            <Link to="/forgot-password" className="text-md text-gray-600 hover:text-black">
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-md text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-md">
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
