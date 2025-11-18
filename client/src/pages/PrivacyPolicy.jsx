import React, { useEffect } from 'react';
import PageHeader from '../components/header/PageHeader';
import BackButton from '../components/BackButton';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 mt-36 max-md:mt-2">
      {/* Back Button */}
      <div className="sticky top-44 max-md:top-10">
        <BackButton />
      </div>


      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-2 max-md:mt-0">
        <div className="bg-white  shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50 border-b border-gray-100 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-3xl  font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-600 text-[1.0625rem]  max-w-2xl mx-auto">
                At GARAVA, we prioritize our customers' privacy and respect the confidentiality of their personal information. Whether you visit our website or interact with us via social media, email, or phone, we are committed to safeguarding your privacy and addressing any concerns you may have about the protection of your personal data.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* Information Collection */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Information We Collect
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-[1.0625rem]  leading-relaxed">
                    By using our website, www.garava.store, you acknowledge and agree to our Privacy Policy. If you do not agree with our Privacy Policy, please exit this page and refrain from accessing or using the website. Our Privacy Policy provides detailed information on how we collect, use, and manage your personal data, regardless of your role as an internet user, customer, prospect, partner, supplier, or candidate ("you"). Please note that our Privacy Policy may be updated periodically without prior notice to ensure compliance with current regulations. We recommend reviewing the policy regularly to stay informed of any changes. To ensure the security of your personal information, we employ advanced encryption technology, digital certificates, secure commerce servers, and authentication measures.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Personal Information Includes:</h3>
                    <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Name, email address, and phone number
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Billing and shipping addresses
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Payment information (processed securely)
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Communication preferences
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  How We Use Your Information
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-[1.0625rem]  leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Primary Uses</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                        <li>• Process and fulfill your orders</li>
                        <li>• Provide customer support</li>
                        <li>• Send order confirmations and updates</li>
                        <li>• Communicate about our products and services</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Secondary Uses</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
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
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Information Sharing
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-[1.0625rem]  leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We may share your 
                    information only in the following circumstances:
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Limited Sharing Only</h3>
                    <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        With service providers who help us operate our business
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        When required by law or legal process
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To protect our rights and property
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Data Security
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-[1.0625rem]  leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized 
                    access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Security Measures</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                        <li>• SSL encryption for data transmission</li>
                        <li>• Secure payment processing</li>
                        <li>• Regular security updates</li>
                        <li>• Limited access to personal data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Your Responsibility</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
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
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Your Rights
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-[1.0625rem]  leading-relaxed">
                    You have certain rights regarding your personal information. You may exercise these rights by 
                    contacting us at any time.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Access & Control</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                        <li>• Request access to your data</li>
                        <li>• Update or correct your information</li>
                        <li>• Delete your account</li>
                        <li>• Export your data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50  p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Communication Preferences</h3>
                      <ul className="space-y-2 text-[1.0625rem] text-gray-800">
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
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Cookies
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-[1.0625rem]  leading-relaxed">
                    We use cookies and similar tracking technologies to improve your browsing experience and analyze 
                    how our website is used.
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200  p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Cookie Types</h3>
                    <ul className="space-y-2 text-[1.0625rem] text-gray-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Essential cookies:</strong> Required for website functionality
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Analytics cookies:</strong> Help us understand website usage
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <strong>Marketing cookies:</strong> Used for personalized advertising
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Changes to Policy */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Changes to This Policy
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-[1.0625rem]  leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                    the new policy on this page and updating the "Last Updated" date.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full mr-3"></span>
                  Contact Us
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-gray-50  p-6 border border-gray-200">
                  <p className="text-gray-700 text-[1.0625rem]  mb-6 leading-relaxed">
                    If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
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
                        <h4 className="font-semibold text-gray-900 text-[1.0625rem]">Email Support</h4>
                        <p className="text-gray-600 text-[1.0625rem]">info@garava.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-[1.0625rem]">Phone Support</h4>
                        <p className="text-gray-600 text-[1.0625rem]">+91-7738543881</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
            <p className="text-[1.0625rem] text-gray-600">
              © 2025 Garava. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;