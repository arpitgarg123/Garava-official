// import React, { useMemo } from "react";

import { Link } from "react-router-dom";
import ShareButton from "../../components/blogs/ShareButton";
import { formatDate } from "../../utils/FormatDate";
import { FaArrowLeft } from "react-icons/fa";
import BackButton from "../../components/BackButton";

// /**
//  * MediaCoverage.jsx — Garava redesign
//  * - Clean luxury-style press/media coverage list
//  * - Responsive cards, external links open in new tab
//  * - Optional filters (outlet, year) shown as props example
//  *
//  * EventDetail.jsx — Garava redesign
//  * - Hero with cover, title, meta (date, city, location)
//  * - Content sections, schedule, CTA (RSVP), share icons, small gallery, related items
//  * - Production-grade, accessible, responsive, no extra libs
//  *
//  * Tailwind CSS required (dark mode friendly)
//  */

// /********************** MEDIA COVERAGE **********************/

// export function MediaCoveragePage({ items = MOCK_COVERAGE }) {
//   const years = useMemo(() => ["All", ...Array.from(new Set(items.map(i => new Date(i.date).getFullYear())))], [items]);
//   const outlets = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.outlet)))], [items]);

//   // minimal state-less example: wire filters with state if needed

//   return (
//     <div className="bg-background text-foreground">
//       {/* Hero */}
//       <section className="relative overflow-hidden border-b">
//         <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
//           <p className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Garava — Media Coverage</p>
//           <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Press & Features</h1>
//           <p className="mt-3 max-w-2xl text-muted-foreground">A selection of articles, interviews, and editorials featuring Garava.</p>
//         </div>
//       </section>

//       {/* Grid */}
//       <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {items.map(item => (
//             <MediaCard key={item.id} item={item} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// function MediaCard({ item }) {
//   return (
//     <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm">
//       {item.cover && (
//         <figure className="overflow-hidden">
//           <img
//             src={item.cover}
//             alt={item.outlet}
//             className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
//             loading="lazy"
//           />
//         </figure>
//       )}
//       <div className="p-5">
//         <div className="mb-2 flex items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             {item.logo && (
//               <img src={item.logo} alt="logo" className="h-5 w-5 rounded object-contain ring-1 ring-muted" loading="lazy" />
//             )}
//             <span className="text-xs font-medium">{item.outlet}</span>
//           </div>
//           <time className="text-xs text-muted-foreground" dateTime={item.date}>
//             {new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
//           </time>
//         </div>
//         <h3 className="line-clamp-2 text-lg font-medium leading-snug">{item.title}</h3>
//         {item.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>}
//         <div className="mt-4 flex items-center gap-3">
//           <a
//             href={item.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
//           >
//             Read article ↗
//           </a>
//         </div>
//       </div>
//     </article>
//   );
// }

// const MOCK_COVERAGE = [
//   {
//     id: "m1",
//     outlet: "Vogue India",
//     title: "The Quiet Luxury of Lab-Grown Diamonds",
//     date: "2025-03-12",
//     url: "https://example.com/vogue",
//     excerpt: "Garava leads a new wave of refined, ethical jewelry.",
//     cover: "https://images.unsplash.com/photo-1520975940461-2208d157c9e2?q=80&w=1600&auto=format&fit=crop",
//     logo: "https://dummyimage.com/100x100/eee/000.png&text=V",
//   },
//   {
//     id: "m2",
//     outlet: "GQ",
//     title: "Modern Engagement: Minimalist Rings for 2025",
//     date: "2025-06-20",
//     url: "https://example.com/gq",
//     excerpt: "How couples are redefining timelessness.",
//     cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
//     logo: "https://dummyimage.com/100x100/eee/000.png&text=GQ",
//   },
//   {
//     id: "m3",
//     outlet: "Elle",
//     title: "Sustainable Sparkle: Indian Labels to Know",
//     date: "2024-11-02",
//     url: "https://example.com/elle",
//     excerpt: "A shortlist of brands championing conscious craft.",
//     cover: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop",
//     logo: "https://dummyimage.com/100x100/eee/000.png&text=E",
//   },
// ];


const MOCK_EVENT = {
  kind: "Event",
  title: "Lab-Grown Diamond Showcase 2025",
  date: "2025-10-15",
  time: "4:00 PM – 8:00 PM",
  city: "Jaipur",
  location: "Garava Studio, MG Road",
  cover: "https://images.unsplash.com/photo-1722410180687-b05b50922362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRhaW1vbmQlMjBqZXdlbGxlcnl8ZW58MHx8MHx8fDA%3D",
  excerpt: "Experience our latest collection with live styling sessions and expert guidance.",
  url: "https://garava.in/news-and-events/lab-grown-diamond-showcase-2025",
 
  description:
    "Join us for an evening celebrating innovation and elegance. Explore limited pieces, consult with our specialists, and enjoy light refreshments.",
  agenda: [
    { time: "4:00 PM", title: "Welcome & Preview" },
    { time: "5:30 PM", title: "Designer Talk" },
    { time: "6:15 PM", title: "Styling Session" },
  ],
  highlights: [
    "Exclusive first look at new designs",
    "Personalized ring sizing guidance",
    "Special event-only offers",
  ],

};
const event = MOCK_EVENT
const EventDetailPage = () => {
    const canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://example.com/blog/post";

  return (
    <div className="mt-20">
   
    <div className="sticky top-36 z-10 mb-3">
        <BackButton />
      </div>
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-6xl px-4  pt-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="badge">{event.kind}</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
         
              <p className="max-w-2xl text-muted-foreground">{event.excerpt}</p>
       
                {/* {event.rsvpUrl && (
                  <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl bg-primary py-2 text-sm font-medium text-primary-foreground">RSVP ↗</a>
                )}
          */}
            </div>
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-2xl ring-1 ring-muted">
                <img src={event.cover} alt={event.title} className="aspect-[16/10] w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main */}
          <article className="lg:col-span-8">
            <section className="prose prose-neutral max-w-none dark:prose-invert">
              <h2 className="font-semibold text-xl">About this {event.kind.toUpperCase()}</h2>
              <p className="text-lg py-2">{event.description}</p>

              {event.agenda?.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg py-2">Schedule</h3>
                  <ul>
                    {event.agenda.map((a, idx) => (
                      <li key={idx}><strong>{a.time}</strong> — {a.title}</li>
                    ))}
                  </ul>
                </>
              )}

              {event.highlights?.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg py-2">Highlights</h3>
                  <ul>
                    {event.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </>
              )}

             
            </section>

             <div className="py-8">
            <h3 className="mb-3 text-sm font-semibold">Share this article</h3>
            <ShareButton title={event.title} url={canonicalUrl} />
          </div>

         
          </article>

          {/* Aside */}
          {/* <aside className="lg:col-span-4 space-y-6">
            {event.ctaNote && (
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-semibold">Good to know</h3>
                <p className="mt-2 text-sm text-muted-foreground">{event.ctaNote}</p>
              </div>
            )} */}

        
          {/* </aside> */}
        </div>
      </section>

      
    </div>
  );
}



export default EventDetailPage