import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../../components/newsEvents/EventCard";
import Pagination from "../../components/Pagination";
import BackButton from "../../components/BackButton";
import { fetchEventsGrouped } from "../../features/newsevents/slice";
import {
  selectEventsGrouped,
  selectNewsEventsLoading,
  selectNewsEventsError
} from "../../features/newsevents/selectors";

/**
 * EventsPage.jsx — Garava redesign (News & Events)
 * - Clean, luxury-styled UI using Tailwind (no extra libs)
 * - Tabs: Upcoming / Past / All
 * - Filters: type (News/Event), city, month; search; sort
 * - Responsive card grid; modal for quick view; pagination
 * - Production-grade patterns: memoization, controlled state, a11y
 * - Integrated with backend API
 */

 const  EventsPage =() =>{
  const dispatch = useDispatch();
  const eventsGrouped = useSelector(selectEventsGrouped);
  const loading = useSelector(selectNewsEventsLoading);
  const error = useSelector(selectNewsEventsError);
  const [tab, setTab] = useState("Upcoming"); // Upcoming | Past | All
  const [q, setQ] = useState("");
  const [type, setType] = useState("All"); // All | Event | News
  const [city, setCity] = useState("All");
  const [month, setMonth] = useState("All"); // 1..12 or All
  const [sort, setSort] = useState("date_desc"); // date_desc | date_asc
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchEventsGrouped({
      page: 1,
      limit: 100, // Get more items for client-side filtering
      q: q || undefined,
      kind: type !== "All" ? type : undefined,
      city: city !== "All" ? city : undefined
    }));
  }, [dispatch, q, type, city]);

  // Transform Redux data to match existing component structure
  const EVENTS_DATA = useMemo(() => {
    const allEvents = [];
    
    if (eventsGrouped?.upcoming?.items) {
      allEvents.push(...eventsGrouped.upcoming.items.map(item => ({
        id: item._id,
        kind: item.kind,
        title: item.title,
        date: item.date,
        city: item.city,
        location: item.location,
        cover: item.cover?.url || "",
        excerpt: item.excerpt,
        rsvpUrl: item.rsvpUrl,
        slug: item.slug
      })));
    }
    
    if (eventsGrouped?.past?.items) {
      allEvents.push(...eventsGrouped.past.items.map(item => ({
        id: item._id,
        kind: item.kind,
        title: item.title,
        date: item.date,
        city: item.city,
        location: item.location,
        cover: item.cover?.url || "",
        excerpt: item.excerpt,
        rsvpUrl: item.rsvpUrl,
        slug: item.slug
      })));
    }
    
    return allEvents;
  }, [eventsGrouped]);

  const cities = useMemo(() => ["All", ...Array.from(new Set(EVENTS_DATA.map((e) => e.city).filter(Boolean)))], [EVENTS_DATA]);

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
    return EVENTS_DATA.filter((e) => {
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
  }, [EVENTS_DATA, tab, type, city, month, q, sort, now, months]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetToFirstPage = () => setPage(1);

  // Show loading state
  if (loading && EVENTS_DATA.length === 0) {
    return (
      <div className="mt-30 max-md:mt-0">
        <div className="sticky top-20 z-10 mb-3 max-md:top-7">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 max-md:mt-0 ">
      <div className="sticky top-58 z-10 mb-3 max-md:top-7">
        <BackButton />
      </div>
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <p className="badge">
            Garava — News & Events
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Discover what's happening</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Launches, trunk shows, and press moments—curated in one elegant place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-md w-1/4 max-md:w-full border border-gray-300 bg-card p-1 text-[1.0625rem] ">
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
      <p className="mt-1 max-w-md text-[1.0625rem] text-muted-foreground">
        Try adjusting filters or searching a different term.
      </p>
    </div>
  );
}
