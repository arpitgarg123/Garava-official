import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { FiFileText, FiEye, FiEdit3 } from "react-icons/fi";
import { MdPublish, MdDrafts } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  fetchBlogsAdmin,
  deleteBlogAdmin,
  updateBlogStatusAdmin,
  openModal,
  selectBlogAdminBlogs,
  selectBlogAdminLoading,
  selectBlogAdminError,
  selectBlogAdminPagination,
  selectBlogAdminModals
} from "../../features/blogs/blogAdminSlice";
import BlogCreateEditModal from "./BlogCreateEditModal";
import BlogDetailsModal from "./BlogDetailsModal";
import BlogDeleteModal from "./BlogDeleteModal";
import { formatDate } from "../../utils/FormatDate";

export default function BlogsAdmin() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogAdminBlogs);
  const loading = useSelector(selectBlogAdminLoading);
  const error = useSelector(selectBlogAdminError);
  const pagination = useSelector(selectBlogAdminPagination);
  const modals = useSelector(selectBlogAdminModals);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchBlogsAdmin({ page: 1, limit: 50 }));
  }, [dispatch]);



  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      await dispatch(updateBlogStatusAdmin({ id: blogId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update blog status:', error);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await dispatch(deleteBlogAdmin(blogId)).unwrap();
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  const handleCreateNew = () => {
    dispatch(openModal({ modalType: 'create' }));
  };

  const handleEdit = (blogId) => {
    dispatch(openModal({ modalType: 'edit', blogId }));
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Blog Management</h2>
            <p className="text-sm text-gray-600">Create and manage blog posts</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <AiOutlinePlus className="w-4 h-4" />
            New Blog Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading blog posts...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No blog posts found</p>
              <p className="text-gray-400 text-sm mt-1">Create your first blog post to get started</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {blog.coverImageUrl ? (
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={blog.coverImageUrl} 
                              alt={blog.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <FiFileText className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {blog.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {blog.author?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiEye className="w-4 h-4 mr-1 text-gray-400" />
                        {blog.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1" title="View Post">
                          <AiOutlineEye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(blog._id)}
                          className="text-green-600 hover:text-green-900 p-1" 
                          title="Edit Post"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        {blog.status === 'draft' && (
                          <button
                            onClick={() => handleStatusUpdate(blog._id, 'published')}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Publish Post"
                          >
                            <MdPublish className="w-4 h-4" />
                          </button>
                        )}
                        {blog.status === 'published' && (
                          <button
                            onClick={() => handleStatusUpdate(blog._id, 'draft')}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Unpublish Post"
                          >
                            <MdDrafts className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Post"
                        >
                          <RiDeleteBin6Line className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <BlogCreateEditModal />
      <BlogDetailsModal />
      <BlogDeleteModal />
    </div>
  );
}