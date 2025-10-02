import React from "react";
import { AiOutlineClose, AiOutlineWarning } from "react-icons/ai";

export default function DeleteNewsEventModal({ 
  isOpen, 
  item, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-red-600">Delete {item.type === 'event' ? 'Event' : 'Media Coverage'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AiOutlineWarning className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure you want to delete this {item.type === 'event' ? 'event' : 'media coverage'}?
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Title:</strong> {item.title}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Type:</strong> {item.type === 'media-coverage' ? 'Media Coverage' : item.kind}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {item.status}
                </p>
              </div>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone. The {item.type === 'event' ? 'event' : 'media coverage'} will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item._id)}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}