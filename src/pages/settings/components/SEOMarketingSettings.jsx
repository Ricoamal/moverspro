import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SEOMarketingSettings = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    // Basic SEO
    metaTitle: 'MoveEase Pro - Professional Moving Services',
    metaDescription: 'Professional moving services in Kenya. Get instant quotes, track your move, and enjoy stress-free relocation with MoveEase Pro.',
    metaKeywords: 'moving services, relocation, Kenya, Nairobi, professional movers',
    canonicalUrl: 'https://moveeasepro.com',

    // Open Graph
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    ogLocale: 'en_US',

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterSite: '@moveeasepro',
    twitterCreator: '@moveeasepro',

    // Analytics & Tracking
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    hotjarId: '',

    // SEO Features
    enableSitemap: true,
    enableRobotsTxt: true,
    enableStructuredData: true,
    enableBreadcrumbs: true,

    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('google'); // google, facebook, twitter

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    onSettingsChange();

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    // Meta title validation
    if (!settings.metaTitle.trim()) {
      newErrors.metaTitle = 'Meta title is required';
    } else if (settings.metaTitle.length > 60) {
      newErrors.metaTitle = 'Meta title should be under 60 characters';
    }

    // Meta description validation
    if (!settings.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required';
    } else if (settings.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be under 160 characters';
    }

    // URL validations
    const urlFields = ['canonicalUrl', 'ogImage', 'facebookUrl', 'twitterUrl', 'linkedinUrl', 'instagramUrl', 'youtubeUrl'];
    urlFields.forEach(field => {
      if (settings[field] && !/^https?:\/\/.+/.test(settings[field])) {
        newErrors[field] = 'Please enter a valid URL (starting with http:// or https://)';
      }
    });

    // Analytics ID validations
    if (settings.googleAnalyticsId && !/^G-[A-Z0-9]+$/.test(settings.googleAnalyticsId)) {
      newErrors.googleAnalyticsId = 'Invalid Google Analytics ID format (should be G-XXXXXXXXXX)';
    }

    if (settings.googleTagManagerId && !/^GTM-[A-Z0-9]+$/.test(settings.googleTagManagerId)) {
      newErrors.googleTagManagerId = 'Invalid Google Tag Manager ID format (should be GTM-XXXXXXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving SEO & Marketing settings:', settings);
      alert('SEO & Marketing settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const twitterCardTypes = [
    { value: 'summary', label: 'Summary' },
    { value: 'summary_large_image', label: 'Summary Large Image' },
    { value: 'app', label: 'App' },
    { value: 'player', label: 'Player' }
  ];

  const ogTypes = [
    { value: 'website', label: 'Website' },
    { value: 'article', label: 'Article' },
    { value: 'business.business', label: 'Business' },
    { value: 'profile', label: 'Profile' }
  ];

  const previewModes = [
    { value: 'google', label: 'Google Search' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">SEO & Marketing Tools</h2>
          <p className="text-gray-600 mt-1">
            Configure SEO settings, social media, and marketing integrations.
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

      {/* Basic SEO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic SEO Settings</h3>

        <div className="space-y-6">
          <Input
            label="Meta Title"
            value={settings.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            placeholder="Enter meta title"
            description={`${settings.metaTitle.length}/60 characters`}
            error={errors.metaTitle}
            required
          />

          <Textarea
            label="Meta Description"
            value={settings.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Enter meta description"
            rows={3}
            description={`${settings.metaDescription.length}/160 characters`}
            error={errors.metaDescription}
            required
          />

          <Input
            label="Meta Keywords"
            value={settings.metaKeywords}
            onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
            placeholder="Enter keywords separated by commas"
            description="Separate keywords with commas"
          />

          <Input
            label="Canonical URL"
            value={settings.canonicalUrl}
            onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
            placeholder="https://moveeasepro.com"
            error={errors.canonicalUrl}
            description="The preferred URL for this page"
          />
        </div>
      </div>

      {/* Open Graph */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph (Facebook)</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="OG Title"
              value={settings.ogTitle}
              onChange={(e) => handleInputChange('ogTitle', e.target.value)}
              placeholder="Leave empty to use meta title"
            />

            <Select
              label="OG Type"
              options={ogTypes}
              value={settings.ogType}
              onChange={(value) => handleInputChange('ogType', value)}
            />
          </div>

          <Textarea
            label="OG Description"
            value={settings.ogDescription}
            onChange={(e) => handleInputChange('ogDescription', e.target.value)}
            placeholder="Leave empty to use meta description"
            rows={3}
          />

          <Input
            label="OG Image URL"
            value={settings.ogImage}
            onChange={(e) => handleInputChange('ogImage', e.target.value)}
            placeholder="https://example.com/image.jpg"
            description="Recommended size: 1200x630px"
            error={errors.ogImage}
          />

          <Input
            label="OG Locale"
            value={settings.ogLocale}
            onChange={(e) => handleInputChange('ogLocale', e.target.value)}
            placeholder="en_US"
            description="Language and country code"
          />
        </div>
      </div>

      {/* Twitter Cards */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Cards</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Card Type"
              options={twitterCardTypes}
              value={settings.twitterCard}
              onChange={(value) => handleInputChange('twitterCard', value)}
            />

            <Input
              label="Twitter Site"
              value={settings.twitterSite}
              onChange={(e) => handleInputChange('twitterSite', e.target.value)}
              placeholder="@yourusername"
              description="Your Twitter username"
            />
          </div>

          <Input
            label="Twitter Creator"
            value={settings.twitterCreator}
            onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
            placeholder="@creatorusername"
            description="Content creator's Twitter username"
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics & Tracking</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Google Analytics ID"
              value={settings.googleAnalyticsId}
              onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              error={errors.googleAnalyticsId}
              description="Google Analytics 4 measurement ID"
            />

            <Input
              label="Google Tag Manager ID"
              value={settings.googleTagManagerId}
              onChange={(e) => handleInputChange('googleTagManagerId', e.target.value)}
              placeholder="GTM-XXXXXXX"
              error={errors.googleTagManagerId}
              description="Container ID from GTM"
            />

            <Input
              label="Facebook Pixel ID"
              value={settings.facebookPixelId}
              onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
              placeholder="123456789012345"
              description="Facebook Ads pixel ID"
            />

            <Input
              label="Hotjar Site ID"
              value={settings.hotjarId}
              onChange={(e) => handleInputChange('hotjarId', e.target.value)}
              placeholder="1234567"
              description="Hotjar tracking site ID"
            />
          </div>
        </div>
      </div>

      {/* SEO Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Toggle
            checked={settings.enableSitemap}
            onChange={(e) => handleInputChange('enableSitemap', e.target.checked)}
            label="Generate XML Sitemap"
            description="Automatically generate and update sitemap.xml"
          />

          <Toggle
            checked={settings.enableRobotsTxt}
            onChange={(e) => handleInputChange('enableRobotsTxt', e.target.checked)}
            label="Generate Robots.txt"
            description="Create robots.txt file for search engines"
          />

          <Toggle
            checked={settings.enableStructuredData}
            onChange={(e) => handleInputChange('enableStructuredData', e.target.checked)}
            label="Structured Data"
            description="Add JSON-LD structured data markup"
          />

          <Toggle
            checked={settings.enableBreadcrumbs}
            onChange={(e) => handleInputChange('enableBreadcrumbs', e.target.checked)}
            label="Breadcrumb Navigation"
            description="Show breadcrumb navigation on pages"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Facebook URL"
            value={settings.facebookUrl}
            onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
            placeholder="https://facebook.com/moveeasepro"
            error={errors.facebookUrl}
          />

          <Input
            label="Twitter URL"
            value={settings.twitterUrl}
            onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
            placeholder="https://twitter.com/moveeasepro"
            error={errors.twitterUrl}
          />

          <Input
            label="LinkedIn URL"
            value={settings.linkedinUrl}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/company/moveeasepro"
            error={errors.linkedinUrl}
          />

          <Input
            label="Instagram URL"
            value={settings.instagramUrl}
            onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
            placeholder="https://instagram.com/moveeasepro"
            error={errors.instagramUrl}
          />

          <Input
            label="YouTube URL"
            value={settings.youtubeUrl}
            onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/c/moveeasepro"
            error={errors.youtubeUrl}
          />
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SEO Preview</h3>
          <Select
            options={previewModes}
            value={previewMode}
            onChange={(value) => setPreviewMode(value)}
            className="w-48"
          />
        </div>

        {previewMode === 'google' && (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
              {settings.ogTitle || settings.metaTitle || 'Page Title'}
            </div>
            <div className="text-green-700 text-sm mt-1">
              {settings.canonicalUrl || 'https://moveeasepro.com'}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              {settings.ogDescription || settings.metaDescription || 'Meta description will appear here...'}
            </div>
          </div>
        )}

        {previewMode === 'facebook' && (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-lg">
            {settings.ogImage && (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img
                  src={settings.ogImage}
                  alt="OG Preview"
                  className="max-h-full max-w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center h-full text-gray-500">
                  <Icon name="Image" size={48} />
                </div>
              </div>
            )}
            <div className="p-4 border-t border-gray-200">
              <div className="text-gray-500 text-xs uppercase mb-1">
                {new URL(settings.canonicalUrl || 'https://moveeasepro.com').hostname}
              </div>
              <div className="font-semibold text-gray-900 mb-1">
                {settings.ogTitle || settings.metaTitle || 'Page Title'}
              </div>
              <div className="text-gray-600 text-sm">
                {settings.ogDescription || settings.metaDescription || 'Meta description will appear here...'}
              </div>
            </div>
          </div>
        )}

        {previewMode === 'twitter' && (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-lg">
            {settings.ogImage && settings.twitterCard === 'summary_large_image' && (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img
                  src={settings.ogImage}
                  alt="Twitter Preview"
                  className="max-h-full max-w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center h-full text-gray-500">
                  <Icon name="Image" size={48} />
                </div>
              </div>
            )}
            <div className="p-4 border-t border-gray-200">
              <div className="font-semibold text-gray-900 mb-1">
                {settings.ogTitle || settings.metaTitle || 'Page Title'}
              </div>
              <div className="text-gray-600 text-sm mb-2">
                {settings.ogDescription || settings.metaDescription || 'Meta description will appear here...'}
              </div>
              <div className="text-gray-500 text-xs">
                {new URL(settings.canonicalUrl || 'https://moveeasepro.com').hostname}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOMarketingSettings;
