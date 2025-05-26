const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    empId: {
      type: String,
    },
    role: {
      type: String,
    },
    otp: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admins", userSchema);
