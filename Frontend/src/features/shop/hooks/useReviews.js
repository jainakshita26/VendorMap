import { useState, useEffect } from "react";
import { getReviews, addReview, deleteReview } from "../services/shop.api";

const useReviews = (shopId) => {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getReviews(shopId);
        setReviews(data.reviews);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    if (shopId) fetch();
  }, [shopId]);

  const handleAddReview = async (rating, comment) => {
    setSubmitting(true);
    try {
      const data = await addReview(shopId, { rating, comment });
      // upsert — replace if user already reviewed
      setReviews((prev) => {
        const exists = prev.find((r) => r._id === data.review._id);
        if (exists) return prev.map((r) => r._id === data.review._id ? data.review : r);
        return [data.review, ...prev];
      });
      return true;
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(shopId);
      setReviews((prev) => prev.filter((r) => r.user._id !== undefined));
    } catch (err) {
      throw err;
    }
  };

  return { reviews, loading, submitting, error, handleAddReview, handleDeleteReview };
};

export default useReviews;