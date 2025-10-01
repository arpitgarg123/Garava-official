import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlineWarning } from 'react-icons/ai';
import {
  deleteBlogAdmin,
  closeModal,
  selectBlogAdminModals,
  selectBlogAdminSelectedId,
  selectBlogAdminActionLoading,
} from '../../features/blogs/blogAdminSlice';

export default function BlogDeleteModal() {
  const dispatch = useDispatch();
  const modals = useSelector(selectBlogAdminModals);
  const selectedBlogId = useSelector(selectBlogAdminSelectedId);
  const actionLoading = useSelector(selectBlogAdminActionLoading);

  const isOpen = modals.delete;

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (selectedBlogId) {
      await dispatch(deleteBlogAdmin(selectedBlogId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Delete Blog</h2>
          <button
            onClick={() => dispatch(closeModal('delete'))}
            className="text-gray-400 hover:text-gray-600"
            disabled={actionLoading}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <AiOutlineWarning className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this blog?
              </h3>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. The blog will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => dispatch(closeModal('delete'))}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={actionLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {actionLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            Delete Blog
          </button>
        </div>
      </div>
    </div>
  );
}