// ✅ correct app.js
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

require("./models/user.model");
require("./models/shop.model");
require("./models/product.model");
require("./models/review.model");


const userRoutes    = require('./routes/userRoutes');
const shopRoutes    = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes'); 
const reviewRoutes=require('./routes/reviewRoutes')
const favouriteRoutes=require('./routes/favouriteRoutes')
const aiRoutes=require('./routes/aiRoutes')
require("./models/shopView.model");
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",     userRoutes);
app.use("/api/shops",    shopRoutes);
app.use("/api", productRoutes);
app.use("/api/shops/:shopId/reviews", reviewRoutes);
app.use("/api/users/favourites", favouriteRoutes);
app.use("/api/ai", aiRoutes);
module.exports = app;