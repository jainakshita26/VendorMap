// src/controllers/productController.js
const productModel = require("../models/product.model");
require("../models/shop.model");  // ← add this
require("../models/user.model");

// POST /api/add/:shopId/products
const addProduct = async (req, res) => {
  try {
    console.log("addProduct hit");
    console.log("body:", req.body);
    console.log("file:", req.file);
    console.log("shopId:", req.params.shopId);

    const { name, price, description, unit, discountPrice } = req.body;
    const image = req.file ? req.file.path : "";

    const product = await productModel.create({
      name,
      price,
      discountPrice: discountPrice && Number(discountPrice) > 0 ? Number(discountPrice) : null,
      unit:          unit || "piece",
      description,
      image,
      shop: req.params.shopId,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.log("addProduct ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, unit, discountPrice } = req.body;

    const updates = {
      name,
      price,
      discountPrice: discountPrice && Number(discountPrice) > 0 ? Number(discountPrice) : null,
      unit:          unit || "piece",
      description,
    };

    if (req.file) updates.image = req.file.path;

    const product = await productModel.findByIdAndUpdate(
      req.params.productId,
      updates,
      { new: true }
    );

    res.json({ message: "Product updated", product });
  } catch (error) {
    console.log("updateProduct ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/shops/:shopId/products
const getProductsByShop = async (req, res) => {
  try {
    const products = await productModel.find({ shop: req.params.shopId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// DELETE /api/products/:productId
const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.productId);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/search?q=&lat=&lng=
const searchProducts = async (req, res) => {
  try {
    const { q, lat, lng, radius = 50 } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await productModel
      .find({ name: { $regex: q, $options: "i" } })
      .populate({
        path: "shop",
        populate: { path: "owner", select: "name email" },
      });

    let results = products;

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxDist = parseFloat(radius);

      const nearby = products.filter((product) => {
        const shop = product.shop;
        if (!shop) return false;

        const coords = shop?.location?.coordinates;
        if (!coords || (coords[0] === 0 && coords[1] === 0)) return true;

        const [shopLng, shopLat] = coords;
        const R = 6371;
        const dLat = ((shopLat - userLat) * Math.PI) / 180;
        const dLng = ((shopLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
          Math.cos((shopLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return distance <= maxDist;
      });

      // fallback to all results if nothing nearby
      results = nearby.length > 0 ? nearby : products;
    }

    // sort by distance if coords available
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      results.sort((a, b) => {
        const getDistance = (product) => {
          const coords = product.shop?.location?.coordinates;
          if (!coords || (coords[0] === 0 && coords[1] === 0)) return 9999;
          const [shopLng, shopLat] = coords;
          const dLat = ((shopLat - userLat) * Math.PI) / 180;
          const dLng = ((shopLng - userLng) * Math.PI) / 180;
          const aVal =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
            Math.cos((shopLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
          return 6371 * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
        };
        return getDistance(a) - getDistance(b);
      });
    }

    res.json({ results, total: results.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProduct,
  getProductsByShop,
  updateProduct,
  deleteProduct,
  searchProducts,
};