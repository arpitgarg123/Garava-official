import fetch from 'node-fetch';

async function testTestimonialApi() {
  try {
    console.log('🔍 Testing Testimonial API...');
    
    const response = await fetch('http://localhost:8080/api/testimonials');
    const data = await response.json();
    
    if (data.success && data.data && data.data.testimonials) {
      console.log(`✅ API is working! Found ${data.data.testimonials.length} testimonials`);
      console.log('\n📋 Sample testimonials:');
      data.data.testimonials.slice(0, 3).forEach(testimonial => {
        console.log(`- ${testimonial.name}: "${testimonial.content.substring(0, 50)}..." (${testimonial.rating}⭐) - Active: ${testimonial.isActive}, Featured: ${testimonial.isFeatured}`);
      });
      
      // Test pagination info
      if (data.data.pagination) {
        console.log(`\n📄 Pagination: Page ${data.data.pagination.currentPage} of ${data.data.pagination.pages} (${data.data.pagination.total} total)`);
      }
    } else {
      console.log('❌ API response format is unexpected');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testTestimonialApi();