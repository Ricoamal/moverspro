import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import FileUpload from '../../../components/ui/FileUpload';
import ColorPicker from '../../../components/ui/ColorPicker';
import Icon from '../../../components/AppIcon';

const CompanyBrandingSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    companyName: 'MoveEase Pro',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    registrationNumber: '',
    licenseNumber: '',
    primaryColor: '#1E40AF',
    secondaryColor: '#64748B',
    accentColor: '#F59E0B'
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onSettingsChange();
  };

  const handleLogoSelect = (file) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    onSettingsChange();
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview(null);
    onSettingsChange();
  };

  const colorPresets = [
    { name: 'Blue', primary: '#1E40AF', secondary: '#64748B', accent: '#F59E0B' },
    { name: 'Green', primary: '#059669', secondary: '#64748B', accent: '#F59E0B' },
    { name: 'Purple', primary: '#7C3AED', secondary: '#64748B', accent: '#F59E0B' },
    { name: 'Red', primary: '#DC2626', secondary: '#64748B', accent: '#F59E0B' },
    { name: 'Orange', primary: '#EA580C', secondary: '#64748B', accent: '#F59E0B' }
  ];

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (settings.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }

    if (settings.companyWebsite && !/^https?:\/\/.+/.test(settings.companyWebsite)) {
      newErrors.companyWebsite = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving company branding settings:', { settings, logoFile });
      // Here you would typically make an API call to save the settings
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Company Branding & Identity</h2>
          <p className="text-gray-600 mt-1">
            Manage your company logo, details, and brand colors across the application.
          </p>
        </div>
        <Button
          onClick={handleSave}
          loading={isSaving}
          iconName="Save"
        >
          Save Changes
        </Button>
      </div>

      {/* Company Logo Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Logo</h3>

        <FileUpload
          label="Upload Company Logo"
          accept="image/*"
          maxSize={2 * 1024 * 1024} // 2MB
          onFileSelect={handleLogoSelect}
          onFileRemove={handleLogoRemove}
          description="Recommended: PNG or SVG format, max 2MB, 200x200px minimum"
        />
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={settings.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter company name"
            required
            error={errors.companyName}
          />

          <Input
            label="Registration Number"
            value={settings.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            placeholder="Company registration number"
          />

          <Input
            label="License Number"
            value={settings.licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            placeholder="Business license number"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={settings.companyPhone}
            onChange={(e) => handleInputChange('companyPhone', e.target.value)}
            placeholder="+254 700 123 456"
          />

          <Input
            label="Email Address"
            type="email"
            value={settings.companyEmail}
            onChange={(e) => handleInputChange('companyEmail', e.target.value)}
            placeholder="info@company.com"
            error={errors.companyEmail}
          />

          <Input
            label="Website"
            type="url"
            value={settings.companyWebsite}
            onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
            placeholder="https://www.company.com"
            error={errors.companyWebsite}
          />
        </div>
        
        <div className="mt-6">
          <Textarea
            label="Company Address"
            value={settings.companyAddress}
            onChange={(e) => handleInputChange('companyAddress', e.target.value)}
            placeholder="Enter complete company address"
            rows={3}
          />
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
        
        {/* Color Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Color Presets
          </label>
          <div className="flex flex-wrap gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  handleInputChange('primaryColor', preset.primary);
                  handleInputChange('secondaryColor', preset.secondary);
                  handleInputChange('accentColor', preset.accent);
                }}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <span className="text-sm">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ColorPicker
            label="Primary Color"
            value={settings.primaryColor}
            onChange={(color) => handleInputChange('primaryColor', color)}
            presets={colorPresets.map(p => p.primary)}
          />

          <ColorPicker
            label="Secondary Color"
            value={settings.secondaryColor}
            onChange={(color) => handleInputChange('secondaryColor', color)}
            presets={colorPresets.map(p => p.secondary)}
          />

          <ColorPicker
            label="Accent Color"
            value={settings.accentColor}
            onChange={(color) => handleInputChange('accentColor', color)}
            presets={colorPresets.map(p => p.accent)}
          />
        </div>

        {/* Color Preview */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="flex items-center space-x-4">
            <div 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: settings.primaryColor }}
            >
              Primary Button
            </div>
            <div 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: settings.secondaryColor }}
            >
              Secondary Button
            </div>
            <div 
              className="px-4 py-2 rounded text-white text-sm font-medium"
              style={{ backgroundColor: settings.accentColor }}
            >
              Accent Button
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBrandingSettings;
