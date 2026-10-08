const Project = require('../models/Project');
const Client = require('../models/Client');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.userId })
      .populate('client', 'name company')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { projectName, client, status, fee, paidAmount, dueDate } = req.body;

    if (!projectName || !client || !fee) {
      return res.status(400).json({ message: 'Project name, client, and fee are required' });
    }

    if (fee < 0) {
      return res.status(400).json({ message: 'Fee must be positive' });
    }

    if (paidAmount && paidAmount < 0) {
      return res.status(400).json({ message: 'Paid amount must be positive' });
    }

    if (paidAmount > fee) {
      return res.status(400).json({ message: 'Paid amount cannot exceed project fee' });
    }

    const clientExists = await Client.findOne({ _id: client, user: req.user.userId });
    if (!clientExists) {
      return res.status(400).json({ message: 'Invalid client' });
    }

    const project = new Project({
      user: req.user.userId,
      projectName,
      client,
      status: status || 'Active',
      fee,
      paidAmount: paidAmount || 0,
      dueDate
    });

    await project.save();
    await project.populate('client', 'name company');
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectName, client, status, fee, paidAmount, dueDate } = req.body;

    if (fee < 0) {
      return res.status(400).json({ message: 'Fee must be positive' });
    }

    if (paidAmount && paidAmount < 0) {
      return res.status(400).json({ message: 'Paid amount must be positive' });
    }

    if (paidAmount > fee) {
      return res.status(400).json({ message: 'Paid amount cannot exceed project fee' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { projectName, client, status, fee, paidAmount, dueDate },
      { new: true }
    ).populate('client', 'name company');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
