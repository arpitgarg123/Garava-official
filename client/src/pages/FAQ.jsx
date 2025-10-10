import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const FAQ = () => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "We offer free standard shipping on all orders. Standard shipping typically takes 3-7 business days. Express shipping (1-3 business days) is available for an additional fee. All orders are processed within 1-2 business days."
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we ship within India only. We're working on expanding our international shipping options. Please check back soon or contact us for updates on international shipping availability."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking confirmation email with your tracking number. You can also track your order status by logging into your account and visiting the 'My Orders' section."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter our fulfillment process and cannot be changed. Please contact us immediately if you need to make changes."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
       
        {
          question: "What metals do you use for jewelry?",
          answer: "Our jewelry is crafted from premium materials including 925 Sterling Silver, 14K and 18K Gold (Yellow, White, and Rose), and Platinum. All metals are clearly specified in each product description."
        },
        {
          question: "How do I determine my ring size?",
          answer: "We recommend visiting a local jeweler for professional sizing. You can also download our ring sizing guide or order our complimentary ring sizer. If you're unsure, we offer free resizing within 30 days of purchase."
        },
        {
          question: "Are your fragrances authentic?",
          answer: "Absolutely! All GARAVA fragrances are authentic, original formulations created exclusively for our brand. Each fragrance comes with a certificate of authenticity and is backed by our quality guarantee."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unworn items in original condition. Custom or personalized items cannot be returned unless there's a manufacturing defect. Return shipping is complimentary for defective items."
        },
        {
          question: "How do I initiate a return?",
          answer: "To start a return, log into your account and go to 'My Orders'. Select the item you wish to return and follow the prompts. You can also contact our customer service team for assistance with your return."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method. You'll receive an email confirmation once the refund is processed."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking 'Sign Up' in the top navigation or during checkout. Having an account allows you to track orders, save favorites, and enjoy faster checkout on future purchases."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email, check your spam folder or contact support."
        },
        {
          question: "How can I contact customer support?",
          answer: "Our customer support team is available via email, phone, or live chat. Visit our Contact page for all support options. We typically respond to inquiries within one business day."
        },
        {
          question: "Do you offer appointments for jewelry consultation?",
          answer: "Yes! We offer virtual and in-person consultations for jewelry selection, custom pieces, and sizing assistance. Book an appointment through your account or contact us directly to schedule."
        }
      ]
    },
    {
      category: "Care & Maintenance",
      questions: [
        {
          question: "How do I care for my jewelry?",
          answer: "Store jewelry in individual pouches to prevent scratching. Clean with a soft cloth and mild soap solution. Avoid exposure to chemicals, perfumes, and extreme temperatures. Professional cleaning is recommended annually."
        },
        {
          question: "How should I store my fragrances?",
          answer: "Keep fragrances in a cool, dry place away from direct sunlight and heat. Store bottles upright and avoid temperature fluctuations. Properly stored fragrances maintain their quality for 3-5 years."
        },
        {
          question: "Is my jewelry covered under warranty?",
          answer: "All GARAVA jewelry comes with a 1-year warranty covering manufacturing defects. This includes stone settings, clasps, and structural integrity. Normal wear and tear, damage from misuse, or accidents are not covered."
        }
      ]
    }
  ];

  return (
    <section aria-labelledby="faq-heading" className="w-full bg-white">
      <div className="sticky top-34 z-10 mb-3">
        <BackButton />
      </div>
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12 mt-20 text-center">
          <h1
            id="faq-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight"
          >
            Frequently Asked Questions
          </h1>
          <p className="mt-3 sm:mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>
        </header>

        {/* FAQ Content */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border-b border-gray-200 pb-8 last:border-b-0">
              {/* Category Title */}
              <h2 className="text-xl font-medium mb-4 text-gray-900">
                {category.category}
              </h2>
              
              {/* Questions in Category */}
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const itemIndex = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems.has(itemIndex);
                  
                  return (
                    <div
                      key={questionIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleItem(itemIndex)}
                        className="w-full px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset hover:bg-gray-50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      
                      {/* Answer */}
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to help you.
          </p>
          <a
            href="/contact"
            className="btn-black w-1/2"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;