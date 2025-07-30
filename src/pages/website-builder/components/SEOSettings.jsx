import React, { useState, useEffect } from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import ImageUpload from '../../../components/ui/ImageUpload';
import Icon from '../../../components/AppIcon';
import seoService from '../../../services/seoService';

const SEOSettings = ({ onClose }) => {
  const { currentPage, updatePage } = useWebsiteBuilder();
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    robots: 'index, follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // basic, social, advanced, analysis

  // Load current page SEO data
  useEffect(() => {
    if (currentPage) {
      const pageSettings = currentPage.settings?.seo || {};
      setSeoData({
        title: pageSettings.title || currentPage.title || '',
        description: pageSettings.description || currentPage.description || '',
        keywords: pageSettings.keywords || '',
        canonical: pageSettings.canonical || '',
        robots: pageSettings.robots || 'index, follow',
        ogTitle: pageSettings.ogTitle || pageSettings.title || currentPage.title || '',
        ogDescription: pageSettings.ogDescription || pageSettings.description || currentPage.description || '',
        ogImage: pageSettings.ogImage || '',
        ogType: pageSettings.ogType || 'website',
        twitterCard: pageSettings.twitterCard || 'summary_large_image',
        twitterTitle: pageSettings.twitterTitle || pageSettings.title || currentPage.title || '',
        twitterDescription: pageSettings.twitterDescription || pageSettings.description || currentPage.description || '',
        twitterImage: pageSettings.twitterImage || pageSettings.ogImage || ''
      });
    }
  }, [currentPage]);

  // Analyze SEO when data changes
  useEffect(() => {
    if (currentPage) {
      const pageContent = currentPage.blocks
        .map(block => JSON.stringify(block.content))
        .join(' ');
      
      const analysis = seoService.analyzePage({
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords.split(',').map(k => k.trim()).filter(k => k),
        content: pageContent
      });
      
      setSeoAnalysis(analysis);
    }
  }, [seoData, currentPage]);

  const handleSeoDataChange = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAutoGenerate = (field) => {
    if (!currentPage) return;

    const pageContent = currentPage.blocks
      .map(block => {
        const content = block.content || {};
        return [content.title, content.subtitle, content.description].filter(Boolean).join(' ');
      })
      .join(' ');

    switch (field) {
      case 'title':
        const generatedTitle = seoService.generateTitle(currentPage.name);
        handleSeoDataChange('title', generatedTitle);
        break;
      
      case 'description':
        const generatedDescription = seoService.generateDescription(pageContent);
        handleSeoDataChange('description', generatedDescription);
        break;
      
      case 'keywords':
        const extractedKeywords = seoService.extractKeywords(pageContent);
        handleSeoDataChange('keywords', extractedKeywords.join(', '));
        break;
    }
  };

  const handleSave = async () => {
    if (!currentPage) return;

    const updatedSettings = {
      ...currentPage.settings,
      seo: seoData
    };

    await updatePage(currentPage.id, { 
      settings: updatedSettings,
      title: seoData.title || currentPage.name,
      description: seoData.description
    });

    onClose();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!currentPage) {
    return (
      <div className="text-center py-8">
        <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No page selected</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">SEO Settings</h2>
              <p className="text-sm text-gray-600 mt-1">
                Optimize "{currentPage.name}" for search engines
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* SEO Score */}
          {seoAnalysis && (
            <div className={`mt-4 p-4 rounded-lg ${getScoreBgColor(seoAnalysis.score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">SEO Score</h3>
                  <p className="text-sm text-gray-600">
                    {seoAnalysis.score >= 80 ? 'Excellent' : 
                     seoAnalysis.score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(seoAnalysis.score)}`}>
                  {seoAnalysis.score}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'basic', label: 'Basic SEO', icon: 'Search' },
            { key: 'social', label: 'Social Media', icon: 'Share2' },
            { key: 'advanced', label: 'Advanced', icon: 'Settings' },
            { key: 'analysis', label: 'Analysis', icon: 'BarChart3' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Page Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Page Title
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAutoGenerate('title')}
                  >
                    <Icon name="Wand2" size={14} className="mr-1" />
                    Auto-generate
                  </Button>
                </div>
                <Input
                  value={seoData.title}
                  onChange={(value) => handleSeoDataChange('title', value)}
                  placeholder="Enter page title (50-60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoData.title.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAutoGenerate('description')}
                  >
                    <Icon name="Wand2" size={14} className="mr-1" />
                    Auto-generate
                  </Button>
                </div>
                <Textarea
                  value={seoData.description}
                  onChange={(value) => handleSeoDataChange('description', value)}
                  placeholder="Enter meta description (120-160 characters)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {seoData.description.length}/160 characters
                </p>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Keywords
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAutoGenerate('keywords')}
                  >
                    <Icon name="Wand2" size={14} className="mr-1" />
                    Extract from content
                  </Button>
                </div>
                <Input
                  value={seoData.keywords}
                  onChange={(value) => handleSeoDataChange('keywords', value)}
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas (e.g., moving services, relocation, Kenya)
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <Input
                  value={seoData.canonical}
                  onChange={(value) => handleSeoDataChange('canonical', value)}
                  placeholder="https://example.com/page-url (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use the default page URL
                </p>
              </div>

              {/* Robots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Robots Meta Tag
                </label>
                <Select
                  options={[
                    { value: 'index, follow', label: 'Index, Follow (Default)' },
                    { value: 'noindex, follow', label: 'No Index, Follow' },
                    { value: 'index, nofollow', label: 'Index, No Follow' },
                    { value: 'noindex, nofollow', label: 'No Index, No Follow' }
                  ]}
                  value={seoData.robots}
                  onChange={(value) => handleSeoDataChange('robots', value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Open Graph */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph (Facebook)</h3>
                
                <div className="space-y-4">
                  <Input
                    label="OG Title"
                    value={seoData.ogTitle}
                    onChange={(value) => handleSeoDataChange('ogTitle', value)}
                    placeholder="Title for social media sharing"
                  />
                  
                  <Textarea
                    label="OG Description"
                    value={seoData.ogDescription}
                    onChange={(value) => handleSeoDataChange('ogDescription', value)}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Image
                    </label>
                    <ImageUpload
                      onImageSelect={(image) => handleSeoDataChange('ogImage', image.url)}
                      category="social"
                      showPreview={false}
                    />
                    {seoData.ogImage && (
                      <div className="mt-2">
                        <img
                          src={seoData.ogImage}
                          alt="OG Image preview"
                          className="w-full max-w-md h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Select
                    label="OG Type"
                    options={[
                      { value: 'website', label: 'Website' },
                      { value: 'article', label: 'Article' },
                      { value: 'business.business', label: 'Business' }
                    ]}
                    value={seoData.ogType}
                    onChange={(value) => handleSeoDataChange('ogType', value)}
                  />
                </div>
              </div>

              {/* Twitter Cards */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Cards</h3>
                
                <div className="space-y-4">
                  <Select
                    label="Twitter Card Type"
                    options={[
                      { value: 'summary_large_image', label: 'Large Image Summary' },
                      { value: 'summary', label: 'Summary' }
                    ]}
                    value={seoData.twitterCard}
                    onChange={(value) => handleSeoDataChange('twitterCard', value)}
                  />
                  
                  <Input
                    label="Twitter Title"
                    value={seoData.twitterTitle}
                    onChange={(value) => handleSeoDataChange('twitterTitle', value)}
                    placeholder="Title for Twitter sharing"
                  />
                  
                  <Textarea
                    label="Twitter Description"
                    value={seoData.twitterDescription}
                    onChange={(value) => handleSeoDataChange('twitterDescription', value)}
                    placeholder="Description for Twitter sharing"
                    rows={3}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Image
                    </label>
                    <ImageUpload
                      onImageSelect={(image) => handleSeoDataChange('twitterImage', image.url)}
                      category="social"
                      showPreview={false}
                    />
                    {seoData.twitterImage && (
                      <div className="mt-2">
                        <img
                          src={seoData.twitterImage}
                          alt="Twitter Image preview"
                          className="w-full max-w-md h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Icon name="AlertTriangle" size={20} className="text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Advanced Settings</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      These settings require technical knowledge. Incorrect values may affect SEO performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Structured Data Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Structured Data</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(seoService.generateMovingCompanyStructuredData({
                      title: seoData.title,
                      description: seoData.description
                    }), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && seoAnalysis && (
            <div className="space-y-6">
              {/* SEO Issues */}
              {seoAnalysis.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-red-900 mb-3">Critical Issues</h3>
                  <div className="space-y-2">
                    {seoAnalysis.issues.map((issue, index) => (
                      <div key={index} className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Icon name="AlertCircle" size={16} className="text-red-600 mr-2 mt-0.5" />
                        <span className="text-sm text-red-800">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Warnings */}
              {seoAnalysis.warnings.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-yellow-900 mb-3">Warnings</h3>
                  <div className="space-y-2">
                    {seoAnalysis.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Icon name="AlertTriangle" size={16} className="text-yellow-600 mr-2 mt-0.5" />
                        <span className="text-sm text-yellow-800">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Suggestions */}
              {seoAnalysis.suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-blue-900 mb-3">Suggestions</h3>
                  <div className="space-y-2">
                    {seoAnalysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Icon name="Lightbulb" size={16} className="text-blue-600 mr-2 mt-0.5" />
                        <span className="text-sm text-blue-800">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Changes will be applied to "{currentPage.name}"
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save SEO Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;
