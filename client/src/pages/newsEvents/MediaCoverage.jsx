import React, { useMemo } from "react";
import MediaCard from "../../components/newsEvents/MediaCard";



const MOCK_COVERAGE = [
  {
    id: "m1",
    outlet: "Vogue India",
    title: "The Quiet Luxury of Lab-Grown Diamonds",
    date: "2025-03-12",
    url: "https://example.com/vogue",
    excerpt: "Garava leads a new wave of refined, ethical jewelry.",
    cover: "https://images.unsplash.com/photo-1520975940461-2208d157c9e2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "m2",
    outlet: "GQ",
    title: "Modern Engagement: Minimalist Rings for 2025",
    date: "2025-06-20",
    url: "https://example.com/gq",
    excerpt: "How couples are redefining timelessness. couples sdfckn",
    cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "m3",
    outlet: "Elle",
    title: "Sustainable Sparkle: Indian Labels to Know",
    date: "2024-11-02",
    url: "https://example.com/elle",
    excerpt: "A shortlist of brands championing conscious craft.",
    cover: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop",
  },
];

const items = MOCK_COVERAGE
export const MediaCoveragePage = () => {
  const years = useMemo(() => ["All", ...Array.from(new Set(items.map(i => new Date(i.date).getFullYear())))], [items]);
  const outlets = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.outlet)))], [items]);


  return (
    <div className="mt-20">
      {/* Hero */}
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-6xl  py-16 sm:px-6 lg:px-8">
          <p className="badge">Garava — Media Coverage</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Press & Features</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">A selection of articles, interviews, and editorials featuring Garava.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4  sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}



