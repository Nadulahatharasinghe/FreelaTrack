const Project = require('../models/Project');
const Payment = require('../models/Payment');

const getDashboard = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.userId });
    const payments = await Payment.find({ user: req.user.userId });

    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    const totalIncome = projects.reduce((sum, p) => sum + p.paidAmount, 0);

    const pendingPayments = projects.reduce((sum, p) => {
      const pending = p.fee - p.paidAmount;
      return sum + (pending > 0 ? pending : 0);
    }, 0);

    const projectStatusSummary = {
      Active: projects.filter(p => p.status === 'Active').length,
      Pending: projects.filter(p => p.status === 'Pending').length,
      Completed: projects.filter(p => p.status === 'Completed').length
    };

    const monthlyIncome = {};
    payments.forEach(payment => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + payment.amount;
    });

    const sortedMonthlyIncome = Object.entries(monthlyIncome)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    const recentProjects = await Project.find({ user: req.user.userId })
      .populate('client', 'name company')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      activeProjects,
      totalIncome,
      pendingPayments,
      completedProjects,
      projectStatusSummary,
      monthlyIncome: sortedMonthlyIncome,
      recentProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };
