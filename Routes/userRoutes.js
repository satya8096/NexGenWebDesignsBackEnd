const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  sendOtp,
  changePassword,
  deleteUser,
} = require("../Controllers/userController");
const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/otp-send", sendOtp)
  .post("/change-password", changePassword)
  .post("/delete-user", deleteUser);
router.get("/", getUsers).get("/user", getUser);
router.patch("/update", updateUser);

module.exports = router;
