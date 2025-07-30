import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocalizationSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    // Regional Settings
    country: 'KE',
    language: 'en-US',
    timezone: 'Africa/Nairobi',

    // Currency Settings
    baseCurrency: 'KES',
    supportedCurrencies: ['KES', 'USD', 'EUR'],
    enableMultiCurrency: true,
    currencyDisplayFormat: 'symbol', // symbol, code, name

    // Date & Time Settings
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    firstDayOfWeek: 'monday',

    // Number & Currency Formatting
    numberFormat: 'en-US', // affects decimal separators, thousands separators
    currencyPosition: 'before', // before, after

    // Tax & Compliance
    etims: {
      enabled: false,
      pinNumber: '',
      serialNumber: '',
      environment: 'sandbox'
    },

    // Localization Features
    enableRTL: false,
    enableTranslations: false,
    defaultLocale: 'en-KE'
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [detectedTimezone, setDetectedTimezone] = useState('');

  // Auto-detect timezone on component mount
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setDetectedTimezone(timezone);
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
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

  const handleEtimsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      etims: {
        ...prev.etims,
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!settings.country) newErrors.country = 'Country is required';
    if (!settings.language) newErrors.language = 'Language is required';
    if (!settings.timezone) newErrors.timezone = 'Timezone is required';
    if (!settings.baseCurrency) newErrors.baseCurrency = 'Base currency is required';

    if (settings.etims.enabled) {
      if (!settings.etims.pinNumber) newErrors.etimsPinNumber = 'PIN number is required';
      if (!settings.etims.serialNumber) newErrors.etimsSerialNumber = 'Serial number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving localization settings:', settings);
      alert('Localization settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const detectTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    handleInputChange('timezone', timezone);
  };

  const countries = [
    { value: 'KE', label: '🇰🇪 Kenya' },
    { value: 'UG', label: '🇺🇬 Uganda' },
    { value: 'TZ', label: '🇹🇿 Tanzania' },
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'GB', label: '🇬🇧 United Kingdom' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'ZA', label: '🇿🇦 South Africa' },
    { value: 'NG', label: '🇳🇬 Nigeria' },
    { value: 'GH', label: '🇬🇭 Ghana' }
  ];

  const currencies = [
    { value: 'KES', label: 'Kenyan Shilling (KES) - KSh' },
    { value: 'USD', label: 'US Dollar (USD) - $' },
    { value: 'EUR', label: 'Euro (EUR) - €' },
    { value: 'GBP', label: 'British Pound (GBP) - £' },
    { value: 'UGX', label: 'Ugandan Shilling (UGX) - USh' },
    { value: 'TZS', label: 'Tanzanian Shilling (TZS) - TSh' },
    { value: 'ZAR', label: 'South African Rand (ZAR) - R' },
    { value: 'NGN', label: 'Nigerian Naira (NGN) - ₦' },
    { value: 'GHS', label: 'Ghanaian Cedi (GHS) - ₵' },
    { value: 'CAD', label: 'Canadian Dollar (CAD) - C$' },
    { value: 'AUD', label: 'Australian Dollar (AUD) - A$' }
  ];

  const languages = [
    { value: 'en-US', label: 'English (United States)' },
    { value: 'en-GB', label: 'English (United Kingdom)' },
    { value: 'en-KE', label: 'English (Kenya)' },
    { value: 'sw-KE', label: 'Swahili (Kenya)' },
    { value: 'fr-FR', label: 'French (France)' },
    { value: 'es-ES', label: 'Spanish (Spain)' },
    { value: 'pt-PT', label: 'Portuguese (Portugal)' },
    { value: 'ar-SA', label: 'Arabic (Saudi Arabia)' }
  ];

  const timezones = [
    { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT +3)' },
    { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT +1)' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo (EET +2)' },
    { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST +2)' },
    { value: 'America/New_York', label: 'America/New_York (EST -5)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST -8)' },
    { value: 'Europe/London', label: 'Europe/London (GMT +0)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (CET +1)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST +9)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT +11)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2024)' },
    { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (Dec 31, 2024)' }
  ];

  const timeFormats = [
    { value: '12h', label: '12-hour (2:30 PM)' },
    { value: '24h', label: '24-hour (14:30)' }
  ];

  const firstDayOptions = [
    { value: 'sunday', label: 'Sunday' },
    { value: 'monday', label: 'Monday' }
  ];

  const currencyDisplayFormats = [
    { value: 'symbol', label: 'Symbol ($, €, £)' },
    { value: 'code', label: 'Code (USD, EUR, GBP)' },
    { value: 'name', label: 'Name (Dollar, Euro, Pound)' }
  ];

  const currencyPositions = [
    { value: 'before', label: 'Before amount ($100)' },
    { value: 'after', label: 'After amount (100$)' }
  ];

  const numberFormats = [
    { value: 'en-US', label: 'US Format (1,234.56)' },
    { value: 'en-GB', label: 'UK Format (1,234.56)' },
    { value: 'de-DE', label: 'German Format (1.234,56)' },
    { value: 'fr-FR', label: 'French Format (1 234,56)' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Localization & Regional Settings</h2>
          <p className="text-gray-600 mt-1">
            Configure regional settings, currency, language, and tax compliance.
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

      {/* Regional Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Country"
            options={countries}
            value={settings.country}
            onChange={(value) => handleInputChange('country', value)}
            error={errors.country}
            required
          />

          <Select
            label="Language"
            options={languages}
            value={settings.language}
            onChange={(value) => handleInputChange('language', value)}
            error={errors.language}
            required
          />

          <div>
            <Select
              label="Timezone"
              options={timezones}
              value={settings.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
              error={errors.timezone}
              required
            />
            {detectedTimezone && detectedTimezone !== settings.timezone && (
              <div className="mt-2 flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-blue-500" />
                <span className="text-sm text-gray-600">
                  Detected: {detectedTimezone}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={detectTimezone}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Use Detected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Settings</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Base Currency"
              options={currencies}
              value={settings.baseCurrency}
              onChange={(value) => handleInputChange('baseCurrency', value)}
              error={errors.baseCurrency}
              required
            />

            <Select
              label="Currency Display Format"
              options={currencyDisplayFormats}
              value={settings.currencyDisplayFormat}
              onChange={(value) => handleInputChange('currencyDisplayFormat', value)}
            />

            <Select
              label="Currency Position"
              options={currencyPositions}
              value={settings.currencyPosition}
              onChange={(value) => handleInputChange('currencyPosition', value)}
            />

            <Select
              label="Number Format"
              options={numberFormats}
              value={settings.numberFormat}
              onChange={(value) => handleInputChange('numberFormat', value)}
            />
          </div>

          <div>
            <Toggle
              checked={settings.enableMultiCurrency}
              onChange={(e) => handleInputChange('enableMultiCurrency', e.target.checked)}
              label="Enable Multi-Currency Support"
              description="Allow customers to view prices in different currencies"
            />
          </div>

          {settings.enableMultiCurrency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supported Currencies
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currencies.slice(0, 8).map((currency) => (
                  <label key={currency.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.supportedCurrencies.includes(currency.value)}
                      onChange={(e) => {
                        const newCurrencies = e.target.checked
                          ? [...settings.supportedCurrencies, currency.value]
                          : settings.supportedCurrencies.filter(c => c !== currency.value);
                        handleInputChange('supportedCurrencies', newCurrencies);
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{currency.value}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date & Time Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Date Format"
            options={dateFormats}
            value={settings.dateFormat}
            onChange={(value) => handleInputChange('dateFormat', value)}
          />

          <Select
            label="Time Format"
            options={timeFormats}
            value={settings.timeFormat}
            onChange={(value) => handleInputChange('timeFormat', value)}
          />

          <Select
            label="First Day of Week"
            options={firstDayOptions}
            value={settings.firstDayOfWeek}
            onChange={(value) => handleInputChange('firstDayOfWeek', value)}
          />
        </div>
      </div>

      {/* Localization Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Localization Features</h3>

        <div className="space-y-4">
          <Toggle
            checked={settings.enableRTL}
            onChange={(e) => handleInputChange('enableRTL', e.target.checked)}
            label="Enable Right-to-Left (RTL) Support"
            description="Support for Arabic, Hebrew, and other RTL languages"
          />

          <Toggle
            checked={settings.enableTranslations}
            onChange={(e) => handleInputChange('enableTranslations', e.target.checked)}
            label="Enable Multi-Language Translations"
            description="Allow interface translation to multiple languages"
          />

          {settings.enableTranslations && (
            <Input
              label="Default Locale"
              value={settings.defaultLocale}
              onChange={(e) => handleInputChange('defaultLocale', e.target.value)}
              placeholder="en-KE"
              description="Default locale code for translations"
            />
          )}
        </div>
      </div>

      {/* eTIMS Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">eTIMS Configuration</h3>
            <p className="text-sm text-gray-600 mt-1">
              Electronic Tax Invoice Management System for Kenya Revenue Authority
            </p>
          </div>
          <Toggle
            checked={settings.etims.enabled}
            onChange={(e) => handleEtimsChange('enabled', e.target.checked)}
            label="Enable eTIMS"
          />
        </div>

        {settings.etims.enabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="PIN Number"
                value={settings.etims.pinNumber}
                onChange={(e) => handleEtimsChange('pinNumber', e.target.value)}
                placeholder="Enter KRA PIN"
                error={errors.etimsPinNumber}
                required
              />

              <Input
                label="Serial Number"
                value={settings.etims.serialNumber}
                onChange={(e) => handleEtimsChange('serialNumber', e.target.value)}
                placeholder="Enter device serial number"
                error={errors.etimsSerialNumber}
                required
              />

              <Select
                label="Environment"
                options={[
                  { value: 'sandbox', label: 'Sandbox (Testing)' },
                  { value: 'production', label: 'Production (Live)' }
                ]}
                value={settings.etims.environment}
                onChange={(value) => handleEtimsChange('environment', value)}
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Ensure you have proper authorization from KRA before enabling eTIMS in production.
                    Test thoroughly in sandbox environment first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalizationSettings;
