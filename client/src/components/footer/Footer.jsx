import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaLinkedin 
} from "react-icons/fa";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi"; 
import dark from "../../assets/images/gav-dark.png";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-[#0c0c0c] pt-8 sm:pt-12 pb-3 w-full mt-10 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 text-center lg:text-left">
          {/* Left: Contact */}
       <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-8 w-full">
  {/* Left: contact details */}
  <div className="space-y-4 sm:space-y-5 w-full sm:w-auto text-left flex-1">
    <h3 className="text-[1.0625rem] sm:text-[1.0625rem] uppercase tracking-widest font-medium">
      Contact Details
    </h3>

    <div className="space-y-1">
      <div className="flex items-center">
        <FiMapPin size={16} />
        <span className="text-[0.9375rem] font-semibold text-gray-700">Address:</span>
      </div>
      <p className="text-[1.0625rem] sm:text-[1.0625rem] leading-5 sm:leading-6">
     A -14, 601 Pearl Mount View, Vijay Path, Tilak Nagar, Jaipur -302004, Rajasthan
      </p>
    </div>

    <div className="space-y-1">
      <div className="flex items-center">
        <FiMail size={16} />
        <span className="text-[0.9375rem] font-semibold text-gray-700">Email:</span>
      </div>
      <a href="mailto:info@garava.in" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline break-all">
        info@garava.in
      </a>
    </div>

    <div className="space-y-1">
      <div className="flex items-center">
        <FiPhone size={16} />
        <span className="text-[0.9375rem] font-semibold text-gray-700">Phone:</span>
      </div>
      <a href="tel:+917738543881" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline">
        +91-7738543881
      </a>
    </div>
  </div>

  {/* Right: socials */}
  <div className="space-y-3 sm:space-y-4 w-full sm:w-auto max-sm:mt-4">
    <div className="flex gap-3 sm:gap-4 flex-col text-base sm:text-lg">
          <p className="text-[1.0625rem] sm:text-[1.0625rem] font-medium">Follow us</p>
<div className="flex  items-center gap-4">
      <a href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx" aria-label="Instagram" className="hover:text-gray-500 transition-colors">
        <FaInstagram />
      </a>
      <a href="https://www.facebook.com/garavaofficial" aria-label="Facebook" className="hover:text-gray-500 transition-colors">
        <FaFacebookF />
      </a>
      <a href="https://in.pinterest.com/garaaaaofficial/" aria-label="Pinterest" className="hover:text-gray-500 transition-colors">
        <FaPinterestP />
      </a>
      <a href="https://in.linkedin.com/company/garavaofficial" aria-label="LinkedIn" className="hover:text-gray-500 transition-colors">
        <FaLinkedin />
      </a>
    </div>
    </div>
  </div>
</div>

         

          {/* Center: Logo */}
          <div className="flex flex-col items-center justify-center py-4 lg:py-0">
            <img
              src={dark}
              alt="Garava"
              className="h-32 sm:h-40 lg:h-48c w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Right: Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-[1.0625rem] sm:text-[1.0625rem] uppercase tracking-widest font-medium">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/blogs" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-[1.0625rem] sm:text-[1.0625rem] uppercase tracking-widest font-medium">
                Important Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy-policy" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/refund-return" className="text-[1.0625rem] sm:text-[1.0625rem] hover:underline transition-colors">
                    Refund & Return Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center border-t border-gray-200 pt-6 mt-8 sm:mt-12">
          <h5 className="text-[1.0625rem] sm:text-[1.0625rem] text-gray-400 px-4">
              © {new Date().getFullYear()} Garava. All Rights Reserved | Design by Rebellians.studio.
            </h5>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
