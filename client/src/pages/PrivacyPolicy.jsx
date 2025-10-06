import React, { useEffect } from 'react';
import PageHeader from '../components/header/PageHeader';
import BackButton from '../components/BackButton';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="sticky top-34 max-md:top-10 z-10 mt-4 max-md:mt-2">
        <BackButton />
      </div>


      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-26 max-md:mt-0">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-600 text-md  max-w-2xl mx-auto">
                At Garava, we are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* Information Collection */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Information We Collect
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-md  leading-relaxed">
                    We collect information that you provide directly to us when you use our website, create an account, 
                    make a purchase, or contact our customer service.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-amber-900 mb-3">Personal Information Includes:</h3>
                    <ul className="space-y-2 text-md text-amber-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Name, email address, and phone number
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Billing and shipping addresses
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Payment information (processed securely)
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Communication preferences
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  How We Use Your Information
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-md  leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3">Primary Uses</h3>
                      <ul className="space-y-2 text-md text-blue-800">
                        <li>• Process and fulfill your orders</li>
                        <li>• Provide customer support</li>
                        <li>• Send order confirmations and updates</li>
                        <li>• Communicate about our products and services</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-3">Secondary Uses</h3>
                      <ul className="space-y-2 text-md text-green-800">
                        <li>• Improve our website and services</li>
                        <li>• Personalize your shopping experience</li>
                        <li>• Send promotional emails (with consent)</li>
                        <li>• Comply with legal obligations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Information Sharing
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-md  leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We may share your 
                    information only in the following circumstances:
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-red-900 mb-3">Limited Sharing Only</h3>
                    <ul className="space-y-2 text-md text-red-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        With service providers who help us operate our business
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        When required by law or legal process
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To protect our rights and property
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Data Security
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-md  leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized 
                    access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-3">Security Measures</h3>
                      <ul className="space-y-2 text-md text-green-800">
                        <li>• SSL encryption for data transmission</li>
                        <li>• Secure payment processing</li>
                        <li>• Regular security updates</li>
                        <li>• Limited access to personal data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3">Your Responsibility</h3>
                      <ul className="space-y-2 text-md text-blue-800">
                        <li>• Keep your account password secure</li>
                        <li>• Log out after using shared computers</li>
                        <li>• Report suspicious activity immediately</li>
                        <li>• Keep your browser updated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Your Rights
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-md  leading-relaxed">
                    You have certain rights regarding your personal information. You may exercise these rights by 
                    contacting us at any time.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-3">Access & Control</h3>
                      <ul className="space-y-2 text-md text-purple-800">
                        <li>• Request access to your data</li>
                        <li>• Update or correct your information</li>
                        <li>• Delete your account</li>
                        <li>• Export your data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h3 className="font-semibold text-amber-900 mb-3">Communication Preferences</h3>
                      <ul className="space-y-2 text-md text-amber-800">
                        <li>• Opt out of marketing emails</li>
                        <li>• Choose notification preferences</li>
                        <li>• Withdraw consent</li>
                        <li>• Manage cookie settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Cookies
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-md  leading-relaxed">
                    We use cookies and similar tracking technologies to improve your browsing experience and analyze 
                    how our website is used.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Cookie Types</h3>
                    <ul className="space-y-2 text-md text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Essential cookies:</strong> Required for website functionality
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Analytics cookies:</strong> Help us understand website usage
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Marketing cookies:</strong> Used for personalized advertising
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Changes to Policy */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Changes to This Policy
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-md  leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                    the new policy on this page and updating the "Last Updated" date.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Contact Us
                </h2>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
                  <p className="text-gray-700 text-md  mb-6 leading-relaxed">
                    If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-md">Email Support</h4>
                        <p className="text-gray-600 text-md">info@garava.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-md">Phone Support</h4>
                        <p className="text-gray-600 text-md">+91-7738543881</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
            <p className="text-md text-gray-600">
              © 2025 Garava. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;