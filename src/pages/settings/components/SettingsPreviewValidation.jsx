import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useSettings } from '../../../contexts/SettingsContext';

const SettingsPreviewValidation = () => {
  const { settings, validateSettings } = useSettings();
  const [previewMode, setPreviewMode] = useState('seo');
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const previewModes = [
    { value: 'seo', label: 'SEO Preview' },
    { value: 'email', label: 'Email Template Preview' },
    { value: 'pdf', label: 'PDF Layout Preview' },
    { value: 'branding', label: 'Brand Preview' }
  ];

  const handleValidateAll = async () => {
    setIsValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate validation
      const validation = validateSettings();
      
      // Enhanced validation with more checks
      const enhancedValidation = {
        ...validation,
        sections: {
          company: validateCompanySettings(),
          communication: validateCommunicationSettings(),
          seo: validateSEOSettings(),
          localization: validateLocalizationSettings(),
          payments: validatePaymentSettings(),
          integrations: validateIntegrationSettings()
        }
      };
      
      setValidationResults(enhancedValidation);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const validateCompanySettings = () => {
    const errors = [];
    const warnings = [];
    
    if (!settings.company?.name?.trim()) {
      errors.push('Company name is required');
    }
    
    if (!settings.company?.email?.trim()) {
      errors.push('Company email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.company.email)) {
      errors.push('Invalid email format');
    }
    
    if (!settings.company?.phone?.trim()) {
      warnings.push('Phone number is recommended');
    }
    
    if (!settings.company?.logo) {
      warnings.push('Company logo is recommended for branding');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const validateCommunicationSettings = () => {
    const errors = [];
    const warnings = [];
    
    if (settings.communication?.sms?.enabled && !settings.communication.sms.apiKey) {
      errors.push('SMS API key is required when SMS is enabled');
    }
    
    if (settings.communication?.email?.enabled && !settings.communication.email.smtpHost) {
      errors.push('SMTP host is required when email is enabled');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const validateSEOSettings = () => {
    const errors = [];
    const warnings = [];
    
    if (!settings.seo?.metaTitle?.trim()) {
      warnings.push('Meta title is recommended for SEO');
    } else if (settings.seo.metaTitle.length > 60) {
      warnings.push('Meta title should be under 60 characters');
    }
    
    if (!settings.seo?.metaDescription?.trim()) {
      warnings.push('Meta description is recommended for SEO');
    } else if (settings.seo.metaDescription.length > 160) {
      warnings.push('Meta description should be under 160 characters');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const validateLocalizationSettings = () => {
    const errors = [];
    const warnings = [];
    
    if (settings.localization?.etims?.enabled) {
      if (!settings.localization.etims.pinNumber) {
        errors.push('eTIMS PIN number is required when eTIMS is enabled');
      }
      if (!settings.localization.etims.serialNumber) {
        errors.push('eTIMS serial number is required when eTIMS is enabled');
      }
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const validatePaymentSettings = () => {
    const errors = [];
    const warnings = [];
    
    const enabledGateways = Object.entries(settings.paymentGateways || {})
      .filter(([_, gateway]) => gateway.enabled);
    
    if (enabledGateways.length === 0) {
      warnings.push('At least one payment gateway is recommended');
    }
    
    enabledGateways.forEach(([gatewayId, gateway]) => {
      if (gatewayId === 'mpesa' && (!gateway.consumerKey || !gateway.consumerSecret)) {
        errors.push('M-Pesa requires consumer key and secret');
      }
    });
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const validateIntegrationSettings = () => {
    const errors = [];
    const warnings = [];
    
    if (settings.integrations?.googleMaps?.enabled && !settings.integrations.googleMaps.apiKey) {
      errors.push('Google Maps API key is required when Google Maps is enabled');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  };

  const renderSEOPreview = () => (
    <div className="space-y-6">
      {/* Google Search Preview */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Google Search Preview</h4>
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {settings.seo?.metaTitle || 'MoveEase Pro - Professional Moving Services'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            {settings.company?.website || 'https://moveeasepro.com'}
          </div>
          <div className="text-gray-600 text-sm mt-2">
            {settings.seo?.metaDescription || 'Professional moving and relocation services in Kenya. Get instant quotes, track your move, and enjoy stress-free relocation with MoveEase Pro.'}
          </div>
        </div>
      </div>

      {/* Facebook Preview */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Facebook Share Preview</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-w-md">
          <div className="h-32 bg-gray-200 flex items-center justify-center">
            {settings.seo?.openGraph?.image ? (
              <img src={settings.seo.openGraph.image} alt="OG" className="h-full w-full object-cover" />
            ) : (
              <Icon name="Image" size={32} className="text-gray-400" />
            )}
          </div>
          <div className="p-3">
            <div className="font-medium text-sm">
              {settings.seo?.openGraph?.title || settings.seo?.metaTitle || 'MoveEase Pro'}
            </div>
            <div className="text-gray-600 text-xs mt-1">
              {settings.seo?.openGraph?.description || settings.seo?.metaDescription || 'Professional moving services'}
            </div>
            <div className="text-gray-500 text-xs mt-1 uppercase">
              {settings.company?.website?.replace('https://', '') || 'moveeasepro.com'}
            </div>
          </div>
        </div>
      </div>

      {/* Twitter Preview */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Twitter Card Preview</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-w-md">
          <div className="h-32 bg-gray-200 flex items-center justify-center">
            {settings.seo?.twitter?.image ? (
              <img src={settings.seo.twitter.image} alt="Twitter" className="h-full w-full object-cover" />
            ) : (
              <Icon name="Image" size={32} className="text-gray-400" />
            )}
          </div>
          <div className="p-3">
            <div className="font-medium text-sm">
              {settings.seo?.twitter?.title || settings.seo?.metaTitle || 'MoveEase Pro'}
            </div>
            <div className="text-gray-600 text-xs mt-1">
              {settings.seo?.twitter?.description || settings.seo?.metaDescription || 'Professional moving services'}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {settings.company?.website?.replace('https://', '') || 'moveeasepro.com'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailPreview = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900 mb-3">Email Template Preview</h4>
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden max-w-2xl">
        {/* Email Header */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            From: {settings.communication?.email?.fromName || 'MoveEase Pro'} &lt;{settings.communication?.email?.fromEmail || 'info@moveeasepro.com'}&gt;
          </div>
          <div className="text-sm text-gray-600">
            Subject: Your Moving Quote is Ready
          </div>
        </div>
        
        {/* Email Body */}
        <div className="p-6" style={{ backgroundColor: '#ffffff' }}>
          <div className="text-center mb-6">
            {settings.company?.logo ? (
              <img src={settings.company.logo} alt="Logo" className="h-12 mx-auto" />
            ) : (
              <div className="h-12 w-32 bg-gray-200 rounded mx-auto flex items-center justify-center">
                <span className="text-gray-500 text-sm">Logo</span>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-4" style={{ color: settings.company?.primaryColor || '#1E40AF' }}>
            Your Moving Quote is Ready!
          </h2>
          
          <p className="text-gray-700 mb-4">
            Dear Customer,
          </p>
          
          <p className="text-gray-700 mb-4">
            Thank you for choosing {settings.company?.name || 'MoveEase Pro'} for your moving needs. 
            We've prepared a customized quote based on your requirements.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Quote Details</h3>
            <div className="text-sm text-gray-600">
              <p>Service: Residential Moving</p>
              <p>Date: March 15, 2024</p>
              <p>Total: KSh 45,000</p>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <button 
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: settings.company?.primaryColor || '#1E40AF' }}
            >
              View Full Quote
            </button>
          </div>
          
          <div className="text-sm text-gray-600 border-t border-gray-200 pt-4">
            <p>{settings.company?.name || 'MoveEase Pro'}</p>
            <p>{settings.company?.address || '123 Business Street, Nairobi, Kenya'}</p>
            <p>{settings.company?.phone || '+254 700 123 456'}</p>
            <p>{settings.company?.email || 'info@moveeasepro.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPDFPreview = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900 mb-3">PDF Document Preview</h4>
      <div className="border border-gray-200 rounded-lg bg-white p-6 max-w-2xl">
        {/* PDF Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: settings.company?.primaryColor || '#1E40AF' }}>
          <div>
            {settings.company?.logo ? (
              <img src={settings.company.logo} alt="Logo" className="h-16" />
            ) : (
              <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold" style={{ color: settings.company?.primaryColor || '#1E40AF' }}>
              INVOICE
            </h1>
            <p className="text-gray-600">#INV-001</p>
          </div>
        </div>
        
        {/* Company & Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-medium mb-2">From:</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{settings.company?.name || 'MoveEase Pro'}</p>
              <p>{settings.company?.address || '123 Business Street'}</p>
              <p>Nairobi, Kenya</p>
              <p>{settings.company?.phone || '+254 700 123 456'}</p>
              <p>{settings.company?.email || 'info@moveeasepro.com'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">To:</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">John Doe</p>
              <p>456 Customer Avenue</p>
              <p>Nairobi, Kenya</p>
              <p>+254 700 987 654</p>
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b" style={{ backgroundColor: settings.company?.primaryColor || '#1E40AF' }}>
              <th className="text-left p-2 text-white text-sm">Service</th>
              <th className="text-right p-2 text-white text-sm">Qty</th>
              <th className="text-right p-2 text-white text-sm">Rate</th>
              <th className="text-right p-2 text-white text-sm">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-sm">Residential Moving Service</td>
              <td className="p-2 text-sm text-right">1</td>
              <td className="p-2 text-sm text-right">KSh 45,000</td>
              <td className="p-2 text-sm text-right">KSh 45,000</td>
            </tr>
          </tbody>
        </table>
        
        {/* Total */}
        <div className="text-right mb-6">
          <div className="text-lg font-bold" style={{ color: settings.company?.primaryColor || '#1E40AF' }}>
            Total: KSh 45,000
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          Thank you for choosing {settings.company?.name || 'MoveEase Pro'}!
        </div>
      </div>
    </div>
  );

  const renderBrandPreview = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900 mb-3">Brand Identity Preview</h4>
      
      {/* Color Palette */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">Color Palette</h5>
        <div className="flex space-x-4">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: settings.company?.primaryColor || '#1E40AF' }}
            ></div>
            <p className="text-xs text-gray-600 mt-1">Primary</p>
            <p className="text-xs text-gray-500">{settings.company?.primaryColor || '#1E40AF'}</p>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200"
              style={{ backgroundColor: settings.company?.secondaryColor || '#64748B' }}
            ></div>
            <p className="text-xs text-gray-600 mt-1">Secondary</p>
            <p className="text-xs text-gray-500">{settings.company?.secondaryColor || '#64748B'}</p>
          </div>
        </div>
      </div>
      
      {/* Logo Usage */}
      <div>
        <h5 className="font-medium text-gray-700 mb-2">Logo Usage</h5>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
            {settings.company?.logo ? (
              <img src={settings.company.logo} alt="Logo" className="h-12 mx-auto" />
            ) : (
              <div className="h-12 w-20 bg-gray-200 rounded mx-auto flex items-center justify-center">
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-2">On White</p>
          </div>
          <div 
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: settings.company?.primaryColor || '#1E40AF' }}
          >
            {settings.company?.logo ? (
              <img src={settings.company.logo} alt="Logo" className="h-12 mx-auto filter brightness-0 invert" />
            ) : (
              <div className="h-12 w-20 bg-white bg-opacity-20 rounded mx-auto flex items-center justify-center">
                <span className="text-white text-xs">Logo</span>
              </div>
            )}
            <p className="text-xs text-white mt-2">On Primary</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            {settings.company?.logo ? (
              <img src={settings.company.logo} alt="Logo" className="h-12 mx-auto filter brightness-0 invert" />
            ) : (
              <div className="h-12 w-20 bg-white bg-opacity-20 rounded mx-auto flex items-center justify-center">
                <span className="text-white text-xs">Logo</span>
              </div>
            )}
            <p className="text-xs text-white mt-2">On Dark</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (previewMode) {
      case 'seo':
        return renderSEOPreview();
      case 'email':
        return renderEmailPreview();
      case 'pdf':
        return renderPDFPreview();
      case 'branding':
        return renderBrandPreview();
      default:
        return renderSEOPreview();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Settings Preview & Validation</h2>
          <p className="text-gray-600 mt-1">
            Preview how your settings will appear and validate configuration.
          </p>
        </div>
        <Button
          onClick={handleValidateAll}
          loading={isValidating}
          iconName="CheckCircle"
        >
          Validate All Settings
        </Button>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Validation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(validationResults.sections).map(([section, result]) => (
              <div key={section} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{section}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    result.isValid ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                
                {result.errors.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-red-600 font-medium">Errors:</p>
                    <ul className="text-xs text-red-600 list-disc list-inside">
                      {result.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.warnings.length > 0 && (
                  <div>
                    <p className="text-xs text-yellow-600 font-medium">Warnings:</p>
                    <ul className="text-xs text-yellow-600 list-disc list-inside">
                      {result.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.errors.length === 0 && result.warnings.length === 0 && (
                  <p className="text-xs text-green-600">All good!</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Settings Preview</h3>
          <Select
            options={previewModes}
            value={previewMode}
            onChange={(value) => setPreviewMode(value)}
            className="w-48"
          />
        </div>
        
        {renderPreview()}
      </div>
    </div>
  );
};

export default SettingsPreviewValidation;
