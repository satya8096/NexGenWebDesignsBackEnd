const moment = require("moment");
const Payment = require("../Models/paymentsModel");
const Spend = require("../Models/paymentSpendModel");
const Project = require("../Models/projectModel");

const getAdminCounters = async (req, res) => {
  try {
    const now = moment().endOf("month");
    const sixMonthsAgo = moment().subtract(5, "months").startOf("month");

    // === TOTALS ===
    const [totalPayments, totalSpends, totalProjectsDueAmount] =
      await Promise.all([
        Payment.aggregate([
          { $group: { _id: null, total: { $sum: "$paymentAmount" } } },
        ]),
        Spend.aggregate([
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Project.aggregate([
          { $group: { _id: null, total: { $sum: "$dueAmount" } } },
        ]),
      ]);

    const [
      totalProjects,
      totalProjectsCompleted,
      totalProjectsPending,
      totalProjectsInProgress,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "Completed" }),
      Project.countDocuments({ status: "Pending" }),
      Project.countDocuments({ status: "In Progress" }),
    ]);

    const totalRemaining =
      (totalPayments[0]?.total || 0) - (totalSpends[0]?.total || 0);

    // === MONTHLY DATA (last 6 months) ===
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: sixMonthsAgo.toDate(),
            $lte: now.toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          year: { $first: { $year: "$paymentDate" } },
          totalAmount: { $sum: "$paymentAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlySpends = await Spend.aggregate([
      {
        $match: {
          spendDate: {
            $gte: sixMonthsAgo.toDate(),
            $lte: now.toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$spendDate" },
          year: { $first: { $year: "$spendDate" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyProjects = await Project.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sixMonthsAgo.toDate(),
            $lte: now.toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          year: { $first: { $year: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // === Format Month Names ===
    const months = [];
    const paymentsData = [];
    const spendsData = [];
    const projectsData = [];

    for (let i = 0; i < 6; i++) {
      const date = moment().subtract(5 - i, "months");
      const monthNumber = date.month() + 1; // 1-indexed
      const monthName = date.format("MMM");

      months.push(monthName);

      const payment = monthlyPayments.find((m) => m._id === monthNumber);
      const spend = monthlySpends.find((m) => m._id === monthNumber);
      const project = monthlyProjects.find((m) => m._id === monthNumber);

      paymentsData.push(payment ? payment.totalAmount : 0);
      spendsData.push(spend ? spend.totalAmount : 0);
      projectsData.push(project ? project.total : 0);
    }

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
        months,
        paymentsData,
        spendsData,
        projectsData,
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
