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
    <footer className="bg-gray-50 text-[#0c0c0c] pt-12 pb-3 w-full mt-10 px-6 ">
      <div className="w-full flex items-center justify-between px-6 max-sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 text-center md:text-left">
          {/* Left: Contact */}
       <div className="flex  max-md:flex-row max-sm:flex-col  items-start justify-between gap-6 md:gap-8 w-full">
  {/* Left: contact details */}
  <div className="space-y-5 max-md:text-start w-full max-md:mb-5  max-sm:space-y-2 text-start flex-1">
    <h3 className="text-md uppercase tracking-widest font-medium">
      Contact Detail
    </h3>

    <div className="flex  gap-3 max-sm:gap-5">
      <FiMapPin size={18} />
      <p className="text-md max-sm:text-sm leading-6">
        Advir & Co. <br />
        416, Saumya Apartment, Lane no 2,<br /> Rajapark, Jaipur, 302004
      </p>
    </div>

    <div className="flex items-center gap-3 max-sm:gap-5">
      <FiMail size={18} />
      <a href="mailto:info@garava.in" className="text-md max-sm:text-sm hover:underline">
        info@garava.in
      </a>
    </div>

    <div className="flex items-center gap-3">
      <FiPhone size={18} />
      <a href="tel:+917738543881" className="text-md max-sm:text-sm hover:underline">
        +91-7738543881
      </a>
    </div>
  </div>

  {/* Right: socials */}
  <div className="space-y-3 md:space-y-4 self-start">
    <p className="text-md">Stay in the know</p>
    <div className="flex gap-4 text-lg mt-2">
      <a href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx" aria-label="Instagram" className="hover:text-gray-500">
        <FaInstagram />
      </a>
      <a href="https://www.facebook.com/garavaofficial" aria-label="Facebook" className="hover:text-gray-500">
        <FaFacebookF />
      </a>
      <a href="https://in.pinterest.com/garaaaaofficial/" aria-label="Pinterest" className="hover:text-gray-500">
        <FaPinterestP />
      </a>
      <a href="#" aria-label="Twitter" className="hover:text-gray-500">
        <FaTwitter />
      </a>
      <a href="https://in.linkedin.com/company/garavaofficial" aria-label="LinkedIn" className="hover:text-gray-500">
        <FaLinkedin />
      </a>
    </div>
  </div>
</div>

         

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <img
              src={dark}
              alt="Garava"
              className="h-48 "
              loading="lazy"
            />
          
          </div>

          {/* Right: Navigation */}
          <div className="flex  h-[30vh] items-start justify-between max-sm:items-end max-sm:pt-10">
            <div className="space-y-4 text-md self-start max-sm:text-sm">
              <h3 className="text-md uppercase tracking-widest font-medium">
                Navigation
              </h3>
              <ul className="space-y-2 ">
                <li>
                  <a href="/about" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/blogs" className="hover:underline">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4  self-start max-sm:text-sm">
              <h3 className="text-md uppercase tracking-widest font-medium">
                Important Links
              </h3>
              <ul className="space-y-2 ">
                <li>
                  <a href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="hover:underline">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/refund-return" className="hover:underline">
                    Refund & Return Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
      
       
    </div>
    
    </div>
     <div className="text-center ">
          <h5 className="text-sm  mt-12 text-gray-400 ">
              © {new Date().getFullYear()} Garava. All Rights Reserved | Design by Rebellians.studio.
            </h5>
       </div>
    </footer>
  );
};

export default Footer;
