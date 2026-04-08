const shopModel = require("../models/shop.model");

const shopOwnerMiddleware = async (req, res, next) => {
  try {

    const shopId = req.params.shopId;

    const shop = await shopModel.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    // check if logged in vendor owns this shop
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only manage your own shop"
      });
    }

    // attach shop to request (optional but useful)
    req.shop = shop;

    next();

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

module.exports = shopOwnerMiddleware;