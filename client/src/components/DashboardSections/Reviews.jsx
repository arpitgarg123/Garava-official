import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineSearch, AiOutlineEye } from "react-icons/ai";
import { MdCheckCircle, MdCancel, MdFilterList } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
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

export default function Reviews() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviewAdminReviews);
  const loading = useSelector(selectReviewAdminLoading);
  const error = useSelector(selectReviewAdminError);
  const pagination = useSelector(selectReviewAdminPagination);
  const filters = useSelector(selectReviewAdminFilters);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

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
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await dispatch(moderateReviewAdmin({ 
        reviewId, 
        moderationData: { approve: false } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const handleFlag = async (reviewId) => {
    try {
      await dispatch(moderateReviewAdmin({ 
        reviewId, 
        moderationData: { flag: true } 
      })).unwrap();
    } catch (error) {
      console.error('Failed to flag review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReviewAdmin(reviewId)).unwrap();
      } catch (error) {
        console.error('Failed to delete review:', error);
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
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRatingFilter('');
    dispatch(fetchReviewsAdmin({ page: 1, limit: 20 }));
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

  return (
    <div className="h-full flex flex-col">
      {/* Header with Actions */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Reviews Management</h2>
            <p className="text-sm text-gray-600">Moderate and manage customer reviews</p>
          </div>
          <div className="text-sm text-gray-600">
            {pagination.total} total reviews
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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

      {/* Reviews Table */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading reviews...</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No reviews found</p>
              <p className="text-gray-400 text-sm mt-1">Customer reviews will appear here</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {review.user?.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.user?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
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
                        <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {review.comment || 'No comment provided'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.isApproved, review.flagged)}`}>
                        {getStatusText(review.isApproved, review.flagged)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
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
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: pagination.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: i + 1 }))}
                  className={`px-3 py-1 border rounded text-sm ${
                    pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => dispatch(fetchReviewsAdmin({ ...filters, page: pagination.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}