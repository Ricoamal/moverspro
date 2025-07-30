import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onCreateQuote, onScheduleJob, onViewReports, onManageCustomers }) => {
  const actions = [
    {
      title: 'Create Quote',
      description: 'Generate new quote for customer',
      icon: 'Plus',
      color: 'default',
      onClick: onCreateQuote
    },
    {
      title: 'Schedule Job',
      description: 'Schedule moving service',
      icon: 'Calendar',
      color: 'secondary',
      onClick: onScheduleJob
    },
    {
      title: 'View Reports',
      description: 'Business analytics & insights',
      icon: 'BarChart3',
      color: 'outline',
      onClick: onViewReports
    },
    {
      title: 'Manage Customers',
      description: 'Customer database & history',
      icon: 'Users',
      color: 'ghost',
      onClick: onManageCustomers
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.color}
            size="lg"
            iconName={action.icon}
            iconPosition="left"
            onClick={action.onClick}
            className="h-auto p-4 flex-col items-start text-left"
          >
            <div className="w-full">
              <div className="font-semibold text-sm mb-1">{action.title}</div>
              <div className="text-xs opacity-75 font-normal">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;