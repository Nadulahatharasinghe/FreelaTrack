const Payment = require('../models/Payment');
const Project = require('../models/Project');

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.userId })
      .populate('project', 'projectName')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createPayment = async (req, res) => {
  try {
    const { project, amount, paymentDate, paymentMethod } = req.body;

    if (!project || !amount || !paymentDate || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    const projectData = await Project.findOne({ _id: project, user: req.user.userId });
    if (!projectData) {
      return res.status(400).json({ message: 'Invalid project' });
    }

    const remainingBalance = projectData.fee - projectData.paidAmount;
    if (amount > remainingBalance) {
      return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
    }

    const payment = new Payment({
      user: req.user.userId,
      project,
      amount,
      paymentDate,
      paymentMethod
    });

    await payment.save();

    projectData.paidAmount += amount;
    await projectData.save();

    await payment.populate('project', 'projectName');
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const project = await Project.findById(payment.project);
    if (project) {
      project.paidAmount -= payment.amount;
      await project.save();
    }

    await Payment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPayments, createPayment, deletePayment };
