import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'server', '.env') });

// Import the testimonial model
import '../server/src/shared/db.js';
import Testimonial from '../server/src/modules/testimonial/testimonial.model.js';

const sampleTestimonials = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    content: 'Absolutely stunning jewelry! The quality is exceptional and the customer service is outstanding. I\'ve been a customer for years and Garava never disappoints.',
    rating: 5,
    location: 'New York, USA',
    designation: 'Fashion Designer',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 1,
    dateOfExperience: new Date('2024-09-15')
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    content: 'The craftsmanship is incredible! Every piece tells a story and the attention to detail is remarkable. Highly recommend for special occasions.',
    rating: 5,
    location: 'San Francisco, USA',
    designation: 'Tech Executive',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 2,
    dateOfExperience: new Date('2024-09-20')
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    content: 'I purchased my engagement ring from Garava and it exceeded all expectations. The team was professional and helped me find the perfect piece.',
    rating: 5,
    location: 'Los Angeles, USA',
    designation: 'Marketing Manager',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 3,
    dateOfExperience: new Date('2024-08-10')
  },
  {
    name: 'Rajesh Patel',
    email: 'rajesh.patel@example.com',
    content: 'Traditional designs with modern elegance. Garava perfectly captures the essence of luxury jewelry. Very satisfied with my purchase.',
    rating: 5,
    location: 'Mumbai, India',
    designation: 'Business Owner',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 4,
    dateOfExperience: new Date('2024-09-05')
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    content: 'The fragrance collection is divine! Long-lasting, elegant scents that receive compliments everywhere I go. Will definitely order again.',
    rating: 5,
    location: 'London, UK',
    designation: 'Interior Designer',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 5,
    dateOfExperience: new Date('2024-08-25')
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    content: 'Exceptional quality and beautiful packaging. The online shopping experience was smooth and delivery was prompt. Highly recommended!',
    rating: 4,
    location: 'Seoul, Korea',
    designation: 'Software Engineer',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 6,
    dateOfExperience: new Date('2024-09-12')
  },
  {
    name: 'Amanda Smith',
    email: 'amanda.smith@example.com',
    content: 'Love the variety and uniqueness of the collection. Each piece is carefully crafted and the customer support team is incredibly helpful.',
    rating: 5,
    location: 'Toronto, Canada',
    designation: 'Artist',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 7,
    dateOfExperience: new Date('2024-08-30')
  },
  {
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@example.com',
    content: 'Premium quality at reasonable prices. The jewelry speaks for itself - elegant, timeless, and beautifully designed. Very happy customer!',
    rating: 5,
    location: 'Madrid, Spain',
    designation: 'Architect',
    source: 'manual',
    isActive: true,
    isFeatured: true,
    order: 8,
    dateOfExperience: new Date('2024-09-18')
  },
  {
    name: 'Jennifer Wilson',
    email: 'jennifer.wilson@example.com',
    content: 'The perfect blend of traditional and contemporary styles. My necklace from Garava is my most treasured piece of jewelry.',
    rating: 4,
    location: 'Sydney, Australia',
    designation: 'Lawyer',
    source: 'manual',
    isActive: true,
    isFeatured: false,
    order: 9,
    dateOfExperience: new Date('2024-08-15')
  },
  {
    name: 'Mohammed Al-Rashid',
    email: 'mohammed.alrashid@example.com',
    content: 'Outstanding service from start to finish. The team understood exactly what I was looking for and delivered beyond expectations.',
    rating: 5,
    location: 'Dubai, UAE',
    designation: 'Investment Banker',
    source: 'manual',
    isActive: true,
    isFeatured: false,
    order: 10,
    dateOfExperience: new Date('2024-09-01')
  }
];

async function insertSampleTestimonials() {
  try {
    console.log('🚀 Starting to insert sample testimonials...');
    
    // Check if testimonials already exist
    const existingCount = await Testimonial.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing testimonials. Clearing them first...`);
      await Testimonial.deleteMany({});
    }

    // Insert sample testimonials
    const insertedTestimonials = await Testimonial.insertMany(sampleTestimonials);
    
    console.log(`✅ Successfully inserted ${insertedTestimonials.length} sample testimonials!`);
    
    // Log some stats
    const stats = await Testimonial.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    
    console.log('📊 Testimonials Statistics:');
    console.log(`   Total: ${stats[0].total}`);
    console.log(`   Featured: ${stats[0].featured}`);
    console.log(`   Average Rating: ${stats[0].averageRating.toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Error inserting sample testimonials:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
insertSampleTestimonials();