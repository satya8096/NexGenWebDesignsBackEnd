const Payment = require("../Models/paymentsModel");
const Spend = require("../Models/paymentSpendModel");
const Project = require("../Models/projectModel");

const getAdminCounters = async (req, res) => {
  try {
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$paymentAmount" } } },
    ]);

    const totalSpends = await Spend.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalProjects = await Project.countDocuments();

    const totalProjectsCompleted = await Project.countDocuments({
      status: "Completed",
    });

    const totalProjectsPending = await Project.countDocuments({
      status: "Pending",
    });
    const totalProjectsInProgress = await Project.countDocuments({
      status: "In Progress",
    });
    const totalProjectsDueAmount = await Project.aggregate([
      { $group: { _id: null, total: { $sum: "$dueAmount" } } },
    ]);

    const totalRemaining =
      (totalPayments[0]?.total || 0) - (totalSpends[0]?.total || 0);

    res.status(200).json({
      message: "Success",
      data: {
        totalPayments: totalPayments[0]?.total || 0,
        totalSpends: totalSpends[0]?.total || 0,
        totalRemaining,
        totalProjects,
        totalProjectsCompleted,
        totalProjectsPending,
        totalProjectsInProgress,
        totalProjectsDueAmount: totalProjectsDueAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard counter fetch failed:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAdminCounters,
};
