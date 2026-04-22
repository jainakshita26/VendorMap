const express = require("express");
const router  = express.Router({ mergeParams: true }); // mergeParams to access :shopId

const { getReviews, addReview, deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/",    getReviews);
router.post("/",   authMiddleware, addReview);
router.delete("/", authMiddleware, deleteReview);

module.exports = router;