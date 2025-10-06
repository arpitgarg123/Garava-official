import mongoose from 'mongoose';
import InstagramPost from './src/modules/instagram/instagram.model.js';
import { env } from './src/config/env.js';

const samplePosts = [
  {
    title: "Elegant Diamond Collection",
    description: "Discover our stunning diamond jewelry collection featuring exquisite craftsmanship and timeless designs.",
    image: {
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      alt: "Elegant diamond jewelry collection"
    },
    instagramUrl: "https://www.instagram.com/p/sample1/",
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: "Signature Fragrance Line",
    description: "Experience our luxurious signature fragrances that capture the essence of elegance and sophistication.",
    image: {
      url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop",
      alt: "Luxury perfume bottles"
    },
    instagramUrl: "https://www.instagram.com/p/sample2/",
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    title: "Handcrafted Artisan Jewelry",
    description: "Each piece is meticulously handcrafted by our skilled artisans, ensuring unique beauty in every design.",
    image: {
      url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
      alt: "Handcrafted jewelry pieces"
    },
    instagramUrl: "https://www.instagram.com/p/sample3/",
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },
  {
    title: "Premium Essential Collection",
    description: "Our premium essential collection brings together the finest materials and contemporary design.",
    image: {
      url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop",
      alt: "Premium jewelry essentials"
    },
    instagramUrl: "https://www.instagram.com/p/sample4/",
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  }
];

async function seedInstagramPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing posts
    await InstagramPost.deleteMany({});
    console.log('Cleared existing Instagram posts');

    // Insert sample posts
    const createdPosts = await InstagramPost.insertMany(samplePosts);
    console.log(`Created ${createdPosts.length} Instagram posts`);

    console.log('Instagram posts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Instagram posts:', error);
    process.exit(1);
  }
}

seedInstagramPosts();