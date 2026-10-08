import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FolderKanban, Plus, Search, Edit, Trash2, Calendar, DollarSign, Filter } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    status: 'Active',
    fee: '',
    paidAmount: '',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesClient = clientFilter === 'All' || project.client._id === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        projectName: project.projectName,
        client: project.client._id,
        status: project.status,
        fee: project.fee,
        paidAmount: project.paidAmount,
        dueDate: project.dueDate ? project.dueDate.split('T')[0] : ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        projectName: '',
        client: '',
        status: 'Active',
        fee: '',
        paidAmount: '',
        dueDate: ''
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      projectName: '',
      client: '',
      status: 'Active',
      fee: '',
      paidAmount: '',
      dueDate: ''
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

    if (!formData.projectName || !formData.client || !formData.fee) {
      setError('Project name, client, and fee are required');
      return;
    }

    const fee = parseFloat(formData.fee);
    const paidAmount = parseFloat(formData.paidAmount) || 0;

    if (fee < 0) {
      setError('Fee must be positive');
      return;
    }

    if (paidAmount < 0) {
      setError('Paid amount must be positive');
      return;
    }

    if (paidAmount > fee) {
      setError('Paid amount cannot exceed project fee');
      return;
    }

    try {
      const data = {
        ...formData,
        fee,
        paidAmount,
        dueDate: formData.dueDate || null
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data);
      } else {
        await api.post('/projects', data);
      }
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FolderKanban size={32} />
          </div>
          <div>
            <h1>Projects</h1>
            <p className="page-subtitle">Track your freelance work and project progress.</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Project
        </button>
      </div>

      <div className="filters-section">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-wrapper">
          <Filter size={20} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="filter-wrapper">
          <Filter size={20} className="filter-icon" />
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Clients</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={64} className="empty-icon" />
          <h3>No projects found</h3>
          <p>Create your first project to start tracking your work.</p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Project
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const pending = project.fee - project.paidAmount;
                return (
                  <tr key={project._id}>
                    <td>
                      <div className="project-name-cell">
                        <div className="project-icon">
                          <FolderKanban size={20} />
                        </div>
                        <span className="project-name">{project.projectName}</span>
                      </div>
                    </td>
                    <td>{project.client?.name || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="amount">
                      <DollarSign size={14} className="amount-icon" />
                      {project.fee.toLocaleString()}
                    </td>
                    <td className="amount">
                      <DollarSign size={14} className="amount-icon" />
                      {project.paidAmount.toLocaleString()}
                    </td>
                    <td className="amount amount-pending">
                      <DollarSign size={14} className="amount-icon" />
                      {pending.toLocaleString()}
                    </td>
                    <td>
                      {project.dueDate ? (
                        <div className="date-cell">
                          <Calendar size={14} className="date-icon" />
                          {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenModal(project)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(project._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
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
                <label>Project Name *</label>
                <div className="input-wrapper">
                  <FolderKanban size={20} className="input-icon" />
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Client *</label>
                <div className="input-wrapper">
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <div className="input-wrapper">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fee (Rs.) *</label>
                  <div className="input-wrapper">
                    <DollarSign size={20} className="input-icon" />
                    <input
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Paid Amount (Rs.)</label>
                  <div className="input-wrapper">
                    <DollarSign size={20} className="input-icon" />
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <div className="input-wrapper">
                  <Calendar size={20} className="input-icon" />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Update' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
