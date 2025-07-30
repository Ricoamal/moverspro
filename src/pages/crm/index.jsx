import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import { CRMProvider } from '../../contexts/CRMContext';
import CRMDashboard from './components/CRMDashboard';
import LeadManagement from './components/LeadManagement';
import LeadForm from './components/LeadForm';
import OpportunityPipeline from './components/OpportunityPipeline';
import ActivityManager from './components/ActivityManager';

const CRMManagement = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, leads, opportunities, activities, create-lead, edit-lead, convert-lead
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Handle view changes
  const handleCreateLead = () => {
    setSelectedLead(null);
    setCurrentView('create-lead');
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setCurrentView('edit-lead');
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setCurrentView('lead-details');
  };

  const handleConvertLead = (lead) => {
    setSelectedLead(lead);
    setCurrentView('convert-lead');
  };

  const handleCreateOpportunity = () => {
    setSelectedOpportunity(null);
    setCurrentView('create-opportunity');
  };

  const handleViewOpportunities = () => {
    setCurrentView('opportunities');
  };

  const handleViewLeads = () => {
    setCurrentView('leads');
  };

  const handleLeadSaved = (lead) => {
    setSelectedLead(lead);
    setCurrentView('leads');
  };

  const handleBackToDashboard = () => {
    setSelectedLead(null);
    setSelectedOpportunity(null);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-lead':
        return (
          <LeadForm
            onSave={handleLeadSaved}
            onCancel={handleBackToDashboard}
          />
        );
      
      case 'edit-lead':
        return (
          <LeadForm
            lead={selectedLead}
            onSave={handleLeadSaved}
            onCancel={handleBackToDashboard}
          />
        );
      
      case 'leads':
        return (
          <LeadManagement
            onCreateLead={handleCreateLead}
            onViewLead={handleViewLead}
            onConvertLead={handleConvertLead}
          />
        );
      
      case 'opportunities':
        return (
          <OpportunityPipeline
            onCreateOpportunity={handleCreateOpportunity}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'activities':
        return (
          <ActivityManager
            onBack={handleBackToDashboard}
          />
        );
      
      default:
        return (
          <CRMDashboard
            onCreateLead={handleCreateLead}
            onCreateOpportunity={handleCreateOpportunity}
            onViewLeads={handleViewLeads}
            onViewOpportunities={handleViewOpportunities}
          />
        );
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'create-lead':
        return 'Create New Lead';
      case 'edit-lead':
        return 'Edit Lead';
      case 'leads':
        return 'Lead Management';
      case 'opportunities':
        return 'Sales Pipeline';
      case 'activities':
        return 'Activity Management';
      default:
        return 'CRM Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case 'create-lead':
        return 'Add a new lead to your sales pipeline';
      case 'edit-lead':
        return 'Update lead information and track progress';
      case 'leads':
        return 'Manage and track all your sales leads';
      case 'opportunities':
        return 'Track opportunities through your sales pipeline';
      case 'activities':
        return 'Manage sales activities and follow-ups';
      default:
        return 'Comprehensive customer relationship management';
    }
  };

  return (
    <CRMProvider>
      <Helmet>
        <title>CRM Management - MoveEase Pro</title>
        <meta name="description" content="Complete customer relationship management with lead tracking, sales pipeline, and opportunity management" />
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
                      <div className="text-sm text-gray-500">CRM Status</div>
                      <div className="text-lg font-semibold text-green-600">Active</div>
                    </div>
                    
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}

                {currentView === 'leads' && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Lead Pipeline</div>
                      <div className="text-lg font-semibold text-blue-600">
                        Active Management
                      </div>
                    </div>
                  </div>
                )}

                {currentView === 'opportunities' && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Sales Pipeline</div>
                      <div className="text-lg font-semibold text-purple-600">
                        Opportunity Tracking
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
    </CRMProvider>
  );
};

export default CRMManagement;
