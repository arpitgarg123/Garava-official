import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate } from "../../utils/FormatDate";

export default function NewsEventDetailsModal({ isOpen, item, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">News/Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="space-y-6">
            
            {/* Cover Image */}
            {item.cover?.url && (
              <div>
                <img
                  src={item.cover.url}
                  alt={item.title}
                  className=" h-64 object-contain "
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p className="text-gray-900">{item.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Slug:</span>
                    <p className="text-gray-600 font-mono text-sm">{item.slug}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.type === 'event' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type === 'media-coverage' ? 'Media Coverage' : item.kind}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{formatDate(item.date)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' :
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Views:</span>
                    <p className="text-gray-900">{item.views || 0}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {item.type === 'event' ? 'Event Details' : 'Media Details'}
                </h3>
                <div className="space-y-3">
                  {item.type === 'event' ? (
                    <>
                      {item.city && (
                        <div>
                          <span className="font-medium text-gray-700">City:</span>
                          <p className="text-gray-900">{item.city}</p>
                        </div>
                      )}
                      {item.location && (
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <p className="text-gray-900">{item.location}</p>
                        </div>
                      )}
                      {item.rsvpUrl && (
                        <div>
                          <span className="font-medium text-gray-700">RSVP URL:</span>
                          <a 
                            href={item.rsvpUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
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
                          <span className="font-medium text-gray-700">Outlet:</span>
                          <p className="text-gray-900">{item.outlet}</p>
                        </div>
                      )}
                      {item.url && (
                        <div>
                          <span className="font-medium text-gray-700">Article URL:</span>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
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

            {/* Excerpt */}
            {item.excerpt && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Excerpt</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{item.excerpt}</p>
              </div>
            )}

            {/* Content */}
            {item.content && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Content</h3>
                <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Information */}
            {(item.metaTitle || item.metaDescription) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">SEO Information</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {item.metaTitle && (
                    <div>
                      <span className="font-medium text-gray-700">Meta Title:</span>
                      <p className="text-gray-900">{item.metaTitle}</p>
                    </div>
                  )}
                  {item.metaDescription && (
                    <div>
                      <span className="font-medium text-gray-700">Meta Description:</span>
                      <p className="text-gray-900">{item.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600">{formatDate(item.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated:</span>
                  <p className="text-gray-600">{formatDate(item.updatedAt)}</p>
                </div>
                {item.author && (
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>
                    <p className="text-gray-600">{item.author.name || item.author.email}</p>
                  </div>
                )}
                {item.publishAt && (
                  <div>
                    <span className="font-medium text-gray-700">Publish Date:</span>
                    <p className="text-gray-600">{formatDate(item.publishAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}