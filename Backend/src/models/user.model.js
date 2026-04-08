const mongoose = require("mongoose");

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["customer", "vendor"],
    default: "customer"
  },
  location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: [0, 0]
  },
  address: {
    type: String  // human readable — "Indore, MP"
  }
}
}, { timestamps: true });

// Export model
module.exports = mongoose.model("User", UserSchema);