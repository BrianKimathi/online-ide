const Project = require('../models/Project');
const File = require('../models/File');

exports.createProject = async (req, res, next) => {
  try {
    const { name, language } = req.body;
    const project = await Project.create({ name, language, owner: req.user.id, files: [] });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).populate('files');
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id }).populate('files');
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ message: 'Not found' });
    await File.deleteMany({ project: project._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 