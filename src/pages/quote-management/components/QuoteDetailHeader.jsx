import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuoteDetailHeader = ({ quote, onApprove, onReject, onRevision, onWhatsApp, onEmail }) => {
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
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Quote Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Quote #{quote.id}
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(quote.status)}`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Customer:</span>
              <p className="font-medium text-gray-900">{quote.customerName}</p>
            </div>
            <div>
              <span className="text-gray-500">Service Date:</span>
              <p className="font-medium text-gray-900">{formatDate(quote.serviceDate)}</p>
            </div>
            <div>
              <span className="text-gray-500">Estimated Value:</span>
              <p className="font-medium text-gray-900">{formatCurrency(quote.estimatedValue)}</p>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <p className="font-medium text-gray-900">{formatDate(quote.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Communication Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWhatsApp(quote)}
              iconName="MessageCircle"
              iconPosition="left"
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEmail(quote)}
              iconName="Mail"
              iconPosition="left"
            >
              Email
            </Button>
          </div>

          {/* Status Action Buttons */}
          {quote.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRevision(quote)}
                iconName="Edit"
                iconPosition="left"
              >
                Request Revision
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject(quote)}
                iconName="X"
                iconPosition="left"
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(quote)}
                iconName="Check"
                iconPosition="left"
              >
                Approve
              </Button>
            </div>
          )}

          {quote.status === 'revision' && (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject(quote)}
                iconName="X"
                iconPosition="left"
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(quote)}
                iconName="Check"
                iconPosition="left"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      {quote.requiresApproval && quote.status === 'pending' && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="AlertTriangle" size={16} className="text-amber-600 mr-2" />
            <span className="text-sm text-amber-800 font-medium">
              This quote requires manager approval due to high value or special conditions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteDetailHeader;