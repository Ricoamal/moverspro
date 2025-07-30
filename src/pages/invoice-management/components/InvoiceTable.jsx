import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvoiceTable = ({ invoices, onInvoiceSelect, selectedInvoices, onBulkAction, onInvoiceAction }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });

  const toggleRowExpansion = (invoiceId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: 'CheckCircle' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'Clock' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: 'AlertCircle' },
      partial: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'MinusCircle' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'XCircle' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onInvoiceSelect(invoices.map(inv => inv.id));
    } else {
      onInvoiceSelect([]);
    }
  };

  const isAllSelected = invoices.length > 0 && selectedInvoices.length === invoices.length;
  const isPartiallySelected = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isPartiallySelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedInvoices.length > 0 ? `${selectedInvoices.length} selected` : 'Select all'}
            </span>
          </div>
          
          {selectedInvoices.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('sendReminder')}
                iconName="Mail"
                iconPosition="left"
              >
                Send Reminders
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('invoiceNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>Invoice #</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('serviceDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Service Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onInvoiceSelect([...selectedInvoices, invoice.id]);
                        } else {
                          onInvoiceSelect(selectedInvoices.filter(id => id !== invoice.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleRowExpansion(invoice.id)}
                        className="mr-2 p-1 hover:bg-gray-100 rounded"
                      >
                        <Icon 
                          name={expandedRows.has(invoice.id) ? "ChevronDown" : "ChevronRight"} 
                          size={16} 
                        />
                      </button>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Icon name="User" size={20} className="text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.customerEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.serviceDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.outstandingBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInvoiceAction('view', invoice.id)}
                        iconName="Eye"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInvoiceAction('edit', invoice.id)}
                        iconName="Edit"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInvoiceAction('download', invoice.id)}
                        iconName="Download"
                      />
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.has(invoice.id) && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Line Items */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Service Details</h4>
                          <div className="space-y-2">
                            {invoice.lineItems.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.description}</span>
                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Payment History */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Payment History</h4>
                          <div className="space-y-2">
                            {invoice.paymentHistory.map((payment, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <div>
                                  <div className="text-gray-600">{payment.method}</div>
                                  <div className="text-xs text-gray-500">{formatDate(payment.date)}</div>
                                </div>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Communication Log */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Communication</h4>
                          <div className="space-y-2">
                            {invoice.communicationLog.slice(0, 3).map((log, index) => (
                              <div key={index} className="text-sm">
                                <div className="flex items-center space-x-2">
                                  <Icon name={log.type === 'email' ? 'Mail' : 'MessageCircle'} size={12} />
                                  <span className="text-gray-600">{log.subject}</span>
                                </div>
                                <div className="text-xs text-gray-500 ml-5">
                                  {formatDate(log.date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedInvoices.includes(invoice.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onInvoiceSelect([...selectedInvoices, invoice.id]);
                    } else {
                      onInvoiceSelect(selectedInvoices.filter(id => id !== invoice.id));
                    }
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {invoice.customerName}
                  </div>
                </div>
              </div>
              {getStatusBadge(invoice.paymentStatus)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500">Service Date</div>
                <div className="text-sm font-medium">{formatDate(invoice.serviceDate)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Amount</div>
                <div className="text-sm font-medium">{formatCurrency(invoice.totalAmount)}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Balance: <span className="font-medium">{formatCurrency(invoice.outstandingBalance)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onInvoiceAction('view', invoice.id)}
                  iconName="Eye"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onInvoiceAction('edit', invoice.id)}
                  iconName="Edit"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTable;