const bcrypt = require('bcrypt')
const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken')


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      location: {
        type:        "Point",
        coordinates: location?.coordinates || [0, 0],
        address:     location?.address || ""
      }
    });

    // ← generate token immediately after register
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ← set cookie just like login does
    res.cookie("token", token, {
      httpOnly: true,
      secure:   false,
      sameSite: "lax",
      maxAge:   24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id:      newUser._id,
        name:     newUser.name,
        email:    newUser.email,
        role:     newUser.role,
        location: newUser.location,
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout
}