import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import ColorPicker from '../../../components/ui/ColorPicker';
import FileUpload from '../../../components/ui/FileUpload';
import Icon from '../../../components/AppIcon';

const DocumentTemplatesSettings = ({ onSettingsChange }) => {
  const [activeTemplate, setActiveTemplate] = useState('invoice');
  const [settings, setSettings] = useState({
    invoice: {
      layout: 'modern',
      headerText: 'INVOICE',
      footerText: 'Thank you for your business!',
      showLogo: true,
      showCompanyDetails: true,
      showPaymentTerms: true,
      paymentTerms: 'Payment due within 30 days',
      primaryColor: '#1E40AF',
      secondaryColor: '#64748B',
      fontSize: 'medium',
      showNotes: true,
      notesText: 'Please retain this invoice for your records.',
      showSignature: false,
      watermark: '',
      showWatermark: false
    },
    quote: {
      layout: 'modern',
      headerText: 'QUOTATION',
      footerText: 'This quote is valid for 30 days',
      showLogo: true,
      showCompanyDetails: true,
      showValidityPeriod: true,
      validityPeriod: '30 days',
      primaryColor: '#059669',
      secondaryColor: '#64748B',
      fontSize: 'medium',
      showNotes: true,
      notesText: 'All prices are subject to change without notice.',
      showSignature: true,
      watermark: 'QUOTE',
      showWatermark: true
    },
    delivery: {
      layout: 'minimal',
      headerText: 'DELIVERY NOTE',
      footerText: 'Goods delivered in good condition',
      showLogo: true,
      showCompanyDetails: true,
      showDeliveryInstructions: true,
      deliveryInstructions: 'Please inspect items upon delivery',
      primaryColor: '#7C3AED',
      secondaryColor: '#64748B',
      fontSize: 'medium',
      showNotes: true,
      notesText: 'Customer signature required upon delivery.',
      showSignature: true,
      watermark: '',
      showWatermark: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile, print

  const templates = [
    { id: 'invoice', name: 'Invoice Template', icon: 'Receipt', color: 'blue' },
    { id: 'quote', name: 'Quote Template', icon: 'FileText', color: 'green' },
    { id: 'delivery', name: 'Delivery Note Template', icon: 'Truck', color: 'purple' }
  ];

  const templateLayouts = [
    { value: 'modern', label: 'Modern Layout', description: 'Clean, contemporary design' },
    { value: 'classic', label: 'Classic Layout', description: 'Traditional business format' },
    { value: 'minimal', label: 'Minimal Layout', description: 'Simple, clean design' },
    { value: 'professional', label: 'Professional Layout', description: 'Corporate style format' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small (10pt)' },
    { value: 'medium', label: 'Medium (12pt)' },
    { value: 'large', label: 'Large (14pt)' }
  ];

  const previewModes = [
    { value: 'desktop', label: 'Desktop View' },
    { value: 'mobile', label: 'Mobile View' },
    { value: 'print', label: 'Print Preview' }
  ];

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        [field]: value
      }
    }));
    onSettingsChange();

    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateSettings = () => {
    const newErrors = {};
    const currentSettings = settings[activeTemplate];

    if (!currentSettings.headerText.trim()) {
      newErrors.headerText = 'Header text is required';
    }

    if (!currentSettings.footerText.trim()) {
      newErrors.footerText = 'Footer text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving document template settings:', settings);
      alert('Document template settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewDownload = () => {
    console.log(`Downloading ${activeTemplate} template preview...`);
    alert(`${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} template preview would be downloaded as PDF`);
  };

  const handleTemplateReset = () => {
    if (confirm('Are you sure you want to reset this template to default settings?')) {
      // Reset to default settings logic would go here
      alert('Template reset to default settings');
    }
  };

  const currentSettings = settings[activeTemplate];
  const activeTemplateData = templates.find(t => t.id === activeTemplate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Templates</h2>
          <p className="text-gray-600 mt-1">
            Customize PDF templates for invoices, quotes, and delivery notes.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handlePreviewDownload}
            iconName="Download"
          >
            Download Preview
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Template</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeTemplate === template.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  template.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  template.color === 'green' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon name={template.icon} size={20} />
                </div>
                <span className="font-medium text-gray-900">{template.name}</span>
              </div>
              <p className="text-sm text-gray-600 text-left">
                {template.id === 'invoice' && 'Professional invoice template with payment terms'}
                {template.id === 'quote' && 'Quotation template with validity period'}
                {template.id === 'delivery' && 'Delivery note with signature section'}
              </p>
            </button>
          ))}
        </div>

        {/* Current Template Settings */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              {activeTemplateData?.name} Settings
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTemplateReset}
              iconName="RotateCcw"
            >
              Reset to Default
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Basic Settings</h5>
                <div className="space-y-4">
                  <Select
                    label="Layout Style"
                    options={templateLayouts}
                    value={currentSettings.layout}
                    onChange={(value) => handleSettingChange('layout', value)}
                  />

                  <Input
                    label="Header Text"
                    value={currentSettings.headerText}
                    onChange={(e) => handleSettingChange('headerText', e.target.value)}
                    placeholder="Enter header text"
                    error={errors.headerText}
                    required
                  />

                  <Textarea
                    label="Footer Text"
                    value={currentSettings.footerText}
                    onChange={(e) => handleSettingChange('footerText', e.target.value)}
                    placeholder="Enter footer text"
                    rows={2}
                    error={errors.footerText}
                    required
                  />

                  <Select
                    label="Font Size"
                    options={fontSizes}
                    value={currentSettings.fontSize}
                    onChange={(value) => handleSettingChange('fontSize', value)}
                  />
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Display Options</h5>
                <div className="space-y-3">
                  <Toggle
                    checked={currentSettings.showLogo}
                    onChange={(e) => handleSettingChange('showLogo', e.target.checked)}
                    label="Show Company Logo"
                  />

                  <Toggle
                    checked={currentSettings.showCompanyDetails}
                    onChange={(e) => handleSettingChange('showCompanyDetails', e.target.checked)}
                    label="Show Company Details"
                  />

                  {activeTemplate === 'invoice' && (
                    <Toggle
                      checked={currentSettings.showPaymentTerms}
                      onChange={(e) => handleSettingChange('showPaymentTerms', e.target.checked)}
                      label="Show Payment Terms"
                    />
                  )}

                  {activeTemplate === 'quote' && (
                    <Toggle
                      checked={currentSettings.showValidityPeriod}
                      onChange={(e) => handleSettingChange('showValidityPeriod', e.target.checked)}
                      label="Show Validity Period"
                    />
                  )}

                  {activeTemplate === 'delivery' && (
                    <Toggle
                      checked={currentSettings.showDeliveryInstructions}
                      onChange={(e) => handleSettingChange('showDeliveryInstructions', e.target.checked)}
                      label="Show Delivery Instructions"
                    />
                  )}

                  <Toggle
                    checked={currentSettings.showNotes}
                    onChange={(e) => handleSettingChange('showNotes', e.target.checked)}
                    label="Show Notes Section"
                  />

                  <Toggle
                    checked={currentSettings.showSignature}
                    onChange={(e) => handleSettingChange('showSignature', e.target.checked)}
                    label="Show Signature Section"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Colors</h5>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary Color"
                    value={currentSettings.primaryColor}
                    onChange={(color) => handleSettingChange('primaryColor', color)}
                  />

                  <ColorPicker
                    label="Secondary Color"
                    value={currentSettings.secondaryColor}
                    onChange={(color) => handleSettingChange('secondaryColor', color)}
                  />
                </div>
              </div>

              {/* Template-specific Settings */}
              {activeTemplate === 'invoice' && currentSettings.showPaymentTerms && (
                <Textarea
                  label="Payment Terms"
                  value={currentSettings.paymentTerms}
                  onChange={(e) => handleSettingChange('paymentTerms', e.target.value)}
                  placeholder="Enter payment terms"
                  rows={2}
                />
              )}

              {activeTemplate === 'quote' && currentSettings.showValidityPeriod && (
                <Input
                  label="Validity Period"
                  value={currentSettings.validityPeriod}
                  onChange={(e) => handleSettingChange('validityPeriod', e.target.value)}
                  placeholder="e.g., 30 days"
                />
              )}

              {activeTemplate === 'delivery' && currentSettings.showDeliveryInstructions && (
                <Textarea
                  label="Delivery Instructions"
                  value={currentSettings.deliveryInstructions}
                  onChange={(e) => handleSettingChange('deliveryInstructions', e.target.value)}
                  placeholder="Enter delivery instructions"
                  rows={2}
                />
              )}

              {currentSettings.showNotes && (
                <Textarea
                  label="Notes Text"
                  value={currentSettings.notesText}
                  onChange={(e) => handleSettingChange('notesText', e.target.value)}
                  placeholder="Enter notes text"
                  rows={2}
                />
              )}

              {/* Watermark Settings */}
              <div>
                <Toggle
                  checked={currentSettings.showWatermark}
                  onChange={(e) => handleSettingChange('showWatermark', e.target.checked)}
                  label="Show Watermark"
                  description="Add a watermark to the document"
                />

                {currentSettings.showWatermark && (
                  <Input
                    label="Watermark Text"
                    value={currentSettings.watermark}
                    onChange={(e) => handleSettingChange('watermark', e.target.value)}
                    placeholder="Enter watermark text"
                    className="mt-3"
                  />
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900">Preview</h5>
                <Select
                  options={previewModes}
                  value={previewMode}
                  onChange={(value) => setPreviewMode(value)}
                  className="w-40"
                />
              </div>

              <div className={`border border-gray-300 rounded-lg bg-white overflow-hidden ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' :
                previewMode === 'print' ? 'shadow-lg' : ''
              }`}>
                {/* Mock Document Preview */}
                <div className="p-6 space-y-4" style={{
                  color: currentSettings.secondaryColor,
                  fontSize: currentSettings.fontSize === 'small' ? '10px' :
                           currentSettings.fontSize === 'large' ? '14px' : '12px'
                }}>
                  {/* Header */}
                  <div className="text-center border-b pb-4" style={{ borderColor: currentSettings.primaryColor }}>
                    {currentSettings.showLogo && (
                      <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                        <Icon name="Image" size={24} className="text-gray-400" />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold" style={{ color: currentSettings.primaryColor }}>
                      {currentSettings.headerText}
                    </h1>
                    {currentSettings.showCompanyDetails && (
                      <div className="text-sm mt-2">
                        <p>MoveEase Pro</p>
                        <p>123 Business Street, Nairobi</p>
                        <p>+254 700 123 456</p>
                      </div>
                    )}
                  </div>

                  {/* Document Number and Date */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <p><strong>{activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} #:</strong> 001</p>
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><strong>Customer:</strong> John Doe</p>
                      <p><strong>Address:</strong> 456 Client Ave</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border rounded">
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: currentSettings.primaryColor, color: 'white' }}>
                        <tr>
                          <th className="p-2 text-left">Item</th>
                          <th className="p-2 text-right">Qty</th>
                          <th className="p-2 text-right">Price</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">Moving Service</td>
                          <td className="p-2 text-right">1</td>
                          <td className="p-2 text-right">KSh 50,000</td>
                          <td className="p-2 text-right">KSh 50,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: currentSettings.primaryColor }}>
                      Total: KSh 50,000
                    </p>
                  </div>

                  {/* Template-specific sections */}
                  {activeTemplate === 'invoice' && currentSettings.showPaymentTerms && (
                    <div className="text-sm">
                      <strong>Payment Terms:</strong> {currentSettings.paymentTerms}
                    </div>
                  )}

                  {activeTemplate === 'quote' && currentSettings.showValidityPeriod && (
                    <div className="text-sm">
                      <strong>Valid for:</strong> {currentSettings.validityPeriod}
                    </div>
                  )}

                  {activeTemplate === 'delivery' && currentSettings.showDeliveryInstructions && (
                    <div className="text-sm">
                      <strong>Delivery Instructions:</strong> {currentSettings.deliveryInstructions}
                    </div>
                  )}

                  {/* Notes */}
                  {currentSettings.showNotes && (
                    <div className="text-sm">
                      <strong>Notes:</strong> {currentSettings.notesText}
                    </div>
                  )}

                  {/* Signature */}
                  {currentSettings.showSignature && (
                    <div className="flex justify-between mt-8">
                      <div className="text-center">
                        <div className="border-t border-gray-400 w-32 mb-1"></div>
                        <p className="text-xs">Customer Signature</p>
                      </div>
                      <div className="text-center">
                        <div className="border-t border-gray-400 w-32 mb-1"></div>
                        <p className="text-xs">Company Representative</p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center text-sm border-t pt-4 mt-4" style={{ borderColor: currentSettings.primaryColor }}>
                    {currentSettings.footerText}
                  </div>

                  {/* Watermark */}
                  {currentSettings.showWatermark && currentSettings.watermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="text-6xl font-bold opacity-10 transform rotate-45"
                        style={{ color: currentSettings.primaryColor }}
                      >
                        {currentSettings.watermark}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplatesSettings;
