import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlineEye, AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import {
  closeModal,
  selectBlogAdminModals,
  selectBlogAdminCurrentBlog,
} from '../../features/blogs/blogAdminSlice';
import { formatDate } from '../../utils/FormatDate';

export default function BlogDetailsModal() {
  const dispatch = useDispatch();
  const modals = useSelector(selectBlogAdminModals);
  const blog = useSelector(selectBlogAdminCurrentBlog);

  const isOpen = modals.details;

  if (!isOpen || !blog) return null;

 

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Blog Details</h2>
          <button
            onClick={() => dispatch(closeModal('details'))}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[1.0625rem] font-medium ${getStatusColor(blog.status)}`}>
                {blog.status}
              </span>
              {blog.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[1.0625rem] font-medium">
                  {blog.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h1>
            
            {blog.excerpt && (
              <p className="text-gray-600 text-lg mb-4">{blog.excerpt}</p>
            )}

            <div className="flex items-center gap-6 text-[1.0625rem] text-gray-500">
              <div className="flex items-center gap-2">
                <AiOutlineUser />
                <span>By {blog.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AiOutlineCalendar />
                <span>Created {formatDate(blog.createdAt)}</span>
              </div>
              {blog.publishAt && (
                <div className="flex items-center gap-2">
                  <AiOutlineCalendar />
                  <span>Published {formatDate(blog.publishAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <AiOutlineEye />
                <span>{blog.views || 0} views</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage?.url && (
            <div className="mb-6">
              <img
                src={blog.coverImage.url}
                alt={blog.coverImage.alt || blog.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Metadata</h3>
              <div className="space-y-2 text-[1.0625rem]">
                <div>
                  <span className="text-gray-500">Slug:</span>
                  <span className="ml-2 font-mono text-gray-800">{blog.slug}</span>
                </div>
                {blog.readingTime && (
                  <div>
                    <span className="text-gray-500">Reading Time:</span>
                    <span className="ml-2">{blog.readingTime} minutes</span>
                  </div>
                )}
                {blog.metaTitle && (
                  <div>
                    <span className="text-gray-500">Meta Title:</span>
                    <span className="ml-2">{blog.metaTitle}</span>
                  </div>
                )}
                {blog.metaDescription && (
                  <div>
                    <span className="text-gray-500">Meta Description:</span>
                    <span className="ml-2">{blog.metaDescription}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              {blog.tags && blog.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-[1.0625rem]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-[1.0625rem]">No tags assigned</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => dispatch(closeModal('details'))}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}