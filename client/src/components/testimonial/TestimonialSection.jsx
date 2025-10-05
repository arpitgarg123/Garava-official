import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineStar, MdArrowBack, MdArrowForward } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { 
  fetchFeaturedTestimonials,
  clearError 
} from '../../features/testimonial/slice';
import {
  selectFeaturedTestimonials,
  selectFeaturedTestimonialsLoading,
  selectTestimonialError
} from '../../features/testimonial/selectors';

const TestimonialSection = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Redux state
  const testimonials = useSelector(selectFeaturedTestimonials);
  const loading = useSelector(selectFeaturedTestimonialsLoading);
  const error = useSelector(selectTestimonialError);

  // Fetch testimonials on mount
  useEffect(() => {
    dispatch(fetchFeaturedTestimonials(8));
  }, [dispatch]);

  // Clear errors
  useEffect(() => {
    if (error) {
      console.error('Testimonial error:', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Check scroll position for navigation buttons
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Navigation functions
  const scrollToDirection = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Touch/Mouse event handlers
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleTouchStart = (e) => {
    setIsScrolling(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScrollPosition();
  };

  const handleTouchMove = (e) => {
    if (!isScrolling) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScrollPosition();
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [testimonials]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdOutlineStar 
        key={i} 
        size={20} 
        className={`${i < rating ? 'text-amber-400' : 'text-gray-300'} transition-colors duration-200`}
        aria-hidden="true" 
      />
    ));
  };

  // Generate alphabet avatar
  const getAlphabetAvatar = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || 'G';
    return firstLetter;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="w-full py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-gray-50 rounded-2xl p-8 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-playfair">
              What Our Customers Say
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Unable to load testimonials</p>
              <button 
                onClick={() => dispatch(fetchFeaturedTestimonials(8))}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // No testimonials state
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <div className="w-full py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-playfair">
              What Our Customers Say
            </h2>
            <div className="bg-gray-50 rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💎</div>
              <p className="text-gray-600 text-lg leading-relaxed">
                We're gathering precious testimonials from our valued customers. 
                Check back soon to read their experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header - Matching Reference Design */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfair tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover why thousands of customers trust Garava for their most precious moments
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop */}
          <div className="hidden lg:block">
            <button 
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollLeft 
                  ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <MdArrowBack size={20} />
            </button>
            
            <button 
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollRight 
                  ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <MdArrowForward size={20} />
            </button>
          </div>

          {/* Testimonials Slider - Hidden Scrollbar */}
          <div 
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto cursor-grab select-none scroll-smooth px-4 lg:px-16 testimonials-scroll"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`${testimonial._id}-${index}`} 
                testimonial={testimonial}
                renderStars={renderStars}
                getAlphabetAvatar={getAlphabetAvatar}
              />
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center mt-8 lg:hidden">
            <div className="flex gap-2">
              {testimonials.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300 hover:bg-amber-400 transition-colors duration-200"
                  onClick={() => {
                    const scrollAmount = 320 * index;
                    scrollRef.current?.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style jsx>{`
        .testimonials-scroll::-webkit-scrollbar {
          display: none;
        }
        .testimonials-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

const TestimonialCard = ({ testimonial, renderStars, getAlphabetAvatar }) => {
  return (
    <article className="flex-shrink-0 w-80 lg:w-96 bg-gray-50 rounded-2xl p-8 lg:p-10 pointer-events-none hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200">
      {/* Alphabet Avatar - Matching Reference Design */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl lg:text-2xl font-bold">
            {getAlphabetAvatar(testimonial.name)}
          </span>
        </div>
      </div>

      {/* Content - Clean Layout Like Reference */}
      <div className="text-center mb-6">
        <blockquote className="text-gray-700 text-base lg:text-lg leading-relaxed font-normal line-clamp-4 min-h-[5rem]">
          {testimonial.content}
        </blockquote>
      </div>

      {/* Rating - Smaller and Centered */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex gap-1 ">
          {renderStars(testimonial.rating)}
        </div>
      </div>

      {/* Customer Info - Simple and Clean */}
      <div className="text-center">
        <h4 className="font-semibold text-gray-900 text-lg mb-1">
          {testimonial.name}
        </h4>
        <p className="text-gray-500 text-sm font-medium">
          {testimonial.location || 'Customer'}
        </p>
      </div>
    </article>
  );
};

export default TestimonialSection;