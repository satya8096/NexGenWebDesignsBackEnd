const Project = require("./../Models/projectModel");

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.status(200).json({
      status: "Success",
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = new Project({ ...req.body.data });
    const savedProject = await project.save();
    res.status(201).json({
      status: "Success",
      project: savedProject,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body.data,
      { new: true }
    );
    res.json({ status: "Success", project: updatedProject });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ status: "Success", message: "Project Deleted !" });
  } catch (error) {
    next(error);
  }
};
