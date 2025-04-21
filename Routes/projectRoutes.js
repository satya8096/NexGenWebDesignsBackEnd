const express = require("express");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../Controllers/projectController");
const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").put(updateProject).delete(deleteProject);

module.exports = router;
