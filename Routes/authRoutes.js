const express = require("express");
const {
  forgotPassword,
  resetPassword,
  VerifyToken,
} = require("../Controllers/authController");
const protect = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset/:token", resetPassword);
router.get("/verify-token", protect, VerifyToken);

module.exports = router;
