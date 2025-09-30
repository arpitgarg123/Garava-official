import React, { useMemo, useState } from "react";
import EventCard from "../../components/newsEvents/EventCard";
import Pagination from "../../components/Pagination";

/**
 * EventsPage.jsx — Garava redesign (News & Events)
 * - Clean, luxury-styled UI using Tailwind (no extra libs)
 * - Tabs: Upcoming / Past / All
 * - Filters: type (News/Event), city, month; search; sort
 * - Responsive card grid; modal for quick view; pagination
 * - Production-grade patterns: memoization, controlled state, a11y
 * - Replace MOCK_EVENTS with API data when wiring
 */

 const MOCK_EVENTS = [
  {
    id: "e1",
    kind: "Event", // or "News"
    title: "Lab-Grown Diamond Showcase 2025",
    date: "2025-10-15",
    city: "Jaipur",
    location: "Garava Studio, MG Road",
    cover:
      "https://plus.unsplash.com/premium_photo-1681276168422-ebd2d7e95340?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRhaW1vbmQlMjBqZXdlbGxlcnl8ZW58MHx8MHx8fDA%3D",
    excerpt:
      "Experience our latest lab-grown diamond collection with live styling sessions and expert guidance.",
    rsvpUrl: "#",
    slug: "lab-grown-diamond-showcase-2025",
  },
  {
    id: "e2",
    kind: "News",
    title: "Garava Wins Ethical Jewelry Award",
    date: "2025-07-08",
    city: "Mumbai",
    location: "Press Release",
    cover:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "We are honored to receive recognition for our commitment to sustainability and design commitment.",
    slug: "garava-wins-ethical-jewelry-award",
  },
  {
    id: "e3",
    kind: "Event",
    title: "Valentine Trunk Show",
    date: "2025-02-10",
    city: "Delhi",
    location: "The Jewel Courtyard",
    cover:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1600&auto=format&fit=crop",
    excerpt:
      "An intimate preview of romantic pieces curated for the season.An intimate preview of romantic pieces curated for the season.",
    rsvpUrl: "#",
    slug: "valentine-trunk-show",
  },
];


 
 const  EventsPage =() =>{
  const [tab, setTab] = useState("Upcoming"); // Upcoming | Past | All
  const [q, setQ] = useState("");
  const [type, setType] = useState("All"); // All | Event | News
  const [city, setCity] = useState("All");
  const [month, setMonth] = useState("All"); // 1..12 or All
  const [sort, setSort] = useState("date_desc"); // date_desc | date_asc
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const cities = useMemo(() => ["All", ...Array.from(new Set(MOCK_EVENTS.map((e) => e.city)))], []);

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      // tab filter
      const isFuture = new Date(e.date) >= new Date(now.toDateString());
      if (tab === "Upcoming" && !isFuture) return false;
      if (tab === "Past" && isFuture) return false;

      if (type !== "All" && e.kind !== type) return false;
      if (city !== "All" && e.city !== city) return false;
      if (month !== "All") {
        const m = new Date(e.date).getMonth();
        if (months[m + 1] !== month) return false;
      }
      if (q) {
        const hay = (e.title + " " + e.city + " " + e.excerpt).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    })
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sort === "date_desc" ? db - da : da - db;
      });
  }, [tab, type, city, month, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetToFirstPage = () => setPage(1);

  return (
    <div className="mt-32">
      {/* Hero */}
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="badge">
            Garava — News & Events
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Discover what's happening</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Launches, trunk shows, and press moments—curated in one elegant place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-md w-1/4 border border-gray-300 bg-card p-1 text-sm ">
            {(["Upcoming", "Past", "All"]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); resetToFirstPage(); }}
                className={`rounded-xl px-3 py-2 transition cursor-pointer hover:underline   ${
                  tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        {pageItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {pageItems.map((e) => (
              <EventCard key={e.id} item={e} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  );
}

export default EventsPage



function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
      <div className="text-3xl">💎</div>
      <h3 className="mt-2 text-lg font-medium">No results</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Try adjusting filters or searching a different term.
      </p>
    </div>
  );
}
