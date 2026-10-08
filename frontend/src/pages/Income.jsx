import React, { useState, useEffect } from 'react';
import api from '../services/api';
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

  return (
    <div className="income-page">
      <div className="page-header">
        <h1>Income</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Add Payment
        </button>
      </div>

      <div className="total-income-card">
        <h2>Total Income</h2>
        <p className="total-amount">Rs. {totalIncome.toLocaleString()}</p>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <p>No payments yet. Click "Add Payment" to get started.</p>
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
                  <td>{payment.project?.projectName || 'N/A'}</td>
                  <td>Rs. {payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </button>
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
            <h2>Add Payment</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project *</label>
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
              <div className="form-group">
                <label>Amount (Rs.) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method *</label>
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
