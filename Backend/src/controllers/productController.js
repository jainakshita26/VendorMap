const productModel = require("../models/product.model");

const addProduct = async (req, res) => {
  try {

    const shopId = req.params.shopId;

    const { name, price, description, image } = req.body;

    const product = await productModel.create({
      name,
      price,
      description,
      image,
      shop: shopId
    });

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


const getProductsByShop = async (req, res) => {

  try {

    const shopId = req.params.shopId;

    const products = await productModel.find({ shop: shopId });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


const updateProduct = async (req, res) => {

  try {

    const productId = req.params.productId;

    const product = await productModel.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    res.json({
      message: "Product updated",
      product
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};



const deleteProduct = async (req, res) => {

  try {

    const productId = req.params.productId;

    await productModel.findByIdAndDelete(productId);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


// Search products by name + optional location
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
        populate: { path: "owner", select: "name email" }
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
        if (!coords || (coords[0] === 0 && coords[1] === 0)) {
          return true; // include unknown location
        }

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

      /*
        ✅ Key fix:
        If nearby search returns nothing → fall back to ALL results
        This handles GPS inaccuracy and development testing
      */
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
  searchProducts, // ✅ add this
};

