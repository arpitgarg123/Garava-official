const BlogStatus = ["draft", "published"];

const commentSchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
content: { type: String, required: true, trim: true, maxlength: 2000 },
createdAt: { type: Date, default: Date.now },
},
{ _id: true }
);

const blogSchema = new mongoose.Schema(
  {
title: { type: String, required: true, trim: true, maxlength: 160 },
slug: { type: String, required: true, unique: true, lowercase: true, index: true },


category: { type: String, required: true, trim: true, maxlength: 80 },
authorName: { type: String, required: true, trim: true, maxlength: 80 },


excerpt: { type: String, trim: true, maxlength: 300 },
contentHtml: { type: String, required: true },
coverImage: { type: String, trim: true },
tags: { type: [String], default: [], index: true },


status: { type: String, enum: BlogStatus, default: "draft", index: true },


publishedAt: { type: Date, index: true },
isDeleted: { type: Boolean, default: false, index: true },


metaTitle: { type: String, trim: true, maxlength: 160 },
metaDescription: { type: String, trim: true, maxlength: 200 },


// Simplified comments: just userId, content, createdAt
comments: { type: [commentSchema], default: [] },


createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", contentHtml: "text", tags: 1 });

export const Blog = mongoose.model("Blog", blogSchema);

