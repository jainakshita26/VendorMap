const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: Number, required: true },
  discountPrice: { type: Number, default: null }, // ← null means no discount
  unit:          { type: String, default: "piece", enum: [
    "piece", "kg", "g", "L", "ml", "dozen", "pack", "box", "bottle"
  ]},
  available:     { type: Boolean, default: true },
  description:   { type: String },
  image:         { type: String },
  shop:          { type: mongoose.Schema.Types.ObjectId, ref: "shops" }
}, { timestamps: true });

module.exports = mongoose.model("products", ProductSchema);