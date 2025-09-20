import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi"; 
import dark from "../../assets/images/gav-dark.png";

const Footer = () => {
  return (
    <footer className="bg-[#f5e6d7] text-[#0c0c0c] pt-12 pb-3 w-full mt-10 px-6 ">
      <div className="w-full flex items-center justify-between px-6 max-sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 text-center md:text-left">
          {/* Left: Contact */}
          <div className="flex w-[30vw] h-[30vh]  b-amber-300  max-sm:w-full  items-start justify-between  ">
            <div className="space-y-5 max-sm:space-y-1  self-start text-start ">
            <h3 className="text-sm uppercase tracking-widest font-medium t">
              Contact Detail
            </h3>

            <div className="flex items-start gap-3 justify-center md:justify-start text-star">
              <FiMapPin size={18} />
              <p className="text-sm leading-6">
                Advir & Co. <br />
                416, Saumya Apartment, Lane no 2,<br /> Rajapark, Jaipur, 302004
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FiMail size={18} />
              <a href="mailto:info@garava.in" className="text-sm hover:underline">
                info@garava.in
              </a>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <FiPhone size={18} />
              <a href="tel:+917738543881" className="text-sm hover:underline">
                +91-7738543881
              </a>
            </div>
          </div>
           <div className="space-y-4 self-start">
          
            <p className="text-sm">Stay in the know</p>
            <div className="flex justify-center md:justify-start gap-4 text-lg mt-3">
              <a href="#" aria-label="Instagram" className="hover:text-gray-300">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-gray-300">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Pinterest" className="hover:text-gray-300">
                <FaPinterestP />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-gray-300">
                <FaTwitter />
              </a>
            </div>
          </div>
          </div>
         

          {/* Center: Logo */}
          <div className="flex flex-col items-center">
            <img
              src={dark}
              alt="Garava"
              className="h-36 w-auto mb-2"
              loading="lazy"
            />
 <p className="font-light text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste voluptatem quam natus error maiores nam?</p>
          
          </div>

          {/* Right: Navigation */}
          <div className="flex  h-[30vh] items-start justify-between ">
            <div className="space-y-4 self-start">
              <h3 className="text-sm uppercase tracking-widest font-medium">
                Navigation
              </h3>
              <ul className="space-y-2 text-sm">
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
            <div className="space-y-4 self-start">
              <h3 className="text-sm uppercase tracking-widest font-medium">
                Important Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy_policy" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/shipping_policy" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="/tearm_condition" className="hover:underline">
                    Tearm & Condition
                  </a>
                </li>
                <li>
                  <a href="/refund_return" className="hover:underline">
                    Refund & Return Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
      
       
    </div>
    
    </div>
     <div className="text-center ">
          <h5 className="text-xs  mt-12 text-gray-400 ">
              © {new Date().getFullYear()} Garava. All Rights Reserved | Design by Rebellians.studio.
            </h5>
       </div>
    </footer>
  );
};

export default Footer;
