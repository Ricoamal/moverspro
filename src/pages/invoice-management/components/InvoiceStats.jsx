import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toLocaleString(),
      icon: 'FileText',
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: 'DollarSign',
      color: 'green',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Outstanding Amount',
      value: formatCurrency(stats.outstandingAmount),
      icon: 'AlertCircle',
      color: 'red',
      change: '-5.1%',
      changeType: 'negative'
    },
    {
      title: 'Paid This Month',
      value: formatCurrency(stats.paidThisMonth),
      icon: 'CheckCircle',
      color: 'emerald',
      change: '+15.3%',
      changeType: 'positive'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'bg-red-100 text-red-600',
        text: 'text-red-600'
      },
      emerald: {
        bg: 'bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-600',
        text: 'text-emerald-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        
        return (
          <div key={index} className={`${colors.bg} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center">
                  <Icon 
                    name={stat.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className={`mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}
                  />
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${colors.icon} p-3 rounded-lg`}>
                <Icon name={stat.icon} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceStats;