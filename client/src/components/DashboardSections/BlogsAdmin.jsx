// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
// import { FiFileText, FiEye, FiEdit3 } from "react-icons/fi";
// import { MdPublish, MdDrafts } from "react-icons/md";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import {
//   fetchBlogsAdmin,
//   fetchBlogAdminById,
//   deleteBlogAdmin,
//   updateBlogStatusAdmin,
//   openModal,
//   selectBlogAdminBlogs,
//   selectBlogAdminLoading,
//   selectBlogAdminError,
//   selectBlogAdminPagination,
//   selectBlogAdminModals
// } from "../../features/blogs/blogAdminSlice";
// import BlogCreateEditModal from "./BlogCreateEditModal";
// import BlogDetailsModal from "./BlogDetailsModal";
// import BlogDeleteModal from "./BlogDeleteModal";
// import { formatDate } from "../../utils/FormatDate";

// export default function BlogsAdmin() {
//   const dispatch = useDispatch();
//   const blogs = useSelector(selectBlogAdminBlogs);
//   const loading = useSelector(selectBlogAdminLoading);
//   const error = useSelector(selectBlogAdminError);
//   const pagination = useSelector(selectBlogAdminPagination);
//   const modals = useSelector(selectBlogAdminModals);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');

//   useEffect(() => {
//     dispatch(fetchBlogsAdmin({ page: 1, limit: 50 }));
//   }, [dispatch]);



//   const getStatusColor = (status) => {
//     const colors = {
//       published: "bg-green-100 text-green-800",
//       draft: "bg-yellow-100 text-yellow-800",
//       archived: "bg-red-100 text-red-800",
//     };
//     return colors[status] || "bg-gray-50 text-gray-800";
//   };

//   const handleStatusUpdate = async (blogId, newStatus) => {
//     try {
//       await dispatch(updateBlogStatusAdmin({ id: blogId, status: newStatus })).unwrap();
//     } catch (error) {
//       console.error('Failed to update blog status:', error);
//     }
//   };

//   const handleDelete = async (blogId) => {
//     if (window.confirm('Are you sure you want to delete this blog post?')) {
//       try {
//         await dispatch(deleteBlogAdmin(blogId)).unwrap();
//       } catch (error) {
//         console.error('Failed to delete blog:', error);
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     dispatch(openModal({ modalType: 'create' }));
//   };

//   const handleEdit = (blogId) => {
//     dispatch(openModal({ modalType: 'edit', blogId }));
//   };

//   const handleView = (blogId) => {
//     dispatch(openModal({ modalType: 'details', blogId }));
//     dispatch(fetchBlogAdminById(blogId));
//   };

//   const filteredBlogs = blogs.filter(blog => {
//     const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          blog.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = !statusFilter || blog.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header with Actions */}
//       <div className="flex-shrink-0 p-6 w-full border-b border-gray-200">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Blog Management</h2>
//             <p className="text-md text-gray-600">Create and manage blog posts</p>
//           </div>
//           <button 
//             onClick={handleCreateNew}
//             className="btn-black btn-small"
//           >
//             <AiOutlinePlus className="w-4 h-4" />
//             New Blog Post
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex-1 min-w-64">
//             <div className="relative">
//               <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search blog posts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border outline-none border-gray-300 rounded-md "
//               />
//             </div>
//           </div>
          
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md "
//           >
//             <option value="">All Status</option>
//             <option value="published">Published</option>
//             <option value="draft">Draft</option>
//             <option value="archived">Archived</option>
//           </select>
//         </div>
//       </div>

