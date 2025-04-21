// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAdminCounters } = require("../Controllers/AdminCounters");

// GET /admin/counters
router.get("/", getAdminCounters);

module.exports = router;
