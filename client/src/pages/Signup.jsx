import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup, googleLogin } from "../features/auth/slice";
import AuthLayout from "../layouts/AuthLayout";
import { FcGoogle } from 'react-icons/fc';
import { CiUser, CiMail, CiLock } from 'react-icons/ci';

const Signup = () => {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await dispatch(signup(form)).unwrap();
      if (res?.accessToken) {
        navigate("/", { replace: true });
      } else {
        setMessage("Account created. Please check your email to verify your account.");
      }
    } catch {
      // error handled in state
    }
  };

  const handleGoogleSignup = () => {
    dispatch(googleLogin());
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the Garava family and discover luxury"
    >
       <div className="max-w-md mx-auto p-6">
        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full mb-6 flex items-center justify-center gap-3 border border-gray-300 p-2.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FcGoogle size={20} />
          <span className="text-gray-600">Continue with Google</span>
        </button>

  
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-md">
            <span className="px-2 bg-white text-gray-500">or sign up with email</span>
          </div>
        </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-md text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-md text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-md text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-md text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {message && <p className="text-md text-green-700">{message}</p>}
        {error && <p className="text-md text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-md text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="underline hover:text-black">
          Login
        </Link>
      </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
