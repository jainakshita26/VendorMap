const express    = require("express");
const router     = express.Router();
const authMiddleware  = require("../middlewares/auth.middleware");
const vendorMiddleware = require("../middlewares/vendor.middleware");
const { generateDescription } = require("../controllers/aiController");

// only vendors can generate descriptions
router.post("/generate-description", authMiddleware, vendorMiddleware, generateDescription);

module.exports = router;