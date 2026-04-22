const express  = require("express");
const router   = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getFavourites, toggleFavourite } = require("../controllers/favouriteController");

router.get("/",            authMiddleware, getFavourites);
router.post("/:shopId",    authMiddleware, toggleFavourite);

module.exports = router;