// productRoutes.js
const express = require("express");
const router  = express.Router();

const {
  addProduct,
  getProductsByShop,
  updateProduct,
  deleteProduct,
  searchProducts
} = require("../controllers/productController");

const authMiddleware      = require("../middlewares/auth.middleware");
const vendorOnly          = require("../middlewares/vendor.middleware");
const shopOwnerMiddleware = require("../middlewares/shop.middleware");

// ✅ search — must be first, no auth needed
router.get("/products/search", searchProducts);

// products by shop — public
router.get("/shops/:shopId/products", getProductsByShop);

// add product — vendor only
router.post("/add/:shopId/products", authMiddleware, vendorOnly, shopOwnerMiddleware, addProduct);

// update product — vendor only
router.put("/products/:productId", authMiddleware, vendorOnly, updateProduct);

// delete product — vendor only
router.delete("/products/:productId", authMiddleware, vendorOnly, deleteProduct);

module.exports = router;