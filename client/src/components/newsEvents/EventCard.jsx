import React from 'react'
import { formatDate } from '../../utils/FormatDate';

const EventCard = ({item}) => {
  return (
    <article className="group overflow-hidden bg-gray-50 mt-4">
      <figure className="overflow-hidden">
        <img
          src={item.cover}
          alt={item.title}
          className="aspect-[16/8] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </figure>
      <div className="p-4  h-fit flex flex-col items-start justify-between">
        <div className=" flex  gap-2 text-xs self-start">
          <span className={`rounded-full px-2 py-0.5  ${item.kind === "Event" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200"}`}>
            {item.kind}
          </span>
          <span className="text-muted-foreground">{formatDate(item.date)}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{item.city}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-medium leading-snug self-start">{item.title}</h3>
        <p className=" line-clamp-3 text-md text-muted-foreground self-start" >{item.excerpt}</p>

        <div className="mt-4 flex  gap-3 self-start">
          {item.rsvpUrl && (
            <a
              href={item.rsvpUrl}
              className="inline-flex  rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
            >
              RSVP
            </a>
          )}
          <a
            href={`/event_details/${item.slug}`}
            className="text-xs font-medium underline underline-offset-4 hover:opacity-80"
          >
            View details
          </a>
        </div>
      </div>
    </article>
  );
}

export default EventCard
