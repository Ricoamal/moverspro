import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import FileUpload from '../../../components/ui/FileUpload';
import Icon from '../../../components/AppIcon';
import { useSettings } from '../../../contexts/SettingsContext';

const SettingsImportExport = () => {
  const { settings, exportSettings, importSettings, resetSettings, validateSettings } = useSettings();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleExport = () => {
    try {
      exportSettings();
      alert('Settings exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export settings. Please try again.');
    }
  };

  const handleImport = async (file) => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const importData = await importSettings(file);
      setImportResult({
        success: true,
        message: `Settings imported successfully from ${importData.exportedAt ? new Date(importData.exportedAt).toLocaleDateString() : 'unknown date'}`,
        data: importData
      });
      alert('Settings imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        message: error.message || 'Failed to import settings',
        data: null
      });
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      resetSettings();
      alert('Settings reset to defaults successfully!');
    }
  };

  const handleValidate = () => {
    const validation = validateSettings();
    
    if (validation.isValid) {
      alert('All settings are valid!');
    } else {
      const errorMessages = Object.values(validation.errors).join('\n');
      alert(`Settings validation failed:\n\n${errorMessages}`);
    }
  };

  const getSettingsStats = () => {
    const stats = {
      totalSections: Object.keys(settings).length,
      enabledIntegrations: 0,
      enabledFeatures: 0,
      configuredGateways: 0
    };

    // Count enabled integrations
    if (settings.integrations) {
      stats.enabledIntegrations = Object.values(settings.integrations).filter(
        integration => integration.enabled
      ).length;
    }

    // Count enabled advanced features
    if (settings.advancedFeatures) {
      stats.enabledFeatures = Object.values(settings.advancedFeatures).filter(
        feature => feature.enabled
      ).length;
    }

    // Count configured payment gateways
    if (settings.paymentGateways) {
      stats.configuredGateways = Object.values(settings.paymentGateways).filter(
        gateway => gateway.enabled
      ).length;
    }

    return stats;
  };

  const stats = getSettingsStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings Management</h2>
        <p className="text-gray-600 mt-1">
          Import, export, validate, and manage your application settings.
        </p>
      </div>

      {/* Settings Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSections}</div>
            <div className="text-sm text-gray-600">Total Sections</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.enabledIntegrations}</div>
            <div className="text-sm text-gray-600">Active Integrations</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.enabledFeatures}</div>
            <div className="text-sm text-gray-600">Enabled Features</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.configuredGateways}</div>
            <div className="text-sm text-gray-600">Payment Gateways</div>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Download" size={24} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Settings</h3>
            <p className="text-sm text-gray-600">Download your current settings as a JSON file</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Export your current settings configuration to backup or transfer to another instance.
            The exported file will include all your customizations, integrations, and preferences.
          </p>
          
          <Button
            onClick={handleExport}
            iconName="Download"
            className="w-full md:w-auto"
          >
            Export Settings
          </Button>
        </div>
      </div>

      {/* Import Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Upload" size={24} className="text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Import Settings</h3>
            <p className="text-sm text-gray-600">Upload a settings file to restore configuration</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Importing settings will overwrite your current configuration. 
                  Consider exporting your current settings first as a backup.
                </p>
              </div>
            </div>
          </div>
          
          <FileUpload
            accept=".json"
            maxSize={1024 * 1024} // 1MB
            onFileSelect={handleImport}
            loading={importing}
            description="Select a JSON settings file to import"
          />
          
          {importResult && (
            <div className={`p-4 rounded-lg border ${
              importResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name={importResult.success ? "CheckCircle" : "XCircle"} 
                  size={20} 
                  className={importResult.success ? "text-green-600" : "text-red-600"} 
                />
                <div>
                  <h4 className={`text-sm font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    importResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {importResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Validate Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-blue-600" />
              <h4 className="font-medium text-gray-900">Validate Settings</h4>
            </div>
            <p className="text-sm text-gray-600">
              Check your current settings for any configuration errors or missing required fields.
            </p>
            <Button
              variant="outline"
              onClick={handleValidate}
              iconName="CheckCircle"
              className="w-full"
            >
              Validate Configuration
            </Button>
          </div>
          
          {/* Reset Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="RotateCcw" size={20} className="text-red-600" />
              <h4 className="font-medium text-gray-900">Reset Settings</h4>
            </div>
            <p className="text-sm text-gray-600">
              Reset all settings to their default values. This action cannot be undone.
            </p>
            <Button
              variant="outline"
              onClick={handleReset}
              iconName="RotateCcw"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Storage Location</h4>
              <p className="text-sm text-gray-600">
                Settings are stored locally in your browser's localStorage. 
                They persist across sessions but are specific to this browser and domain.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Backup Recommendation</h4>
              <p className="text-sm text-gray-600">
                Regularly export your settings to create backups. 
                This ensures you can restore your configuration if needed.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Settings Format</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Settings files are in JSON format and include metadata about export date and version. 
                  Only import settings files from trusted sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsImportExport;
