const paymentSpend = require("../Models/paymentSpendModel");

// @route   GET /api/payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentSpend.find().sort({ spendDate: -1 });
    res.status(200).json({
      message: "Success",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

// @route   GET /api/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentSpend.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      message: "Success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

// @route   POST /api/payments
exports.createPayment = async (req, res) => {
  try {
    const { purpose, amount, spendDate, mode, remarks } = req.body;

    const newPayment = new paymentSpend({
      purpose,
      amount,
      spendDate,
      mode,
      remarks,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({
      message: "Success",
      data: savedPayment,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating payment", error });
  }
};

// @route   PUT /api/payments/:id
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await paymentSpend.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      message: "Success",
      data: updatedPayment,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating payment", error });
  }
};

// @route   DELETE /api/payments/:id
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await paymentSpend.findByIdAndDelete(req.params.id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
};
