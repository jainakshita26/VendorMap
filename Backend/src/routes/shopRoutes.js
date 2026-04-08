const express = require("express");
const router = express.Router();

const {
  createShop,
  getAllShops,
  getShopById,
  getMyShop,
  getNearbyShops,
  updateShop
} = require("../controllers/shopController");

const authMiddleware=require('../middlewares/auth.middleware')
const vendorMiddleware=require('../middlewares/vendor.middleware')


// Create a shop
router.post("/create",authMiddleware,vendorMiddleware, createShop);


// Get all shops
router.get("/", getAllShops);

router.get("/my-shop", authMiddleware, vendorMiddleware, getMyShop);

router.get("/nearby",    getNearbyShops);


// Get shop by ID
router.get("/:id", getShopById);

router.put("/update",     authMiddleware, vendorMiddleware, updateShop);


module.exports = router;