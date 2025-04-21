const { request } = require("express");
const Project = require("./../Models/projectModel");

// Get All Projects
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.status(200).json({
      message: "Success",
      count: projects.length,
      data: projects.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

// Create New Project
exports.createProject = async (req, res, next) => {
  try {
    const project = new Project({ ...req.body });
    const savedProject = await project.save();
    res.status(201).json({
      message: "Success",
      data: savedProject,
    });
  } catch (error) {
    next(error);
  }
};

// Update Existing Project
exports.updateProject = async (req, res, next) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({
      message: "Success",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Project
exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};
