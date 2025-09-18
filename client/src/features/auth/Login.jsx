import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // integrate with backend
    console.log("Login:", form);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your Garava account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="underline hover:text-black">
          Sign Up
        </Link>
      </p>
    </AuthLayout >
  );
};

export default Login;
