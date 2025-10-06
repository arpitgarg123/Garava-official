import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate } from "../../utils/FormatDate";

export default function NewsEventDetailsModal({ isOpen, item, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[94vh] overflow-hidden">
        {/* Responsive Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold truncate flex-1">News/Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors ml-4"
          >
            <AiOutlineClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Responsive Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)] p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            
            {/* Responsive Cover Image */}
            {item.cover?.url && (
              <div className="w-full">
                <img
                  src={item.cover.url}
                  alt={item.title}
                  className="h-48 sm:h-64 md:h-80 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Responsive Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Information</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Title:</span>
                    <p className="text-gray-900 text-md sm:text-base break-words">{item.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Slug:</span>
                    <p className="text-gray-600 font-mono text-xs sm:text-md break-all">{item.slug}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Type:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.type === 'event' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type === 'media-coverage' ? 'Media Coverage' : item.kind}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Date:</span>
                    <p className="text-gray-900 text-md sm:text-base">{formatDate(item.date)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' :
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 text-md sm:text-base">Views:</span>
                    <p className="text-gray-900 text-md sm:text-base">{item.views || 0}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  {item.type === 'event' ? 'Event Details' : 'Media Details'}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {item.type === 'event' ? (
                    <>
                      {item.city && (
                        <div>
                          <span className="font-medium text-gray-700 text-md sm:text-base">City:</span>
                          <p className="text-gray-900 text-md sm:text-base">{item.city}</p>
                        </div>
                      )}
                      {item.location && (
                        <div>
                          <span className="font-medium text-gray-700 text-md sm:text-base">Location:</span>
                          <p className="text-gray-900 text-md sm:text-base break-words">{item.location}</p>
                        </div>
                      )}
                      {item.rsvpUrl && (
                        <div>
                          <span className="font-medium text-gray-700 text-md sm:text-base">RSVP URL:</span>
                          <a 
                            href={item.rsvpUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-md sm:text-base break-all block"
                          >
                            {item.rsvpUrl}
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {item.outlet && (
                        <div>
                          <span className="font-medium text-gray-700 text-md sm:text-base">Outlet:</span>
                          <p className="text-gray-900 text-md sm:text-base">{item.outlet}</p>
                        </div>
                      )}
                      {item.url && (
                        <div>
                          <span className="font-medium text-gray-700 text-md sm:text-base">Article URL:</span>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-md sm:text-base break-all block"
                          >
                            {item.url}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Responsive Excerpt */}
            {item.excerpt && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Excerpt</h3>
                <p className="text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg text-md sm:text-base leading-relaxed">
                  {item.excerpt}
                </p>
              </div>
            )}

            {/* Responsive Content */}
            {item.content && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 max-sm:mb-0 sm:mb-3">Content</h3>
                <div className="prose prose-sm sm:prose max-w-none bg-gray-50 p-3 sm:p-4 rounded-lg">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 text-md sm:text-base leading-relaxed text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Responsive SEO Information */}
            {(item.metaTitle || item.metaDescription) && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">SEO Information</h3>
                <div className="space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
                  {item.metaTitle && (
                    <div>
                      <span className="font-medium text-gray-700 text-md sm:text-base">Meta Title:</span>
                      <p className="text-gray-900 text-md sm:text-base break-words">{item.metaTitle}</p>
                    </div>
                  )}
                  {item.metaDescription && (
                    <div>
                      <span className="font-medium text-gray-700 text-md sm:text-base">Meta Description:</span>
                      <p className="text-gray-900 text-md sm:text-base break-words">{item.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Responsive Metadata */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-md">
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600 break-words">{formatDate(item.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated:</span>
                  <p className="text-gray-600 break-words">{formatDate(item.updatedAt)}</p>
                </div>
                {item.author && (
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>
                    <p className="text-gray-600 break-words">{item.author.name || item.author.email}</p>
                  </div>
                )}
                {item.publishAt && (
                  <div>
                    <span className="font-medium text-gray-700">Publish Date:</span>
                    <p className="text-gray-600 break-words">{formatDate(item.publishAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-md sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}