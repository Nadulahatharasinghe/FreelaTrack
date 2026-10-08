import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, Plus, Calendar, CreditCard, Wallet, Trash2, TrendingUp } from 'lucide-react';
import './Income.css';

const Income = () => {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'Cash'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
    fetchProjects();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const totalIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleOpenModal = () => {
    setFormData({
      project: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash'
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      project: '',
      amount: '',
      paymentDate: '',
      paymentMethod: 'Cash'
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.project || !formData.amount || !formData.paymentDate || !formData.paymentMethod) {
      setError('All fields are required');
      return;
    }

    const amount = parseFloat(formData.amount);

    if (amount <= 0) {
      setError('Amount must be positive');
      return;
    }

    try {
      await api.post('/payments', {
        ...formData,
        amount
      });
      fetchPayments();
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding payment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      await api.delete(`/payments/${id}`);
      fetchPayments();
      fetchProjects();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Cash':
        return <Wallet size={16} />;
      case 'Bank Transfer':
        return <CreditCard size={16} />;
      case 'Card':
        return <CreditCard size={16} />;
      default:
        return <DollarSign size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="income-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading income data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="income-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <DollarSign size={32} />
          </div>
          <div>
            <h1>Income & Payments</h1>
            <p className="page-subtitle">Track your freelance earnings and payment history.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={20} />
          Add Payment
        </button>
      </div>

      <div className="income-card">
        <div className="income-card-content">
          <div className="income-icon">
            <TrendingUp size={32} />
          </div>
          <div className="income-details">
            <h2>Total Income</h2>
            <p className="total-amount">Rs. {totalIncome.toLocaleString()}</p>
            <p className="income-subtitle">Total earnings from all projects</p>
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <DollarSign size={64} className="empty-icon" />
          <h3>No payments yet</h3>
          <p>Add your first payment to start tracking your income.</p>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            Add Payment
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    <div className="project-name-cell">
                      <div className="project-icon">
                        <DollarSign size={18} />
                      </div>
                      <span className="project-name">{payment.project?.projectName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="amount">
                    <DollarSign size={14} className="amount-icon" />
                    {payment.amount.toLocaleString()}
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} className="date-icon" />
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="payment-method-cell">
                      <span className="payment-method-icon">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                      <span>{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(payment._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Payment</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            {error && (
              <div className="error-alert">
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Project *</label>
                <div className="input-wrapper">
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Amount (Rs.) *</label>
                <div className="input-wrapper">
                  <DollarSign size={20} className="input-icon" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Payment Date *</label>
                <div className="input-wrapper">
                  <Calendar size={20} className="input-icon" />
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method *</label>
                <div className="input-wrapper">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
