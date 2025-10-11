// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AiFillStar, AiOutlineSearch, AiOutlineEye } from "react-icons/ai";
// import { MdCheckCircle, MdCancel, MdFilterList } from "react-icons/md";
// import { FiMessageSquare } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import {
//   fetchReviewsAdmin,
//   moderateReviewAdmin,
//   deleteReviewAdmin,
//   setFilters,
//   setCurrentPage,
//   selectReviewAdminReviews,
//   selectReviewAdminLoading,
//   selectReviewAdminError,
//   selectReviewAdminPagination,
//   selectReviewAdminFilters
// } from "../../features/reviews/reviewAdminSlice";
// import { formatDate } from "../../utils/FormatDate";

// export default function Reviews() {
//   const dispatch = useDispatch();
//   const reviews = useSelector(selectReviewAdminReviews);
//   const loading = useSelector(selectReviewAdminLoading);
//   const error = useSelector(selectReviewAdminError);
//   const pagination = useSelector(selectReviewAdminPagination);
//   const filters = useSelector(selectReviewAdminFilters);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [ratingFilter, setRatingFilter] = useState('');

//   useEffect(() => {
//     dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }));
//   }, [dispatch]);


//   const getStatusColor = (isApproved, flagged) => {
//     if (flagged) return "bg-red-100 text-red-800";
//     if (isApproved) return "bg-green-100 text-green-800";
//     return "bg-yellow-100 text-yellow-800";
//   };

//   const getStatusText = (isApproved, flagged) => {
//     if (flagged) return "Flagged";
//     if (isApproved) return "Approved";
//     return "Pending";
//   };

//   const handleApprove = async (reviewId) => {
//     try {
//       await dispatch(moderateReviewAdmin({ 
//         reviewId, 
//         moderationData: { approve: true } 
//       })).unwrap();
//     } catch (error) {
//       console.error('Failed to approve review:', error);
//     }
//   };

//   const handleReject = async (reviewId) => {
//     try {
//       await dispatch(moderateReviewAdmin({ 
//         reviewId, 
//         moderationData: { approve: false } 
//       })).unwrap();
//     } catch (error) {
//       console.error('Failed to reject review:', error);
//     }
//   };

//   const handleFlag = async (reviewId) => {
//     try {
//       await dispatch(moderateReviewAdmin({ 
//         reviewId, 
//         moderationData: { flag: true } 
//       })).unwrap();
//     } catch (error) {
//       console.error('Failed to flag review:', error);
//     }
//   };

//   const handleDelete = async (reviewId) => {
//     if (window.confirm('Are you sure you want to delete this review?')) {
//       try {
//         await dispatch(deleteReviewAdmin(reviewId)).unwrap();
//       } catch (error) {
//         console.error('Failed to delete review:', error);
//       }
//     }
//   };

//   const handleSearch = () => {
//     const filterParams = {
//       page: 1,
//       search: searchTerm,
//       isApproved: statusFilter === 'approved' ? 'true' : statusFilter === 'pending' ? 'false' : '',
//       flagged: statusFilter === 'flagged' ? 'true' : ''
//     };
//     dispatch(fetchReviewsAdmin(filterParams));
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('');
//     setRatingFilter('');
//     dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }));
//   };

//   const filteredReviews = reviews.filter(review => {
//     const matchesSearch = searchTerm === '' || 
//       review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       review.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === '' || 
//       (statusFilter === 'approved' && review.isApproved) ||
//       (statusFilter === 'pending' && !review.isApproved && !review.flagged) ||
//       (statusFilter === 'flagged' && review.flagged);
    
//     const matchesRating = ratingFilter === '' || review.rating === parseInt(ratingFilter);
    
//     return matchesSearch && matchesStatus && matchesRating;
//   });
// console.log(reviews);

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header with Actions */}
//       <div className="flex-shrink-0 p-6 border-b w-full border-gray-200">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">Reviews Management</h2>
//             <p className="text-sm text-gray-600">Moderate and manage customer reviews</p>
//           </div>
//           <div className="text-sm text-gray-600">
//             {pagination.total} total reviews
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex-1 min-w-64">
//             <div className="relative">
//               <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search reviews..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="approved">Approved</option>
//             <option value="pending">Pending</option>
//             <option value="flagged">Flagged</option>
//           </select>
          
