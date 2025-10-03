// Testimonial selectors
export const selectTestimonials = (state) => state.testimonials?.testimonials || [];
export const selectFeaturedTestimonials = (state) => state.testimonials?.featuredTestimonials || [];
export const selectLatestTestimonials = (state) => state.testimonials?.latestTestimonials || [];
export const selectCurrentTestimonial = (state) => state.testimonials?.currentTestimonial;
export const selectTestimonialPagination = (state) => state.testimonials?.pagination || {};
export const selectTestimonialStats = (state) => state.testimonials?.stats || {};

// Loading states
export const selectTestimonialsLoading = (state) => state.testimonials?.loading || false;
export const selectFeaturedTestimonialsLoading = (state) => state.testimonials?.featuredLoading || false;
export const selectLatestTestimonialsLoading = (state) => state.testimonials?.latestLoading || false;
export const selectTestimonialActionLoading = (state) => state.testimonials?.actionLoading || false;
export const selectTestimonialGoogleLoading = (state) => state.testimonials?.googleLoading || false;
export const selectTestimonialStatsLoading = (state) => state.testimonials?.statsLoading || false;

// Error and success states
export const selectTestimonialError = (state) => state.testimonials?.error;
export const selectTestimonialSuccessMessage = (state) => state.testimonials?.successMessage;

// Computed selectors
export const selectTestimonialById = (state, id) => 
  state.testimonials?.testimonials?.find(testimonial => testimonial._id === id);

export const selectActiveTestimonials = (state) => 
  state.testimonials?.testimonials?.filter(testimonial => testimonial.isActive) || [];

export const selectTestimonialsByRating = (state, minRating = 4) => 
  state.testimonials?.testimonials?.filter(testimonial => testimonial.rating >= minRating) || [];

export const selectTestimonialsBySource = (state, source) => 
  state.testimonials?.testimonials?.filter(testimonial => testimonial.source === source) || [];

export const selectManualTestimonials = (state) => 
  selectTestimonialsBySource(state, 'manual');

export const selectGoogleTestimonials = (state) => 
  selectTestimonialsBySource(state, 'google');

export const selectFeaturedActiveTestimonials = (state) => 
  state.testimonials?.testimonials?.filter(testimonial => 
    testimonial.isActive && testimonial.isFeatured
  ) || [];

export const selectTestimonialCountByRating = (state) => {
  const testimonials = selectTestimonials(state);
  return testimonials.reduce((acc, testimonial) => {
    acc[testimonial.rating] = (acc[testimonial.rating] || 0) + 1;
    return acc;
  }, {});
};

export const selectAverageRating = (state) => {
  const testimonials = selectActiveTestimonials(state);
  if (testimonials.length === 0) return 0;
  
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  return totalRating / testimonials.length;
};