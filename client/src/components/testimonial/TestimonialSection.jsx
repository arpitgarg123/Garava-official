import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineStar } from "react-icons/md";
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

  // Touch/Mouse event handlers for smooth swipe
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
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isScrolling) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
    scrollRef.current.style.cursor = 'grab';
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
    scrollRef.current.style.cursor = 'grab';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <MdOutlineStar 
        key={i} 
        size={20} 
        color={i < rating ? "#fbbf24" : "#e5e7eb"} 
        aria-hidden="true" 
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  // Debug logging
  useEffect(() => {
    console.log('TestimonialSection mounted');
    console.log('Testimonials:', testimonials);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [testimonials, loading, error]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-red-600">Error loading testimonials: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no testimonials from API
  if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
    return (
      <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">No featured testimonials available. Please add some testimonials in the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  // Create infinite scroll effect by duplicating testimonials
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of customers trust Garava for their most precious moments
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto cursor-grab select-none"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
              scrollBehavior: 'smooth'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`${testimonial._id}-${index}`} 
                testimonial={testimonial}
                renderStars={renderStars}
                formatDate={formatDate}
              />
            ))}
          </div>
          
          {/* Hide scrollbar for Chrome/Safari */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial, renderStars, formatDate }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 pointer-events-none">
      <div className="p-6">
        {/* Quote Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaQuoteLeft className="text-blue-600 text-lg" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex justify-center items-center gap-1 mb-4">
          {renderStars(testimonial.rating)}
        </div>

        {/* Content */}
        <p className="text-gray-700 text-center text-sm leading-relaxed mb-6 line-clamp-4">
          "{testimonial.content}"
        </p>

        {/* Customer Info */}
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <img
              src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=032c6a&color=fff&size=150`}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=032c6a&color=fff&size=150`;
              }}
            />
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-sm">
                {testimonial.name}
              </h4>
              <div className="flex items-center text-xs text-gray-500">
                {testimonial.location && (
                  <span>{testimonial.location}</span>
                )}
                {testimonial.location && testimonial.dateOfExperience && (
                  <span className="mx-1">•</span>
                )}
                {testimonial.dateOfExperience && (
                  <span>{formatDate(testimonial.dateOfExperience)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS for line-clamp if not available
const styles = `
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Hide scrollbar for all browsers */
  .testimonials-scroll::-webkit-scrollbar {
    display: none;
  }
  
  .testimonials-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('testimonial-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'testimonial-styles';
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}

export default TestimonialSection;