import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import Icon from '../../../components/AppIcon';

const ThirdPartyIntegrationsSettings = ({ onSettingsChange }) => {
  const [integrations, setIntegrations] = useState({
    googleCalendar: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      scopes: ['calendar.readonly', 'calendar.events'],
      connected: false,
      lastSync: null,
      autoSync: true,
      syncInterval: '15' // minutes
    },
    googleMaps: {
      enabled: true,
      apiKey: '',
      connected: false,
      enabledAPIs: ['maps', 'places', 'directions', 'geocoding'],
      restrictions: {
        domains: '',
        ips: '',
        androidApps: '',
        iosApps: ''
      },
      mapStyle: 'default',
      defaultZoom: 10
    },
    googleDrive: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      scopes: ['drive.file', 'drive.readonly'],
      connected: false,
      folderStructure: 'organized', // organized, flat
      autoUpload: true,
      fileRetention: '365', // days
      allowedFileTypes: ['pdf', 'jpg', 'png', 'mp4', 'mov']
    },
    slack: {
      enabled: false,
      webhookUrl: '',
      botToken: '',
      channel: '#general',
      connected: false,
      notifications: {
        newBookings: true,
        paymentReceived: true,
        moveCompleted: true
      }
    },
    zapier: {
      enabled: false,
      webhookUrl: '',
      apiKey: '',
      connected: false,
      triggers: ['booking_created', 'payment_received', 'move_completed']
    },
    mailchimp: {
      enabled: false,
      apiKey: '',
      serverPrefix: '',
      listId: '',
      connected: false,
      autoSubscribe: true,
      doubleOptIn: true
    }
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState({});
  const [activeIntegration, setActiveIntegration] = useState('googleCalendar');

  const integrationsList = [
    {
      id: 'googleCalendar',
      name: 'Google Calendar',
      icon: 'Calendar',
      color: 'blue',
      description: 'Schedule and manage appointments',
      category: 'Google Services'
    },
    {
      id: 'googleMaps',
      name: 'Google Maps',
      icon: 'MapPin',
      color: 'red',
      description: 'Location services and route optimization',
      category: 'Google Services'
    },
    {
      id: 'googleDrive',
      name: 'Google Drive',
      icon: 'HardDrive',
      color: 'green',
      description: 'File storage and sharing',
      category: 'Google Services'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: 'MessageSquare',
      color: 'purple',
      description: 'Team communication and notifications',
      category: 'Communication'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: 'Zap',
      color: 'orange',
      description: 'Workflow automation',
      category: 'Automation'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      icon: 'Mail',
      color: 'yellow',
      description: 'Email marketing and newsletters',
      category: 'Marketing'
    }
  ];

  const handleToggle = (integration, enabled) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        enabled
      }
    }));
    onSettingsChange();
  };

  const handleInputChange = (integration, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [field]: value
      }
    }));
    onSettingsChange();

    // Clear error when user makes changes
    const errorKey = `${integration}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const handleNestedChange = (integration, section, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [section]: {
          ...prev[integration][section],
          [field]: value
        }
      }
    }));
    onSettingsChange();
  };

  const handleArrayChange = (integration, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [field]: value.split(',').map(item => item.trim()).filter(Boolean)
      }
    }));
    onSettingsChange();
  };

  const validateIntegration = (integrationId) => {
    const integration = integrations[integrationId];
    const newErrors = {};

    if (!integration.enabled) return true;

    // Common validations
    if (integration.clientId !== undefined && !integration.clientId.trim()) {
      newErrors[`${integrationId}_clientId`] = 'Client ID is required';
    }
    if (integration.clientSecret !== undefined && !integration.clientSecret.trim()) {
      newErrors[`${integrationId}_clientSecret`] = 'Client secret is required';
    }
    if (integration.apiKey !== undefined && !integration.apiKey.trim()) {
      newErrors[`${integrationId}_apiKey`] = 'API key is required';
    }

    // Integration-specific validations
    if (integrationId === 'slack' && !integration.webhookUrl.trim()) {
      newErrors[`${integrationId}_webhookUrl`] = 'Webhook URL is required';
    }

    if (integrationId === 'mailchimp') {
      if (!integration.serverPrefix.trim()) {
        newErrors[`${integrationId}_serverPrefix`] = 'Server prefix is required';
      }
      if (!integration.listId.trim()) {
        newErrors[`${integrationId}_listId`] = 'List ID is required';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const enabledIntegrations = Object.keys(integrations).filter(id => integrations[id].enabled);
    let allValid = true;

    for (const integrationId of enabledIntegrations) {
      if (!validateIntegration(integrationId)) {
        allValid = false;
      }
    }

    if (!allValid) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving third-party integration settings:', integrations);
      alert('Third-party integration settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const connectIntegration = async (integration) => {
    if (!validateIntegration(integration)) {
      alert('Please fix configuration errors before connecting');
      return;
    }

    setTestingConnection(prev => ({ ...prev, [integration]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          connected: true,
          lastSync: new Date().toISOString()
        }
      }));
      alert(`${integrationsList.find(i => i.id === integration)?.name} connected successfully!`);
    } catch (error) {
      alert(`Failed to connect ${integrationsList.find(i => i.id === integration)?.name}`);
    } finally {
      setTestingConnection(prev => ({ ...prev, [integration]: false }));
    }
  };

  const disconnectIntegration = (integration) => {
    if (confirm(`Are you sure you want to disconnect ${integrationsList.find(i => i.id === integration)?.name}?`)) {
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          connected: false,
          lastSync: null
        }
      }));
    }
  };

  const syncIntegration = async (integration) => {
    setTestingConnection(prev => ({ ...prev, [`${integration}_sync`]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          lastSync: new Date().toISOString()
        }
      }));
      alert(`${integrationsList.find(i => i.id === integration)?.name} synced successfully!`);
    } catch (error) {
      alert(`Failed to sync ${integrationsList.find(i => i.id === integration)?.name}`);
    } finally {
      setTestingConnection(prev => ({ ...prev, [`${integration}_sync`]: false }));
    }
  };

  const currentIntegration = integrations[activeIntegration];
  const currentIntegrationData = integrationsList.find(i => i.id === activeIntegration);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Third-Party Integrations</h2>
          <p className="text-gray-600 mt-1">
            Configure Google APIs and other third-party service integrations.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Integrations List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Integrations</h3>

          {/* Group by category */}
          {['Google Services', 'Communication', 'Automation', 'Marketing'].map(category => {
            const categoryIntegrations = integrationsList.filter(i => i.category === category);
            if (categoryIntegrations.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
                <div className="space-y-2">
                  {categoryIntegrations.map((integration) => (
                    <div
                      key={integration.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        activeIntegration === integration.id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveIntegration(integration.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            integration.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            integration.color === 'red' ? 'bg-red-100 text-red-600' :
                            integration.color === 'green' ? 'bg-green-100 text-green-600' :
                            integration.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            integration.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                            integration.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon name={integration.icon} size={16} />
                          </div>
                          <div>
                            <span className="font-medium text-sm">{integration.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              {integrations[integration.id].enabled && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                                  Enabled
                                </span>
                              )}
                              {integrations[integration.id].connected && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                                  Connected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Toggle
                          checked={integrations[integration.id].enabled}
                          onChange={(e) => handleToggle(integration.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {currentIntegration.enabled ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentIntegrationData?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    currentIntegrationData?.color === 'red' ? 'bg-red-100 text-red-600' :
                    currentIntegrationData?.color === 'green' ? 'bg-green-100 text-green-600' :
                    currentIntegrationData?.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    currentIntegrationData?.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    currentIntegrationData?.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon name={currentIntegrationData?.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {currentIntegrationData?.name} Configuration
                    </h3>
                    <p className="text-sm text-gray-600">{currentIntegrationData?.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {currentIntegration.connected && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Icon name="CheckCircle" size={16} className="mr-1" />
                      Connected
                    </div>
                  )}

                  {currentIntegration.connected ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RefreshCw"
                        onClick={() => syncIntegration(activeIntegration)}
                        loading={testingConnection[`${activeIntegration}_sync`]}
                      >
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Unlink"
                        onClick={() => disconnectIntegration(activeIntegration)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      iconName="Link"
                      onClick={() => connectIntegration(activeIntegration)}
                      loading={testingConnection[activeIntegration]}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Google Calendar Configuration */}
              {activeIntegration === 'googleCalendar' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Client ID"
                      value={currentIntegration.clientId}
                      onChange={(e) => handleInputChange('googleCalendar', 'clientId', e.target.value)}
                      placeholder="Enter Google Calendar Client ID"
                      error={errors.googleCalendar_clientId}
                      required
                    />
                    <Input
                      label="Client Secret"
                      type="password"
                      value={currentIntegration.clientSecret}
                      onChange={(e) => handleInputChange('googleCalendar', 'clientSecret', e.target.value)}
                      placeholder="Enter Client Secret"
                      error={errors.googleCalendar_clientSecret}
                      required
                    />
                    <Input
                      label="Redirect URI"
                      value={currentIntegration.redirectUri}
                      onChange={(e) => handleInputChange('googleCalendar', 'redirectUri', e.target.value)}
                      placeholder="https://yourdomain.com/auth/callback"
                      description="OAuth redirect URI"
                    />
                    <Select
                      label="Sync Interval"
                      options={[
                        { value: '5', label: '5 minutes' },
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' }
                      ]}
                      value={currentIntegration.syncInterval}
                      onChange={(value) => handleInputChange('googleCalendar', 'syncInterval', value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calendar Scopes
                    </label>
                    <div className="space-y-2">
                      {['calendar.readonly', 'calendar.events', 'calendar.events.readonly'].map(scope => (
                        <label key={scope} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentIntegration.scopes.includes(scope)}
                            onChange={(e) => {
                              const newScopes = e.target.checked
                                ? [...currentIntegration.scopes, scope]
                                : currentIntegration.scopes.filter(s => s !== scope);
                              handleInputChange('googleCalendar', 'scopes', newScopes);
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{scope}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Toggle
                    checked={currentIntegration.autoSync}
                    onChange={(e) => handleInputChange('googleCalendar', 'autoSync', e.target.checked)}
                    label="Auto Sync"
                    description="Automatically sync calendar events"
                  />

                  {currentIntegration.lastSync && (
                    <div className="text-sm text-gray-600">
                      Last synced: {new Date(currentIntegration.lastSync).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Google Maps Configuration */}
              {activeIntegration === 'googleMaps' && (
                <div className="space-y-6">
                  <Input
                    label="API Key"
                    type="password"
                    value={currentIntegration.apiKey}
                    onChange={(e) => handleInputChange('googleMaps', 'apiKey', e.target.value)}
                    placeholder="Enter Google Maps API Key"
                    error={errors.googleMaps_apiKey}
                    required
                    description="Enable Maps JavaScript API, Places API, and Directions API"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enabled APIs
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['maps', 'places', 'directions', 'geocoding', 'distance_matrix', 'elevation'].map(api => (
                        <label key={api} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentIntegration.enabledAPIs.includes(api)}
                            onChange={(e) => {
                              const newAPIs = e.target.checked
                                ? [...currentIntegration.enabledAPIs, api]
                                : currentIntegration.enabledAPIs.filter(a => a !== api);
                              handleInputChange('googleMaps', 'enabledAPIs', newAPIs);
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm capitalize">{api.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Map Style"
                      options={[
                        { value: 'default', label: 'Default' },
                        { value: 'satellite', label: 'Satellite' },
                        { value: 'terrain', label: 'Terrain' },
                        { value: 'hybrid', label: 'Hybrid' }
                      ]}
                      value={currentIntegration.mapStyle}
                      onChange={(value) => handleInputChange('googleMaps', 'mapStyle', value)}
                    />

                    <Input
                      label="Default Zoom Level"
                      type="number"
                      min="1"
                      max="20"
                      value={currentIntegration.defaultZoom}
                      onChange={(e) => handleInputChange('googleMaps', 'defaultZoom', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">API Restrictions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Allowed Domains"
                        value={currentIntegration.restrictions.domains}
                        onChange={(e) => handleNestedChange('googleMaps', 'restrictions', 'domains', e.target.value)}
                        placeholder="yourdomain.com, *.yourdomain.com"
                        description="Comma-separated list"
                      />

                      <Input
                        label="Allowed IP Addresses"
                        value={currentIntegration.restrictions.ips}
                        onChange={(e) => handleNestedChange('googleMaps', 'restrictions', 'ips', e.target.value)}
                        placeholder="192.168.1.1, 10.0.0.0/8"
                        description="Comma-separated list"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Google Drive Configuration */}
              {activeIntegration === 'googleDrive' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Client ID"
                      value={currentIntegration.clientId}
                      onChange={(e) => handleInputChange('googleDrive', 'clientId', e.target.value)}
                      placeholder="Enter Google Drive Client ID"
                      error={errors.googleDrive_clientId}
                      required
                    />
                    <Input
                      label="Client Secret"
                      type="password"
                      value={currentIntegration.clientSecret}
                      onChange={(e) => handleInputChange('googleDrive', 'clientSecret', e.target.value)}
                      placeholder="Enter Client Secret"
                      error={errors.googleDrive_clientSecret}
                      required
                    />
                    <Input
                      label="Redirect URI"
                      value={currentIntegration.redirectUri}
                      onChange={(e) => handleInputChange('googleDrive', 'redirectUri', e.target.value)}
                      placeholder="https://yourdomain.com/auth/callback"
                    />
                    <Input
                      label="File Retention (Days)"
                      type="number"
                      min="1"
                      value={currentIntegration.fileRetention}
                      onChange={(e) => handleInputChange('googleDrive', 'fileRetention', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drive Scopes
                      </label>
                      <div className="space-y-2">
                        {['drive.file', 'drive.readonly', 'drive.metadata.readonly'].map(scope => (
                          <label key={scope} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={currentIntegration.scopes.includes(scope)}
                              onChange={(e) => {
                                const newScopes = e.target.checked
                                  ? [...currentIntegration.scopes, scope]
                                  : currentIntegration.scopes.filter(s => s !== scope);
                                handleInputChange('googleDrive', 'scopes', newScopes);
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{scope}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed File Types
                      </label>
                      <Input
                        value={currentIntegration.allowedFileTypes.join(', ')}
                        onChange={(e) => handleArrayChange('googleDrive', 'allowedFileTypes', e.target.value)}
                        placeholder="pdf, jpg, png, mp4"
                        description="Comma-separated list"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Toggle
                      checked={currentIntegration.autoUpload}
                      onChange={(e) => handleInputChange('googleDrive', 'autoUpload', e.target.checked)}
                      label="Auto Upload"
                      description="Automatically upload files to Google Drive"
                    />

                    <Select
                      label="Folder Structure"
                      options={[
                        { value: 'organized', label: 'Organized by date/customer' },
                        { value: 'flat', label: 'Flat structure' }
                      ]}
                      value={currentIntegration.folderStructure}
                      onChange={(value) => handleInputChange('googleDrive', 'folderStructure', value)}
                    />
                  </div>
                </div>
              )}

              {/* Slack Configuration */}
              {activeIntegration === 'slack' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Webhook URL"
                      value={currentIntegration.webhookUrl}
                      onChange={(e) => handleInputChange('slack', 'webhookUrl', e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      error={errors.slack_webhookUrl}
                      required
                    />
                    <Input
                      label="Bot Token"
                      type="password"
                      value={currentIntegration.botToken}
                      onChange={(e) => handleInputChange('slack', 'botToken', e.target.value)}
                      placeholder="xoxb-..."
                      description="Optional: For advanced features"
                    />
                    <Input
                      label="Default Channel"
                      value={currentIntegration.channel}
                      onChange={(e) => handleInputChange('slack', 'channel', e.target.value)}
                      placeholder="#general"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <Toggle
                        checked={currentIntegration.notifications.newBookings}
                        onChange={(e) => handleNestedChange('slack', 'notifications', 'newBookings', e.target.checked)}
                        label="New Bookings"
                        description="Notify when new bookings are created"
                      />
                      <Toggle
                        checked={currentIntegration.notifications.paymentReceived}
                        onChange={(e) => handleNestedChange('slack', 'notifications', 'paymentReceived', e.target.checked)}
                        label="Payment Received"
                        description="Notify when payments are received"
                      />
                      <Toggle
                        checked={currentIntegration.notifications.moveCompleted}
                        onChange={(e) => handleNestedChange('slack', 'notifications', 'moveCompleted', e.target.checked)}
                        label="Move Completed"
                        description="Notify when moves are completed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Zapier Configuration */}
              {activeIntegration === 'zapier' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Webhook URL"
                      value={currentIntegration.webhookUrl}
                      onChange={(e) => handleInputChange('zapier', 'webhookUrl', e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      error={errors.zapier_webhookUrl}
                      required
                    />
                    <Input
                      label="API Key"
                      type="password"
                      value={currentIntegration.apiKey}
                      onChange={(e) => handleInputChange('zapier', 'apiKey', e.target.value)}
                      placeholder="Enter Zapier API key"
                      description="Optional: For advanced automation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Triggers
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['booking_created', 'booking_updated', 'payment_received', 'move_completed', 'customer_created'].map(trigger => (
                        <label key={trigger} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={currentIntegration.triggers.includes(trigger)}
                            onChange={(e) => {
                              const newTriggers = e.target.checked
                                ? [...currentIntegration.triggers, trigger]
                                : currentIntegration.triggers.filter(t => t !== trigger);
                              handleInputChange('zapier', 'triggers', newTriggers);
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mailchimp Configuration */}
              {activeIntegration === 'mailchimp' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="API Key"
                      type="password"
                      value={currentIntegration.apiKey}
                      onChange={(e) => handleInputChange('mailchimp', 'apiKey', e.target.value)}
                      placeholder="Enter Mailchimp API key"
                      error={errors.mailchimp_apiKey}
                      required
                    />
                    <Input
                      label="Server Prefix"
                      value={currentIntegration.serverPrefix}
                      onChange={(e) => handleInputChange('mailchimp', 'serverPrefix', e.target.value)}
                      placeholder="us1, us2, etc."
                      error={errors.mailchimp_serverPrefix}
                      required
                      description="Found in your API key after the dash"
                    />
                    <Input
                      label="List ID"
                      value={currentIntegration.listId}
                      onChange={(e) => handleInputChange('mailchimp', 'listId', e.target.value)}
                      placeholder="Enter audience/list ID"
                      error={errors.mailchimp_listId}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Toggle
                      checked={currentIntegration.autoSubscribe}
                      onChange={(e) => handleInputChange('mailchimp', 'autoSubscribe', e.target.checked)}
                      label="Auto Subscribe Customers"
                      description="Automatically add new customers to mailing list"
                    />
                    <Toggle
                      checked={currentIntegration.doubleOptIn}
                      onChange={(e) => handleInputChange('mailchimp', 'doubleOptIn', e.target.checked)}
                      label="Double Opt-in"
                      description="Require email confirmation before subscribing"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Icon name="Settings" size={48} className="text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {currentIntegrationData?.name} is Disabled
              </h4>
              <p className="text-gray-600 mb-4">
                Enable this integration to configure its settings.
              </p>
              <Button
                onClick={() => handleToggle(activeIntegration, true)}
                iconName="Power"
              >
                Enable {currentIntegrationData?.name}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Integration Status Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Status Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrationsList.map((integration) => {
            const integrationData = integrations[integration.id];

            return (
              <div key={integration.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${
                      integration.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      integration.color === 'red' ? 'bg-red-100 text-red-600' :
                      integration.color === 'green' ? 'bg-green-100 text-green-600' :
                      integration.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      integration.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                      integration.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={integration.icon} size={12} />
                    </div>
                    <h4 className="font-medium text-sm">{integration.name}</h4>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    integrationData.enabled && integrationData.connected
                      ? 'bg-green-500'
                      : integrationData.enabled
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                  }`} />
                </div>
                <p className="text-xs text-gray-600">
                  {integrationData.enabled && integrationData.connected
                    ? 'Active and connected'
                    : integrationData.enabled
                      ? 'Enabled but not connected'
                      : 'Disabled'
                  }
                </p>
                {integrationData.lastSync && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last sync: {new Date(integrationData.lastSync).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyIntegrationsSettings;
