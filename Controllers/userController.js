const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User
exports.registerUser = async (req, res, next) => {
  const { name, email, password, phoneNumber, empId, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      role,
      empId,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        status: "Success",
        _id: user._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ status: "Fail", message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.json({ Status: "Fail", message: "User not found!" });
    }
    res.json({ Status: "Success", message: "User deleted successfully!" });
  } catch (error) {
    console.log(error);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: "Fail", message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ status: "Fail", message: "User not found" });
    }

    res.json({ status: "Success", data: user });
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(401)
      .json({ status: "Fail", message: "Invalid or expired token" });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  try {
    const user = await User.findById(req.body._id);
    if (!user) {
      return res.json({ Status: "Fail", message: "User Not Found !" });
    }
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    await user.save();
    res.json({ Status: "Success", message: "Profile updated successfully!" });
  } catch (error) {
    return res.json({ Status: "Fail", message: "Something went wrong !" });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ Status: "Fail", message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.json({ Status: "Success", message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Status: "Fail", message: "Error sending OTP" });
  }
};

exports.changePassword = async (req, res) => {
  const { newPassword, otp, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ Status: "Fail", message: "User not found" });

    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ Status: "Fail", message: "Invalid or expired OTP" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({
      Status: "Success",
      message: "Password changed successfully",
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ Status: "Fail", message: "Error changing password" });
  }
};
