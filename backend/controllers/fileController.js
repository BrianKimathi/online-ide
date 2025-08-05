const File = require('../models/File');
const Project = require('../models/Project');

exports.createFile = async (req, res, next) => {
  try {
    const { name, content, projectId } = req.body;
    const file = await File.create({ name, content, project: projectId });
    await Project.findByIdAndUpdate(projectId, { $push: { files: file._id } });
    res.status(201).json(file);
  } catch (err) {
    next(err);
  }
};

exports.getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    res.json(file);
  } catch (err) {
    next(err);
  }
};

exports.updateFile = async (req, res, next) => {
  try {
    const file = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!file) return res.status(404).json({ message: 'Not found' });
    res.json(file);
  } catch (err) {
    next(err);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: 'Not found' });
    await Project.findByIdAndUpdate(file.project, { $pull: { files: file._id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}; 