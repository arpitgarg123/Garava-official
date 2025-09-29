import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    fileId: String,
    alt: String,
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    // core
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },

    // content
    excerpt: { type: String },            // short summary for list/SEO
    content: { type: String, required: true }, // HTML or Markdown (your choice)
    coverImage: imageSchema,

    // taxonomy
    tags: [{ type: String, index: true }],
    category: { type: String, index: true },

    // state
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    publishAt: { type: Date, default: null, index: true }, // schedule: visible to public only after this timestamp
    isActive: { type: Boolean, default: true },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },

    // misc
    readingTime: { type: Number, default: 0 }, // minutes (auto compute)
    views: { type: Number, default: 0 },

    // audit
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// text index for search
blogSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.model("Blog", blogSchema);
