import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
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
    <h3 className="text-xs sm:text-sm uppercase tracking-widest font-medium">
      Contact Detail
    </h3>

    <div className="flex items-start gap-3">
      <FiMapPin size={16} className="mt-1 flex-shrink-0" />
      <p className="text-xs sm:text-sm leading-5 sm:leading-6">
     A -14 601 pearl  mount view,  vijay path, tilak nagar, jaipur -302004, Rajasthan
      </p>
    </div>

    <div className="flex items-center gap-3">
      <FiMail size={16} className="flex-shrink-0" />
      <a href="mailto:info@garava.in" className="text-xs sm:text-sm hover:underline break-all">
        info@garava.in
      </a>
    </div>

    <div className="flex items-center gap-3">
      <FiPhone size={16} className="flex-shrink-0" />
      <a href="tel:+917738543881" className="text-xs sm:text-sm hover:underline">
        +91-7738543881
      </a>
    </div>
  </div>

  {/* Right: socials */}
  <div className="space-y-3 sm:space-y-4 w-full sm:w-auto max-sm:mt-4">
    <div className="flex gap-3 sm:gap-4 flex-col text-base sm:text-lg">
          <p className="text-xs sm:text-sm font-medium">Follow us</p>
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
      <a href="#" aria-label="Twitter" className="hover:text-gray-500 transition-colors">
        <FaTwitter />
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
              className="h-32 sm:h-40 lg:h-48 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Right: Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm uppercase tracking-widest font-medium">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-xs sm:text-sm hover:underline transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/blogs" className="text-xs sm:text-sm hover:underline transition-colors">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-xs sm:text-sm hover:underline transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-xs sm:text-sm hover:underline transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm uppercase tracking-widest font-medium">
                Important Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy-policy" className="text-xs sm:text-sm hover:underline transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy" className="text-xs sm:text-sm hover:underline transition-colors">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="text-xs sm:text-sm hover:underline transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/refund-return" className="text-xs sm:text-sm hover:underline transition-colors">
                    Refund & Return Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center border-t border-gray-200 pt-6 mt-8 sm:mt-12">
          <h5 className="text-xs sm:text-sm text-gray-400 px-4">
              © {new Date().getFullYear()} Garava. All Rights Reserved | Design by Rebellians.studio.
            </h5>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
