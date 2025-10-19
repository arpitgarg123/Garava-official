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
      // console.error('Testimonial error:', error);
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

  // Loading skeleton - Fixed responsive issues
  const LoadingSkeleton = () => (
    <div className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="h-8 sm:h-10 lg:h-12 bg-gray-200  w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200  w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[320px] bg-gray-50 rounded-2xl p-8 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 "></div>
                <div className="h-4 bg-gray-200  w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200  w-1/2 mx-auto"></div>
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 "></div>
                ))}
              </div>
              <div className="text-center">
                <div className="h-5 bg-gray-200  w-24 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200  w-20 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Error state - Fixed
  if (error) {
    return (
      <div className="w-full py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-xl lg:text-xl font-bold text-gray-900 mb-6 font-playfair">
              What Our Customers Say
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-600 font-medium mb-4">Unable to load testimonials</p>
              <button 
                onClick={() => dispatch(fetchFeaturedTestimonials(8))}
                className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700 transition-colors"
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

  // No testimonials state - Fixed
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <div className="w-full py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-6 font-playfair">
              What Our Customers Say
            </h2>
            <div className="bg-gray-50  p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💎</div>
              <p className="text-gray-600 text-sm leading-relaxed">
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
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Fixed responsive typography */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-2 font-playfair leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover why thousands of customers trust Garava for their most precious moments
          </p>
        </div>

        {/* Testimonials Slider Container - Fixed positioning */}
        <div className="relative">
          {/* Navigation Buttons - Desktop Only, Fixed positioning */}
          <button 
            onClick={() => scrollToDirection('left')}
            disabled={!canScrollLeft}
            className={`hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 items-center justify-center ${
              canScrollLeft 
                ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
            aria-label="Previous testimonial"
          >
            <MdArrowBack size={20} />
          </button>
          
          <button 
            onClick={() => scrollToDirection('right')}
            disabled={!canScrollRight}
            className={`hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 transition-all duration-300 items-center justify-center ${
              canScrollRight 
                ? 'hover:bg-gray-50 hover:scale-105 text-gray-700' 
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
            aria-label="Next testimonial"
          >
            <MdArrowForward size={20} />
          </button>

          {/* Testimonials Slider - Fixed responsive layout */}
          <div 
            ref={scrollRef}
            className=" gap-6 overflow-x-auto w-full flex  items-center justify-center cursor-grab select-none scroll-smooth px-4 xl:px-16"
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

          {/* Mobile/Tablet Navigation Dots - Fixed spacing */}
          <div className="flex justify-center mt-8 xl:hidden">
            <div className="flex gap-2">
              {testimonials.slice(0, Math.min(testimonials.length, 6)).map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
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

          {/* Mobile Navigation Arrows - Fixed styling */}
          <div className="flex justify-center mt-6 gap-4 sm:hidden">
            <button 
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollLeft 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              aria-label="Previous testimonial"
            >
              <MdArrowBack size={18} />
            </button>
            
            <button 
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 transition-all duration-300 flex items-center justify-center ${
                canScrollRight 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              aria-label="Next testimonial"
            >
              <MdArrowForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Hide Scrollbar CSS */}
      <style jsx="true">{`
        .testimonials-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// Fixed TestimonialCard component with proper responsive design
const TestimonialCard = ({ testimonial, renderStars, getAlphabetAvatar }) => {
  return (
    <article className="flex-shrink-0 w-80 bg-gray-50  p-8 hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md">
      {/* Quote Icon - Fixed positioning */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <FaQuoteLeft className="text-amber-600 text-sm" />
        </div>
      </div>

      {/* Content - Fixed height and spacing */}
      <div className="text-center mb-6">
        <blockquote className="text-gray-700 text-base leading-relaxed font-normal line-clamp-4 min-h-[6rem]">
          "{testimonial.content}"
        </blockquote>
      </div>

      {/* Rating - Fixed spacing */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex gap-1">
          {renderStars(testimonial.rating)}
        </div>
      </div>

      {/* Avatar - Fixed design */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">
            {getAlphabetAvatar(testimonial.name)}
          </span>
        </div>
      </div>

      {/* Customer Info - Fixed typography */}
      <div className="text-center">
        <h4 className="font-semibold text-gray-900 text-lg mb-1">
          {testimonial.name}
        </h4>
        <p className="text-gray-500 text-sm font-medium">
          {testimonial.location || 'Verified Customer'}
        </p>
      </div>
    </article>
  );
};

export default TestimonialSection;