import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { SettingsProvider } from '../../contexts/SettingsContext';

// Import setting modules (will be created)
import CompanyBrandingSettings from './components/CompanyBrandingSettings';
import CommunicationSettings from './components/CommunicationSettings';
import DocumentTemplatesSettings from './components/DocumentTemplatesSettings';
import LocalizationSettings from './components/LocalizationSettings';
import PaymentGatewaySettings from './components/PaymentGatewaySettings';
import SEOMarketingSettings from './components/SEOMarketingSettings';
import ThirdPartyIntegrationsSettings from './components/ThirdPartyIntegrationsSettings';
// import AdvancedFeaturesSettings from './components/AdvancedFeaturesSettings';
import SettingsImportExport from './components/SettingsImportExport';
// import SettingsPreviewValidation from './components/SettingsPreviewValidation';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const settingsTabs = [
    {
      id: 'company',
      name: 'Company Branding',
      icon: 'Building2',
      description: 'Logo, company details, brand colors',
      component: CompanyBrandingSettings
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: 'MessageSquare',
      description: 'SMS & Email configuration',
      component: CommunicationSettings
    },
    {
      id: 'documents',
      name: 'Document Templates',
      icon: 'FileText',
      description: 'PDF templates & layouts',
      component: DocumentTemplatesSettings
    },
    {
      id: 'localization',
      name: 'Localization',
      icon: 'Globe',
      description: 'Currency, language, timezone',
      component: LocalizationSettings
    },
    {
      id: 'payments',
      name: 'Payment Gateways',
      icon: 'CreditCard',
      description: 'Mobile money & payment methods',
      component: PaymentGatewaySettings
    },
    {
      id: 'seo',
      name: 'SEO & Marketing',
      icon: 'TrendingUp',
      description: 'SEO settings & analytics',
      component: SEOMarketingSettings
    },
    {
      id: 'integrations',
      name: 'Third-Party APIs',
      icon: 'Plug',
      description: 'Google APIs & integrations',
      component: ThirdPartyIntegrationsSettings
    },
    // {
    //   id: 'advanced',
    //   name: 'Advanced Features',
    //   icon: 'Settings2',
    //   description: 'QR codes, AI chatbot, virtual tours',
    //   component: AdvancedFeaturesSettings
    // },
    {
      id: 'management',
      name: 'Settings Management',
      icon: 'Database',
      description: 'Import, export, backup & validation',
      component: SettingsImportExport
    },
    // {
    //   id: 'preview',
    //   name: 'Preview & Validation',
    //   icon: 'Eye',
    //   description: 'Preview settings and validate configuration',
    //   component: SettingsPreviewValidation
    // }
  ];

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this section?'
      );
      if (!confirmLeave) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleSaveAll = () => {
    // Implementation for saving all settings
    console.log('Saving all settings...');
    setHasUnsavedChanges(false);
  };

  const handleExportSettings = () => {
    // Implementation for exporting settings
    console.log('Exporting settings...');
  };

  const handleImportSettings = () => {
    // Implementation for importing settings
    console.log('Importing settings...');
  };

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <SettingsProvider>
      <Helmet>
        <title>Settings - MoveEase Pro</title>
        <meta name="description" content="Configure your MoveEase Pro application settings and preferences." />
      </Helmet>

      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Configure your application settings and preferences
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {hasUnsavedChanges && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <Icon name="AlertCircle" size={16} className="mr-1" />
                    Unsaved changes
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={handleExportSettings}
                >
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                  onClick={handleImportSettings}
                >
                  Import
                </Button>
                
                <Button
                  size="sm"
                  iconName="Save"
                  onClick={handleSaveAll}
                  disabled={!hasUnsavedChanges}
                >
                  Save All
                </Button>
              </div>
            </div>
          </header>

          <div className="flex h-full">
            {/* Settings Navigation */}
            <nav className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-2">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={tab.icon} 
                          size={20} 
                          className={`mt-0.5 ${
                            activeTab === tab.id ? 'text-white' : 'text-gray-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{tab.name}</h3>
                          <p className={`text-xs mt-1 ${
                            activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Settings Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                {ActiveComponent ? (
                  <ActiveComponent 
                    onSettingsChange={() => setHasUnsavedChanges(true)}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Settings" size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Settings Module Not Found
                    </h3>
                    <p className="text-gray-600">
                      The selected settings module is not yet implemented.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
};

export default Settings;
