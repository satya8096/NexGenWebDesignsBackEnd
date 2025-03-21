const express = require("express");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../Controllers/projectController");
const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").patch(updateProject).delete(deleteProject);

module.exports = router;
