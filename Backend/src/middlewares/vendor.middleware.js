const vendorOnly = (req, res, next) => {

  if (req.user.role !== "vendor") {
    console.log(req.user)
    return res.status(403).json({
      message: "Only vendors can create shops"
    });
  }

  next();
};

module.exports = vendorOnly;