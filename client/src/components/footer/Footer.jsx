import React from "react";
import FooterColumn from "./FooterColumn";
import { FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  const shopLinks = [
    { label: "New Arrivals", href: "/collections/new" },
    { label: "Best Sellers", href: "/collections/bestsellers" },
    { label: "Gift Cards", href: "/gift-cards" },
  ];

  const helpLinks = [
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Customer Care", href: "/contact" },
    { label: "Warranty", href: "/warranty" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Stores", href: "/stores" },
    { label: "Press", href: "/press" },
  ];

  return (
    <footer className="footer-root mt-20 h-[20vw]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Brand */}
          <div className="flex-1 min-w-[260px]">
            <div className="mb-6">
              <div className="text-5xl font-serif tracking-wider">GARAVA</div>
              <p className="mt-3 text-sm text-gray-600 max-w-md">
                Timeless jewellery crafted with care — pieces made for the moments that matter.
              </p>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-4 items-center">
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-700 hover:text-gray-900">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-700 hover:text-gray-900">
                <FaFacebookF />
              </a>
              <a href="https://pinterest.com" aria-label="Pinterest" className="text-gray-700 hover:text-gray-900">
                <FaPinterestP />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 flex gap-10 justify-between">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Help" links={helpLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>

          {/* Contact */}
          <div className="w-72">
            <h5 className="text-sm tracking-widest uppercase text-gray-800 mb-3">Contact</h5>
            <address className="not-italic text-sm text-gray-600">
              123 Luxury Ave.<br />
              New Delhi, India<br />
              <a href="tel:+911234567890" className="block mt-2 text-gray-700 hover:text-gray-900">+91 1234 567 890</a>
              <a href="mailto:hello@garava.com" className="block mt-1 text-gray-700 hover:text-gray-900">hello@garava.com</a>
            </address>
          </div>
        </div>

        <div className="footer-sep mt-10" />

        {/* Bottom bar */}
        <div className="footer-bottom flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} GARAVA. All rights reserved.</div>
          <div className="flex gap-4 items-center">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
            <a href="/sitemap" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
