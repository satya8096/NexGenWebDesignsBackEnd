const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectCost: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    invoices: [
      {
        type: String,
      },
    ],
    agreements: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    deadline: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    projectURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
