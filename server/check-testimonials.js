import mongoose from 'mongoose';
import './src/shared/db.js';
import Testimonial from './src/modules/testimonial/testimonial.model.js';

async function checkTestimonials() {
  try {
    console.log('Connecting to database...');
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check all testimonials
    const allTestimonials = await Testimonial.find({});
    console.log('\n=== ALL TESTIMONIALS ===');
    console.log('Total testimonials:', allTestimonials.length);
    
    if (allTestimonials.length > 0) {
      allTestimonials.forEach((testimonial, index) => {
        console.log(`\n${index + 1}. ${testimonial.name}`);
        console.log(`   isActive: ${testimonial.isActive}`);
        console.log(`   isFeatured: ${testimonial.isFeatured}`);
        console.log(`   Source: ${testimonial.source}`);
        console.log(`   Rating: ${testimonial.rating}`);
      }); 
    }
    
    // Check featured active testimonials specifically
    const featuredTestimonials = await Testimonial.find({
      isActive: true,
      isFeatured: true
    });
    console.log('\n=== FEATURED ACTIVE TESTIMONIALS ===');
    console.log('Featured active testimonials:', featuredTestimonials.length);
    
    // Check just active testimonials
    const activeTestimonials = await Testimonial.find({
      isActive: true
    });
    console.log('\n=== ACTIVE TESTIMONIALS ===');
    console.log('Active testimonials:', activeTestimonials.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTestimonials();