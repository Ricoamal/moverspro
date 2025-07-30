import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { StaffProvider } from '../../contexts/StaffContext';
import StaffList from './components/StaffList';
import StaffForm from './components/StaffForm';
import StaffDetails from './components/StaffDetails';
import PayrollProcessor from './components/PayrollProcessor';

const StaffManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // list, create, edit, details, payroll
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Handle view changes
  const handleCreateStaff = () => {
    setSelectedEmployee(null);
    setCurrentView('create');
  };

  const handleEditStaff = (employee) => {
    setSelectedEmployee(employee);
    setCurrentView('edit');
  };

  const handleViewStaff = (employee) => {
    setSelectedEmployee(employee);
    setCurrentView('details');
  };

  const handleStaffSaved = (employee) => {
    setSelectedEmployee(employee);
    setCurrentView('details');
  };

  const handleProcessPayroll = (staffList) => {
    setSelectedStaff(staffList);
    setCurrentView('payroll');
  };

  const handleBackToList = () => {
    setSelectedStaff([]);
    setSelectedEmployee(null);
    setCurrentView('list');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <StaffForm
            mode="create"
            onSave={handleStaffSaved}
            onCancel={handleBackToList}
          />
        );

      case 'edit':
        return (
          <StaffForm
            staff={selectedEmployee}
            mode="edit"
            onSave={handleStaffSaved}
            onCancel={handleBackToList}
          />
        );

      case 'details':
        return (
          <StaffDetails
            staff={selectedEmployee}
            onEdit={handleEditStaff}
            onBack={handleBackToList}
          />
        );

      case 'payroll':
        return (
          <PayrollProcessor
            selectedStaff={selectedStaff}
            onBack={handleBackToList}
          />
        );

      default:
        return (
          <StaffList
            onStaffSelect={handleViewStaff}
            onCreateStaff={handleCreateStaff}
            onProcessPayroll={handleProcessPayroll}
          />
        );
    }
  };

  return (
    <StaffProvider>
      <Helmet>
        <title>Staff Management - MoveEase Pro</title>
        <meta name="description" content="Manage your staff, process payroll with M-Pesa, and track employee performance" />
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
                      Back to Staff
                    </button>
                  )}
                  
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentView === 'list' && 'Staff Management'}
                      {currentView === 'create' && 'Add New Staff'}
                      {currentView === 'edit' && 'Edit Staff'}
                      {currentView === 'details' && 'Staff Details'}
                      {currentView === 'payroll' && 'Payroll Processing'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentView === 'list' && 'Manage your staff and process M-Pesa payroll'}
                      {currentView === 'create' && 'Add a new staff member to your team'}
                      {currentView === 'edit' && 'Update staff member information'}
                      {currentView === 'details' && 'View complete staff member profile'}
                      {currentView === 'payroll' && `Processing payroll for ${selectedStaff.length} staff members`}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                {currentView === 'list' && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">M-Pesa Integration</div>
                      <div className="text-lg font-semibold text-green-600">Active</div>
                    </div>
                    
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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
    </StaffProvider>
  );
};

export default StaffManagement;
