import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/ui/AdminSidebar';
import KPICard from './components/KPICard';
import RecentInquiriesTable from './components/RecentInquiriesTable';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import PaymentStatusWidget from './components/PaymentStatusWidget';

import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Daily Revenue',
      value: 'KES 125,400',
      change: '+12.5% from yesterday',
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      title: 'Pending Quotes',
      value: '23',
      change: '+3 new today',
      changeType: 'increase',
      icon: 'FileText',
      color: 'amber'
    },
    {
      title: 'Active Jobs',
      value: '8',
      change: '2 completing today',
      changeType: 'neutral',
      icon: 'Truck',
      color: 'blue'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2 this month',
      changeType: 'increase',
      icon: 'Star',
      color: 'purple'
    }
  ];

  // Mock inquiries data
  const inquiriesData = [
    {
      id: 1,
      date: '2025-01-27',
      customer: 'John Kamau',
      phone: '+254712345678',
      serviceType: 'House Moving',
      amount: 'KES 45,000',
      status: 'pending'
    },
    {
      id: 2,
      date: '2025-01-27',
      customer: 'Mary Wanjiku',
      phone: '+254723456789',
      serviceType: 'Office Relocation',
      amount: 'KES 85,000',
      status: 'approved'
    },
    {
      id: 3,
      date: '2025-01-26',
      customer: 'Peter Ochieng',
      phone: '+254734567890',
      serviceType: 'Apartment Moving',
      amount: 'KES 32,000',
      status: 'completed'
    },
    {
      id: 4,
      date: '2025-01-26',
      customer: 'Grace Akinyi',
      phone: '+254745678901',
      serviceType: 'Storage Service',
      amount: 'KES 15,000',
      status: 'pending'
    },
    {
      id: 5,
      date: '2025-01-25',
      customer: 'David Mwangi',
      phone: '+254756789012',
      serviceType: 'House Moving',
      amount: 'KES 52,000',
      status: 'rejected'
    }
  ];

  // Mock activity data
  const activityData = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      description: 'John Kamau paid KES 45,000 via M-Pesa',
      amount: 'KES 45,000',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 2,
      type: 'quote',
      title: 'New Quote Request',
      description: 'Mary Wanjiku requested quote for office relocation',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 3,
      type: 'message',
      title: 'WhatsApp Message',
      description: 'Customer inquiry about packing services',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 4,
      type: 'system',
      title: 'eTIMS Integration',
      description: 'Tax invoice generated successfully',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 5,
      type: 'customer',
      title: 'Customer Registration',
      description: 'New customer Peter Ochieng registered',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  // Mock payment data
  const paymentData = [
    {
      id: 1,
      customer: 'John Kamau',
      phone: '+254712345678',
      amount: 'KES 45,000',
      status: 'completed',
      transactionId: 'MPX123456789',
      updatedAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 2,
      customer: 'Mary Wanjiku',
      phone: '+254723456789',
      amount: 'KES 25,000',
      status: 'processing',
      transactionId: 'MPX987654321',
      updatedAt: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: 3,
      customer: 'Peter Ochieng',
      phone: '+254734567890',
      amount: 'KES 32,000',
      status: 'completed',
      transactionId: 'MPX456789123',
      updatedAt: new Date(Date.now() - 1200000).toISOString()
    }
  ];

  // Event handlers
  const handleViewDetails = (inquiryId) => {
    console.log('Viewing details for inquiry:', inquiryId);
    navigate('/quote-management');
  };

  const handleApproveQuote = (inquiryId) => {
    console.log('Approving quote for inquiry:', inquiryId);
    // In real app, this would update the quote status
  };

  const handleContactCustomer = (phone) => {
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCreateQuote = () => {
    navigate('/quote-management');
  };

  const handleScheduleJob = () => {
    console.log('Scheduling new job');
  };

  const handleViewReports = () => {
    console.log('Viewing reports');
  };

  const handleManageCustomers = () => {
    console.log('Managing customers');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-card">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back! Here's what's happening with your business today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentTime.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentTime.toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <Button variant="default" iconName="Plus" iconPosition="left">
                  New Quote
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tables and Charts */}
            <div className="lg:col-span-2 space-y-8">
              <RecentInquiriesTable
                inquiries={inquiriesData}
                onViewDetails={handleViewDetails}
                onApproveQuote={handleApproveQuote}
                onContactCustomer={handleContactCustomer}
              />
              
              <QuickActions
                onCreateQuote={handleCreateQuote}
                onScheduleJob={handleScheduleJob}
                onViewReports={handleViewReports}
                onManageCustomers={handleManageCustomers}
              />
            </div>

            {/* Right Column - Activity Feed and Widgets */}
            <div className="space-y-8">
              <PaymentStatusWidget payments={paymentData} />
              <ActivityFeed activities={activityData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;