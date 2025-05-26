const paymentsModel = require("./../Models/paymentsModel");

// ✅ Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const {
      clientName,
      projectName,
      paymentAmount,
      paymentDate,
      paymentMode,
      status,
    } = req.body;

    const newPayment = new paymentsModel({
      clientName,
      projectName,
      paymentAmount,
      paymentDate,
      paymentMode,
      status,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({
      message: "Payment created successfully",
      data: savedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment", error });
  }
};

// ✅ Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentsModel.find().sort({ paymentDate: -1 });
    res.status(200).json({
      message: "Success",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};

// ✅ Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentsModel.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      message: "Payment fetched successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment", error });
  }
};

// ✅ Update a payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const {
      clientName,
      projectName,
      paymentAmount,
      paymentDate,
      paymentMode,
      status,
    } = req.body;

    const updatedPayment = await paymentsModel.findByIdAndUpdate(
      req.params.id,
      {
        clientName,
        projectName,
        paymentAmount,
        paymentDate,
        paymentMode,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment", error });
  }
};

// ✅ Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await paymentsModel.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error });
  }
};
