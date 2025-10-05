import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TestimonialModel from './src/modules/testimonial/testimonial.model.js';

dotenv.config();

const sampleTestimonials = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    content: "Absolutely stunning jewellery! The craftsmanship is exceptional and the designs are timeless. I've received so many compliments on my necklace.",
    rating: 5,
    location: "Mumbai, Maharashtra",
    designation: "Fashion Designer",
    source: "manual",
    isActive: true,
    isFeatured: true,
    publishedAt: new Date(),
    order: 1
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com", 
    content: "Great quality and beautiful designs. The earrings I purchased for my wife are exactly as shown in the pictures. Highly recommended!",
    rating: 5,
    location: "Delhi, Delhi",
    designation: "Business Owner",
    source: "manual",
    isActive: true,
    isFeatured: true,
    publishedAt: new Date(),
    order: 2
  },
  {
    name: "Anitha Reddy",
    email: "anitha.reddy@email.com",
    content: "The traditional temple jewellery collection is amazing. Perfect for festivals and special occasions. The gold plating is excellent.",
    rating: 5,
    location: "Bangalore, Karnataka",
    designation: "Software Engineer",
    source: "manual",
    isActive: true,
    isFeatured: false,
    publishedAt: new Date(),
    order: 3
  },
  {
    name: "Meera Patel",
    email: "meera.patel@email.com",
    content: "Lovely collection of oxidized silver jewellery. The designs are trendy and perfect for daily wear. Very affordable prices too.",
    rating: 4,
    location: "Ahmedabad, Gujarat",
    designation: "Teacher",
    source: "manual",
    isActive: true,
    isFeatured: false,
    publishedAt: new Date(),
    order: 4
  },
  {
    name: "Kavya Nair",
    email: "kavya.nair@email.com",
    content: "The bridal jewellery set I ordered was perfect for my wedding. Beautiful intricate work and great finishing. Thank you for making my day special!",
    rating: 5,
    location: "Kochi, Kerala",
    designation: "Bride",
    source: "manual",
    isActive: true,
    isFeatured: true,
    publishedAt: new Date(),
    order: 5
  },
  {
    name: "Sunita Gupta",
    email: "sunita.gupta@email.com",
    content: "Amazing variety of contemporary designs. The rose gold collection is my favorite. Great customer service and fast delivery.",
    rating: 4,
    location: "Pune, Maharashtra",
    designation: "Marketing Manager",
    source: "manual",
    isActive: true,
    isFeatured: false,
    publishedAt: new Date(),
    order: 6
  },
  {
    name: "Deepika Singh",
    email: "deepika.singh@email.com",
    content: "The antique jewellery pieces are gorgeous. Each piece tells a story and the vintage charm is captivating. Highly satisfied with my purchase.",
    rating: 5,
    location: "Jaipur, Rajasthan",
    designation: "Interior Designer",
    source: "manual",
    isActive: true,
    isFeatured: false,
    publishedAt: new Date(),
    order: 7
  },
  {
    name: "Ritu Agarwal",
    email: "ritu.agarwal@email.com",
    content: "Beautiful kundan jewellery collection. The stones are well-set and the designs are traditional yet elegant. Perfect for weddings.",
    rating: 5,
    location: "Lucknow, Uttar Pradesh",
    designation: "Homemaker",
    source: "manual",
    isActive: true,
    isFeatured: false,
    publishedAt: new Date(),
    order: 8
  }
];

async function createSampleTestimonials() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing testimonials
    console.log('🗑️ Clearing existing testimonials...');
    await TestimonialModel.deleteMany({});
    console.log('✅ Cleared existing testimonials');

    // Insert sample testimonials
    console.log('📝 Creating sample testimonials...');
    const created = await TestimonialModel.insertMany(sampleTestimonials);
    console.log(`✅ Created ${created.length} sample testimonials`);

    // Display created testimonials
    console.log('\n📋 Created Testimonials:');
    created.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.name} - ${testimonial.rating}⭐ (${testimonial.isFeatured ? 'Featured' : 'Regular'})`);
    });

    console.log('\n🎉 Sample testimonials setup complete!');
    
  } catch (error) {
    console.error('❌ Error creating sample testimonials:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createSampleTestimonials();