// src/controllers/reviewController.js
const Review = require("../models/review.model");
const Shop   = require("../models/shop.model");
const User   = require("../models/user.model");

const updateShopRating = async (shopId) => {
  const result = await Review.aggregate([
    { $match: { shop: shopId } },
    { $group: { _id: "$shop", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (result.length > 0) {
    await Shop.findByIdAndUpdate(shopId, {
      averageRating: Math.round(result[0].avgRating * 10) / 10,
      reviewCount:   result[0].count,
    });
  } else {
    await Shop.findByIdAndUpdate(shopId, { averageRating: 0, reviewCount: 0 });
  }
};

// GET /api/shops/:shopId/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ shop: req.params.shopId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (err) {
    console.log("getReviews ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/shops/:shopId/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const shopId = req.params.shopId;

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // guard — old shops may not have owner field
    if (shop.owner && shop.owner.toString() === req.user.id) {
      return res.status(403).json({ message: "You cannot review your own shop" });
    }

    const review = await Review.findOneAndUpdate(
      { shop: shopId, user: req.user.id },
      { rating, comment },
      { returnDocument:"after", upsert: true, setDefaultsOnInsert: true }
    ).populate("user", "name");

    await updateShopRating(shop._id);

    res.status(201).json({ review });
  } catch (err) {
    console.log("addReview ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/shops/:shopId/reviews
const deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({
      shop: req.params.shopId,
      user: req.user.id,
    });

    await updateShopRating(req.params.shopId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.log("deleteReview ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };