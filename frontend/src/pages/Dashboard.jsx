import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
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
import { FolderKanban, DollarSign, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';
import './Dashboard.css';

const COLORS = ['#6366F1', '#F59E0B', '#10B981'];

const Dashboard = () => {
  const { user } = useAuth();
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <p>Error loading dashboard</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Active', value: data.projectStatusSummary.Active },
    { name: 'Pending', value: data.projectStatusSummary.Pending },
    { name: 'Completed', value: data.projectStatusSummary.Completed }
  ].filter(item => item.value > 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{getGreeting()}, {user?.name || 'there'} 👋</h1>
          <p className="dashboard-subtitle">Manage your freelance business from one place.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-active">
          <div className="stat-icon">
            <FolderKanban size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <p className="stat-value">{data.activeProjects}</p>
            <p className="stat-subtitle">Currently in progress</p>
          </div>
        </div>

        <div className="stat-card stat-income">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Income</h3>
            <p className="stat-value">Rs. {data.totalIncome.toLocaleString()}</p>
            <p className="stat-subtitle">Total earnings</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending Payments</h3>
            <p className="stat-value">Rs. {data.pendingPayments.toLocaleString()}</p>
            <p className="stat-subtitle">Awaiting payment</p>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed Projects</h3>
            <p className="stat-value">{data.completedProjects}</p>
            <p className="stat-subtitle">Successfully delivered</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Income</h2>
            <TrendingUp size={20} className="chart-icon" />
          </div>
          <div className="chart-content">
            {data.monthlyIncome.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rs. ${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Income']}
                  />
                  <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No income data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2>Project Status</h2>
            <FolderKanban size={20} className="chart-icon" />
          </div>
          <div className="chart-content">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {value}: {entry.payload.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p>No project data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="recent-projects-card">
        <div className="section-header">
          <h2>Recent Projects</h2>
          <Users size={20} className="section-icon" />
        </div>
        {data.recentProjects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={48} className="empty-icon" />
            <h3>No projects yet</h3>
            <p>Create your first project to start tracking your work</p>
          </div>
        ) : (
          <div className="projects-table-wrapper">
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
                    <td>
                      <div className="project-name">{project.projectName}</div>
                    </td>
                    <td>{project.client?.name || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="amount">Rs. {project.fee.toLocaleString()}</td>
                    <td className="amount">Rs. {project.paidAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
