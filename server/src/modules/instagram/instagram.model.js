import mongoose from 'mongoose';

const instagramPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    image: {
      url: {
        type: String,
        required: true
      },
      fileId: {
        type: String,
        required: false // Optional for backward compatibility with URL-only uploads
      },
      alt: {
        type: String,
        default: ''
      }
    },
    instagramUrl: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // More flexible Instagram URL validation
          // Accepts: instagram.com, www.instagram.com, with or without https://
          return /^(https?:\/\/)?(www\.)?instagram\.com\/.+/.test(v);
        },
        message: 'Please provide a valid Instagram URL (e.g., https://www.instagram.com/p/postid or instagram.com/username)'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for performance
instagramPostSchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1 });

const InstagramPost = mongoose.model('InstagramPost', instagramPostSchema);

export default InstagramPost;