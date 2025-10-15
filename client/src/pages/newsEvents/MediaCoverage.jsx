import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MediaCard from "../../components/newsEvents/MediaCard";
import BackButton from "../../components/BackButton";
import { fetchMediaCoverage } from "../../features/newsevents/slice";
import {
  selectMediaCoverage,
  selectNewsEventsLoading,
  selectNewsEventsError
} from "../../features/newsevents/selectors";



export const MediaCoveragePage = () => {
  const dispatch = useDispatch();
  const mediaCoverage = useSelector(selectMediaCoverage);
  const loading = useSelector(selectNewsEventsLoading);
  const error = useSelector(selectNewsEventsError);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchMediaCoverage({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Transform Redux data to match existing component structure
  const COVERAGE_DATA = useMemo(() => {
    if (!mediaCoverage?.items) return [];
    
    return mediaCoverage.items.map(item => ({
      id: item._id,
      outlet: item.outlet,
      title: item.title,
      date: item.date,
      url: item.url,
      excerpt: item.excerpt,
      cover: item.cover?.url || ""
    }));
  }, [mediaCoverage]);

  const items = COVERAGE_DATA;
  const years = useMemo(() => ["All", ...Array.from(new Set(items.map(i => new Date(i.date).getFullYear())))], [items]);
  const outlets = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.outlet)))], [items]);

  // Show loading state
  if (loading && items.length === 0) {
    return (
      <div className="mt-30 max-md:mt-0">
        <div className="sticky top-20 z-10 mb-3">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading media coverage...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-30 max-md:mt-0">
      <div className="sticky top-44 z-10 mb-3 max-md:top-7">
        <BackButton />
      </div>
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-6xl  py-16 max-md:py-0 max-md:px-4 sm:px-6 lg:px-8">
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



