const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    default: [0, 0]
  },
  address: {
    type: String
  }
},

  category: {
    type: String
  },
  
  shopImage:{
    type:String
  },

  description:{
    type:String
  }
 }, { timestamps: true });

 ShopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("shops", ShopSchema);
