// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { MdOutlineStar } from "react-icons/md";
// import { FaQuoteLeft } from "react-icons/fa";
// import { 
//   fetchFeaturedTestimonials,
//   clearError 
// } from '../../features/testimonial/slice';
// import {
//   selectFeaturedTestimonials,
//   selectFeaturedTestimonialsLoading,
//   selectTestimonialError
// } from '../../features/testimonial/selectors';

// const TestimonialSection = () => {
//   const dispatch = useDispatch();
//   const scrollRef = useRef(null);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);
  
//   // Redux state
//   const testimonials = useSelector(selectFeaturedTestimonials);
//   const loading = useSelector(selectFeaturedTestimonialsLoading);
//   const error = useSelector(selectTestimonialError);

//   // Fetch testimonials on mount
//   useEffect(() => {
//     dispatch(fetchFeaturedTestimonials(8));
//   }, [dispatch]);

//   // Clear errors
//   useEffect(() => {
//     if (error) {
//       console.error('Testimonial error:', error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   // Touch/Mouse event handlers for smooth swipe
//   const handleMouseDown = (e) => {
//     setIsScrolling(true);
//     setStartX(e.pageX - scrollRef.current.offsetLeft);
//     setScrollLeft(scrollRef.current.scrollLeft);
//     scrollRef.current.style.cursor = 'grabbing';
//   };

//   const handleTouchStart = (e) => {
//     setIsScrolling(true);
//     setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
//     setScrollLeft(scrollRef.current.scrollLeft);
//   };

//   const handleMouseMove = (e) => {
//     if (!isScrolling) return;
//     e.preventDefault();
//     const x = e.pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2; // Scroll speed multiplier
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleTouchMove = (e) => {
//     if (!isScrolling) return;
//     const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleMouseUp = () => {
//     setIsScrolling(false);
//     scrollRef.current.style.cursor = 'grab';
//   };

//   const handleTouchEnd = () => {
//     setIsScrolling(false);
//   };

//   const handleMouseLeave = () => {
//     setIsScrolling(false);
//     scrollRef.current.style.cursor = 'grab';
//   };

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) => (
//       <MdOutlineStar 
//         key={i} 
//         size={20} 
//         color={i < rating ? "#fbbf24" : "#e5e7eb"} 
//         aria-hidden="true" 
//       />
//     ));
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Debug logging
//   useEffect(() => {
//     console.log('TestimonialSection mounted');
//     console.log('Testimonials:', testimonials);
//     console.log('Loading:', loading);
//     console.log('Error:', error);
//   }, [testimonials, loading, error]);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               What Our Customers Say
//             </h2>
//             <p className="text-lg text-gray-600">Loading testimonials...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               What Our Customers Say
//             </h2>
//             <p className="text-lg text-red-600">Error loading testimonials: {error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Don't render if no testimonials from API
//   if (!testimonials || !Array.isArray(testimonials) || testimonials.length === 0) {
//     return (
//       <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               What Our Customers Say
//             </h2>
//             <p className="text-lg text-gray-600">No featured testimonials available. Please add some testimonials in the admin dashboard.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Create infinite scroll effect by duplicating testimonials
//   const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];

//   return (
//     <div className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             What Our Customers Say
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover why thousands of customers trust Garava for their most precious moments
//           </p>
//         </div>

//         {/* Testimonials Slider */}
//         <div className="relative">
//           <div 
//             ref={scrollRef}
//             className="flex gap-6 overflow-x-auto cursor-grab select-none"
//             style={{
//               scrollbarWidth: 'none', // Firefox
//               msOverflowStyle: 'none', // IE/Edge
//               scrollBehavior: 'smooth'
//             }}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseLeave}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           >
//             {infiniteTestimonials.map((testimonial, index) => (
//               <TestimonialCard 
//                 key={`${testimonial._id}-${index}`} 
//                 testimonial={testimonial}
//                 renderStars={renderStars}
//                 formatDate={formatDate}
//               />
//             ))}
//           </div>
          
//           {/* Hide scrollbar for Chrome/Safari */}
//           <style jsx>{`
//             div::-webkit-scrollbar {
//               display: none;
//             }
//           `}</style>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TestimonialCard = ({ testimonial, renderStars, formatDate }) => {
//   return (
//     <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 pointer-events-none">
//       <div className="p-6">
//         {/* Quote Icon */}
//         <div className="flex justify-center mb-4">
//           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//             <FaQuoteLeft className="text-blue-600 text-lg" />
//           </div>
//         </div>

//         {/* Rating */}
//         <div className="flex justify-center items-center gap-1 mb-4">
//           {renderStars(testimonial.rating)}
//         </div>

//         {/* Content */}
//         <p className="text-gray-700 text-center text-sm leading-relaxed mb-6 line-clamp-4">
//           "{testimonial.content}"
//         </p>

//         {/* Customer Info */}
//         <div className="flex items-center justify-center">
//           <div className="flex items-center">
//             <img
//               src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=032c6a&color=fff&size=150`}
//               alt={testimonial.name}
//               className="w-12 h-12 rounded-full object-cover mr-3"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=032c6a&color=fff&size=150`;
//               }}
//             />
//             <div className="text-left">
//               <h4 className="font-semibold text-gray-900 text-sm">
//                 {testimonial.name}
//               </h4>
//               <div className="flex items-center text-xs text-gray-500">
//                 {testimonial.location && (
//                   <span>{testimonial.location}</span>
//                 )}
//                 {testimonial.location && testimonial.dateOfExperience && (
//                   <span className="mx-1">•</span>
//                 )}
//                 {testimonial.dateOfExperience && (
//                   <span>{formatDate(testimonial.dateOfExperience)}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Add CSS for line-clamp if not available
// const styles = `
//   .line-clamp-4 {
//     display: -webkit-box;
//     -webkit-line-clamp: 4;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }
  
//   /* Hide scrollbar for all browsers */
//   .testimonials-scroll::-webkit-scrollbar {
//     display: none;
//   }
  
//   .testimonials-scroll {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// `;

// // Inject styles
// if (typeof document !== 'undefined') {
//   const existingStyle = document.getElementById('testimonial-styles');
//   if (!existingStyle) {
//     const styleSheet = document.createElement('style');
//     styleSheet.id = 'testimonial-styles';
//     styleSheet.type = 'text/css';
//     styleSheet.innerText = styles;
//     document.head.appendChild(styleSheet);
//   }
// }

// export default TestimonialSection;


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
        size={18} 
        className={`${i < rating ? 'text-amber-400' : 'text-gray-300'} transition-colors duration-200`}
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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="w-full py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-white rounded-3xl shadow-lg border border-gray-100 animate-pulse">
              <div className="p-8">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
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
      <div className="w-full py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfair">
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
      <div className="w-full py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              What Our Customers Say
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-12 max-w-2xl mx-auto">
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
    <section className="w-full py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Luxury Header */}
        <div className="text-center mb-16">
        
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 font-playfair leading-tight">
            What Our Customers
           <br />
              Say About Us
            
          </h2>
          
          <p className="text-md lg:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed font-light">
            Discover why thousands of customers trust Garava for their most precious moments. 
            Each piece tells a story of elegance, craftsmanship, and timeless beauty.
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="relative">
          {/* Navigation Buttons - Desktop */}
          <div className="hidden lg:block">
            <button 
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                canScrollLeft 
                  ? 'hover:bg-white hover:shadow-2xl hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <MdArrowBack size={24} />
            </button>
            
            <button 
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                canScrollRight 
                  ? 'hover:bg-white hover:shadow-2xl hover:scale-105 text-gray-700' 
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <MdArrowForward size={24} />
            </button>
          </div>

          {/* Testimonials Slider */}
          <div 
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto cursor-grab select-none scroll-smooth testimonials-scroll px-4 lg:px-16"
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
                formatDate={formatDate}
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
    </section>
  );
};

