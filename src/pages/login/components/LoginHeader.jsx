import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/images/logos/longonot-logo.png"
              alt="Longonot Movers"
              className="h-10 w-auto"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 bg-primary rounded-lg items-center justify-center hidden">
              <Icon name="Truck" size={24} color="white" />
            </div>
          </Link>

          {/* Back to Home Link */}
          <Link
            to="/landing-page"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-smooth"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;