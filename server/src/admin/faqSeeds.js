import FAQ from '../modules/faq/faq.model.js';

const sampleFAQs = [
  {
    question: "What types of jewelry do you offer?",
    answer: "We offer a wide range of jewelry including rings, necklaces, earrings, bracelets, and pendants. Our collection features gold, silver, and platinum pieces with precious and semi-precious stones.",
    category: "products",
    keywords: ["jewelry", "rings", "necklaces", "earrings", "bracelets", "gold", "silver", "platinum", "stones"],
    priority: 10,
    isActive: true
  },
  {
    question: "How do I determine my ring size?",
    answer: "You can determine your ring size using our ring size guide available on the product page. We recommend visiting a local jeweler for the most accurate measurement, or you can use our printable ring sizer tool.",
    category: "sizing",
    keywords: ["ring size", "sizing", "measurement", "fit", "guide"],
    priority: 9,
    isActive: true
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unworn items in original condition. Custom or personalized jewelry cannot be returned unless there's a manufacturing defect. Return shipping costs are covered by us for defective items.",
    category: "returns",
    keywords: ["return", "refund", "exchange", "policy", "unworn", "defective"],
    priority: 8,
    isActive: true
  },
  {
    question: "How should I care for my jewelry?",
    answer: "Store your jewelry in a dry place, preferably in individual pouches. Clean regularly with appropriate cleaners - use mild soap for gold, specialized silver cleaner for silver. Avoid exposure to chemicals, perfumes, and lotions.",
    category: "care",
    keywords: ["care", "cleaning", "storage", "maintenance", "chemicals", "perfume"],
    priority: 7,
    isActive: true
  },
  {
    question: "Do you offer custom jewelry design?",
    answer: "Yes! We offer custom jewelry design services. You can work with our designers to create unique pieces. The process typically takes 2-4 weeks depending on complexity. Contact us for a consultation.",
    category: "products",
    keywords: ["custom", "design", "unique", "personalized", "consultation", "designer"],
    priority: 6,
    isActive: true
  },
  {
    question: "What are your shipping options and costs?",
    answer: "We offer standard shipping (5-7 business days) for ₹99 and express shipping (2-3 business days) for ₹199. Free shipping on orders above ₹2999. International shipping available with rates calculated at checkout.",
    category: "shipping",
    keywords: ["shipping", "delivery", "cost", "free shipping", "international", "express"],
    priority: 8,
    isActive: true
  },
  {
    question: "Are your diamonds certified?",
    answer: "Yes, all our diamonds come with certification from recognized gemological institutes like GIA, IGI, or SGL. Each diamond includes a certificate detailing the 4Cs (Cut, Color, Clarity, Carat).",
    category: "products",
    keywords: ["diamond", "certified", "GIA", "IGI", "SGL", "4Cs", "cut", "color", "clarity", "carat"],
    priority: 9,
    isActive: true
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can track your order on our website using the tracking number or through your account dashboard.",
    category: "orders",
    keywords: ["track", "tracking", "order status", "shipment", "dashboard"],
    priority: 7,
    isActive: true
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. We also offer EMI options on orders above ₹10,000 through selected banks and financial partners.",
    category: "orders",
    keywords: ["payment", "credit card", "UPI", "net banking", "EMI", "wallet"],
    priority: 6,
    isActive: true
  },
  {
    question: "Is my jewelry insured during shipping?",
    answer: "Yes, all jewelry is fully insured during shipping against loss, theft, or damage. We use secure, trackable shipping methods and require signature confirmation for high-value items.",
    category: "shipping",
    keywords: ["insurance", "shipping", "secure", "signature", "protection", "loss", "damage"],
    priority: 5,
    isActive: true
  }
];

const seedFAQs = async () => {
  try {
    console.log('🌱 Starting FAQ seeding...');
    
    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('Cleared existing FAQs');
    
    // Insert sample FAQs
    const insertedFAQs = await FAQ.insertMany(sampleFAQs);
    console.log(`✅ Successfully seeded ${insertedFAQs.length} FAQs`);
    
    // Log summary
    const summary = {};
    insertedFAQs.forEach(faq => {
      summary[faq.category] = (summary[faq.category] || 0) + 1;
    });
    
    console.log('📊 FAQ Summary by Category:');
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} FAQs`);
    });
    
    return insertedFAQs;
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    throw error;
  }
};

export { seedFAQs, sampleFAQs };