const express = require("express");
const router = express.Router();

const {
  createShop,
  getAllShops,
  getShopById,
  getMyShop,
  getNearbyShops,
  updateShop,toggleTemporaryClosed,updateHours,getAnalytics
} = require("../controllers/shopController");

const authMiddleware=require('../middlewares/auth.middleware')
const vendorMiddleware=require('../middlewares/vendor.middleware')
const  {upload} = require("../middlewares/upload.middleware");


// Create a shop
router.post("/create", authMiddleware, vendorMiddleware, upload.single("shopImage"), createShop);
router.put("/update", authMiddleware, vendorMiddleware, upload.single("shopImage"), updateShop);


// Get all shops
router.get("/", getAllShops);
router.get("/nearby",    getNearbyShops);
router.get("/my-shop", authMiddleware, vendorMiddleware, getMyShop);
router.get("/analytics", authMiddleware, vendorMiddleware, getAnalytics);






router.post("/create", authMiddleware, vendorMiddleware, upload.single("shopImage"), createShop);
router.put("/update", authMiddleware, vendorMiddleware, upload.single("shopImage"), updateShop);
router.put("/hours", authMiddleware, vendorMiddleware, updateHours);
router.put("/toggle-closed", authMiddleware, vendorMiddleware, toggleTemporaryClosed);

// Get shop by ID
router.get("/:id", getShopById);



module.exports = router;