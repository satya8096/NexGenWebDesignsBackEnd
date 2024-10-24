const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/DB");
const errorHandler = require("./utils/errorHandler");
const userRoutes = require("./Routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./Routes/authRoutes");
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

// Error handler middleware
app.use(errorHandler);
// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
