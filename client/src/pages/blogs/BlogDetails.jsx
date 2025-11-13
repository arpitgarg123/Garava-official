import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../../components/blogs/ShareButton";
import BackButton from "../../components/BackButton";
import {
  fetchBlogBySlug,
  clearCurrentBlog,
  selectCurrentBlog,
  selectBlogLoading,
  selectBlogError,
} from "../../features/blogs/slice";
import { formatDate } from "../../utils/FormatDate";



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

export default function BlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const blog = useSelector(selectCurrentBlog);
  const loading = useSelector(selectBlogLoading);
  const error = useSelector(selectBlogError);

  const scrollRef = useRef(null);
  const progress = useReadingProgress(scrollRef);

  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "https://example.com/blog/post";

  useEffect(() => {
    if (slug) {
      // Sanitize slug before calling API (remove leading/trailing hyphens)
      const cleanSlug = slug.replace(/^-+|-+$/g, '');
      dispatch(fetchBlogBySlug(cleanSlug));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, slug]);

  const getImageUrl = () => {
    if (blog?.coverImage?.url) {
      return blog.coverImage.url;
    }
    return 'https://via.placeholder.com/1200x600?text=Blog+Image';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 max-md:mt-0 ">
        <div className="sticky top-0 z-10 mb-3 pt-20">
          <BackButton />
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 max-md:mt-0 ">
        <div className="sticky top-0 z-10 mb-3 pt-20">
          <BackButton />
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 max-md:mt-0 ">
        <div className="sticky top-0 z-10 mb-3 pt-20">
          <BackButton />
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Blog not found</div>
          <button 
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] mt-30 max-md:mt-0 bg-background text-foreground">
      <div className="sticky top-48 z-10 mb-3 max-md:top-10">
        <BackButton />
      </div>
      <div
        className="sticky top-0 z-30 h-1 w-full "
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="h-full bg-black transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:gap-10">
        <article ref={scrollRef} className="">
          <header className="p-5 sm:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              {blog.category && (
                <span className="rounded-xl bg-black text-white px-3 py-1 text-[1.0625rem] font-medium">
                  {blog.category}
                </span>
              )}
              {blog.readingTime && (
                <span className="text-[1.0625rem] flex-center"> ● {blog.readingTime} min read</span>
              )}
            </div>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              {blog.title}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'G')}&background=random`}
                alt={blog.author?.name || 'Garava'}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-300"
                loading="lazy"
              />
              <div>
                <div className="text-[1.0625rem] font-medium">Posted by {blog.author?.name || 'Garava'}</div>
                <div className="text-[1.0625rem] text-gray-600">Updated {formatDate(blog.publishAt || blog.createdAt)}</div>
              </div>
            </div>
          </header>

          {/* Cover image */}
          <figure className="mx-5 overflow-hidden rounded-xl sm:mx-8">
            <img
              src={getImageUrl()}
              alt={blog.coverImage?.alt || blog.title}
              className="aspect-[16/9] w-full rounded-xl object-cover"
              loading="eager"
            />
          </figure>

          <section className="prose prose-neutral mx-auto max-w-none px-5 py-8 dark:prose-invert prose-headings:scroll-mt-24 prose-a:underline-offset-4 prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </section>

          <div className="border-t px-5 py-6 sm:px-8">
            <h3 className="mb-3 text-[1.0625rem] font-semibold">Share this article</h3>
            <ShareButton title={blog.title} url={canonicalUrl} />
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t px-5 py-6 sm:px-8">
              {blog.tags.map((tag, index) => (
                <span key={index} className="rounded-full border px-3 py-1 text-[1.0625rem] text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}