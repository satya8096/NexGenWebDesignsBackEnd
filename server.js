const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/DB");
const errorHandler = require("./Utils/errorHandler");
const userRoutes = require("./Routes/userRoutes");
const projectRoutes = require("./Routes/projectRoutes");
const authRoutes = require("./Routes/authRoutes");
const paymentRoutes = require("./Routes/paymentsRoutes");
const paymentSpendRoutes = require("./Routes/paymentSpendRoutes");
const protect = require("./Middlewares/authMiddleware");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

// Routes
app.use("/api/admins", userRoutes);
app.use("/api/projects", protect, projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", protect, paymentRoutes);
app.use("/api/paymentspends", protect, paymentSpendRoutes);

// Error handler middleware
app.use(errorHandler);
// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
