import React, { useEffect, useMemo, useRef, useState } from "react";
import ShareButton from "../../components/blogs/ShareButton";

const DEFAULT_POST = {
  category: "Jewelry",
  title: "How to Secretly Find Out Your Partner’s Ring Size for a Surprise Proposal",
  postedBy: { name: "Garava", avatar: "https://ui-avatars.com/api/?name=G&background=random" },
  publishedAt: "2025-07-12T00:00:00.000Z",
  readTimeMinutes: 7,
  coverImage:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
//   tags: [
//     "Engagement ideas",
//     "Ring size tips",
//     "Jewelry tips",
//     "Lab grown diamonds",
//   ],
  html: `
    <p>Arranging a surprise proposal is <strong>romantic</strong>—but getting the <em>ring size</em> right without asking is tricky. Here's a discreet guide.</p>

    <h2 id="borrow-a-ring">1. Borrow a Ring They Already Wear</h2>
    <p>Borrow a ring from the correct finger and compare with a <a href="#">ring-size chart</a>, or take it to a jeweler.</p>

    <h2 id="ask-a-friend">2. Ask a Trusted Friend or Family Member</h2>
    <ul>
      <li>Loop in a sibling or best friend.</li>
      <li>Make it a casual shopping trip.</li>
      <li>Confirm metal, style, and setting preferences.</li>
    </ul>

    <h2 id="string-trick">3. Use the String or Paper Trick (While They Sleep)</h2>
    <p>Measure with a thin thread or paper strip and compare in millimeters against a chart.</p>

    <h2 id="be-playful">4. Playfully Ask Without Being Obvious</h2>
    <blockquote>“A friend is buying a ring—do you know your size?”</blockquote>
    <p>Or turn it into a fun guessing game.</p>

    <h2 id="compare-hands">5. Compare Their Hand to Yours</h2>
    <p>Not scientific, but gives a ballpark. Remember: many rings can be resized.</p>

    <h2 id="final-tip">Final Tip: Choose a Resizable Setting</h2>
    <p>Opt for simple bands or solitaires that are easier to resize post-proposal.</p>

    <h3 id="faqs">FAQs</h3>
    <p><strong>Can a jeweler resize a ring?</strong> Usually 1–2 sizes. Check brand policies.</p>
    <p><strong>Are lab-grown diamonds good?</strong> Yes—ethical, budget-friendly, and gorgeous.</p>
  `,

};

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return iso;
  }
}

function useReadingProgress(targetRef) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = targetRef.current;
      if (!el) return;
      const total = el.scrollHeight - el.clientHeight;
      const current = el.scrollTop;
      const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
      setProgress(pct);
    };
    const el = targetRef.current;
    if (!el) return;
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [targetRef]);
  return progress;
}


export default function BlogDetails({ post = DEFAULT_POST }) {
  const scrollRef = useRef(null);
  const progress = useReadingProgress(scrollRef);

  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://example.com/blog/post";

  return (
    <div className="relative min-h-[100dvh] mt-20 bg-background text-foreground">
      {/* Reading progress */}
      <div
        className="sticky top-0 z-30 h-1 w-full bg-muted/50"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:gap-10">
 
        <article ref={scrollRef} className="">
    
          <header className="p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-black text-white px-3 py-1 text-sm font-medium text-primary">
                {post.category}
              </span>
              <span className="text-xs  flex-center "> ● {post.readTimeMinutes} min read</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={post.postedBy?.avatar}
                alt={post.postedBy?.name}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-muted"
                loading="lazy"
              />
              <div>
                <div className="text-sm font-medium">Posted by {post.postedBy?.name}</div>
                <div className="text-xs text-muted-foreground">Updated {formatDate(post.publishedAt)}</div>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <figure className="mx-5 overflow-hidden rounded-xl sm:mx-8">
              <img
                src={post.coverImage}
                alt="Cover"
                className="aspect-[16/9] w-full rounded-xl object-cover"
                loading="eager"
              />
            </figure>
          )}

  
          <section className="prose prose-neutral mx-auto max-w-none px-5 py-8 dark:prose-invert prose-headings:scroll-mt-24 prose-a:underline-offset-4 prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </section>

          <div className="border-t px-5 py-6 sm:px-8">
            <h3 className="mb-3 text-sm font-semibold">Share this article</h3>
            <ShareButton title={post.title} url={canonicalUrl} />
          </div>

          {/* Tags */}
          {/* {post.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t px-5 py-6 sm:px-8">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          )} */}

       
        </article>
      </div>
    </div>
  );
}
