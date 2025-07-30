import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CustomerHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/landing-page', icon: 'Home' },
    { name: 'Get Quote', path: '/cost-calculator', icon: 'Calculator' },
    { name: 'Sign In', path: '/login', icon: 'LogIn' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/landing-page" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Truck" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MoveEase Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? 'text-primary bg-blue-50' :'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = '/cost-calculator'}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Get Free Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition-smooth"
              aria-expanded="false"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-elevated">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? 'text-primary bg-blue-50 border-l-4 border-primary' :'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="px-3 pt-4">
              <Button 
                variant="default" 
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/cost-calculator';
                }}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;