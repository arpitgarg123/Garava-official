import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../../components/blogs/ShareButton";
import { formatDate } from "../../utils/FormatDate";
import BackButton from "../../components/BackButton";
import { fetchNewsEventBySlug } from "../../features/newsevents/slice";
import {
  selectCurrentNewsEvent,
  selectNewsEventsLoading,
  selectNewsEventsError
} from "../../features/newsevents/selectors";

const EventDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const event = useSelector(selectCurrentNewsEvent);
  const loading = useSelector(selectNewsEventsLoading);
  const error = useSelector(selectNewsEventsError);

  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://example.com/event";

  useEffect(() => {
    if (slug) {
      dispatch(fetchNewsEventBySlug(slug));
    }
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="mt-20">
        <div className="sticky top-36 z-10 mb-3">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mt-20">
        <div className="sticky top-36 z-10 mb-3">
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            {error || "Event not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 max-md:mt-0">
      <div className="sticky top-36 max-md:top-7 z-10 mb-3 max-md:mb-0">
        <BackButton />
      </div>
      <section className="relative overflow-hidden ">
        <div className="mx-auto max-w-6xl px-4 max-md:p-0 max-md:px-4  pt-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="badge">{event.kind}</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
              
              {/* Event meta information */}
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                {event.city && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{event.city}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
         
              <p className="mt-4 max-w-2xl text-muted-foreground">{event.excerpt}</p>
       
              {event.rsvpUrl && (
                <div className="mt-6">
                  <a 
                    href={event.rsvpUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    RSVP ↗
                  </a>
                </div>
              )}
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl ring-1 ring-muted">
                <img 
                  src={event.cover?.url || event.cover || "https://images.unsplash.com/photo-1722410180687-b05b50922362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"} 
                  alt={event.title} 
                  className="aspect-[16/10] w-full object-cover" 
                />
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
              <h2 className="font-semibold text-xl">About this {event.kind}</h2>
              
              {event.content ? (
                <div dangerouslySetInnerHTML={{ __html: event.content }} />
              ) : (
                <p className="text-lg py-2">{event.excerpt}</p>
              )}

              {/* For now, we'll hide the agenda and highlights since they're not in the backend model
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
              */}
            </section>

            <div className="py-8">
              <h3 className="mb-3 text-sm font-semibold">Share this event</h3>
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