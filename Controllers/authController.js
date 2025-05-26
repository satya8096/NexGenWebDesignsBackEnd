const User = require("../Models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.VerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ valid: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ valid: false, message: "Invalid token format" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }
    return res.json({ valid: true });
  } catch (error) {
    return res
      .status(401)
      .json({ valid: false, message: "Token invalid or expired" });
  }
};
