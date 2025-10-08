import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BiLike, BiDislike } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { 
  fetchProductReviews, 
  addProductReview, 
  voteOnReview, 
  clearReviews 
} from '../../features/reviews/reviewSlice';

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector(state => state.auth);
  const { reviews, pagination, status, error } = useSelector(state => state.review);
  const loading = status === 'loading';
  
  // Check if user is authenticated
  const isAuthenticated = user && accessToken;
  
  // Find user's existing review
  const userReview = isAuthenticated && user?._id 
    ? reviews.find(review => review.user._id === user._id)
    : null;
  
  const [sortOption, setSortOption] = useState('recent');
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    title: '', 
    body: '', 
    photos: [] 
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch reviews when component mounts or productId/sort changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews({ 
        productId, 
        page: pagination.page, 
        limit: pagination.limit, 
        sort: sortOption 
      }));
    }
    
    return () => {
      dispatch(clearReviews());
    };
  }, [productId, sortOption, pagination.page, dispatch]);

  // Update form when userReview changes
  useEffect(() => {
    if (userReview) {
      setNewReview({
        rating: userReview.rating || 5,
        title: userReview.title || '',
        body: userReview.body || '',
        photos: userReview.photos || []
      });
    } else {
      setNewReview({
        rating: 5,
        title: '',
        body: '',
        photos: []
      });
    }
  }, [userReview]);

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!newReview.rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!newReview.body.trim()) {
      toast.error("Please enter a review");
      return;
    }

    try {
      const result = await dispatch(addProductReview({
        productId,
        rating: newReview.rating,
        title: newReview.title.trim(),
        body: newReview.body.trim(),
        photos: newReview.photos
      })).unwrap();

      if (result.success) {
        toast.success(userReview ? "Your review has been updated!" : "Thank you for your review!");
        setShowReviewForm(false);
        // Refresh reviews
        dispatch(fetchProductReviews({ 
          productId, 
          page: pagination.page, 
          limit: pagination.limit, 
          sort: sortOption 
        }));
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
      console.error("Review submission error:", error);
    }
  };

  const handleVote = async (reviewId, type) => {
    if (!isAuthenticated) {
      toast.error("Please login to vote on reviews");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      await dispatch(voteOnReview({ reviewId, type })).unwrap();
      toast.success(`You marked this review as ${type}`);
    } catch (error) {
      toast.error("Failed to submit your vote");
      console.error("Vote submission error:", error);
    }
  };

  // Calculate average rating and distribution
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
    
  // Count ratings by star level (5★, 4★, etc.)
  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl  font-semibold text-gray-900">Customer Reviews</h2>
          <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
              <div className="flex flex-col items-center">
                <div className="text-5xl  font-bold mb-2">{averageRating}</div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star}>
                      {star <= Math.round(averageRating) ? (
                        <AiFillStar className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <AiOutlineStar className="w-5 h-5 text-yellow-400" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
                
                <div className="w-full mt-6 space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = ratingCounts[rating - 1];
                    const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                    
                    return (
                      <div key={rating} className="flex  items-center text-sm">
                        <span className="w-8">{rating}</span>
                        <span className="text-yellow-400 mx-1"><AiFillStar /></span>
                        <div className="flex-1 ml-2">
                          <div className="bg-gray-200 h-2 rounded-full">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-9 text-right text-gray-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 w-full">
                  <button 
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)} 
                    className="w-full py-3 border border-black hover:bg-black hover:text-white transition-colors font-medium text-sm uppercase tracking-wider"
                  >
                    {userReview ? "Edit Your Review" : "Write a Review"}
                  </button>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
              <h3 className="text-base font-medium mb-4">Sort Reviews</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setSortOption('recent');
                    dispatch(fetchProductReviews({ 
                      productId, 
                      page: 1, 
                      limit: pagination.limit, 
                      sort: 'recent' 
                    }));
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    sortOption === 'recent' 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Most Recent
                </button>
                <button 
                  onClick={() => {
                    setSortOption('top');
                    dispatch(fetchProductReviews({ 
                      productId, 
                      page: 1, 
                      limit: pagination.limit, 
                      sort: 'top' 
                    }));
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    sortOption === 'top' 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Highest Rating
                </button>
                <button 
                  onClick={() => {
                    setSortOption('helpful');
                    dispatch(fetchProductReviews({ 
                      productId, 
                      page: 1, 
                      limit: pagination.limit, 
                      sort: 'helpful' 
                    }));
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    sortOption === 'helpful' 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Most Helpful
                </button>
              </div>
            </div>
          </div>
          
          {/* Reviews List & Form */}
          <div className="lg:col-span-8">
            {showReviewForm && (
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {userReview ? 'Edit Your Review' : 'Share Your Thoughts'}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="p-1"
                      >
                        {star <= newReview.rating ? (
                          <AiFillStar className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <AiOutlineStar className="w-6 h-6 text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2"
                    placeholder="Summarize your experience"
                    maxLength={100}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                  <textarea 
                    value={newReview.body}
                    onChange={(e) => setNewReview({...newReview, body: e.target.value})}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2 min-h-[100px]"
                    placeholder="Share your experience with this product..."
                    maxLength={1000}
                  ></textarea>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    type="button"
                    onClick={handleAddReview}
                    disabled={loading}
                    className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {loading && !reviews.length ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{review.user?.name || 'Anonymous'}</h4>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star}>
                              {star <= review.rating ? (
                                <AiFillStar className="w-4 h-4 text-yellow-400" />
                              ) : (
                                <AiOutlineStar className="w-4 h-4 text-yellow-400" />
                              )}
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {review.verifiedPurchase && (
                        <div className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full">
                          <BsCheckCircleFill size={12} className="mr-1" />
                          <span className="text-sm font-medium">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    
                    {review.title && (
                      <h5 className="font-medium mt-3">{review.title}</h5>
                    )}
                    
                    <p className="mt-2 text-gray-800">{review.body}</p>
                    
                    {/* Review photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.photos.map((photo, idx) => (
                          <div key={idx} className="w-16 h-16 rounded overflow-hidden">
                            <img 
                              src={photo} 
                              alt={`Review photo ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Helpful buttons */}
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-500 mr-3">Was this helpful?</span>
                      <button 
                        onClick={() => handleVote(review._id, 'helpful')}
                        className="flex items-center text-sm text-gray-500 hover:text-black px-2 py-1 border rounded-md mr-2"
                      >
                        <BiLike className="mr-1" />
                        <span>{review.helpfulCount || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleVote(review._id, 'unhelpful')}
                        className="flex items-center text-sm text-gray-500 hover:text-black px-2 py-1 border rounded-md"
                      >
                        <BiDislike className="mr-1" />
                        <span>{review.unhelpfulCount || 0}</span>
                      </button>
                    </div>
                    
                    {/* Admin reply if any */}
                    {review.adminReply && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-300">
                        <p className="text-sm font-medium">Response from Garava:</p>
                        <p className="text-sm text-gray-600 mt-1">{review.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    <button 
                      onClick={() => dispatch(fetchProductReviews({ 
                        productId, 
                        page: Math.max(1, pagination.page - 1), 
                        limit: pagination.limit, 
                        sort: sortOption 
                      }))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4 py-2">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button 
                      onClick={() => dispatch(fetchProductReviews({ 
                        productId, 
                        page: Math.min(pagination.totalPages, pagination.page + 1), 
                        limit: pagination.limit, 
                        sort: sortOption 
                      }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                {isAuthenticated ? (
                  !showReviewForm && (
                    <button 
                      onClick={() => setShowReviewForm(true)}
                      className="mt-4 px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-wider"
                    >
                      Write a Review
                    </button>
                  )
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    Please <button 
                      onClick={() => navigate('/login', { state: { from: window.location.pathname } })} 
                      className="text-black underline"
                    >
                      login
                    </button> to write a review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;