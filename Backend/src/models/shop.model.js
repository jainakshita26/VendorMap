const mongoose = require("mongoose");

const hoursSchema = new mongoose.Schema({
  day:      { type: String },
  open:     { type: String, default: "09:00" },
  close:    { type: String, default: "21:00" },
  isClosed: { type: Boolean, default: false },
}, { _id: false });

const ShopSchema = new mongoose.Schema({
  shopName:      { type: String, required: true },
  owner:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    type:        { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
    address:     { type: String }
  },
  category:      { type: String },
  shopImage:     { type: String },
  description:   { type: String },
  averageRating: { type: Number, default: 0 },
  reviewCount:   { type: Number, default: 0 },

  // ← new
  hours: {
    type: [hoursSchema],
    default: () => [
      { day: "Monday",    open: "09:00", close: "21:00", isClosed: false },
      { day: "Tuesday",   open: "09:00", close: "21:00", isClosed: false },
      { day: "Wednesday", open: "09:00", close: "21:00", isClosed: false },
      { day: "Thursday",  open: "09:00", close: "21:00", isClosed: false },
      { day: "Friday",    open: "09:00", close: "21:00", isClosed: false },
      { day: "Saturday",  open: "09:00", close: "21:00", isClosed: false },
      { day: "Sunday",    open: "09:00", close: "21:00", isClosed: true  },
    ]
  },
  temporarilyClosed: { type: Boolean, default: false },
}, { timestamps: true });

ShopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("shops", ShopSchema);