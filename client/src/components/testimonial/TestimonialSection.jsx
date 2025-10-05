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
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
      
      // Update current slide for mobile dots
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 384;
      const newSlide = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newSlide);
    }
  };

  // Navigation functions
  const scrollToDirection = (direction) => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 384;
      const gap = window.innerWidth < 1024 ? 24 : 32;
      const scrollAmount = cardWidth + gap;
      
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
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [testimonials]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdOutlineStar 
        key={i} 
        size={16} 
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

  // Go to specific slide
  const goToSlide = (slideIndex) => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 384;
      const gap = window.innerWidth < 1024 ? 24 : 32;
      const scrollAmount = (cardWidth + gap) * slideIndex;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Loading skeleton - Responsive
  const LoadingSkeleton = () => (
    <div className="w-full py-8 sm:py-12 lg:py-16 xl:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-lg w-64 sm:w-80 lg:w-96 mx-auto mb-3 sm:mb-4 animate-pulse"></div>
          <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded-lg w-72 sm:w-96 lg:w-[28rem] mx-auto animate-pulse"></div>
        </div>
        <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-hidden px-4 sm:px-8 lg:px-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 sm:w-72 lg:w-80 xl:w-96 bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 animate-pulse">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6"></div>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="text-center">
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24 mx-auto mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error state - Responsive
  if (error) {
    return (
      <div className="w-full py-8 sm:py-12 lg:py-16 xl:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-playfair tracking-tight">
              What Our Customers Say
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto">
              <p className="text-red-600 font-medium text-sm sm:text-base mb-4">Unable to load testimonials</p>
              <button 
                onClick={() => dispatch(fetchFeaturedTestimonials(8))}
                className="btn btn-small bg-red-600 text-white hover:bg-red-700 transition-colors w-full sm:w-auto"
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

  // No testimonials state - Responsive
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <div className="w-full py-8 sm:py-12 lg:py-16 xl:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-playfair tracking-tight">
              What Our Customers Say
            </h2>
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-12 max-w-lg sm:max-w-2xl mx-auto">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">💎</div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
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
    <section className="w-full py-8 sm:py-12 lg:py-16 xl:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 font-playfair tracking-tight leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Discover why thousands of customers trust Garava for their most precious moments
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop Only */}
          <div className="hidden xl:block">
            <button 
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`btn btn-small absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollLeft 
                  ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(-50%, -50%)' }}
              aria-label="Previous testimonial"
            >
              <MdArrowBack size={18} />
            </button>
            
            <button 
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`btn btn-small absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollRight 
                  ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(50%, -50%)' }}
              aria-label="Next testimonial"
            >
              <MdArrowForward size={18} />
            </button>
          </div>

          {/* Testimonials Slider - Fully Responsive */}
          <div 
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto cursor-grab select-none scroll-smooth px-4 sm:px-6 lg:px-8 xl:px-16 testimonials-scroll"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
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

          {/* Mobile/Tablet Navigation Dots */}
          <div className="flex justify-center mt-6 sm:mt-8 xl:hidden">
            <div className="flex gap-2 sm:gap-3">
              {testimonials.slice(0, Math.min(testimonials.length, 6)).map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-small w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                    currentSlide === index 
                      ? 'bg-amber-400 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex justify-center mt-4 gap-4 sm:hidden">
            <button 
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`btn btn-small w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollLeft 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              aria-label="Previous testimonial"
            >
              <MdArrowBack size={16} />
            </button>
            
            <button 
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`btn btn-small w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollRight 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              aria-label="Next testimonial"
            >
              <MdArrowForward size={16} />
            </button>
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
    <article className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-80 xl:w-96 bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md">
      {/* Responsive Avatar */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
            {getAlphabetAvatar(testimonial.name)}
          </span>
        </div>
      </div>

      {/* Responsive Content */}
      <div className="text-center mb-4 sm:mb-6">
        <blockquote className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-normal line-clamp-4 min-h-[4rem] sm:min-h-[5rem]">
          "{testimonial.content}"
        </blockquote>
      </div>

      {/* Responsive Rating */}
      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <div className="flex gap-0.5 sm:gap-1">
          {renderStars(testimonial.rating)}
        </div>
      </div>

      {/* Responsive Customer Info */}
      <div className="text-center">
        <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
          {testimonial.name}
        </h4>
        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          {testimonial.location || 'Verified Customer'}
        </p>
      </div>
    </article>
  );
};

export default TestimonialSection;