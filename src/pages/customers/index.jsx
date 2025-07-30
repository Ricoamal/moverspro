import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { CustomerProvider } from '../../contexts/CustomerContext';
import { CustomerAdvancedProvider } from '../../contexts/CustomerAdvancedContext';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetails from './components/CustomerDetails';

const CustomerManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // list, create, edit, details
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Handle view changes
  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setCurrentView('create');
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('edit');
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('details');
  };

  const handleCustomerSaved = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setCurrentView('list');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <CustomerForm
            mode="create"
            onSave={handleCustomerSaved}
            onCancel={handleBackToList}
          />
        );
      
      case 'edit':
        return (
          <CustomerForm
            customer={selectedCustomer}
            mode="edit"
            onSave={handleCustomerSaved}
            onCancel={handleBackToList}
          />
        );
      
      case 'details':
        return (
          <CustomerDetails
            customer={selectedCustomer}
            onEdit={handleEditCustomer}
            onBack={handleBackToList}
          />
        );
      
      default:
        return (
          <CustomerList
            onCustomerSelect={handleViewCustomer}
            onCreateCustomer={handleCreateCustomer}
          />
        );
    }
  };

  return (
    <CustomerProvider>
      <CustomerAdvancedProvider>
      <Helmet>
        <title>Customer Management - MoveEase Pro</title>
        <meta name="description" content="Manage your customers, track their move history, and maintain customer relationships" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {currentView !== 'list' && (
                    <button
                      onClick={handleBackToList}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Customers
                    </button>
                  )}
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentView === 'list' && 'Customer Management'}
                      {currentView === 'create' && 'Add New Customer'}
                      {currentView === 'edit' && 'Edit Customer'}
                      {currentView === 'details' && 'Customer Details'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentView === 'list' && 'Manage your customers and track their move history'}
                      {currentView === 'create' && 'Create a new customer record'}
                      {currentView === 'edit' && 'Update customer information'}
                      {currentView === 'details' && selectedCustomer && 
                        `${selectedCustomer.personalInfo.firstName} ${selectedCustomer.personalInfo.lastName} - ${selectedCustomer.customerNumber}`
                      }
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                {currentView === 'details' && selectedCustomer && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEditCustomer(selectedCustomer)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Customer
                    </button>
                    
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Move
                    </button>
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
      </CustomerAdvancedProvider>
    </CustomerProvider>
  );
};

export default CustomerManagement;
