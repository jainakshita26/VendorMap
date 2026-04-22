import { useState } from "react";
import useReviews from "../hooks/useReviews";
import StarRating from "./StarRating";
import useAuth from "../../auth/hooks/useAuth";

const ReviewSkeleton = () => (
  <div className="animate-pulse space-y-2 py-4 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-full" />
    <div className="h-3 bg-gray-200 rounded w-2/3" />
  </div>
);

const ReviewSection = ({ shopId, shopOwnerId }) => {
  const { user, isAuthenticated, isCustomer } = useAuth();
  const { reviews, loading, submitting, handleAddReview, handleDeleteReview } = useReviews(shopId);

  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // check if current user already left a review
  const myReview = reviews.find((r) => r.user?._id === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    try {
      await handleAddReview(rating, comment);
      setSuccess(true);
      setComment("");
      setRating(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit review");
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeleteReview();
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  const isOwner = user?._id === shopOwnerId;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({reviews.length})
          </span>
        )}
      </h2>

      {/* Write a review — only customers, not shop owner */}
      {isAuthenticated && isCustomer && !isOwner && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {myReview ? "Update your review" : "Write a review"}
          </h3>

          {/* Show existing review info */}
          {myReview && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center justify-between">
              <span>You already reviewed this shop — submitting will update it</span>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 underline ml-3 shrink-0"
              >
                Delete
              </button>
            </div>
          )}

          {error && (
            <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 px-4 py-2 bg-green-50 border border-green-200 text-green-600 text-xs rounded-lg">
              ✓ Review submitted successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Star picker */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Your rating</label>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Comment <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Share your experience with this shop..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {comment.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              {submitting ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Not logged in prompt */}
      {!isAuthenticated && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-6 text-center">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </a>{" "}
            to leave a review
          </p>
        </div>
      )}

      {/* Reviews list */}
      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-10">
          <span className="text-4xl">💬</span>
          <p className="text-gray-500 text-sm mt-3">No reviews yet</p>
          <p className="text-gray-400 text-xs mt-1">Be the first to review this shop</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-1">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2"
            >
              {/* Reviewer info + stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Avatar circle with initial */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                    {review.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {review.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;