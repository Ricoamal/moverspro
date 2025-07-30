import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { PayrollProvider } from '../../contexts/PayrollContext';
import PayrollDashboard from './components/PayrollDashboard';
import PayrollPeriodForm from './components/PayrollPeriodForm';
import PayrollGenerator from './components/PayrollGenerator';
import PayrollDetails from './components/PayrollDetails';

const PayrollManagement = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, create-period, generate, details
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Handle view changes
  const handleCreatePeriod = () => {
    setSelectedPeriod(null);
    setCurrentView('create-period');
  };

  const handleViewPeriod = (period) => {
    setSelectedPeriod(period);
    setCurrentView('details');
  };

  const handleGeneratePayroll = (period) => {
    setSelectedPeriod(period);
    setCurrentView('generate');
  };

  const handlePeriodSaved = (period) => {
    setSelectedPeriod(period);
    setCurrentView('details');
  };

  const handleBackToDashboard = () => {
    setSelectedPeriod(null);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-period':
        return (
          <PayrollPeriodForm
            onSave={handlePeriodSaved}
            onCancel={handleBackToDashboard}
          />
        );
      
      case 'generate':
        return (
          <PayrollGenerator
            period={selectedPeriod}
            onBack={handleBackToDashboard}
            onComplete={handleViewPeriod}
          />
        );
      
      case 'details':
        return (
          <PayrollDetails
            period={selectedPeriod}
            onBack={handleBackToDashboard}
            onGenerate={handleGeneratePayroll}
          />
        );
      
      default:
        return (
          <PayrollDashboard
            onCreatePeriod={handleCreatePeriod}
            onViewPeriod={handleViewPeriod}
            onGeneratePayroll={handleGeneratePayroll}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'create-period':
        return 'Create Payroll Period';
      case 'generate':
        return 'Generate Payroll';
      case 'details':
        return selectedPeriod ? selectedPeriod.name : 'Payroll Details';
      default:
        return 'Payroll Management';
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case 'create-period':
        return 'Set up a new payroll period for processing employee salaries';
      case 'generate':
        return 'Generate payroll calculations for all employees';
      case 'details':
        return 'View and manage payroll period details';
      default:
        return 'Manage payroll periods, calculate salaries, and process payments';
    }
  };

  return (
    <PayrollProvider>
      <Helmet>
        <title>Payroll Management - MoveEase Pro</title>
        <meta name="description" content="Advanced payroll management with tax calculations, payslip generation, and comprehensive reporting" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {currentView !== 'dashboard' && (
                    <button
                      onClick={handleBackToDashboard}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Dashboard
                    </button>
                  )}
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {getPageTitle()}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {getPageDescription()}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                {currentView === 'dashboard' && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Tax Engine</div>
                      <div className="text-lg font-semibold text-green-600">KRA Compliant</div>
                    </div>
                    
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}

                {currentView === 'details' && selectedPeriod && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Period Status</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {selectedPeriod.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderCurrentView()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PayrollProvider>
  );
};

export default PayrollManagement;
