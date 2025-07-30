import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin-dashboard',
      icon: 'LayoutDashboard',
      badge: null
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: 'Users',
      badge: null
    },
    {
      name: 'Staff',
      path: '/staff',
      icon: 'UserCheck',
      badge: null
    },
    {
      name: 'Payroll',
      path: '/payroll',
      icon: 'Calculator',
      badge: null
    },
    {
      name: 'CRM',
      path: '/crm',
      icon: 'Target',
      badge: null
    },
    {
      name: 'Website Builder',
      path: '/website-builder',
      icon: 'Layout',
      badge: null
    },
    {
      name: 'Quotes',
      path: '/quote-management',
      icon: 'FileText',
      badge: 12
    },
    {
      name: 'Invoices',
      path: '/invoice-management',
      icon: 'Receipt',
      badge: 5
    }
  ];

  const secondaryItems = [
    { name: 'Settings', path: '/settings', icon: 'Settings' },
    { name: 'Help', path: '/help', icon: 'HelpCircle' },
    { name: 'Logout', path: '/login', icon: 'LogOut' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 shadow-card transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Truck" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">MoveEase Pro</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-smooth"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-smooth group ${
                  isActivePath(item.path)
                    ? 'bg-primary text-white' :'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                        isActivePath(item.path)
                          ? 'bg-white text-primary' :'bg-accent text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Secondary Navigation */}
          <div className="px-3 py-4 border-t border-gray-200 space-y-2">
            {secondaryItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  item.name === 'Logout' ?'text-red-600 hover:bg-red-50' :'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={18} 
                  className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-elevated">
        <div className="grid grid-cols-3 h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-smooth relative ${
                isActivePath(item.path)
                  ? 'text-primary bg-blue-50' :'text-gray-600 hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon name={item.icon} size={20} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-accent rounded-full min-w-[18px] h-[18px]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;