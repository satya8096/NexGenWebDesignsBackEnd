const User = require("../Models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Send password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ status: "Fail", message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      to: user.email,
      from: "no-reply@nexgenwebdesigns.com",
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${process.env.FRONT_END_URL}reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions);

    res.json({
      status: "Success",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Reset password after verifying the token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid or expired token" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  res.json({ status: "Success", message: "Password reset successful" });
};

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