//           <select
//             value={ratingFilter}
//             onChange={(e) => setRatingFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="">All Ratings</option>
//             <option value="5">5 Stars</option>
//             <option value="4">4 Stars</option>
//             <option value="3">3 Stars</option>
//             <option value="2">2 Stars</option>
//             <option value="1">1 Star</option>
//           </select>
          
//           <button
//             onClick={handleSearch}
//             className="px-4 py-2 bg-gray-50 text-gray-700  hover:bg-gray-200 transition-colors"
//           >
//             Search
//           </button>
          
//           <button
//             onClick={handleClearFilters}
//             className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Reviews Table */}
//       <div className="flex-1 overflow-hidden">
//         {loading ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-500 font-medium">Loading reviews...</p>
//             </div>
//           </div>
//         ) : filteredReviews.length === 0 ? (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500 font-medium">No reviews found</p>
//               <p className="text-gray-400 text-sm mt-1">Customer reviews will appear here</p>
//             </div>
//           </div>
//         ) : (
//           <div className="h-full  overflow-auto">
//             <table className="w-full ">
//               <thead className="bg-gray-50 sticky top-0 z-10 ">
//                 <tr>
//                   <th className="pl-14 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="pl-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="pl-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Rating
//                   </th>
//                   <th className="pl-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Review
//                   </th>
//                   <th className="pl-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="pl-1 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="pr-20 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200 ">
//                 {filteredReviews.map((review) => (
//                   <tr key={review._id} className="hover:bg-gray-50 ">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="">
//                         <div className="text-sm font-medium text-gray-900 pl-8">
//                           {review.user?.name || 'Anonymous'}
//                         </div>
//                         <div className="text-sm text-gray-500 pl-8">
//                           {review.user?.email || 'N/A'}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {review.product || 'Unknown Product'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <AiFillStar 
//                             key={i} 
//                             className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
//                           />
//                         ))}
//                         <span className=" text-sm text-gray-600">({review.rating})</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="max-w-xs">
//                         <div className="text-sm text-gray-900 line-clamp-2">
//                           {review.body || 'No comment provided'}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {formatDate(review.createdAt)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(review.isApproved, review.flagged)}`}>
//                         {getStatusText(review.isApproved, review.flagged)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end gap-2">
//                         {!review.isApproved && !review.flagged && (
//                           <button
//                             onClick={() => handleApprove(review._id)}
//                             className="text-green-600 hover:text-green-900 p-1"
//                             title="Approve Review"
//                           >
//                             <MdCheckCircle className="w-4 h-4" />
//                           </button>
//                         )}
//                         {review.isApproved && (
//                           <button
//                             onClick={() => handleReject(review._id)}
//                             className="text-orange-600 hover:text-orange-900 p-1"
//                             title="Reject Review"
//                           >
//                             <MdCancel className="w-4 h-4" />
//                           </button>
//                         )}
//                         {!review.flagged && (
//                           <button
//                             onClick={() => handleFlag(review._id)}
//                             className="text-red-600 hover:text-red-900 p-1"
//                             title="Flag Review"
//                           >
//                             <MdCancel className="w-4 h-4" />
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleDelete(review._id)}
//                           className="text-red-600 pr-10 hover:text-red-900 p-1"
//                           title="Delete Review"
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

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: pagination.page - 1 }))}
//                 disabled={pagination.page <= 1}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               {[...Array(pagination.totalPages)].map((_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: i + 1 }))}
//                   className={`px-3 py-1 border rounded text-sm ${
//                     pagination.page === i + 1
//                       ? 'bg-blue-600 text-white border-blue-600'
//                       : 'border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: pagination.page + 1 }))}
//                 disabled={pagination.page >= pagination.totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineSearch, AiOutlineEye, AiOutlineFilter } from "react-icons/ai";
import { MdCheckCircle, MdCancel, MdFilterList } from "react-icons/md";
import { FiMessageSquare, FiUser } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiX } from "react-icons/bi";
import {
  fetchReviewsAdmin,
  moderateReviewAdmin,
  deleteReviewAdmin,
  setFilters,
  setCurrentPage,
  selectReviewAdminReviews,
  selectReviewAdminLoading,
  selectReviewAdminError,
  selectReviewAdminPagination,
  selectReviewAdminFilters
} from "../../features/reviews/reviewAdminSlice";
import { formatDate } from "../../utils/FormatDate";
import { useToastContext } from "../../layouts/Toast";

