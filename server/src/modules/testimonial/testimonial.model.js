import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 255
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  avatar: {
    type: String,
    default: null
  },
  location: {
    type: String,
    trim: true,
    maxLength: 100
  },
  designation: {
    type: String,
    trim: true,
    maxLength: 100
  },
  source: {
    type: String,
    enum: ['manual', 'google'],
    default: 'manual'
  },
  googlePlaceId: {
    type: String,
    default: null
  },
  googleReviewId: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateOfExperience: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    googleData: {
      authorName: String,
      authorUrl: String,
      language: String,
      originalLanguage: String,
      profilePhotoUrl: String,
      publishedAtDate: Date,
      relativePublishTimeDescription: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
testimonialSchema.index({ source: 1, isActive: 1 });
testimonialSchema.index({ isFeatured: 1, isActive: 1, order: 1 });
testimonialSchema.index({ rating: -1, createdAt: -1 });
testimonialSchema.index({ googlePlaceId: 1, googleReviewId: 1 }, { sparse: true });

// Virtual for formatted date
testimonialSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Instance methods
testimonialSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    content: this.content,
    rating: this.rating,
    avatar: this.avatar,
    location: this.location,
    designation: this.designation,
    source: this.source,
    dateOfExperience: this.dateOfExperience,
    formattedDate: this.formattedDate,
    createdAt: this.createdAt
  };
};

testimonialSchema.methods.toAdminJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    content: this.content,
    rating: this.rating,
    avatar: this.avatar,
    location: this.location,
    designation: this.designation,
    source: this.source,
    isActive: this.isActive,
    isFeatured: this.isFeatured,
    order: this.order,
    dateOfExperience: this.dateOfExperience,
    formattedDate: this.formattedDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static methods
testimonialSchema.statics.getFeatured = function(limit = 8) {
  return this.find({ 
    isActive: true, 
    isFeatured: true 
  })
  .sort({ order: 1, createdAt: -1 })
  .limit(limit);
};

testimonialSchema.statics.getLatest = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

testimonialSchema.statics.getByRating = function(rating, limit = 10) {
  return this.find({ 
    isActive: true, 
    rating: { $gte: rating } 
  })
  .sort({ rating: -1, createdAt: -1 })
  .limit(limit);
};  

// Pre-save middleware
testimonialSchema.pre('save', function(next) {
  // Auto-generate avatar URL if not provided and email exists
  if (!this.avatar && this.email) {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=032c6a&color=fff&size=150`;
  }
  next();
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
