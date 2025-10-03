import mongoose from 'mongoose';
import './src/shared/db.js';
import Testimonial from './src/modules/testimonial/testimonial.model.js';

async function createSampleTestimonial() {
  try {
    console.log('Connecting to database...');
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a sample featured testimonial
    const sampleTestimonial = {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      content: 'Absolutely stunning jewelry! The craftsmanship is exceptional and the customer service was outstanding. I received my order quickly and it exceeded all my expectations. Highly recommend Garava for anyone looking for quality jewelry.',
      rating: 5,
      location: 'Mumbai, India',
      designation: 'Fashion Designer',
      source: 'manual',
      isActive: true,
      isFeatured: true,
      order: 1
    };  

    const testimonial = await Testimonial.create(sampleTestimonial);
    console.log('✅ Created sample testimonial:', testimonial.name);
    
    // Check featured testimonials
    const featured = await Testimonial.find({ isActive: true, isFeatured: true });
    console.log('📝 Total featured testimonials:', featured.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSampleTestimonial();