const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  available: {
    type: Boolean,
    default: true
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shops"
  }

}, { timestamps: true });

module.exports = mongoose.model("products", ProductSchema);