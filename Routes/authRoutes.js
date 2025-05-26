const express = require("express");
const { VerifyToken } = require("../Controllers/authController");

const router = express.Router();

router.get("/verify-token", VerifyToken);

module.exports = router;
