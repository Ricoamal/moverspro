import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';

// Import components
import QuoteListItem from './components/QuoteListItem';
import QuoteFilters from './components/QuoteFilters';
import QuoteDetailHeader from './components/QuoteDetailHeader';
import CustomerInformation from './components/CustomerInformation';
import ServiceRequirements from './components/ServiceRequirements';
import PricingBreakdown from './components/PricingBreakdown';
import AdminNotes from './components/AdminNotes';
import BulkActions from './components/BulkActions';

const QuoteManagement = () => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    urgency: 'all',
    sortBy: 'newest',
    dateRange: { start: '', end: '' }
  });

  // Mock data
  const mockQuotes = [
    {
      id: 'QT-2025-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+254712345678',
      alternativeContact: '+254798765432',
      fromLocation: 'Westlands, Nairobi',
      fromAddress: 'Westlands Shopping Mall, Waiyaki Way',
      toLocation: 'Karen, Nairobi',
      toAddress: 'Karen Country Club, Karen Road',
      distance: 15,
      accessDifficulty: 'medium',
      serviceDate: '2025-02-15',
      preferredTime: '09:00',
      serviceType: 'residential',
      propertyType: 'apartment',
      fromFloor: '3rd Floor',
      toFloor: 'Ground Floor',
      estimatedValue: 45000,
      estimatedDuration: 6,
      status: 'pending',
      urgency: 'high',
      requiresApproval: true,
      createdAt: '2025-01-20T10:30:00Z',
      rooms: [
        { type: 'bedroom', quantity: 2, size: 'medium' },
        { type: 'living_room', quantity: 1, size: 'large' },
        { type: 'kitchen', quantity: 1, size: 'medium' },
        { type: 'bathroom', quantity: 2, size: 'small' }
      ],
      additionalServices: [
        { name: 'Packing Service', description: 'Professional packing of fragile items' },
        { name: 'Insurance Coverage', description: 'Full coverage up to KES 500,000' }
      ],
      specialRequirements: [
        'Handle piano with extra care',
        'Disassemble and reassemble furniture'
      ],
      specialInstructions: `Please be careful with the antique furniture in the living room.\nThe piano needs special handling and should be moved first.\nCustomer will be available from 8 AM onwards.`,
      pricingBreakdown: [
        { id: 1, description: 'Base Moving Service', quantity: 1, unitPrice: 25000, category: 'base' },
        { id: 2, description: 'Distance Charge (15km)', quantity: 15, unitPrice: 800, category: 'distance' },
        { id: 3, description: 'Room Count (5 rooms)', quantity: 5, unitPrice: 2000, category: 'rooms' },
        { id: 4, description: 'Packing Service', quantity: 1, unitPrice: 8000, category: 'additional' },
        { id: 5, description: 'Insurance Coverage', quantity: 1, unitPrice: 2000, category: 'insurance' }
      ],
      adminNotes: [
        {
          id: 1,
          content: 'Customer mentioned they have a valuable piano that needs special care. Recommended our premium moving team.',
          author: 'John Admin',
          timestamp: '2025-01-20T11:00:00Z',
          type: 'admin'
        },
        {
          id: 2,
          content: 'Quote automatically flagged for approval due to high value and special requirements.',
          author: 'System',
          timestamp: '2025-01-20T10:31:00Z',
          type: 'system'
        }
      ],
      auditTrail: [
        { action: 'Quote created', user: 'System', timestamp: '2025-01-20T10:30:00Z' },
        { action: 'Flagged for approval', user: 'System', timestamp: '2025-01-20T10:31:00Z' },
        { action: 'Admin note added', user: 'John Admin', timestamp: '2025-01-20T11:00:00Z' }
      ]
    },
    {
      id: 'QT-2025-002',
      customerName: 'Michael Ochieng',
      customerEmail: 'michael.ochieng@gmail.com',
      customerPhone: '+254723456789',
      alternativeContact: null,
      fromLocation: 'Kileleshwa, Nairobi',
      fromAddress: 'Kileleshwa Shopping Center',
      toLocation: 'Runda, Nairobi',
      toAddress: 'Runda Estate, House No. 45',
      distance: 8,
      accessDifficulty: 'easy',
      serviceDate: '2025-02-10',
      preferredTime: '14:00',
      serviceType: 'residential',
      propertyType: 'house',
      fromFloor: 'Ground Floor',
      toFloor: 'Ground Floor',
      estimatedValue: 28000,
      estimatedDuration: 4,
      status: 'approved',
      urgency: 'medium',
      requiresApproval: false,
      createdAt: '2025-01-18T14:20:00Z',
      rooms: [
        { type: 'bedroom', quantity: 3, size: 'medium' },
        { type: 'living_room', quantity: 1, size: 'medium' },
        { type: 'kitchen', quantity: 1, size: 'small' }
      ],
      additionalServices: [
        { name: 'Storage Service', description: '1 month temporary storage' }
      ],
      specialRequirements: [],
      specialInstructions: 'Customer prefers afternoon timing. Access is easy with parking available.',
      pricingBreakdown: [
        { id: 1, description: 'Base Moving Service', quantity: 1, unitPrice: 20000, category: 'base' },
        { id: 2, description: 'Distance Charge (8km)', quantity: 8, unitPrice: 600, category: 'distance' },
        { id: 3, description: 'Room Count (5 rooms)', quantity: 5, unitPrice: 1200, category: 'rooms' },
        { id: 4, description: 'Storage Service (1 month)', quantity: 1, unitPrice: 2200, category: 'storage' }
      ],
      adminNotes: [
        {
          id: 1,
          content: 'Standard residential move. Customer is flexible with timing.',
          author: 'Jane Admin',
          timestamp: '2025-01-18T15:00:00Z',
          type: 'admin'
        }
      ],
      auditTrail: [
        { action: 'Quote created', user: 'System', timestamp: '2025-01-18T14:20:00Z' },
        { action: 'Quote approved', user: 'Jane Admin', timestamp: '2025-01-18T15:30:00Z' }
      ]
    },
    {
      id: 'QT-2025-003',
      customerName: 'Grace Wanjiku',
      customerEmail: 'grace.wanjiku@yahoo.com',
      customerPhone: '+254734567890',
      alternativeContact: '+254701234567',
      fromLocation: 'Parklands, Nairobi',
      fromAddress: 'Parklands Road, Apartment 12B',
      toLocation: 'Thika, Kiambu',
      toAddress: 'Thika Town, Blue Post Hotel Area',
      distance: 45,
      accessDifficulty: 'hard',
      serviceDate: '2025-02-20',
      preferredTime: '08:00',
      serviceType: 'residential',
      propertyType: 'apartment',
      fromFloor: '12th Floor',
      toFloor: '2nd Floor',
      estimatedValue: 65000,
      estimatedDuration: 8,
      status: 'revision',
      urgency: 'low',
      requiresApproval: true,
      createdAt: '2025-01-15T09:15:00Z',
      rooms: [
        { type: 'bedroom', quantity: 1, size: 'small' },
        { type: 'living_room', quantity: 1, size: 'small' },
        { type: 'kitchen', quantity: 1, size: 'small' },
        { type: 'office', quantity: 1, size: 'small' }
      ],
      additionalServices: [
        { name: 'Packing Service', description: 'Full packing service' },
        { name: 'Insurance Coverage', description: 'Premium coverage' },
        { name: 'Storage Service', description: '2 weeks temporary storage' }
      ],
      specialRequirements: [
        'Elevator access required',
        'Long distance move preparation'
      ],
      specialInstructions: `Long distance move to Thika.\nCustomer needs early morning start.\nElevator available but needs booking in advance.`,
      pricingBreakdown: [
        { id: 1, description: 'Base Moving Service', quantity: 1, unitPrice: 30000, category: 'base' },
        { id: 2, description: 'Long Distance (45km)', quantity: 45, unitPrice: 500, category: 'distance' },
        { id: 3, description: 'Room Count (4 rooms)', quantity: 4, unitPrice: 1500, category: 'rooms' },
        { id: 4, description: 'Full Packing Service', quantity: 1, unitPrice: 12000, category: 'additional' },
        { id: 5, description: 'Premium Insurance', quantity: 1, unitPrice: 3000, category: 'insurance' },
        { id: 6, description: 'Temporary Storage', quantity: 1, unitPrice: 4000, category: 'storage' }
      ],
      adminNotes: [
        {
          id: 1,
          content: 'Customer requested revision on pricing. Long distance charges seem high to them.',
          author: 'Mike Admin',
          timestamp: '2025-01-16T10:00:00Z',
          type: 'admin'
        },
        {
          id: 2,
          content: 'Customer called to discuss elevator booking requirements.',
          author: 'Customer Service',
          timestamp: '2025-01-17T14:30:00Z',
          type: 'customer'
        }
      ],
      auditTrail: [
        { action: 'Quote created', user: 'System', timestamp: '2025-01-15T09:15:00Z' },
        { action: 'Revision requested', user: 'Mike Admin', timestamp: '2025-01-16T10:30:00Z' },
        { action: 'Customer contacted', user: 'Customer Service', timestamp: '2025-01-17T14:30:00Z' }
      ]
    }
  ];

  useEffect(() => {
    setQuotes(mockQuotes);
    setFilteredQuotes(mockQuotes);
    if (mockQuotes.length > 0) {
      setSelectedQuote(mockQuotes[0]);
    }
  }, []);

  useEffect(() => {
    let filtered = [...quotes];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(quote =>
        quote.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.fromLocation.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.toLocation.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(quote => quote.status === filters.status);
    }

    // Urgency filter
    if (filters.urgency !== 'all') {
      filtered = filtered.filter(quote => quote.urgency === filters.urgency);
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(quote => 
        new Date(quote.serviceDate) >= new Date(filters.dateRange.start)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(quote => 
        new Date(quote.serviceDate) <= new Date(filters.dateRange.end)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'value_high':
          return b.estimatedValue - a.estimatedValue;
        case 'value_low':
          return a.estimatedValue - b.estimatedValue;
        case 'service_date':
          return new Date(a.serviceDate) - new Date(b.serviceDate);
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  }, [quotes, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      urgency: 'all',
      sortBy: 'newest',
      dateRange: { start: '', end: '' }
    });
  };

  const handleQuoteSelect = (quote) => {
    setSelectedQuote(quote);
  };

  const handleQuoteAction = (action, quote) => {
    const updatedQuotes = quotes.map(q => {
      if (q.id === quote.id) {
        const updatedQuote = { ...q };
        
        switch (action) {
          case 'approve':
            updatedQuote.status = 'approved';
            updatedQuote.auditTrail = [
              ...updatedQuote.auditTrail,
              { action: 'Quote approved', user: 'Current Admin', timestamp: new Date().toISOString() }
            ];
            break;
          case 'reject':
            updatedQuote.status = 'rejected';
            updatedQuote.auditTrail = [
              ...updatedQuote.auditTrail,
              { action: 'Quote rejected', user: 'Current Admin', timestamp: new Date().toISOString() }
            ];
            break;
          case 'revision':
            updatedQuote.status = 'revision';
            updatedQuote.auditTrail = [
              ...updatedQuote.auditTrail,
              { action: 'Revision requested', user: 'Current Admin', timestamp: new Date().toISOString() }
            ];
            break;
        }
        
        return updatedQuote;
      }
      return q;
    });
    
    setQuotes(updatedQuotes);
    setSelectedQuote(updatedQuotes.find(q => q.id === quote.id));
  };

  const handleWhatsApp = (quote) => {
    const message = `Hello ${quote.customerName}, regarding your moving quote ${quote.id}...`;
    const whatsappUrl = `https://wa.me/${quote.customerPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (quote) => {
    const subject = `Update on your moving quote ${quote.id}`;
    const body = `Dear ${quote.customerName},\n\nWe have an update regarding your moving quote...`;
    const mailtoUrl = `mailto:${quote.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handlePriceUpdate = (updatedQuote) => {
    const updatedQuotes = quotes.map(q => 
      q.id === updatedQuote.id ? {
        ...updatedQuote,
        auditTrail: [
          ...updatedQuote.auditTrail,
          { action: 'Pricing updated', user: 'Current Admin', timestamp: new Date().toISOString() }
        ]
      } : q
    );
    
    setQuotes(updatedQuotes);
    setSelectedQuote(updatedQuote);
  };

  const handleAddNote = (quoteId, note) => {
    const updatedQuotes = quotes.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          adminNotes: [...(q.adminNotes || []), note],
          auditTrail: [
            ...q.auditTrail,
            { action: 'Admin note added', user: note.author, timestamp: note.timestamp }
          ]
        };
      }
      return q;
    });
    
    setQuotes(updatedQuotes);
    setSelectedQuote(updatedQuotes.find(q => q.id === quoteId));
  };

  const handleQuoteSelection = (quoteId, isSelected) => {
    if (isSelected) {
      setSelectedQuotes(prev => [...prev, quoteId]);
    } else {
      setSelectedQuotes(prev => prev.filter(id => id !== quoteId));
    }
  };

  const handleSelectAll = () => {
    if (selectedQuotes.length === filteredQuotes.length) {
      setSelectedQuotes([]);
    } else {
      setSelectedQuotes(filteredQuotes.map(q => q.id));
    }
  };

  const handleBulkAction = (action, quoteIds) => {
    const updatedQuotes = quotes.map(quote => {
      if (quoteIds.includes(quote.id)) {
        const updatedQuote = { ...quote };
        
        switch (action) {
          case 'approve':
            updatedQuote.status = 'approved';
            break;
          case 'reject':
            updatedQuote.status = 'rejected';
            break;
          case 'revision':
            updatedQuote.status = 'revision';
            break;
          case 'export':
            // Handle export logic
            console.log('Exporting quotes:', quoteIds);
            return quote;
          case 'email':
            // Handle bulk email logic
            console.log('Sending emails for quotes:', quoteIds);
            return quote;
        }
        
        updatedQuote.auditTrail = [
          ...updatedQuote.auditTrail,
          { action: `Bulk ${action}`, user: 'Current Admin', timestamp: new Date().toISOString() }
        ];
        
        return updatedQuote;
      }
      return quote;
    });
    
    setQuotes(updatedQuotes);
    setSelectedQuotes([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="lg:ml-64">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review and manage customer quote requests
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => window.location.href = '/cost-calculator'}
                >
                  New Quote
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Quote List - Left Panel */}
            <div className="w-full lg:w-1/3 xl:w-1/4 border-r border-gray-200 bg-white flex flex-col">
              <QuoteFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
              
              {selectedQuotes.length > 0 && (
                <BulkActions
                  selectedQuotes={selectedQuotes}
                  onBulkAction={handleBulkAction}
                  onSelectAll={handleSelectAll}
                  onClearSelection={() => setSelectedQuotes([])}
                />
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredQuotes.length > 0 ? (
                  filteredQuotes.map((quote) => (
                    <div key={quote.id} className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedQuotes.includes(quote.id)}
                          onChange={(e) => handleQuoteSelection(quote.id, e.target.checked)}
                        />
                      </div>
                      <QuoteListItem
                        quote={quote}
                        isSelected={selectedQuote?.id === quote.id}
                        onClick={handleQuoteSelect}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No quotes found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or create a new quote
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quote Details - Right Panel */}
            <div className="hidden lg:flex lg:w-2/3 xl:w-3/4 flex-col bg-gray-50">
              {selectedQuote ? (
                <>
                  <QuoteDetailHeader
                    quote={selectedQuote}
                    onApprove={(quote) => handleQuoteAction('approve', quote)}
                    onReject={(quote) => handleQuoteAction('reject', quote)}
                    onRevision={(quote) => handleQuoteAction('revision', quote)}
                    onWhatsApp={handleWhatsApp}
                    onEmail={handleEmail}
                  />
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <CustomerInformation quote={selectedQuote} />
                      <ServiceRequirements quote={selectedQuote} />
                    </div>
                    
                    <PricingBreakdown
                      quote={selectedQuote}
                      onPriceUpdate={handlePriceUpdate}
                    />
                    
                    <AdminNotes
                      quote={selectedQuote}
                      onAddNote={handleAddNote}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="FileText" size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Quote
                    </h3>
                    <p className="text-gray-500">
                      Choose a quote from the list to view details and manage it
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quote Details Modal */}
      {selectedQuote && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuote(null)}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to List
              </Button>
            </div>
            
            <QuoteDetailHeader
              quote={selectedQuote}
              onApprove={(quote) => handleQuoteAction('approve', quote)}
              onReject={(quote) => handleQuoteAction('reject', quote)}
              onRevision={(quote) => handleQuoteAction('revision', quote)}
              onWhatsApp={handleWhatsApp}
              onEmail={handleEmail}
            />
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <CustomerInformation quote={selectedQuote} />
              <ServiceRequirements quote={selectedQuote} />
              <PricingBreakdown
                quote={selectedQuote}
                onPriceUpdate={handlePriceUpdate}
              />
              <AdminNotes
                quote={selectedQuote}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Spacer */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default QuoteManagement;