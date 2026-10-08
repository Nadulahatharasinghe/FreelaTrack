import React, { useState, useEffect } from 'react';
import api from '../services/api';
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

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Add Project
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
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

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
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
                    <td>{project.projectName}</td>
                    <td>{project.client?.name || 'N/A'}</td>
                    <td>
                      <span className={`status status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>Rs. {project.fee.toLocaleString()}</td>
                    <td>Rs. {project.paidAmount.toLocaleString()}</td>
                    <td>Rs. {pending.toLocaleString()}</td>
                    <td>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleOpenModal(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(project._id)}
                      >
                        Delete
                      </button>
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
            <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client *</label>
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
              <div className="form-group">
                <label>Status</label>
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
              <div className="form-group">
                <label>Fee (Rs.) *</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Paid Amount (Rs.)</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Update' : 'Add'}
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
