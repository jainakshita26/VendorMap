// src/controllers/favouriteController.js
const User = require("../models/user.model");
const Shop = require("../models/shop.model"); // ← import as variable, not just require

const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // manually populate instead of using .populate()
    // this avoids the MissingSchemaError completely
    const favourites = await Shop.find({
      _id: { $in: user.favourites || [] }
    });

    res.json({ favourites });
  } catch (err) {
    console.log("getFavourites ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const toggleFavourite = async (req, res) => {
  try {
    const user   = await User.findById(req.user.id);
    const shopId = req.params.shopId;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favourites) user.favourites = [];

    const isSaved = user.favourites.some(id => id.toString() === shopId);

    if (isSaved) {
      user.favourites = user.favourites.filter(id => id.toString() !== shopId);
    } else {
      user.favourites.push(shopId);
    }

    await user.save();

    res.json({
      isFavourite: !isSaved,
      favourites:  user.favourites,
    });
  } catch (err) {
    console.log("toggleFavourite ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFavourites, toggleFavourite };