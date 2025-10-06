const MediaCard =({ item }) =>{
  return (
    <article className="group overflow-hidden bg-gray-50">
      {item.cover && (
        <figure className="overflow-hidden">
          <img
            src={item.cover}
            alt={item.outlet}
            className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </figure>
      )}
      <div className="p-5 ">
        <div className="flex h-1/2 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            
            <span className="text-xs font-medium">{item.outlet}</span>
          </div>
          <time className="text-xs text-muted-foreground" dateTime={item.date}>
            {new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
          </time>
        </div>
        <h3 className="line-clamp-2 text-lg font-medium leading-snug">{item.title}</h3>
        {item.excerpt && <p className="mt-2 line-clamp-3 text-md text-muted-foreground">{item.excerpt}</p>}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            Read article ↗
          </a>
        </div>
      </div>
    </article>
  );
}

export default MediaCard