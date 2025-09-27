import { Blog } from "../blog.model";

export const createBlogService = async (payload, userId) =>{
  if (await Blog.findOne({ slug: payload.slug })) {
    throw new ApiError(409, "Slug already in use");
  }
  const doc = await BlogModel.create({
 title: payload.title,
 slug,
 category: payload.category,
 authorName: payload.authorName || "Admin",
excerpt: payload.excerpt,
contentHtml: payload.contentHtml,
coverImage: payload.coverImage,
tags: payload.tags || [],
status: coerceStatus(payload.status),
publishedAt: payload.status === "published" ? payload.publishedAt || new Date() : null,
metaTitle: payload.metaTitle || payload.title,
metaDescription: payload.metaDescription || payload.excerpt,
createdBy: userId,
updatedBy: userId,
});
return doc.toObject();
}
export const updateService = async (id,payload, userId) =>{
 
}
