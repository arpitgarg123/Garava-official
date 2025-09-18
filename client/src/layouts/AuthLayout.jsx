import React from "react"; 
import logo from '../assets//images/logo-main.png'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 relative">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Garava"
            className="h-12 object-contain"
          />
        </div>

        <h2 className="text-2xl font-playfair text-center text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
