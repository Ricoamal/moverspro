import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusWidget = ({ payments }) => {
  const [realtimePayments, setRealtimePayments] = useState(payments);

  // Simulate real-time M-Pesa payment updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random payment status updates
      setRealtimePayments(prev => 
        prev.map(payment => {
          if (payment.status === 'processing' && Math.random() > 0.7) {
            return {
              ...payment,
              status: Math.random() > 0.2 ? 'completed' : 'failed',
              updatedAt: new Date().toISOString()
            };
          }
          return payment;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-amber-100 text-amber-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'failed': return 'XCircle';
      case 'pending': return 'AlertCircle';
      default: return 'AlertCircle';
    }
  };

  const totalAmount = realtimePayments.reduce((sum, payment) => 
    sum + (payment.status === 'completed' ? parseFloat(payment.amount.replace(/[^\d.-]/g, '')) : 0), 0
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-card">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">M-Pesa Payments</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-green-600">KES {totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total received today</p>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {realtimePayments.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CreditCard" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No payments today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {realtimePayments.map((payment) => (
              <div key={payment.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="Smartphone" size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.customer}</p>
                      <p className="text-xs text-gray-500">{payment.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{payment.amount}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name={getStatusIcon(payment.status)} size={12} />
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Transaction ID: {payment.transactionId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusWidget;