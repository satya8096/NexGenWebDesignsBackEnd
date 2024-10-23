const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../Controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers); // Admin access only

module.exports = router;