const TestimonialCard = ({ testimonial, renderStars, formatDate }) => {
  return (
    <article className="group flex-shrink-0 w-80 lg:w-96   bg-white transition-all duration-500 border border-gray-100 hover:border-amber-200 pointer-events-none hover:-translate-y-2">
      <div className="p-8 lg:p-10">
        {/* Luxury Quote Icon */}
        <div className="flex justify-center ">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br mb-4 from-amber-100 to-amber-50 rounded-full flex items-center justify-center  ">
              <FaQuoteLeft className="text-amber-600 text-xl" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Premium Rating Display */}
        <div className="flex justify-center items-center mb-4">
          <div className="flex">
            {renderStars(testimonial.rating)}
          </div>
        </div>

        {/* Content with Luxury Typography */}
        <blockquote className="text-gray-700 text-center text-base lg:text-lg leading-relaxed  font-light italic line-clamp-4 min-h-[6rem]">
          "{testimonial.content}"
        </blockquote>

        {/* Customer Info with Luxury Layout */}
        <div className="flex items-center justify-center">
          <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
            <div className="relative mr-4">
              <img
                src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f59e0b&color=fff&size=200&bold=true`}
                alt={testimonial.name}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border-3 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f59e0b&color=fff&size=200&bold=true`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 text-base lg:text-lg mb-1">
                {testimonial.name}
              </h4>
              <div className="flex items-center text-sm text-gray-500 font-light">
                {testimonial.location && (
                  <span className="flex items-center">
                    <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                    {testimonial.location}
                  </span>
                )}
                {testimonial.location && testimonial.dateOfExperience && (
                  <span className="mx-2 text-gray-300">•</span>
                )}
                {testimonial.dateOfExperience && (
                  <span>{formatDate(testimonial.dateOfExperience)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TestimonialSection;