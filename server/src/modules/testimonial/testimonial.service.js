import Testimonial from './testimonial.model.js';
import ApiError from '../../shared/utils/ApiError.js';
import axios from 'axios';
import { env } from '../../config/env.js';

// CRUD Operations
export const createTestimonialService = async (data) => {
  try {
    const testimonial = new Testimonial(data);
    await testimonial.save();
    return testimonial.toPublicJSON();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, 'Testimonial already exists');
    }
    throw new ApiError(400, error.message);
  }
};

export const getTestimonialsService = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      isActive = true,
      isFeatured,
      rating,
      source,
      search
    } = filters;

    const query = {};

    // Apply filters with proper type conversion
    if (isActive !== undefined) {
      query.isActive = isActive === 'true' || isActive === true;
    }
    if (isFeatured !== undefined && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (rating) query.rating = { $gte: rating };
    if (source) query.source = source;

    // Search in name and content
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [testimonials, total] = await Promise.all([
      Testimonial.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Testimonial.countDocuments(query)
    ]);

    return {
      testimonials: testimonials.map(t => t.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const getTestimonialByIdService = async (id) => {
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
    return testimonial.toPublicJSON();
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const updateTestimonialService = async (id, data) => {
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }

    Object.assign(testimonial, data);
    await testimonial.save();
    
    return testimonial.toPublicJSON();
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const deleteTestimonialService = async (id) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
    return { message: 'Testimonial deleted successfully' };
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Specialized services
export const getFeaturedTestimonialsService = async (limit = 8) => {
  try {
    const testimonials = await Testimonial.getFeatured(limit);
    return testimonials.map(t => t.toPublicJSON());
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const getLatestTestimonialsService = async (limit = 10) => {
  try {
    const testimonials = await Testimonial.getLatest(limit);
    return testimonials.map(t => t.toPublicJSON());
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const toggleTestimonialStatusService = async (id) => {
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    
    return testimonial.toPublicJSON();
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const toggleFeaturedStatusService = async (id) => {
  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();
    
    return testimonial.toPublicJSON();
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export const bulkUpdateOrderService = async (updates) => {
  try {
    const bulkOps = updates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order }
      }
    }));

    await Testimonial.bulkWrite(bulkOps);
    return { message: 'Order updated successfully' };
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// Google Business Profile Integration
export const fetchGoogleReviewsService = async () => {
  try {
    const placeId = env.GOOGLE_PLACE_ID;
    const apiKey = env.GOOGLE_API_KEY;
    
    if (!placeId || !apiKey) {
      throw new ApiError(400, 'Google Place ID and API key must be configured in environment variables');
    }

    // Google Places API endpoint for place details with reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const params = {
      place_id: placeId,
      fields: 'name,reviews,rating,user_ratings_total',
      key: apiKey,
      language: 'en'
    };

    const response = await axios.get(url, { params });
    
    if (response.data.status !== 'OK') {
      throw new ApiError(400, `Google API Error: ${response.data.status}`);
    }

    const placeData = response.data.result;
    const reviews = placeData.reviews || [];

    // Process and save reviews
    const processedReviews = [];
    
    for (const review of reviews) {
      // Check if review already exists
      const existingReview = await Testimonial.findOne({
        googlePlaceId: placeId,
        googleReviewId: review.time.toString() // Using time as unique identifier
      });

      if (!existingReview && review.rating >= 4) { // Only import good reviews
        const testimonialData = {
          name: review.author_name,
          content: review.text,
          rating: review.rating,
          avatar: review.profile_photo_url,
          source: 'google',
          googlePlaceId: placeId,
          googleReviewId: review.time.toString(),
          dateOfExperience: new Date(review.time * 1000),
          metadata: {
            googleData: {
              authorName: review.author_name,
              authorUrl: review.author_url,
              language: review.language,
              originalLanguage: review.original_language,
              profilePhotoUrl: review.profile_photo_url,
              publishedAtDate: new Date(review.time * 1000),
              relativePublishTimeDescription: review.relative_time_description
            }
          }
        };

        const testimonial = await createTestimonialService(testimonialData);
        processedReviews.push(testimonial);
      }
    }

    return {
      placeInfo: {
        name: placeData.name,
        rating: placeData.rating,
        totalReviews: placeData.user_ratings_total
      },
      imported: processedReviews.length,
      testimonials: processedReviews
    };

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, `Failed to fetch Google reviews: ${error.message}`);
  }
};

// Analytics
export const getTestimonialStatsService = async () => {
  try {
    const [
      total,
      active,
      featured,
      manual,
      google,
      ratingStats
    ] = await Promise.all([
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ isFeatured: true }),
      Testimonial.countDocuments({ source: 'manual' }),
      Testimonial.countDocuments({ source: 'google' }),
      Testimonial.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } }
      ])
    ]);

    return {
      total,
      active,
      featured,
      manual,
      google,
      ratingDistribution: ratingStats,
      averageRating: await Testimonial.aggregate([
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' }
          }
        }
      ]).then(result => result[0]?.average || 0)
    };
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};