export default function Reviews() {
  const dispatch = useDispatch();
  const toast = useToastContext();
  const reviews = useSelector(selectReviewAdminReviews);
  const loading = useSelector(selectReviewAdminLoading);
  const error = useSelector(selectReviewAdminError);
  const pagination = useSelector(selectReviewAdminPagination);
  const filters = useSelector(selectReviewAdminFilters);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }));
  }, [dispatch]);

  const getStatusColor = (isApproved, flagged) => {
    if (flagged) return "bg-red-100 text-red-800";
    if (isApproved) return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (isApproved, flagged) => {
    if (flagged) return "Flagged";
    if (isApproved) return "Approved";
    return "Pending";
  };

  const handleApprove = async (reviewId) => {
    try {
      await dispatch(moderateReviewAdmin({ 
        reviewId, 
        moderationData: { approve: true } 
      })).unwrap();
      toast?.success('Review approved successfully', 'Review Management');
    } catch (error) {
      console.error('Failed to approve review:', error);
      toast?.error('Failed to approve review. Please try again.', 'Error');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await dispatch(moderateReviewAdmin({ 
        reviewId, 
        moderationData: { approve: false } 
      })).unwrap();
      toast?.success('Review rejected successfully', 'Review Management');
    } catch (error) {
      console.error('Failed to reject review:', error);
      toast?.error('Failed to reject review. Please try again.', 'Error');
    }
  };

  const handleFlag = async (reviewId) => {
    try {
      await dispatch(moderateReviewAdmin({ 
        reviewId, 
        moderationData: { flag: true } 
      })).unwrap();
      toast?.warning('Review flagged for review', 'Review Management');
    } catch (error) {
      console.error('Failed to flag review:', error);
      toast?.error('Failed to flag review. Please try again.', 'Error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReviewAdmin(reviewId)).unwrap();
        toast?.success('Review deleted successfully', 'Review Management');
      } catch (error) {
        console.error('Failed to delete review:', error);
        toast?.error('Failed to delete review. Please try again.', 'Error');
      }
    }
  };

  const handleSearch = () => {
    const filterParams = {
      page: 1,
      search: searchTerm,
      isApproved: statusFilter === 'approved' ? 'true' : statusFilter === 'pending' ? 'false' : '',
      flagged: statusFilter === 'flagged' ? 'true' : ''
    };
    dispatch(fetchReviewsAdmin(filterParams));
    toast?.success('Filters applied successfully', 'Reviews');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRatingFilter('');
    dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }));
    toast?.info('All filters cleared', 'Reviews');
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchReviewsAdmin({ ...filters, page: newPage }));
    toast?.info(`Viewing page ${newPage} of ${pagination.totalPages}`, 'Pagination');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'approved' && review.isApproved) ||
      (statusFilter === 'pending' && !review.isApproved && !review.flagged) ||
      (statusFilter === 'flagged' && review.flagged);
    
    const matchesRating = ratingFilter === '' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  // Mobile Review Card Component
  const MobileReviewCard = ({ review }) => (
    <div className="bg-white border border-gray-300  w-full overflow-hidden mb-4">
      <div className="p-4">
        {/* Mobile Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {review.user?.name || 'Anonymous'}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {review.user?.email || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 ml-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(review.isApproved, review.flagged)}`}>
              {getStatusText(review.isApproved, review.flagged)}
            </span>
          </div>
        </div>

        {/* Product & Rating */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">Product</p>
          <p className="text-sm font-medium text-gray-900 mb-2">
            {review.product || 'Unknown Product'}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <AiFillStar 
                  key={i} 
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({review.rating}/5)</span>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 mb-1">Review</p>
          <p className="text-sm text-gray-900 line-clamp-3">
            {review.body || 'No comment provided'}
          </p>
        </div>

        {/* Date */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </p>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedReview(review);
                setShowDetailsModal(true);
              }}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50  transition-colors"
              title="View Details"
            >
              <AiOutlineEye className="w-4 h-4" />
            </button>
            {!review.isApproved && !review.flagged && (
              <button
                onClick={() => handleApprove(review._id)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50  transition-colors"
                title="Approve Review"
              >
                <MdCheckCircle className="w-4 h-4" />
              </button>
            )}
            {review.isApproved && (
              <button
                onClick={() => handleReject(review._id)}
                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50  transition-colors"
                title="Reject Review"
              >
                <MdCancel className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!review.flagged && (
              <button
                onClick={() => handleFlag(review._id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50  transition-colors"
                title="Flag Review"
              >
                <MdCancel className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleDelete(review._id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50  transition-colors"
              title="Delete Review"
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
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Review
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <tr key={review._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {review.user?.name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.user?.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 max-w-32 truncate">
                  {review.product || 'Unknown Product'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {review.body || 'No comment provided'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(review.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(review.isApproved, review.flagged)}`}>
                  {getStatusText(review.isApproved, review.flagged)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowDetailsModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="View Details"
                  >
                    <AiOutlineEye className="w-4 h-4" />
                  </button>
                  {!review.isApproved && !review.flagged && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Approve Review"
                    >
                      <MdCheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleReject(review._id)}
                      className="text-orange-600 hover:text-orange-900 p-1"
                      title="Reject Review"
                    >
                      <MdCancel className="w-4 h-4" />
                    </button>
                  )}
                  {!review.flagged && (
                    <button
                      onClick={() => handleFlag(review._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Flag Review"
                    >
                      <MdCancel className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete Review"
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

  // Review Details Modal
  const ReviewDetailsModal = ({ review, isOpen, onClose }) => {
    if (!isOpen || !review) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-50"
            >
              <BiX size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Customer</p>
                <p className="text-sm text-gray-900">{review.user?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{review.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Product</p>
                <p className="text-sm text-gray-900">{review.product || 'Unknown Product'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Review</p>
              <p className="text-sm text-gray-900 leading-relaxed">
                {review.body || 'No comment provided'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Date</p>
                <p className="text-sm text-gray-900">{formatDate(review.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(review.isApproved, review.flagged)}`}>
                  {getStatusText(review.isApproved, review.flagged)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300  hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Error loading reviews</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }))}
            className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Actions - Responsive */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b w-full border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Reviews Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Moderate and manage customer reviews • {pagination.total || 0} total reviews
            </p>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <p className="text-sm text-gray-600">
            {filteredReviews.length} reviews
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300  hover:bg-gray-50 transition-colors"
          >
            <AiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden w-full lg:flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-50 text-gray-700  hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
          
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Clear
          </button>
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
            <h3 className="font-semibold text-lg">Filter Reviews</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300  outline-none"
                />
              </div>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  outline-none"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            {/* Mobile Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          
          <div className="border-t p-4 flex items-center justify-between">
            <button 
              onClick={() => {
                handleClearFilters();
                setShowMobileFilters(false);
              }}
              className="px-3 py-1 border border-gray-300  text-center hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => {
                handleSearch();
                setShowMobileFilters(false);
              }}
              className="btn-black btn-small"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Content - Responsive */}
      <div className="flex-1 overflow-hidden w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No reviews found</p>
              <p className="text-gray-400 text-sm mb-4">
                {searchTerm || statusFilter || ratingFilter 
                  ? "Try adjusting your filters or search terms"
                  : "Customer reviews will appear here"
                }
              </p>
              {(searchTerm || statusFilter || ratingFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto w-full">
            {/* Mobile Cards */}
            <div className="block lg:hidden p-4 w-full">
              {filteredReviews.map((review) => (
                <MobileReviewCard key={review._id} review={review} />
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block h-full">
              <DesktopTable />
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Responsive */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            
            {/* Mobile Pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← Prev
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white font-medium text-sm min-w-[40px] text-center">
                {pagination.page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next →
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300  text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 border  text-sm ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300  text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReview(null);
        }}
      />
    </div>
  );
}