import React, { useEffect } from 'react';
import PageHeader from '../components/header/PageHeader';
import BackButton from '../components/BackButton';

const RefundReturn = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="sticky top-34 z-10 max-md:top-10 mt-4 max-md:mt-2">
        <BackButton />
      </div>

   

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 mt-26 max-md:mt-0">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 p-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 mb-4">
                Refund & Returns
              </h1>
              <p className="text-gray-600 text-sm  max-w-2xl mx-auto">
                Your satisfaction is our priority. Learn about our simple return and refund process for Garava products.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* Return Policy */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Return Policy
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    At Garava, we want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, 
                    we offer a simple return policy to ensure your peace of mind.
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-amber-900 mb-3">Return Window</h3>
                    <p className="text-amber-800 text-sm ">
                      You may return items within <strong>7 days</strong> of delivery for a full refund, provided the items are in their original condition.
                    </p>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Eligible Items for Return:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm  mb-6">
                    <li>Items in original packaging with all tags attached</li>
                    <li>Unused and unworn jewellery pieces</li>
                    <li>Unopened fragrance products with intact seals</li>
                    <li>Items with original certificates and documentation</li>
                  </ul>

                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Non-Returnable Items:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm  mb-6">
                    <li>Personalized or customized jewellery</li>
                    <li>Items damaged by customer use</li>
                    <li>Opened fragrance products</li>
                    <li>Special order or made-to-order items</li>
                  </ul>
                </div>
              </section>

              {/* How to Return */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  How to Return
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4 text-sm  leading-relaxed">
                    Returning your Garava purchase is simple and hassle-free. Follow these easy steps:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Contact Us</h4>
                          <p className="text-sm text-gray-600">Email us at info@garava.in or call our customer service team to initiate your return.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Pack Your Items</h4>
                          <p className="text-sm text-gray-600">Carefully pack your items in the original packaging with all accessories and documentation.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Ship Back</h4>
                          <p className="text-sm text-gray-600">Use the prepaid return label provided or ship to our return address as instructed.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          4
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Get Refund</h4>
                          <p className="text-sm text-gray-600">Receive your refund within 5-7 business days after we process your return.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Process */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Refund Process
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-sm  leading-relaxed">
                    Once we receive your returned item, we will inspect it and process your refund accordingly.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-4">Refund Timeline</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Items inspected within 2 business days</li>
                        <li>• Refund processed within 3-5 business days</li>
                        <li>• Amount credited to original payment method</li>
                        <li>• Email confirmation sent once processed</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-4">What You Get Back</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• Full product price refunded</li>
                        <li>• Original shipping charges (if applicable)</li>
                        <li>• Taxes and fees included</li>
                        <li>• Return shipping costs covered by us</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Need Help?
                </h2>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
                  <p className="text-gray-700 text-sm  mb-6 leading-relaxed">
                    Our customer service team is here to assist you with any questions about returns or refunds.
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
                        <h4 className="font-semibold text-gray-900 text-sm">Email Support</h4>
                        <p className="text-gray-600 text-sm">info@garava.in</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Phone Support</h4>
                        <p className="text-gray-600 text-sm">+91-7738543881</p>
                        <p className="text-xs text-gray-500">Mon-Sat: 10 AM - 7 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-amber-200 text-center">
                    <p className="text-sm text-gray-600">
                      <strong>Return Address:</strong> Garava, Bandra West, Mumbai - 400050
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Garava. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;