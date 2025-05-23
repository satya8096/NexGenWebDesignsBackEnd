const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  projectName: {
    type: String,
    required: true,
    trim: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ["Cash", "Card", "UPI", "Bank Transfer", "Other", "Phonepay", "Gpay"],
  },
  dueAmount: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
    enum: ["Received", "Pending", "Cancelled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Fix for OverwriteModelError in CommonJS
module.exports = mongoose.model("payments", paymentSchema);