//       {/* Blogs Table */}
//       <div className="flex-1 overflow-hidden">
//         {loading ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-500 font-medium">Loading blog posts...</p>
//             </div>
//           </div>
//         ) : filteredBlogs.length === 0 ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500 font-medium">No blog posts found</p>
//               <p className="text-gray-400 text-md mt-1">Create your first blog post to get started</p>
//             </div>
//           </div>
//         ) : (
//           <div className="h-full overflow-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Post
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Author
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Views
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBlogs.map((blog) => (
//                   <tr key={blog._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-12 w-12 flex-shrink-0">
//                           {blog.coverImageUrl ? (
//                             <img 
//                               className="h-12 w-12 rounded-lg object-cover" 
//                               src={blog.coverImageUrl} 
//                               alt={blog.title}
//                             />
//                           ) : (
//                             <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
//                               <FiFileText className="w-6 h-6 text-gray-400" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-md font-medium text-gray-900 max-w-xs truncate">
//                             {blog.title}
//                           </div>
//                           <div className="text-md text-gray-500 max-w-xs truncate">
//                             {blog.description}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-md text-gray-900">
//                         {blog.author?.name || 'Unknown'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-md text-gray-900">
//                         {formatDate(blog.createdAt)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
//                         {blog.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-md text-gray-900">
//                         <FiEye className="w-4 h-4 mr-1 text-gray-400" />
//                         {blog.views || 0}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
//                       <div className="flex items-center justify-end gap-2">
//                         <button 
//                           onClick={() => handleView(blog._id)}
//                           className="text-blue-600 hover:text-blue-900 p-1" 
//                           title="View Post"
//                         >
//                           <AiOutlineEye className="w-4 h-4" />
//                         </button>
//                         <button 
//                           onClick={() => handleEdit(blog._id)}
//                           className="text-green-600 hover:text-green-900 p-1" 
//                           title="Edit Post"
//                         >
//                           <FiEdit3 className="w-4 h-4" />
//                         </button>
//                         {blog.status === 'draft' && (
//                           <button
//                             onClick={() => handleStatusUpdate(blog._id, 'published')}
//                             className="text-purple-600 hover:text-purple-900 p-1"
//                             title="Publish Post"
//                           >
//                             <MdPublish className="w-4 h-4" />
//                           </button>
//                         )}
//                         {blog.status === 'published' && (
//                           <button
//                             onClick={() => handleStatusUpdate(blog._id, 'draft')}
//                             className="text-yellow-600 hover:text-yellow-900 p-1"
//                             title="Unpublish Post"
//                           >
//                             <MdDrafts className="w-4 h-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDelete(blog._id)}
//                           className="text-red-600 hover:text-red-900 p-1"
//                           title="Delete Post"
//                         >
//                           <RiDeleteBin6Line className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <BlogCreateEditModal />
//       <BlogDetailsModal />
//       <BlogDeleteModal />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineEye, AiOutlinePlus, AiOutlineEdit, AiOutlineFilter } from "react-icons/ai";
import { FiFileText, FiEye, FiEdit3 } from "react-icons/fi";
import { MdPublish, MdDrafts } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiX } from "react-icons/bi";
import {
  fetchBlogsAdmin,
  fetchBlogAdminById,
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
import { useToastContext } from "../../layouts/Toast";

export default function BlogsAdmin() {
  const dispatch = useDispatch();
  const toast = useToastContext();
  const blogs = useSelector(selectBlogAdminBlogs);
  const loading = useSelector(selectBlogAdminLoading);
  const error = useSelector(selectBlogAdminError);
  const pagination = useSelector(selectBlogAdminPagination);
  const modals = useSelector(selectBlogAdminModals);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogsAdmin({ page: 1, limit: 50 }));
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-50 text-gray-800";
  };

  const handleStatusUpdate = async (blogId, newStatus) => {
    try {
      await dispatch(updateBlogStatusAdmin({ id: blogId, status: newStatus })).unwrap();
      toast?.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`, 'Blog Management');
    } catch (error) {
      console.error('Failed to update blog status:', error);
      toast?.error('Failed to update blog status. Please try again.', 'Error');
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await dispatch(deleteBlogAdmin(blogId)).unwrap();
        toast?.success('Blog deleted successfully', 'Blog Management');
      } catch (error) {
        console.error('Failed to delete blog:', error);
        toast?.error('Failed to delete blog. Please try again.', 'Error');
      }
    }
  };

  const handleCreateNew = () => {
    dispatch(openModal({ modalType: 'create' }));
  };

  const handleEdit = (blogId) => {
    dispatch(openModal({ modalType: 'edit', blogId }));
  };

  const handleView = (blogId) => {
    dispatch(openModal({ modalType: 'details', blogId }));
    dispatch(fetchBlogAdminById(blogId));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setShowMobileFilters(false);
    toast?.info('Filters cleared', 'Blog Management');
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || blog.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Mobile Blog Card Component
  const MobileBlogCard = ({ blog }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="flex p-4">
        {/* Blog Image */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
          {blog.coverImageUrl ? (
            <img 
              className="w-full h-full rounded-lg object-cover" 
              src={blog.coverImageUrl} 
              alt={blog.title}
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
              <FiFileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="flex-1 ml-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-md sm:text-base font-medium text-gray-900 line-clamp-2 flex-1">
              {blog.title}
            </h3>
            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(blog.status)}`}>
              {blog.status}
            </span>
          </div>
          
          <p className="text-xs sm:text-md text-gray-600 line-clamp-2 mb-2">
            {blog.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>{formatDate(blog.createdAt)}</span>
            <div className="flex items-center">
              <FiEye className="w-3 h-3 mr-1" />
              {blog.views || 0}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleView(blog._id)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title="View Post"
            >
              <AiOutlineEye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleEdit(blog._id)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
              title="Edit Post"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            {blog.status === 'draft' && (
              <button
                onClick={() => handleStatusUpdate(blog._id, 'published')}
                className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                title="Publish Post"
              >
                <MdPublish className="w-4 h-4" />
              </button>
            )}
            {blog.status === 'published' && (
              <button
                onClick={() => handleStatusUpdate(blog._id, 'draft')}
                className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-md transition-colors"
                title="Unpublish Post"
              >
                <MdDrafts className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleDelete(blog._id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Post"
            >
              <RiDeleteBin6Line className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Table Component
  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
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
                    <div className="text-md font-medium text-gray-900 max-w-xs truncate">
                      {blog.title}
                    </div>
                    <div className="text-md text-gray-500 max-w-xs truncate">
                      {blog.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-md text-gray-900">
                  {blog.author?.name || 'Unknown'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-md text-gray-900">
                  {formatDate(blog.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                  {blog.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-md text-gray-900">
                  <FiEye className="w-4 h-4 mr-1 text-gray-400" />
                  {blog.views || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handleView(blog._id)}
                    className="text-blue-600 hover:text-blue-900 p-1" 
                    title="View Post"
                  >
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
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading blogs</p>
          <p className="text-gray-500 text-md mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchBlogsAdmin({ page: 1, limit: 50 }))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Responsive Header Section */}
      <div className="flex-shrink-0 p-4 sm:p-6 w-full border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-end gap-4 mb-4">
          <div className="min-w-0 flex-1 items-start">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Blog Management
            </h2>
            <p className="text-md text-gray-600 mt-1">
              Create and manage blog posts • {pagination.total || filteredBlogs.length} total posts
            </p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="btn-black btn-small"
          >
            <AiOutlinePlus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <p className="text-md text-gray-600">
            {filteredBlogs.length} posts
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden max-md:flex items-center gap-2 px-3 py-2 text-md border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <AiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md outline-none"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {(searchTerm || statusFilter) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 lg:hidden ${
          showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileFilters(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-out ${
            showMobileFilters ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="font-semibold text-lg">Filter Blog Posts</h3>
            <button 
              onClick={() => setShowMobileFilters(false)} 
              className="p-1 rounded-full hover:bg-gray-50"
            >
              <BiX size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none"
                />
              </div>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex gap-4 justify-between">
            <button 
              onClick={handleClearFilters}
              className="btn-small px-4 py-1"
            >
              Clear All
            </button>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="btn-black btn-small"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Content Section */}
      <div className="flex-1 overflow-hidden w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No blog posts found</p>
              <p className="text-gray-400 text-md mb-4">
                {searchTerm || statusFilter 
                  ? "Try adjusting your filters or search terms"
                  : "Create your first blog post to get started"
                }
              </p>
              {(searchTerm || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {/* Mobile Cards */}
            <div className="block lg:hidden p-4">
              {filteredBlogs.map((blog) => (
                <MobileBlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block h-full">
              <DesktopTable />
            </div>
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