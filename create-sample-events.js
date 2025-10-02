// Sample data creation script
const sampleEvents = [
  {
    title: "Garava Luxury Jewelry Exhibition",
    slug: "garava-luxury-jewelry-exhibition-2025",
    excerpt: "Experience our latest luxury jewelry collection in an exclusive exhibition showcasing the finest craftsmanship.",
    content: "Join us for an exclusive exhibition featuring our latest luxury jewelry collection. Discover exquisite pieces that blend traditional craftsmanship with contemporary design.",
    type: "event",
    kind: "Event",
    date: new Date("2025-11-15T18:00:00Z"),
    city: "Mumbai",
    location: "Grand Ballroom, The Taj Mahal Palace",
    rsvpUrl: "https://garava.com/rsvp/jewelry-exhibition",
    status: "published",
    cover: {
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      alt: "Luxury jewelry exhibition"
    }
  },
  {
    title: "Festive Collection Launch",
    slug: "festive-collection-launch-2025",
    excerpt: "Celebrate the festive season with our specially curated collection of traditional and contemporary jewelry pieces.",
    content: "Our festive collection brings together the best of traditional Indian jewelry with modern design sensibilities.",
    type: "event",
    kind: "Event", 
    date: new Date("2025-10-25T19:00:00Z"),
    city: "Delhi",
    location: "India Habitat Centre",
    rsvpUrl: "https://garava.com/rsvp/festive-launch",
    status: "published",
    cover: {
      url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800",
      alt: "Festive jewelry collection"
    }
  },
  {
    title: "Jewelry Craftsmanship Workshop",
    slug: "jewelry-craftsmanship-workshop-2024",
    excerpt: "A hands-on workshop showcasing traditional jewelry making techniques by master craftsmen.",
    content: "Learn about the intricate art of jewelry making from our master craftsmen in this exclusive workshop.",
    type: "event",
    kind: "Event",
    date: new Date("2024-09-15T10:00:00Z"),
    city: "Jaipur", 
    location: "Heritage Craft Center",
    rsvpUrl: "https://garava.com/rsvp/workshop",
    status: "published",
    cover: {
      url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800",
      alt: "Jewelry craftsmanship workshop"
    }
  }
];

const sampleMediaCoverage = [
  {
    title: "Garava Featured in Vogue India",
    slug: "garava-featured-vogue-india-2025",
    excerpt: "Our latest bridal collection gets spotlight in Vogue India's luxury jewelry feature.",
    content: "Vogue India showcases Garava's exquisite bridal collection in their latest luxury feature.",
    type: "media-coverage",
    date: new Date("2025-09-20T00:00:00Z"),
    outlet: "Vogue India",
    url: "https://vogue.in/garava-luxury-jewelry",
    status: "published",
    cover: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      alt: "Vogue India feature"
    }
  },
  {
    title: "Times of India Coverage",
    slug: "times-india-coverage-2025",
    excerpt: "Times of India highlights Garava's commitment to sustainable luxury jewelry practices.",
    content: "An in-depth article about Garava's sustainable practices and ethical sourcing.",
    type: "media-coverage", 
    date: new Date("2025-08-10T00:00:00Z"),
    outlet: "Times of India",
    url: "https://timesofindia.com/garava-sustainable-luxury",
    status: "published",
    cover: {
      url: "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=800", 
      alt: "Times of India coverage"
    }
  }
];

console.log("Sample Events:", JSON.stringify(sampleEvents, null, 2));
console.log("\nSample Media Coverage:", JSON.stringify(sampleMediaCoverage, null, 2));