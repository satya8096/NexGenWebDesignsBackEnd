const mongoose = require("mongoose");
const paymentSpendSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  spendDate: {
    type: Date,
    required: true,
  },
  mode: {
    type: String,
    enum: ["Cash", "Card", "UPI", "Bank Transfer", "Other"],
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("paymentspends", paymentSpendSchema);
