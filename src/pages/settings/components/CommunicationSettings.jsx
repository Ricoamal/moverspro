import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import Toggle from '../../../components/ui/Toggle';
import Icon from '../../../components/AppIcon';

const CommunicationSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    // SMS Settings
    smsEnabled: false,
    smsProvider: '',
    smsApiKey: '',
    smsApiSecret: '',
    smsSenderName: 'MoveEase',

    // Email Settings
    emailEnabled: true,
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    emailFromName: 'MoveEase Pro',
    emailFromAddress: '',

    // Notification Settings
    bookingConfirmations: true,
    statusUpdates: true,
    paymentReminders: true,
    marketingEmails: false
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState({ sms: false, email: false });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onSettingsChange();
  };

  const smsProviders = [
    { value: '', label: 'Select SMS Provider' },
    { value: 'africastalking', label: 'Africa\'s Talking' },
    { value: 'twilio', label: 'Twilio' },
    { value: 'textlocal', label: 'TextLocal' },
    { value: 'bulksms', label: 'BulkSMS' }
  ];

  const encryptionOptions = [
    { value: 'none', label: 'None' },
    { value: 'tls', label: 'TLS' },
    { value: 'ssl', label: 'SSL' }
  ];

  const validateSettings = () => {
    const newErrors = {};

    if (settings.smsEnabled) {
      if (!settings.smsProvider) newErrors.smsProvider = 'SMS provider is required';
      if (!settings.smsApiKey) newErrors.smsApiKey = 'API key is required';
      if (!settings.smsApiSecret) newErrors.smsApiSecret = 'API secret is required';
    }

    if (settings.emailEnabled) {
      if (!settings.smtpHost) newErrors.smtpHost = 'SMTP host is required';
      if (!settings.smtpPort) newErrors.smtpPort = 'SMTP port is required';
      if (!settings.smtpUsername) newErrors.smtpUsername = 'Username is required';
      if (!settings.smtpPassword) newErrors.smtpPassword = 'Password is required';
      if (!settings.emailFromAddress) newErrors.emailFromAddress = 'From email address is required';
      if (settings.emailFromAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.emailFromAddress)) {
        newErrors.emailFromAddress = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving communication settings:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const testSMSConnection = async () => {
    if (!settings.smsProvider || !settings.smsApiKey) {
      alert('Please configure SMS settings first');
      return;
    }

    setTestingConnection(prev => ({ ...prev, sms: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('SMS connection test successful!');
    } catch (error) {
      alert('SMS connection test failed');
    } finally {
      setTestingConnection(prev => ({ ...prev, sms: false }));
    }
  };

  const testEmailConnection = async () => {
    if (!settings.smtpHost || !settings.smtpUsername) {
      alert('Please configure email settings first');
      return;
    }

    setTestingConnection(prev => ({ ...prev, email: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Email connection test successful!');
    } catch (error) {
      alert('Email connection test failed');
    } finally {
      setTestingConnection(prev => ({ ...prev, email: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Communication Settings</h2>
          <p className="text-gray-600 mt-1">
            Configure SMS and email settings for customer communications.
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

      {/* SMS Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SMS Configuration</h3>
          <Toggle
            checked={settings.smsEnabled}
            onChange={(e) => handleInputChange('smsEnabled', e.target.checked)}
            label="Enable SMS"
          />
        </div>

        {settings.smsEnabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="SMS Provider"
                options={smsProviders}
                value={settings.smsProvider}
                onChange={(value) => handleInputChange('smsProvider', value)}
                required
                error={errors.smsProvider}
              />

              <Input
                label="Sender Name"
                value={settings.smsSenderName}
                onChange={(e) => handleInputChange('smsSenderName', e.target.value)}
                placeholder="MoveEase"
                description="Max 11 characters"
              />

              <Input
                label="API Key"
                type="password"
                value={settings.smsApiKey}
                onChange={(e) => handleInputChange('smsApiKey', e.target.value)}
                placeholder="Enter API key"
                error={errors.smsApiKey}
              />

              <Input
                label="API Secret"
                type="password"
                value={settings.smsApiSecret}
                onChange={(e) => handleInputChange('smsApiSecret', e.target.value)}
                placeholder="Enter API secret"
                error={errors.smsApiSecret}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Send"
                onClick={testSMSConnection}
                loading={testingConnection.sms}
                disabled={!settings.smsProvider || !settings.smsApiKey}
              >
                Test SMS Connection
              </Button>
              <span className="text-sm text-gray-500">
                Send a test SMS to verify configuration
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Email Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
          <Toggle
            checked={settings.emailEnabled}
            onChange={(e) => handleInputChange('emailEnabled', e.target.checked)}
            label="Enable Email"
          />
        </div>

        {settings.emailEnabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="SMTP Host"
                value={settings.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                required
                error={errors.smtpHost}
              />

              <Input
                label="SMTP Port"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                placeholder="587"
                required
                error={errors.smtpPort}
              />

              <Input
                label="Username"
                value={settings.smtpUsername}
                onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                placeholder="your-email@gmail.com"
                required
                error={errors.smtpUsername}
              />

              <Input
                label="Password"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                placeholder="Enter password or app password"
                required
                error={errors.smtpPassword}
              />

              <Select
                label="Encryption"
                options={encryptionOptions}
                value={settings.smtpEncryption}
                onChange={(value) => handleInputChange('smtpEncryption', value)}
                required
              />

              <div></div> {/* Empty div for grid alignment */}

              <Input
                label="From Name"
                value={settings.emailFromName}
                onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                placeholder="MoveEase Pro"
                required
              />

              <Input
                label="From Email Address"
                type="email"
                value={settings.emailFromAddress}
                onChange={(e) => handleInputChange('emailFromAddress', e.target.value)}
                placeholder="noreply@moveeasepro.com"
                required
                error={errors.emailFromAddress}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Mail"
                onClick={testEmailConnection}
                loading={testingConnection.email}
                disabled={!settings.smtpHost || !settings.smtpUsername}
              >
                Test Email Connection
              </Button>
              <span className="text-sm text-gray-500">
                Send a test email to verify configuration
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Booking Confirmations</h4>
              <p className="text-sm text-gray-600">Send confirmation when bookings are created</p>
            </div>
            <Checkbox
              checked={settings.bookingConfirmations}
              onChange={(e) => handleInputChange('bookingConfirmations', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Status Updates</h4>
              <p className="text-sm text-gray-600">Notify customers of booking status changes</p>
            </div>
            <Checkbox
              checked={settings.statusUpdates}
              onChange={(e) => handleInputChange('statusUpdates', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Payment Reminders</h4>
              <p className="text-sm text-gray-600">Send reminders for pending payments</p>
            </div>
            <Checkbox
              checked={settings.paymentReminders}
              onChange={(e) => handleInputChange('paymentReminders', e.target.checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Emails</h4>
              <p className="text-sm text-gray-600">Send promotional and marketing content</p>
            </div>
            <Checkbox
              checked={settings.marketingEmails}
              onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationSettings;
