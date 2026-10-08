import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-icon">
          <span>404</span>
        </div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary">
          <Home size={20} />
          Go to Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
