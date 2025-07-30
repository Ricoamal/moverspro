import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/ui/AdminSidebar';

import Button from '../../components/ui/Button';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import InvoiceStats from './components/InvoiceStats';
import PaymentModal from './components/PaymentModal';
import BulkActionsBar from './components/BulkActionsBar';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock invoice data
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      customerName: "John Kamau",
      customerEmail: "john.kamau@email.com",
      serviceDate: "2024-01-15",
      invoiceDate: "2024-01-16",
      totalAmount: 45000,
      paidAmount: 45000,
      outstandingBalance: 0,
      paymentStatus: "paid",
      lineItems: [
        { description: "3-bedroom house moving", amount: 35000 },
        { description: "Packing materials", amount: 5000 },
        { description: "Insurance coverage", amount: 5000 }
      ],
      paymentHistory: [
        { method: "M-Pesa", amount: 45000, date: "2024-01-20", reference: "QA12B3C4D5" }
      ],
      communicationLog: [
        { type: "email", subject: "Invoice sent", date: "2024-01-16" },
        { type: "whatsapp", subject: "Payment confirmation", date: "2024-01-20" }
      ]
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      customerName: "Mary Wanjiku",
      customerEmail: "mary.wanjiku@email.com",
      serviceDate: "2024-01-18",
      invoiceDate: "2024-01-19",
      totalAmount: 28000,
      paidAmount: 15000,
      outstandingBalance: 13000,
      paymentStatus: "partial",
      lineItems: [
        { description: "2-bedroom apartment moving", amount: 25000 },
        { description: "Storage (1 week)", amount: 3000 }
      ],
      paymentHistory: [
        { method: "Bank Transfer", amount: 15000, date: "2024-01-22", reference: "BT789456123" }
      ],
      communicationLog: [
        { type: "email", subject: "Invoice sent", date: "2024-01-19" },
        { type: "email", subject: "Payment reminder", date: "2024-01-25" }
      ]
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      customerName: "Peter Ochieng",
      customerEmail: "peter.ochieng@email.com",
      serviceDate: "2024-01-20",
      invoiceDate: "2024-01-21",
      totalAmount: 52000,
      paidAmount: 0,
      outstandingBalance: 52000,
      paymentStatus: "overdue",
      lineItems: [
        { description: "4-bedroom house moving", amount: 42000 },
        { description: "Packing service", amount: 8000 },
        { description: "Cleaning service", amount: 2000 }
      ],
      paymentHistory: [],
      communicationLog: [
        { type: "email", subject: "Invoice sent", date: "2024-01-21" },
        { type: "email", subject: "Payment reminder", date: "2024-01-28" },
        { type: "whatsapp", subject: "Overdue notice", date: "2024-02-05" }
      ]
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      customerName: "Grace Njeri",
      customerEmail: "grace.njeri@email.com",
      serviceDate: "2024-01-22",
      invoiceDate: "2024-01-23",
      totalAmount: 18000,
      paidAmount: 0,
      outstandingBalance: 18000,
      paymentStatus: "pending",
      lineItems: [
        { description: "1-bedroom apartment moving", amount: 15000 },
        { description: "Insurance coverage", amount: 3000 }
      ],
      paymentHistory: [],
      communicationLog: [
        { type: "email", subject: "Invoice sent", date: "2024-01-23" }
      ]
    },
    {
      id: 5,
      invoiceNumber: "INV-2024-005",
      customerName: "David Mwangi",
      customerEmail: "david.mwangi@email.com",
      serviceDate: "2024-01-25",
      invoiceDate: "2024-01-26",
      totalAmount: 0,
      paidAmount: 0,
      outstandingBalance: 0,
      paymentStatus: "cancelled",
      lineItems: [
        { description: "Office relocation (cancelled)", amount: 75000 }
      ],
      paymentHistory: [],
      communicationLog: [
        { type: "email", subject: "Invoice sent", date: "2024-01-26" },
        { type: "email", subject: "Service cancelled", date: "2024-01-27" }
      ]
    }
  ];

  // Mock statistics
  const mockStats = {
    totalInvoices: 156,
    totalRevenue: 2450000,
    outstandingAmount: 485000,
    paidThisMonth: 1250000
  };

  useEffect(() => {
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...invoices];

    if (filters.search) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.paymentStatus === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(invoice => new Date(invoice.serviceDate) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(invoice => new Date(invoice.serviceDate) <= new Date(filters.dateTo));
    }

    if (filters.amountMin) {
      filtered = filtered.filter(invoice => invoice.totalAmount >= parseFloat(filters.amountMin));
    }

    if (filters.amountMax) {
      filtered = filtered.filter(invoice => invoice.totalAmount <= parseFloat(filters.amountMax));
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredInvoices(invoices);
    setCurrentPage(1);
  };

  const handleInvoiceAction = (action, invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    switch (action) {
      case 'view': console.log('Viewing invoice:', invoiceId);
        break;
      case 'edit': console.log('Editing invoice:', invoiceId);
        break;
      case 'download':
        console.log('Downloading invoice:', invoiceId);
        break;
      case 'recordPayment':
        setSelectedInvoiceForPayment(invoice);
        setIsPaymentModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Executing bulk action: ${action} on invoices:`, selectedInvoices);
    
    switch (action) {
      case 'sendReminder':
        alert(`Sending payment reminders to ${selectedInvoices.length} customers`);
        break;
      case 'export':
        alert(`Exporting ${selectedInvoices.length} invoices to PDF`);
        break;
      case 'markPaid':
        alert(`Marking ${selectedInvoices.length} invoices as paid`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices?`)) {
          alert('Invoices deleted successfully');
          setSelectedInvoices([]);
        }
        break;
      default:
        break;
    }
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Recording payment:', paymentData);
    alert('Payment recorded successfully!');
    
    // Update invoice status (mock implementation)
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === paymentData.invoiceId) {
        const newPaidAmount = invoice.paidAmount + paymentData.amount;
        const newOutstandingBalance = invoice.totalAmount - newPaidAmount;
        
        return {
          ...invoice,
          paidAmount: newPaidAmount,
          outstandingBalance: newOutstandingBalance,
          paymentStatus: newOutstandingBalance === 0 ? 'paid' : 'partial',
          paymentHistory: [
            ...invoice.paymentHistory,
            {
              method: paymentData.method,
              amount: paymentData.amount,
              date: paymentData.timestamp,
              reference: paymentData.reference
            }
          ]
        };
      }
      return invoice;
    }));
  };

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="lg:ml-64 pb-16 lg:pb-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage billing, payments, and financial records
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => console.log('Create new invoice')}
              >
                New Invoice
              </Button>
              
              <Button
                variant="default"
                iconName="CreditCard"
                iconPosition="left"
                onClick={() => {
                  if (selectedInvoices.length === 1) {
                    const invoice = invoices.find(inv => inv.id === selectedInvoices[0]);
                    handleInvoiceAction('recordPayment', invoice.id);
                  } else {
                    alert('Please select a single invoice to record payment');
                  }
                }}
                disabled={selectedInvoices.length !== 1}
              >
                Record Payment
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Statistics */}
          <InvoiceStats stats={mockStats} />

          {/* Filters */}
          <InvoiceFilters
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Invoice Table */}
          <InvoiceTable
            invoices={paginatedInvoices}
            onInvoiceSelect={setSelectedInvoices}
            selectedInvoices={selectedInvoices}
            onBulkAction={handleBulkAction}
            onInvoiceAction={handleInvoiceAction}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-md transition-smooth ${
                          currentPage === pageNum
                            ? 'bg-primary text-white' :'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedInvoices.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedInvoices([])}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoiceForPayment(null);
        }}
        invoice={selectedInvoiceForPayment}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default InvoiceManagement;