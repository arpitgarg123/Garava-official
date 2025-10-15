import React, { useEffect } from 'react';
import PageHeader from '../components/header/PageHeader';
import BackButton from '../components/BackButton';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 mt-36 max-md:mt-0">
      {/* Back Button */}
      <div className="sticky top-44 max-md:top-10 z-10r ">
        <BackButton />
      </div>

    

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-2 max-md:mt-0">
        <div className=" shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50 border-b border-gray-100 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 mb-4">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 text-sm  max-w-2xl mx-auto">
                Please read these terms of use carefully before using this website. If you do not agree to this Terms of Use you may not use this Website.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* General */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  1. GENERAL
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    "GARAVA" www.garava.in (hereinafter referred to as "GARAVA") is the brand created, owned, and operated by ADVIR & Co. The terms "We", "Us", and "Our" shall mean GARAVA, our employees, and authorized agents that perform any services on behalf of GARAVA. By using our website, you agree that you have read and understood these Terms of Use and that you accept and agree to follow them, without any limitations or conditions, and without requiring a handwritten signature from the Buyer. When you access the website, you also consent to how we collect, use, and share your information, as explained in our Privacy Policy. These general e-selling terms and conditions ("General Terms and Conditions") apply to all sales of GARAVA products made through www.garava.in (the "Online Store" or "Website"). Their primary purpose is to inform potential buyers about the terms and conditions under which GARAVA conducts the sale and delivery of ordered products. Additionally, they outline the rights and obligations of the parties involved in the sale of products by GARAVA to the customer (the "Buyer").
                  </p>
                </div>
              </section>

              {/* Use of Website */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Use of Website
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    You may use our website for lawful purposes only. You agree not to use the website in any way 
                    that could damage, disable, or impair the website or interfere with any other party's use of the website.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
                      <li>Using the website for any unlawful purpose</li>
                      <li>Attempting to gain unauthorized access to our systems</li>
                      <li>Transmitting viruses or malicious code</li>
                      <li>Interfering with the website's functionality</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Account Registration */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Account Registration
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    To place orders, you may need to create an account. You are responsible for maintaining 
                    the confidentiality of your account information and password.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Your Responsibilities</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Provide accurate information</li>
                        <li>• Keep account details updated</li>
                        <li>• Maintain password security</li>
                        <li>• Notify us of unauthorized access</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Age Requirements</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Must be 18 years or older</li>
                        <li>• Guardian consent for minors</li>
                        <li>• Valid identification may be required</li>
                        <li>• One account per person</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Orders and Payment */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Orders and Payment
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-sm  leading-relaxed">
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel 
                    orders at our discretion.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50  p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Payment Terms</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Payment required before dispatch</li>
                        <li>• All prices include applicable taxes</li>
                        <li>• Secure payment processing</li>
                        <li>• Multiple payment options available</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50  p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Processing</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Orders processed within 24-48 hours</li>
                        <li>• Confirmation sent via email</li>
                        <li>• Custom orders may take longer</li>
                        <li>• Tracking information provided</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Information */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Product Information
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    We strive to display our products as accurately as possible. However, colors and details 
                    may vary slightly due to screen settings and natural variations in materials.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
                      <li>Product images are for illustration purposes</li>
                      <li>Natural materials may have slight variations</li>
                      <li>Gemstone characteristics are as described</li>
                      <li>All jewelry comes with authenticity certificates</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Shipping and Delivery */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Shipping and Delivery
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    We ship to locations across India. Delivery times are estimates and may vary based on location 
                    and product availability.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Free shipping on eligible orders</li>
                        <li>• Secure packaging for all items</li>
                        <li>• Signature required for delivery</li>
                        <li>• Insurance coverage included</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Customer Responsibility</h3>
                      <ul className="space-y-2 text-sm text-gray-800">
                        <li>• Provide accurate delivery address</li>
                        <li>• Be available to receive packages</li>
                        <li>• Inspect items upon delivery</li>
                        <li>• Report any damage immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Returns and Refunds */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Returns and Refunds
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    We offer a 7-day return policy for eligible items. Please refer to our Returns Policy 
                    for complete details on the return process.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Return Conditions</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
                      <li>Items must be in original condition and packaging</li>
                      <li>Unused and unworn products only</li>
                      <li>All tags and certificates must be included</li>
                      <li>Custom or personalized items are non-returnable</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Intellectual Property
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    All content on this website, including text, images, logos, and designs, is the property of Garava 
                    and is protected by copyright and trademark laws.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Usage Restrictions</h3>
                    <p className="text-sm text-gray-800">
                      You may not reproduce, distribute, or use our content without written permission. 
                      Unauthorized use may result in legal action.
                    </p>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Limitation of Liability
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    Our liability is limited to the maximum extent permitted by law. We are not liable for any 
                    indirect, incidental, or consequential damages.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Important Disclaimer</h3>
                    <p className="text-sm text-gray-800">
                      We provide our services "as is" without warranties of any kind. We do not guarantee 
                      uninterrupted access to our website or services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Changes to Terms */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Changes to Terms
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be posted on this page 
                    and will be effective immediately upon posting.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Contact Us
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-gray-50  p-6 border border-gray-200">
                  <p className="text-gray-700 text-sm  mb-4 leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Email Support</h4>
                        <p className="text-gray-600 text-sm">info@garava.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Phone Support</h4>
                        <p className="text-gray-600 text-sm">+91-7738543881</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Garava. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;