const shopModel = require("../models/shop.model");
const ShopView     = require("../models/shopView.model"); 
const productModel = require("../models/product.model");



// Create Shop
// const createShop = async (req, res) => {
//   try {
//     const { shopName, location, category, shopImage, description } = req.body;
//     // location from frontend = { coordinates: [lng, lat], address: "Indore, MP" }

//     const newShop = await shopModel.create({
//       shopName,
//       owner: req.user.id,
//       location: {
//         type: "Point",
//         coordinates: location?.coordinates || [0, 0],
//         address: location?.address || ""
//       },
//       category,
//       shopImage,
//       description
//     });

//     res.status(201).json({
//       message: "Shop created successfully",
//       shop: newShop
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


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


// Get Shop By ID — now tracks views
const getShopById = async (req, res) => {
  try {
    const shop = await shopModel.findById(req.params.id)
      .populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // track view — fire and forget, don't block response
    const now = new Date();
    ShopView.create({
      shop:      shop._id,
      viewedAt:  now,
      hour:      now.getHours(),
      dayOfWeek: now.getDay(),
    }).catch(() => {}); // silent fail — view tracking never breaks the page

    // increment simple counter too
    shopModel.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
      .catch(() => {});

    res.status(200).json({ shop });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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


// POST /api/shops/create


// POST /api/shops/create
const createShop = async (req, res) => {
  try {
    const { shopName, category, description, phone } = req.body; // ← add phone
    const shopImage = req.file ? req.file.path : "";
    const location  = req.body.location ? JSON.parse(req.body.location) : undefined;

    const shop = await shopModel.create({
      shopName,
      category,
      description,
      phone: phone || "",  // ← add
      shopImage,
      location,
      owner: req.user._id || req.user.id,
    });

    res.status(201).json({ success: true, shop });
  } catch (err) {
    console.log("createShop ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/shops/update
const updateShop = async (req, res) => {
  try {
    const updates = {};

    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.phone !== undefined)       updates.phone       = req.body.phone; // ← add
    if (req.file) updates.shopImage = req.file.path;

    const shop = await shopModel.findOneAndUpdate(
      { owner: req.user._id || req.user.id },
      updates,
      { new: true }
    );

    res.json({ success: true, shop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PUT /api/shops/toggle-closed
const toggleTemporaryClosed = async (req, res) => {
  try {
    const shop = await shopModel.findOne({ owner: req.user.id });

    if (!shop) return res.status(404).json({ message: "Shop not found" });

    shop.temporarilyClosed = !shop.temporarilyClosed;
    await shop.save();

    res.json({ success: true, temporarilyClosed: shop.temporarilyClosed, shop });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/shops/hours
const updateHours = async (req, res) => {
  try {
    const { hours } = req.body;

    const shop = await shopModel.findOneAndUpdate(
      { owner: req.user.id },
      { hours },
      { new: true }
    );

    res.json({ success: true, shop });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/shops/analytics
const getAnalytics = async (req, res) => {
  try {
    const shop = await shopModel.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const shopId = shop._id;
    const now    = new Date();
    const days7  = new Date(now - 7 * 24 * 60 * 60 * 1000);  // 7 days ago
    const days30 = new Date(now - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // ── 1. Total views (all time)
    const totalViews = await ShopView.countDocuments({ shop: shopId });

    // ── 2. Views last 7 days — grouped by date for line chart
    const viewsByDay = await ShopView.aggregate([
      { $match: { shop: shopId, viewedAt: { $gte: days7 } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // fill missing days with 0
    const viewsByDayFilled = [];
    for (let i = 6; i >= 0; i--) {
      const d     = new Date(now - i * 24 * 60 * 60 * 1000);
      const label = d.toISOString().split("T")[0];
      const found = viewsByDay.find((v) => v._id === label);
      viewsByDayFilled.push({
        date:  label,
        label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        views: found ? found.count : 0,
      });
    }

    // ── 3. Peak hours — grouped by hour for bar chart
    const peakHours = await ShopView.aggregate([
      { $match: { shop: shopId, viewedAt: { $gte: days30 } } },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // fill all 24 hours with 0
    const peakHoursFilled = Array.from({ length: 24 }, (_, h) => {
      const found = peakHours.find((p) => p._id === h);
      const label = h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
      return { hour: h, label, views: found ? found.count : 0 };
    });

    // ── 4. Products count
    const totalProducts = await productModel.countDocuments({ shop: shopId });

    // ── 5. Views last 7 days total
    const weekViews = await ShopView.countDocuments({
      shop: shopId, viewedAt: { $gte: days7 }
    });

    // ── 6. Views last 30 days total
    const monthViews = await ShopView.countDocuments({
      shop: shopId, viewedAt: { $gte: days30 }
    });

    res.json({
      totalViews,
      weekViews,
      monthViews,
      totalProducts,
      averageRating: shop.averageRating,
      reviewCount:   shop.reviewCount,
      viewsByDay:    viewsByDayFilled,
      peakHours:     peakHoursFilled,
    });
  } catch (err) {
    console.log("getAnalytics ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// add to exports
module.exports = {
  createShop,
  updateShop,
  getAllShops,
  getShopById,
  getMyShop,
  getNearbyShops,
  updateShop ,
  toggleTemporaryClosed ,
  updateHours,
  getAnalytics
};




