import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, TrendingUp, DollarSign, FolderKanban } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>FreelaTrack</h1>
          <p className="tagline">Manage your work. Track your income.</p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <div className="feature-icon">
              <TrendingUp size={24} />
            </div>
            <div className="feature-text">
              <h3>Track Projects</h3>
              <p>Manage all your freelance projects in one place</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <DollarSign size={24} />
            </div>
            <div className="feature-text">
              <h3>Monitor Income</h3>
              <p>Keep track of your earnings and payments</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FolderKanban size={24} />
            </div>
            <div className="feature-text">
              <h3>Organize Clients</h3>
              <p>Manage your client relationships effortlessly</p>
            </div>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome back 👋</h2>
            <p>Sign in to your FreelaTrack account</p>
          </div>

          {error && (
            <div className="error-alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
