import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import TopBar from './TopBar';

const CustomerHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'About Us', path: '/about', icon: 'Users' },
    { name: 'Our Services', path: '/services', icon: 'Truck' },
    { name: 'Our Work', path: '/work', icon: 'Camera' },
    { name: 'Contact', path: '/contact', icon: 'Phone' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <TopBar />
      <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
          <div className="hidden lg:block">
            <Button
              variant="default"
              size="sm"
              onClick={() => window.location.href = '/cost-calculator'}
              iconName="Calculator"
              iconPosition="left"
            >
              Get Free Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
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
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
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

            {/* Mobile CTA Button */}
            <div className="px-3 pt-4">
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/cost-calculator';
                }}
                iconName="Calculator"
                iconPosition="left"
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </header>
  );
};

export default CustomerHeader;