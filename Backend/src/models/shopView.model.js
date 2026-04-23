const mongoose = require("mongoose");

const shopViewSchema = new mongoose.Schema({
  shop:      { type: mongoose.Schema.Types.ObjectId, ref: "shops", required: true },
  viewedAt:  { type: Date, default: Date.now },
  hour:      { type: Number }, // 0-23 for peak hours chart
  dayOfWeek: { type: Number }, // 0=Sun, 1=Mon ... 6=Sat
}, { timestamps: false });

module.exports = mongoose.model("ShopView", shopViewSchema);