import React, { useState } from 'react';
import { useWebsiteBuilder } from '../../../contexts/WebsiteBuilderContext';
import { getBlockByType } from '../../../data/blockLibrary';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import ImageUpload from '../../../components/ui/ImageUpload';
import SEOSettings from './SEOSettings';
import Icon from '../../../components/AppIcon';

const PropertyPanel = () => {
  const { selectedBlock, updateBlock, deviceMode, currentPage } = useWebsiteBuilder();
  const [activeTab, setActiveTab] = useState('content'); // content, style, advanced
  const [showSEOSettings, setShowSEOSettings] = useState(false);

  if (!selectedBlock) {
    return (
      <div className="p-6 text-center">
        <Icon name="MousePointer" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Block Selected</h3>
        <p className="text-gray-600">
          Click on a block in the canvas to edit its properties.
        </p>
      </div>
    );
  }

  const blockInfo = getBlockByType(selectedBlock.type);

  const handleContentUpdate = (field, value) => {
    updateBlock(selectedBlock.id, {
      content: {
        ...selectedBlock.content,
        [field]: value
      }
    });
  };

  const handleStyleUpdate = (property, value) => {
    const currentStyles = selectedBlock.styles?.[deviceMode] || {};
    updateBlock(selectedBlock.id, {
      styles: {
        ...selectedBlock.styles,
        [deviceMode]: {
          ...currentStyles,
          [property]: value
        }
      }
    });
  };

  const handleSettingsUpdate = (field, value) => {
    updateBlock(selectedBlock.id, {
      settings: {
        ...selectedBlock.settings,
        [field]: value
      }
    });
  };

  const renderContentTab = () => {
    const content = selectedBlock.content || {};

    return (
      <div className="space-y-4">
        {/* Common Content Fields */}
        {content.title !== undefined && (
          <Input
            label="Title"
            value={content.title || ''}
            onChange={(value) => handleContentUpdate('title', value)}
          />
        )}

        {content.subtitle !== undefined && (
          <Input
            label="Subtitle"
            value={content.subtitle || ''}
            onChange={(value) => handleContentUpdate('subtitle', value)}
          />
        )}

        {content.description !== undefined && (
          <Textarea
            label="Description"
            value={content.description || ''}
            onChange={(value) => handleContentUpdate('description', value)}
            rows={3}
          />
        )}

        {/* Background Image */}
        {content.backgroundImage !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <ImageUpload
              onImageSelect={(image) => {
                handleContentUpdate('backgroundImage', image.url);
              }}
              category="backgrounds"
              showPreview={false}
              className="mb-2"
            />
            {content.backgroundImage && (
              <div className="mt-2">
                <img
                  src={content.backgroundImage}
                  alt="Background preview"
                  className="w-full h-32 object-cover rounded border"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleContentUpdate('backgroundImage', '')}
                  className="mt-1 text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        {content.buttons && Array.isArray(content.buttons) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buttons
            </label>
            <div className="space-y-3">
              {content.buttons.map((button, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Button {index + 1}</span>
                    {content.buttons.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updatedButtons = content.buttons.filter((_, i) => i !== index);
                          handleContentUpdate('buttons', updatedButtons);
                        }}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Button text"
                      value={button.text || ''}
                      onChange={(value) => {
                        const updatedButtons = [...content.buttons];
                        updatedButtons[index] = { ...button, text: value };
                        handleContentUpdate('buttons', updatedButtons);
                      }}
                    />
                    <Input
                      placeholder="Link URL"
                      value={button.link || ''}
                      onChange={(value) => {
                        const updatedButtons = [...content.buttons];
                        updatedButtons[index] = { ...button, link: value };
                        handleContentUpdate('buttons', updatedButtons);
                      }}
                    />
                    <Select
                      options={[
                        { value: 'primary', label: 'Primary' },
                        { value: 'secondary', label: 'Secondary' },
                        { value: 'outline', label: 'Outline' }
                      ]}
                      value={button.style || 'primary'}
                      onChange={(value) => {
                        const updatedButtons = [...content.buttons];
                        updatedButtons[index] = { ...button, style: value };
                        handleContentUpdate('buttons', updatedButtons);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newButton = { text: 'New Button', link: '#', style: 'primary' };
                  handleContentUpdate('buttons', [...content.buttons, newButton]);
                }}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Button
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStyleTab = () => {
    const styles = selectedBlock.styles?.[deviceMode] || {};

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Editing styles for {deviceMode} view
        </div>

        {/* Spacing */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Spacing</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Padding Top"
              type="number"
              value={styles.paddingTop || ''}
              onChange={(value) => handleStyleUpdate('paddingTop', value + 'px')}
              placeholder="0"
            />
            <Input
              label="Padding Bottom"
              type="number"
              value={styles.paddingBottom || ''}
              onChange={(value) => handleStyleUpdate('paddingBottom', value + 'px')}
              placeholder="0"
            />
            <Input
              label="Margin Top"
              type="number"
              value={styles.marginTop || ''}
              onChange={(value) => handleStyleUpdate('marginTop', value + 'px')}
              placeholder="0"
            />
            <Input
              label="Margin Bottom"
              type="number"
              value={styles.marginBottom || ''}
              onChange={(value) => handleStyleUpdate('marginBottom', value + 'px')}
              placeholder="0"
            />
          </div>
        </div>

        {/* Colors */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded"
                />
                <Input
                  value={styles.backgroundColor || ''}
                  onChange={(value) => handleStyleUpdate('backgroundColor', value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={styles.color || '#000000'}
                  onChange={(e) => handleStyleUpdate('color', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded"
                />
                <Input
                  value={styles.color || ''}
                  onChange={(value) => handleStyleUpdate('color', value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
          <div className="space-y-3">
            <Select
              label="Font Family"
              options={[
                { value: 'Inter', label: 'Inter' },
                { value: 'Arial', label: 'Arial' },
                { value: 'Georgia', label: 'Georgia' },
                { value: 'Times New Roman', label: 'Times New Roman' }
              ]}
              value={styles.fontFamily || 'Inter'}
              onChange={(value) => handleStyleUpdate('fontFamily', value)}
            />
            <Input
              label="Font Size"
              type="number"
              value={styles.fontSize || ''}
              onChange={(value) => handleStyleUpdate('fontSize', value + 'px')}
              placeholder="16"
            />
            <Select
              label="Font Weight"
              options={[
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
              ]}
              value={styles.fontWeight || '400'}
              onChange={(value) => handleStyleUpdate('fontWeight', value)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    const settings = selectedBlock.settings || {};

    return (
      <div className="space-y-4">
        {/* Animation */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Animation</h4>
          <div className="space-y-3">
            <Select
              label="Animation Type"
              options={[
                { value: 'none', label: 'None' },
                { value: 'fadeIn', label: 'Fade In' },
                { value: 'slideUp', label: 'Slide Up' },
                { value: 'slideDown', label: 'Slide Down' },
                { value: 'slideLeft', label: 'Slide Left' },
                { value: 'slideRight', label: 'Slide Right' },
                { value: 'zoomIn', label: 'Zoom In' },
                { value: 'bounce', label: 'Bounce' }
              ]}
              value={settings.animation || 'none'}
              onChange={(value) => handleSettingsUpdate('animation', value)}
            />
            <Input
              label="Animation Duration (ms)"
              type="number"
              value={settings.animationDuration || 1000}
              onChange={(value) => handleSettingsUpdate('animationDuration', parseInt(value))}
            />
            <Input
              label="Animation Delay (ms)"
              type="number"
              value={settings.animationDelay || 0}
              onChange={(value) => handleSettingsUpdate('animationDelay', parseInt(value))}
            />
          </div>
        </div>

        {/* Visibility */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Visibility</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.visible !== false}
              onChange={(e) => handleSettingsUpdate('visible', e.target.checked)}
              className="mr-2"
            />
            Block is visible
          </label>
        </div>

        {/* Custom CSS */}
        <div>
          <Textarea
            label="Custom CSS"
            value={settings.customCSS || ''}
            onChange={(value) => handleSettingsUpdate('customCSS', value)}
            rows={4}
            placeholder="/* Custom CSS styles */"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name={blockInfo?.icon || 'Square'} size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{blockInfo?.name || 'Block'}</h3>
            <p className="text-sm text-gray-600">{selectedBlock.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'content', label: 'Content', icon: 'Type' },
          { key: 'style', label: 'Style', icon: 'Palette' },
          { key: 'advanced', label: 'Advanced', icon: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name={tab.icon} size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </div>
    </div>
  );
};

export default PropertyPanel;
