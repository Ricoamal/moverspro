import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentModal = ({ isOpen, onClose, invoice, onPaymentSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: '',
    reference: '',
    notes: ''
  });

  const paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPaymentSubmit({
      invoiceId: invoice.id,
      ...paymentData,
      amount: parseFloat(paymentData.amount),
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-modal transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Record Payment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-smooth"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{invoice.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">{formatCurrency(invoice.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="font-medium text-red-600">{formatCurrency(invoice.outstandingBalance)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Amount */}
            <Input
              label="Payment Amount (KES)"
              type="number"
              step="0.01"
              min="0"
              max={invoice.outstandingBalance}
              value={paymentData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />

            {/* Payment Method */}
            <Select
              label="Payment Method"
              options={paymentMethods}
              value={paymentData.method}
              onChange={(value) => handleInputChange('method', value)}
              placeholder="Select payment method"
              required
            />

            {/* Reference Number */}
            <Input
              label="Reference Number"
              type="text"
              value={paymentData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Transaction/Reference ID"
              description="M-Pesa code, bank reference, etc."
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={paymentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional payment notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Quick amounts:</span>
              <button
                type="button"
                onClick={() => handleInputChange('amount', (invoice.outstandingBalance / 2).toString())}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-smooth"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('amount', invoice.outstandingBalance.toString())}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-smooth"
              >
                Full Amount
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="CreditCard"
                iconPosition="left"
                disabled={!paymentData.amount || !paymentData.method}
              >
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;