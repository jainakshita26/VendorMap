const shopModel = require("../models/shop.model");


// Create Shop
const createShop = async (req, res) => {
  try {
    const { shopName, location, category, shopImage, description } = req.body;
    // location from frontend = { coordinates: [lng, lat], address: "Indore, MP" }

    const newShop = await shopModel.create({
      shopName,
      owner: req.user.id,
      location: {
        type: "Point",
        coordinates: location?.coordinates || [0, 0],
        address: location?.address || ""
      },
      category,
      shopImage,
      description
    });

    res.status(201).json({
      message: "Shop created successfully",
      shop: newShop
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get All Shops
const getAllShops = async (req, res) => {
  try {

    const shops = await shopModel.find().populate("owner", "name email");

    res.status(200).json({
      shops
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};


// Get Shop By ID
const getShopById = async (req, res) => {
  try {

    const shop = await shopModel.findById(req.params.id).populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    res.status(200).json({
      shop
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

// Get vendor's own shop
const getMyShop = async (req, res) => {
  try {
    const shop = await shopModel.findOne({ owner: req.user.id })
      .populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({
        message: "You don't have a shop yet"
      });
    }

    res.status(200).json({ shop });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/shops/nearby?lat=22.7&lng=75.8&radius=10
// shopController.js

const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ 
        message: "lat and lng are required" 
      });
    }

    /*
      We try three different radiuses one by one.
      As soon as we find shops → stop and return them.
      
      Why this order?
      5km  → show only very nearby shops (same area)
      20km → expand to nearby town/district
      50km → expand to whole region
      null → give up on nearby, show everything
    */
    const radiusOptions = [5, 20, 50];

    let shops = [];
    let usedRadius = null;

    for (const radius of radiusOptions) {
      /*
        $nearSphere → MongoDB's GPS distance query
        $geometry   → the center point (user's location)
        $maxDistance → maximum distance in METERS
                       so we multiply km × 1000
        
        MongoDB automatically:
        1. Calculates distance from user to every shop
        2. Filters shops beyond maxDistance
        3. Sorts results nearest first
      */
      const found = await shopModel.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(lng), // longitude first (MongoDB convention)
                parseFloat(lat)  // latitude second
              ]
            },
            $maxDistance: radius * 1000 // e.g. 5km = 5000 meters
          }
        }
      }).populate("owner", "name email");

      if (found.length > 0) {
        // found shops at this radius → use these results
        shops = found;
        usedRadius = radius;
        break; // stop trying larger radiuses
      }
      // found nothing → loop continues to next radius
    }

    // if all radiuses failed → return ALL shops as fallback
    if (shops.length === 0) {
      shops = await shopModel
        .find()
        .populate("owner", "name email");
      usedRadius = null; // null means "showing all shops"
    }

    /*
      We send usedRadius back to frontend so it can show:
      "Shops within 5km" or "Shops within 20km" or "All Shops"
    */
    res.status(200).json({ shops, usedRadius });

  } catch (error) {
    console.log(error);
    // if geospatial query crashes → graceful fallback
    try {
      const shops = await shopModel
        .find()
        .populate("owner", "name email");
      res.status(200).json({ shops, usedRadius: null });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
};


// shopController.js — add this new function

/*
  updateShop:
  Vendor can update their shop's image and description
  
  Why only image and description?
  - shopName, category, location are more permanent
  - We can add those later if needed
  - Keeping it simple for now
*/
const updateShop = async (req, res) => {
  try {
    const { shopImage, description } = req.body;

    /*
      findOneAndUpdate:
      { owner: req.user.id } → find shop owned by THIS vendor
      This prevents vendors from editing OTHER vendors' shops
      
      { new: true } → return updated document (not old one)
    */
    const shop = await shopModel.findOneAndUpdate(
      { owner: req.user.id },
      { shopImage, description },
      { new: true }
    ).populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
      message: "Shop updated successfully",
      shop
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// add to exports
module.exports = {
  createShop,
  getAllShops,
  getShopById,
  getMyShop,
  getNearbyShops,
  updateShop  
};




