// ✅ correct app.js
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes    = require('./routes/userRoutes');
const shopRoutes    = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes'); // ✅ fixed path

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

module.exports = app;