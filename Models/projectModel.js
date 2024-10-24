const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      default: "Basic",
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    projectCost: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    invoiceUrl: {
      type: Array,
      default: [],
    },
    agreementUrl: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      default: "",
    },
    projectUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "In Progress", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
