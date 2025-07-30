import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import Icon from '../../../components/AppIcon';

const PaymentGatewaySettings = ({ onSettingsChange }) => {
  const [activeGateway, setActiveGateway] = useState('mpesa');
  const [gateways, setGateways] = useState({
    mpesa: {
      enabled: true,
      consumerKey: '',
      consumerSecret: '',
      environment: 'sandbox',
      shortcode: '',
      passkey: '',
      callbackUrl: '',
      regions: ['KE'],
      fees: { percentage: 0, fixed: 0 },
      minAmount: 1,
      maxAmount: 300000
    },
    airtelMoney: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      environment: 'sandbox',
      merchantId: '',
      regions: ['KE', 'UG', 'TZ'],
      fees: { percentage: 0, fixed: 0 },
      minAmount: 1,
      maxAmount: 500000
    },
    equitel: {
      enabled: false,
      merchantId: '',
      apiKey: '',
      environment: 'sandbox',
      businessNumber: '',
      regions: ['KE'],
      fees: { percentage: 0, fixed: 0 },
      minAmount: 1,
      maxAmount: 300000
    },
    pesapal: {
      enabled: false,
      consumerKey: '',
      consumerSecret: '',
      environment: 'sandbox',
      ipnUrl: '',
      regions: ['KE', 'UG', 'TZ', 'RW'],
      fees: { percentage: 3.5, fixed: 0 },
      minAmount: 10,
      maxAmount: 1000000
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      environment: 'sandbox',
      webhookId: '',
      regions: ['US', 'GB', 'CA', 'AU', 'EU'],
      fees: { percentage: 2.9, fixed: 30 },
      minAmount: 1,
      maxAmount: 10000
    },
    tigoPesa: {
      enabled: false,
      merchantCode: '',
      apiKey: '',
      environment: 'sandbox',
      businessNumber: '',
      regions: ['TZ'],
      fees: { percentage: 0, fixed: 0 },
      minAmount: 1,
      maxAmount: 300000
    },
    stripe: {
      enabled: false,
      publishableKey: '',
      secretKey: '',
      environment: 'sandbox',
      webhookSecret: '',
      regions: ['US', 'GB', 'CA', 'AU', 'EU', 'KE'],
      fees: { percentage: 2.9, fixed: 30 },
      minAmount: 50,
      maxAmount: 999999999
    },
    flutterwave: {
      enabled: false,
      publicKey: '',
      secretKey: '',
      environment: 'sandbox',
      encryptionKey: '',
      regions: ['NG', 'KE', 'UG', 'TZ', 'GH', 'ZA'],
      fees: { percentage: 1.4, fixed: 0 },
      minAmount: 1,
      maxAmount: 1000000
    }
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('KE');

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: 'Smartphone',
      color: 'green',
      description: 'Kenya\'s leading mobile money service',
      type: 'Mobile Money',
      regions: ['KE']
    },
    {
      id: 'airtelMoney',
      name: 'Airtel Money',
      icon: 'Smartphone',
      color: 'red',
      description: 'Mobile money across East Africa',
      type: 'Mobile Money',
      regions: ['KE', 'UG', 'TZ']
    },
    {
      id: 'equitel',
      name: 'Equitel',
      icon: 'Smartphone',
      color: 'blue',
      description: 'Equity Bank mobile money platform',
      type: 'Mobile Money',
      regions: ['KE']
    },
    {
      id: 'tigoPesa',
      name: 'Tigo Pesa',
      icon: 'Smartphone',
      color: 'orange',
      description: 'Tanzania mobile money service',
      type: 'Mobile Money',
      regions: ['TZ']
    },
    {
      id: 'pesapal',
      name: 'PesaPal',
      icon: 'CreditCard',
      color: 'purple',
      description: 'Multi-channel payment gateway',
      type: 'Payment Gateway',
      regions: ['KE', 'UG', 'TZ', 'RW']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'CreditCard',
      color: 'blue',
      description: 'Global digital payment platform',
      type: 'Digital Wallet',
      regions: ['US', 'GB', 'CA', 'AU', 'EU']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: 'CreditCard',
      color: 'indigo',
      description: 'Online payment processing platform',
      type: 'Payment Processor',
      regions: ['US', 'GB', 'CA', 'AU', 'EU', 'KE']
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: 'CreditCard',
      color: 'yellow',
      description: 'African payment infrastructure',
      type: 'Payment Gateway',
      regions: ['NG', 'KE', 'UG', 'TZ', 'GH', 'ZA']
    }
  ];

  const regions = [
    { value: 'KE', label: '🇰🇪 Kenya' },
    { value: 'UG', label: '🇺🇬 Uganda' },
    { value: 'TZ', label: '🇹🇿 Tanzania' },
    { value: 'RW', label: '🇷🇼 Rwanda' },
    { value: 'NG', label: '🇳🇬 Nigeria' },
    { value: 'GH', label: '🇬🇭 Ghana' },
    { value: 'ZA', label: '🇿🇦 South Africa' },
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'GB', label: '🇬🇧 United Kingdom' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'EU', label: '🇪🇺 European Union' }
  ];

  const handleGatewayToggle = (gatewayId, enabled) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        enabled
      }
    }));
    onSettingsChange();
  };

  const handleGatewayChange = (gatewayId, field, value) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        [field]: value
      }
    }));
    onSettingsChange();

    // Clear error when user makes changes
    const errorKey = `${gatewayId}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const handleFeesChange = (gatewayId, feeType, value) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        fees: {
          ...prev[gatewayId].fees,
          [feeType]: parseFloat(value) || 0
        }
      }
    }));
    onSettingsChange();
  };

  const validateGateway = (gatewayId) => {
    const gateway = gateways[gatewayId];
    const newErrors = {};

    if (!gateway.enabled) return true;

    // Common validations
    if (gateway.consumerKey !== undefined && !gateway.consumerKey.trim()) {
      newErrors[`${gatewayId}_consumerKey`] = 'Consumer key is required';
    }
    if (gateway.consumerSecret !== undefined && !gateway.consumerSecret.trim()) {
      newErrors[`${gatewayId}_consumerSecret`] = 'Consumer secret is required';
    }
    if (gateway.clientId !== undefined && !gateway.clientId.trim()) {
      newErrors[`${gatewayId}_clientId`] = 'Client ID is required';
    }
    if (gateway.clientSecret !== undefined && !gateway.clientSecret.trim()) {
      newErrors[`${gatewayId}_clientSecret`] = 'Client secret is required';
    }

    // Gateway-specific validations
    if (gatewayId === 'mpesa') {
      if (!gateway.shortcode.trim()) newErrors[`${gatewayId}_shortcode`] = 'Shortcode is required';
      if (!gateway.passkey.trim()) newErrors[`${gatewayId}_passkey`] = 'Passkey is required';
    }

    if (gatewayId === 'stripe') {
      if (!gateway.publishableKey.trim()) newErrors[`${gatewayId}_publishableKey`] = 'Publishable key is required';
      if (!gateway.secretKey.trim()) newErrors[`${gatewayId}_secretKey`] = 'Secret key is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const enabledGateways = Object.keys(gateways).filter(id => gateways[id].enabled);
    let allValid = true;

    for (const gatewayId of enabledGateways) {
      if (!validateGateway(gatewayId)) {
        allValid = false;
      }
    }

    if (!allValid) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving payment gateway settings:', gateways);
      alert('Payment gateway settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (gatewayId) => {
    if (!validateGateway(gatewayId)) {
      alert('Please fix configuration errors before testing');
      return;
    }

    setTestingConnection(prev => ({ ...prev, [gatewayId]: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${paymentMethods.find(m => m.id === gatewayId)?.name} connection test successful!`);
    } catch (error) {
      alert(`${paymentMethods.find(m => m.id === gatewayId)?.name} connection test failed`);
    } finally {
      setTestingConnection(prev => ({ ...prev, [gatewayId]: false }));
    }
  };

  // Filter payment methods by selected region
  const filteredPaymentMethods = paymentMethods.filter(method =>
    method.regions.includes(selectedRegion)
  );

  const activeGatewayData = gateways[activeGateway];
  const activeMethodData = paymentMethods.find(m => m.id === activeGateway);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Gateway Integration</h2>
          <p className="text-gray-600 mt-1">
            Configure mobile money and payment gateway integrations by region.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            options={regions}
            value={selectedRegion}
            onChange={(value) => setSelectedRegion(value)}
            className="w-48"
          />
          <Button
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Regional Filter Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Regional Payment Methods</h4>
            <p className="text-sm text-blue-700 mt-1">
              Showing payment methods available in {regions.find(r => r.value === selectedRegion)?.label}.
              Switch regions to configure different payment options.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Payment Methods ({filteredPaymentMethods.length})
          </h3>

          <div className="space-y-3">
            {filteredPaymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  activeGateway === method.id
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveGateway(method.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      method.color === 'green' ? 'bg-green-100 text-green-600' :
                      method.color === 'red' ? 'bg-red-100 text-red-600' :
                      method.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      method.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      method.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                      method.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                      method.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon name={method.icon} size={16} />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{method.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          method.type === 'Mobile Money' ? 'bg-green-100 text-green-700' :
                          method.type === 'Payment Gateway' ? 'bg-blue-100 text-blue-700' :
                          method.type === 'Digital Wallet' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {method.type}
                        </span>
                        {gateways[method.id].enabled && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Enabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Toggle
                    checked={gateways[method.id].enabled}
                    onChange={(e) => handleGatewayToggle(method.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-xs text-gray-600">{method.description}</p>

                {/* Fee Information */}
                {gateways[method.id].enabled && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Fees: {gateways[method.id].fees.percentage}% + {gateways[method.id].fees.fixed}</span>
                      <span>Limits: {gateways[method.id].minAmount} - {gateways[method.id].maxAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPaymentMethods.length === 0 && (
            <div className="text-center py-8">
              <Icon name="CreditCard" size={48} className="text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Payment Methods Available
              </h4>
              <p className="text-gray-600">
                No payment methods are available for the selected region.
              </p>
            </div>
          )}
        </div>

        {/* Gateway Configuration */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {filteredPaymentMethods.find(m => m.id === activeGateway) ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activeMethodData?.color === 'green' ? 'bg-green-100 text-green-600' :
                    activeMethodData?.color === 'red' ? 'bg-red-100 text-red-600' :
                    activeMethodData?.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    activeMethodData?.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    activeMethodData?.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    activeMethodData?.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                    activeMethodData?.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon name={activeMethodData?.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {activeMethodData?.name} Configuration
                    </h3>
                    <p className="text-sm text-gray-600">{activeMethodData?.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeGatewayData.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activeGatewayData.enabled ? 'Enabled' : 'Disabled'}
                  </div>

                  {activeGatewayData.enabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Zap"
                      onClick={() => testConnection(activeGateway)}
                      loading={testingConnection[activeGateway]}
                    >
                      Test Connection
                    </Button>
                  )}
                </div>
              </div>

              {activeGatewayData.enabled ? (
                <div className="space-y-6">
                  {/* Environment Selection */}
                  <Select
                    label="Environment"
                    options={[
                      { value: 'sandbox', label: 'Sandbox (Testing)' },
                      { value: 'production', label: 'Production (Live)' }
                    ]}
                    value={activeGatewayData.environment}
                    onChange={(value) => handleGatewayChange(activeGateway, 'environment', value)}
                  />

                  {/* Gateway-specific Configuration */}
                  {activeGateway === 'mpesa' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Consumer Key"
                          type="password"
                          value={activeGatewayData.consumerKey}
                          onChange={(e) => handleGatewayChange(activeGateway, 'consumerKey', e.target.value)}
                          placeholder="Enter consumer key"
                          error={errors[`${activeGateway}_consumerKey`]}
                          required
                        />
                        <Input
                          label="Consumer Secret"
                          type="password"
                          value={activeGatewayData.consumerSecret}
                          onChange={(e) => handleGatewayChange(activeGateway, 'consumerSecret', e.target.value)}
                          placeholder="Enter consumer secret"
                          error={errors[`${activeGateway}_consumerSecret`]}
                          required
                        />
                        <Input
                          label="Shortcode"
                          value={activeGatewayData.shortcode}
                          onChange={(e) => handleGatewayChange(activeGateway, 'shortcode', e.target.value)}
                          placeholder="Enter shortcode"
                          error={errors[`${activeGateway}_shortcode`]}
                          required
                        />
                        <Input
                          label="Passkey"
                          type="password"
                          value={activeGatewayData.passkey}
                          onChange={(e) => handleGatewayChange(activeGateway, 'passkey', e.target.value)}
                          placeholder="Enter passkey"
                          error={errors[`${activeGateway}_passkey`]}
                          required
                        />
                        <Input
                          label="Callback URL"
                          value={activeGatewayData.callbackUrl}
                          onChange={(e) => handleGatewayChange(activeGateway, 'callbackUrl', e.target.value)}
                          placeholder="https://yourdomain.com/callback"
                          description="URL to receive payment notifications"
                        />
                      </div>
                    </div>
                  )}

                  {activeGateway === 'airtelMoney' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Client ID"
                        value={activeGatewayData.clientId}
                        onChange={(e) => handleGatewayChange(activeGateway, 'clientId', e.target.value)}
                        placeholder="Enter client ID"
                        error={errors[`${activeGateway}_clientId`]}
                        required
                      />
                      <Input
                        label="Client Secret"
                        type="password"
                        value={activeGatewayData.clientSecret}
                        onChange={(e) => handleGatewayChange(activeGateway, 'clientSecret', e.target.value)}
                        placeholder="Enter client secret"
                        error={errors[`${activeGateway}_clientSecret`]}
                        required
                      />
                      <Input
                        label="Merchant ID"
                        value={activeGatewayData.merchantId}
                        onChange={(e) => handleGatewayChange(activeGateway, 'merchantId', e.target.value)}
                        placeholder="Enter merchant ID"
                      />
                    </div>
                  )}

                  {activeGateway === 'stripe' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Publishable Key"
                        value={activeGatewayData.publishableKey}
                        onChange={(e) => handleGatewayChange(activeGateway, 'publishableKey', e.target.value)}
                        placeholder="pk_test_..."
                        error={errors[`${activeGateway}_publishableKey`]}
                        required
                      />
                      <Input
                        label="Secret Key"
                        type="password"
                        value={activeGatewayData.secretKey}
                        onChange={(e) => handleGatewayChange(activeGateway, 'secretKey', e.target.value)}
                        placeholder="sk_test_..."
                        error={errors[`${activeGateway}_secretKey`]}
                        required
                      />
                      <Input
                        label="Webhook Secret"
                        type="password"
                        value={activeGatewayData.webhookSecret}
                        onChange={(e) => handleGatewayChange(activeGateway, 'webhookSecret', e.target.value)}
                        placeholder="whsec_..."
                        description="For webhook signature verification"
                      />
                    </div>
                  )}

                  {activeGateway === 'paypal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Client ID"
                        value={activeGatewayData.clientId}
                        onChange={(e) => handleGatewayChange(activeGateway, 'clientId', e.target.value)}
                        placeholder="Enter PayPal client ID"
                        error={errors[`${activeGateway}_clientId`]}
                        required
                      />
                      <Input
                        label="Client Secret"
                        type="password"
                        value={activeGatewayData.clientSecret}
                        onChange={(e) => handleGatewayChange(activeGateway, 'clientSecret', e.target.value)}
                        placeholder="Enter PayPal client secret"
                        error={errors[`${activeGateway}_clientSecret`]}
                        required
                      />
                      <Input
                        label="Webhook ID"
                        value={activeGatewayData.webhookId}
                        onChange={(e) => handleGatewayChange(activeGateway, 'webhookId', e.target.value)}
                        placeholder="Enter webhook ID"
                        description="For webhook event verification"
                      />
                    </div>
                  )}

                  {activeGateway === 'flutterwave' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Public Key"
                        value={activeGatewayData.publicKey}
                        onChange={(e) => handleGatewayChange(activeGateway, 'publicKey', e.target.value)}
                        placeholder="FLWPUBK_TEST-..."
                        required
                      />
                      <Input
                        label="Secret Key"
                        type="password"
                        value={activeGatewayData.secretKey}
                        onChange={(e) => handleGatewayChange(activeGateway, 'secretKey', e.target.value)}
                        placeholder="FLWSECK_TEST-..."
                        required
                      />
                      <Input
                        label="Encryption Key"
                        type="password"
                        value={activeGatewayData.encryptionKey}
                        onChange={(e) => handleGatewayChange(activeGateway, 'encryptionKey', e.target.value)}
                        placeholder="FLWSECK_TEST..."
                        description="For payload encryption"
                      />
                    </div>
                  )}

                  {/* Fee Configuration */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Fee Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Percentage Fee (%)"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={activeGatewayData.fees.percentage}
                        onChange={(e) => handleFeesChange(activeGateway, 'percentage', e.target.value)}
                        placeholder="0.00"
                      />
                      <Input
                        label="Fixed Fee"
                        type="number"
                        step="0.01"
                        min="0"
                        value={activeGatewayData.fees.fixed}
                        onChange={(e) => handleFeesChange(activeGateway, 'fixed', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Transaction Limits */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Transaction Limits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Minimum Amount"
                        type="number"
                        min="0"
                        value={activeGatewayData.minAmount}
                        onChange={(e) => handleGatewayChange(activeGateway, 'minAmount', parseInt(e.target.value) || 0)}
                        placeholder="1"
                      />
                      <Input
                        label="Maximum Amount"
                        type="number"
                        min="0"
                        value={activeGatewayData.maxAmount}
                        onChange={(e) => handleGatewayChange(activeGateway, 'maxAmount', parseInt(e.target.value) || 0)}
                        placeholder="1000000"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="CreditCard" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {activeMethodData?.name} is Disabled
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Enable this payment method to configure its settings.
                  </p>
                  <Button
                    onClick={() => handleGatewayToggle(activeGateway, true)}
                    iconName="Power"
                  >
                    Enable {activeMethodData?.name}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Icon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Payment Method Selected
              </h4>
              <p className="text-gray-600">
                This payment method is not available in the selected region.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;
