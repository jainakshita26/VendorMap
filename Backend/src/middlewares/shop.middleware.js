const shopModel = require("../models/shop.model");

const shopOwnerMiddleware = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const shop   = await shopModel.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // guard — old shops may not have owner field
    if (!shop.owner) {
      return res.status(403).json({ message: "Shop has no owner assigned" });
    }

    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only manage your own shop" });
    }

    req.shop = shop;
    next();

  } catch (error) {
    console.log("shopOwnerMiddleware ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = shopOwnerMiddleware;