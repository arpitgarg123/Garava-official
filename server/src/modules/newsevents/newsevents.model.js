import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    fileId: String,
    alt: String,
  },
  { _id: false }
);

const newseventsSchema = new mongoose.Schema(
  {
    // core
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },

    // content
    excerpt: { type: String, required: true }, // short summary for cards
    content: { type: String }, // detailed content for full view
    cover: imageSchema, // main image

    // type classification
    type: { 
      type: String, 
      enum: ["event", "media-coverage"], 
      required: true, 
      index: true 
    },

    // event-specific fields
    kind: { 
      type: String, 
      enum: ["Event", "News"], 
      required: function() { return this.type === 'event'; }
    },
    date: { type: Date, required: true, index: true }, // event date or coverage date
    city: { type: String }, // for events
    location: { type: String }, // for events
    rsvpUrl: { type: String }, // for events

    // media coverage-specific fields
    outlet: { 
      type: String, 
      required: function() { return this.type === 'media-coverage'; }
    },
    url: { 
      type: String, 
      required: function() { return this.type === 'media-coverage'; }
    }, // external article URL

    // state
    status: { 
      type: String, 
      enum: ["draft", "published", "archived"], 
      default: "draft", 
      index: true 
    },
    publishAt: { type: Date, default: null, index: true },
    isActive: { type: Boolean, default: true },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },

    // misc
    views: { type: Number, default: 0 },

    // audit
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// text index for search
newseventsSchema.index({ title: "text", content: "text", excerpt: "text" });

// compound indexes for efficient queries
newseventsSchema.index({ type: 1, status: 1, publishAt: 1 });
newseventsSchema.index({ type: 1, date: -1 });

export default mongoose.model("NewsEvents", newseventsSchema);