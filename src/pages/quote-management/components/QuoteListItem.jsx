import React from 'react';
import Icon from '../../../components/AppIcon';

const QuoteListItem = ({ quote, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'revision':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high':
        return <Icon name="AlertTriangle" size={16} className="text-red-500" />;
      case 'medium':
        return <Icon name="Clock" size={16} className="text-yellow-500" />;
      case 'low':
        return <Icon name="CheckCircle" size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={() => onClick(quote)}
      className={`p-4 border rounded-lg cursor-pointer transition-smooth hover:shadow-card ${
        isSelected 
          ? 'border-primary bg-blue-50 shadow-card' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {quote.customerName}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Quote #{quote.id}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {getUrgencyIcon(quote.urgency)}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-600">
          <Icon name="Calendar" size={14} className="mr-2" />
          <span>Service: {formatDate(quote.serviceDate)}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-600">
          <Icon name="MapPin" size={14} className="mr-2" />
          <span className="truncate">{quote.fromLocation} → {quote.toLocation}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-600">
            <Icon name="DollarSign" size={14} className="mr-1" />
            <span className="font-medium text-gray-900">
              {formatCurrency(quote.estimatedValue)}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(quote.createdAt).toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>

      {quote.requiresApproval && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-amber-600">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            <span>Requires Manager Approval</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteListItem;