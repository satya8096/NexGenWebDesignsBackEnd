const paymenstModel = require("./../Models/paymentsModel");

// Create a new payment
exports.createPayment = async (req, res) => {
  console.log(req.body);

  try {
    const { purpose, amount, spendDate, mode, remarks } = req.body;

    const newPayment = new paymenstModel({
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
    res.status(500).json({ message: "Failed to create payment", error });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymenstModel.find().sort({ spendDate: -1 });
    res.status(200).json({
      message: "Success",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymenstModel.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      message: "Success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment", error });
  }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const { purpose, amount, spendDate, mode, remarks } = req.body;

    const updatedPayment = await paymenstModel.findByIdAndUpdate(
      req.params.id,
      { purpose, amount, spendDate, mode, remarks },
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
    res.status(500).json({ message: "Failed to update payment", error });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error });
  }
};
