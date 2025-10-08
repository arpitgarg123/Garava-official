import React, { useEffect } from 'react';
import PageHeader from '../components/header/PageHeader';
import BackButton from '../components/BackButton';

const ShippingPolicy = () => {
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
                Shipping Policy
              </h1>
              <p className="text-gray-600 text-sm  max-w-2xl mx-auto">
                We are committed to delivering your luxury jewellery and fragrances safely and efficiently. 
                Learn about our shipping options, delivery timelines, and policies.
              </p>
              <div className="mt-4 text-sm text-amber-700 font-medium">
                Last updated: October 2, 2025
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="space-y-8">
              
              {/* Shipping Overview */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Shipping Information
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">Delivery Commitment</h3>
                      <p className="text-amber-800 text-sm  leading-relaxed">
                        At Garava, we ensure secure and timely delivery of all our luxury products. 
                        All orders are carefully packaged and shipped with trusted courier partners to ensure 
                        your precious items reach you safely.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Processing Time */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Order Processing Time
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 3.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-blue-900 mb-3">Ready to Ship Items</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Orders for in-stock items are processed within 24-48 hours of order confirmation.
                    </p>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Same day processing for orders placed before 2 PM</li>
                      <li>• Quality check before dispatch</li>
                      <li>• Tracking information provided via SMS & Email</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-purple-900 mb-3">Custom & Bespoke Orders</h3>
                    <p className="text-sm text-purple-800 mb-3">
                      Made-to-order and customized items require additional processing time.
                    </p>
                    <ul className="space-y-1 text-sm text-purple-800">
                      <li>• 7-14 business days for custom sizing</li>
                      <li>• 14-21 days for personalized engraving</li>
                      <li>• High jewellery: 21-45 days (consultation required)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Delivery Timeline */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Delivery Timeline
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Shipping Cost</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">COD Available</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Mumbai Metropolitan Area</td>
                        <td className="px-6 py-4 text-sm text-gray-700">1-2 business days</td>
                        <td className="px-6 py-4 text-sm text-green-700 font-semibold">Free</td>
                        <td className="px-6 py-4 text-sm text-green-700">✓ Yes</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Major Cities (Delhi, Bangalore, etc.)</td>
                        <td className="px-6 py-4 text-sm text-gray-700">2-4 business days</td>
                        <td className="px-6 py-4 text-sm text-green-700 font-semibold">Free</td>
                        <td className="px-6 py-4 text-sm text-green-700">✓ Yes</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Other Cities & Towns</td>
                        <td className="px-6 py-4 text-sm text-gray-700">3-7 business days</td>
                        <td className="px-6 py-4 text-sm text-green-700 font-semibold">Free</td>
                        <td className="px-6 py-4 text-sm text-amber-700">Select locations</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Remote Areas</td>
                        <td className="px-6 py-4 text-sm text-gray-700">5-10 business days</td>
                        <td className="px-6 py-4 text-sm text-gray-700">₹100-200</td>
                        <td className="px-6 py-4 text-sm text-red-700">✗ No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Delivery timelines are estimates and may vary during festivals, monsoons, 
                    or unforeseen circumstances. Free shipping applies to all orders above ₹1,999.
                  </p>
                </div>
              </section>

              {/* Packaging & Security */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Packaging & Security
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                      <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                        Premium Packaging
                      </h3>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Signature Garava luxury boxes
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Protective cushioning for delicate items
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Elegant gift packaging available
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Eco-friendly materials used
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Security Features
                      </h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Tamper-evident packaging seals
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Insurance coverage on all orders
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Signature confirmation required
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Real-time tracking available
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Instructions */}
              <section className="border-b border-gray-100 pb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Important Delivery Guidelines
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Before Delivery
                      </h3>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>• Ensure accurate delivery address</li>
                        <li>• Provide working contact number</li>
                        <li>• Specify delivery preferences</li>
                        <li>• Arrange for someone to receive the package</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                      <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Delivery Attempts
                      </h3>
                      <ul className="space-y-1 text-sm text-amber-800">
                        <li>• 3 delivery attempts will be made</li>
                        <li>• Customer notification before each attempt</li>
                        <li>• Package return after failed delivery</li>
                        <li>• Redelivery charges may apply</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                      <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Upon Delivery
                      </h3>
                      <ul className="space-y-1 text-sm text-green-800">
                        <li>• Check package condition before signing</li>
                        <li>• Verify order contents immediately</li>
                        <li>• Keep packaging for potential returns</li>
                        <li>• Report any damage within 24 hours</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Special Requirements
                      </h3>
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• Valid ID required for high-value orders</li>
                        <li>• Apartment access coordination needed</li>
                        <li>• Office deliveries during business hours</li>
                        <li>• Custom clearance for certain areas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Support */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full mr-3"></span>
                  Shipping Support & Tracking
                </h2>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
                  <p className="text-gray-700 text-sm  mb-6 leading-relaxed">
                    Need assistance with your shipment? Our customer service team is available to help you track your order, 
                    modify delivery details, or answer any shipping-related questions.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Customer Support</h4>
                        <p className="text-gray-600 text-sm">+91-7738543881</p>
                        <p className="text-sm text-gray-500">Mon-Sat: 10 AM - 7 PM</p>
                      </div>
                    </div>
                    
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
                        <p className="text-sm text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Order Tracking</h4>
                        <p className="text-gray-600 text-sm">Track your shipment</p>
                        <p className="text-sm text-gray-500">Real-time updates via SMS</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-amber-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Flagship Store Address:</strong>
                      </p>
                      <p className="text-sm text-gray-700">
                        Garava Luxury Jewellery, Bandra West, Mumbai - 400050
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Visit us: Tuesday to Sunday, 11:00 AM - 8:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Garava. All rights reserved. This shipping policy is effective as of October 2, 2025.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Shipping terms are subject to change based on location and product availability. 
              Delivery timelines are estimates and may vary during peak seasons or unforeseen circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;