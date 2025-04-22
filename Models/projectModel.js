const mongoose = require("mongoose");
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
    renewalDate: {
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

projectSchema.pre("save", function (next) {
  this.dueAmount = this.projectCost - this.amountPaid;
  next();
});

module.exports = mongoose.model("Project", projectSchema);
