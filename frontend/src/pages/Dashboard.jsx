import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#4a90e2', '#f39c12', '#27ae60'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!data) {
    return <div className="error">Error loading dashboard</div>;
  }

  const pieData = [
    { name: 'Active', value: data.projectStatusSummary.Active },
    { name: 'Pending', value: data.projectStatusSummary.Pending },
    { name: 'Completed', value: data.projectStatusSummary.Completed }
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <p className="stat-value">{data.activeProjects}</p>
        </div>
        <div className="stat-card">
          <h3>Total Income</h3>
          <p className="stat-value">Rs. {data.totalIncome.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="stat-value">Rs. {data.pendingPayments.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Projects</h3>
          <p className="stat-value">{data.completedProjects}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h2>Monthly Income</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#4a90e2" name="Income (Rs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Project Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-projects">
        <h2>Recent Projects</h2>
        {data.recentProjects.length === 0 ? (
          <p>No projects yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.projectName}</td>
                  <td>{project.client?.name || 'N/A'}</td>
                  <td>
                    <span className={`status status-${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>Rs. {project.fee.toLocaleString()}</td>
                  <td>Rs. {project.paidAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
