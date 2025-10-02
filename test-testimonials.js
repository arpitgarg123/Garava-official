import fetch from 'node-fetch';

const API_BASE = 'http://localhost:8080/api/testimonials';

const sampleTestimonials = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    content: 'Absolutely stunning jewelry! The quality is exceptional and the customer service is outstanding. I\'ve been a customer for years and Garava never disappoints.',
    rating: 5,
    location: 'New York, USA',
    designation: 'Fashion Designer',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    content: 'The craftsmanship is incredible! Every piece tells a story and the attention to detail is remarkable. Highly recommend for special occasions.',
    rating: 5,
    location: 'San Francisco, USA',
    designation: 'Tech Executive',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    content: 'I purchased my engagement ring from Garava and it exceeded all expectations. The team was professional and helped me find the perfect piece.',
    rating: 5,
    location: 'Los Angeles, USA',
    designation: 'Marketing Manager',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rajesh Patel',
    email: 'rajesh.patel@example.com',
    content: 'Traditional designs with modern elegance. Garava perfectly captures the essence of luxury jewelry. Very satisfied with my purchase.',
    rating: 5,
    location: 'Mumbai, India',
    designation: 'Business Owner',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    content: 'The fragrance collection is divine! Long-lasting, elegant scents that receive compliments everywhere I go. Will definitely order again.',
    rating: 5,
    location: 'London, UK',
    designation: 'Interior Designer',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    content: 'Exceptional quality and beautiful packaging. The online shopping experience was smooth and delivery was prompt. Highly recommended!',
    rating: 4,
    location: 'Seoul, Korea',
    designation: 'Software Engineer',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Amanda Smith',
    email: 'amanda.smith@example.com',
    content: 'Love the variety and uniqueness of the collection. Each piece is carefully crafted and the customer support team is incredibly helpful.',
    rating: 5,
    location: 'Toronto, Canada',
    designation: 'Artist',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@example.com',
    content: 'Premium quality at reasonable prices. The jewelry speaks for itself - elegant, timeless, and beautifully designed. Very happy customer!',
    rating: 5,
    location: 'Madrid, Spain',
    designation: 'Architect',
    isActive: true,
    isFeatured: true
  }
];

async function createTestimonials() {
  console.log('🚀 Testing testimonial API endpoints...');
  
  try {
    // First test the public endpoint to see existing testimonials
    console.log('📋 Fetching existing testimonials...');
    const getResponse = await fetch(`${API_BASE}/featured`);
    const existingData = await getResponse.json();
    console.log('Existing testimonials:', existingData);
    
    // Test creating testimonials without authentication (should work for now since we commented out auth)
    console.log('✨ Creating sample testimonials...');
    
    for (const testimonial of sampleTestimonials) {
      try {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testimonial),
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Created testimonial: ${testimonial.name}`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to create testimonial for ${testimonial.name}:`, error);
        }
      } catch (error) {
        console.log(`❌ Error creating testimonial for ${testimonial.name}:`, error.message);
      }
    }
    
    // Fetch testimonials again to verify
    console.log('📋 Fetching testimonials after creation...');
    const finalResponse = await fetch(`${API_BASE}/featured`);
    const finalData = await finalResponse.json();
    console.log('Final testimonials count:', finalData.data?.length || 0);
    
  } catch (error) {
    console.error('❌ Error testing testimonials API:', error);
  }
}

createTestimonials();